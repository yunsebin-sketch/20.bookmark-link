"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import type { BookmarkFolder } from "@/app/_lib/types";

type FolderContextValue = {
  folders: BookmarkFolder[];
  addFolder: (name: string) => Promise<void>;
  renameFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => void;
};

const FolderContext = createContext<FolderContextValue | null>(null);

export function FolderProvider({
  initialFolders = [],
  children,
}: {
  initialFolders?: BookmarkFolder[];
  children: ReactNode;
}) {
  const [folders, setFolders] = useState<BookmarkFolder[]>(initialFolders);
  const [supabase] = useState(() => createClient());
  // 폴더 추가 요청이 진행 중인지 추적해 버튼 중복 클릭으로 인한 중복 삽입을 막는다.
  const addingRef = useRef(false);
  // 폴더 이름 수정 요청이 진행 중인지 추적해 중복 요청을 막는다.
  const renamingRef = useRef(false);

  useEffect(() => {
    let active = true;

    async function loadFolders() {
      const { data, error } = await supabase
        .from("folders")
        .select("id, name")
        .order("created_at", { ascending: true });

      if (!active || error || !data) return;

      setFolders(
        data.map((folder) => ({
          id: String(folder.id),
          name: folder.name,
        })),
      );
    }

    loadFolders();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addFolder(name: string) {
    const trimmed = name.trim();
    if (!trimmed || addingRef.current) return;

    addingRef.current = true;
    try {
      const { data, error } = await supabase
        .from("folders")
        .insert({ name: trimmed })
        .select("id, name")
        .single();

      if (error || !data) return;

      setFolders((prev) => [
        ...prev,
        { id: String(data.id), name: data.name },
      ]);
    } finally {
      addingRef.current = false;
    }
  }

  async function renameFolder(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed || renamingRef.current) return;

    renamingRef.current = true;
    try {
      const { data, error } = await supabase
        .from("folders")
        .update({ name: trimmed })
        .eq("id", id)
        .select("id, name")
        .single();

      if (error || !data) return;

      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === id ? { ...folder, name: data.name } : folder,
        ),
      );
    } finally {
      renamingRef.current = false;
    }
  }

  function deleteFolder(id: string) {
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
  }

  return (
    <FolderContext.Provider
      value={{ folders, addFolder, renameFolder, deleteFolder }}
    >
      {children}
    </FolderContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error("useFolders must be used within a FolderProvider");
  }
  return context;
}
