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
  deleteFolder: (id: string) => Promise<void>;
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
  // 폴더 삭제 요청이 진행 중인지 추적해 중복 요청을 막는다.
  const deletingRef = useRef(false);

  useEffect(() => {
    let active = true;
    // 현재 데이터를 불러온 사용자 ID. 계정이 바뀌었는지 판단하는 기준이 된다.
    let currentUserId: string | null = null;

    async function loadFolders(userId: string | null) {
      if (!userId) {
        if (active) setFolders([]);
        return;
      }

      const { data, error } = await supabase
        .from("folders")
        .select("id, name")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (!active || error || !data) return;

      setFolders(
        data.map((folder) => ({
          id: String(folder.id),
          name: folder.name,
        })),
      );
    }

    // 최초 구독 시 INITIAL_SESSION 이벤트로 현재 세션이 전달되고,
    // 로그인/로그아웃 등 계정이 바뀔 때마다 다시 호출된다.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUserId = session?.user?.id ?? null;
      // 사용자 계정이 변경된 경우에만 데이터를 다시 불러온다.
      if (nextUserId === currentUserId) return;
      currentUserId = nextUserId;
      // 콜백 안에서 supabase 함수를 직접 await 하지 않도록 다음 틱으로 미룬다.
      setTimeout(() => loadFolders(nextUserId), 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
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

  async function deleteFolder(id: string) {
    if (deletingRef.current) return;

    deletingRef.current = true;
    try {
      const { error } = await supabase.from("folders").delete().eq("id", id);

      if (error) return;

      setFolders((prev) => prev.filter((folder) => folder.id !== id));
    } finally {
      deletingRef.current = false;
    }
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
