"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { BookmarkFolder } from "@/app/_lib/types";

type FolderContextValue = {
  folders: BookmarkFolder[];
  addFolder: (name: string) => void;
  deleteFolder: (id: string) => void;
};

const FolderContext = createContext<FolderContextValue | null>(null);

export function FolderProvider({
  initialFolders,
  children,
}: {
  initialFolders: BookmarkFolder[];
  children: ReactNode;
}) {
  const [folders, setFolders] = useState<BookmarkFolder[]>(initialFolders);

  function addFolder(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;

    const newFolder: BookmarkFolder = {
      id: `folder-${Date.now()}`,
      name: trimmed,
      count: 0,
    };
    setFolders((prev) => [...prev, newFolder]);
  }

  function deleteFolder(id: string) {
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
  }

  return (
    <FolderContext.Provider value={{ folders, addFolder, deleteFolder }}>
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
