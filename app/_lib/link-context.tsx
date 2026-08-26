"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { BookmarkLink } from "@/app/_lib/types";

type LinkContextValue = {
  links: BookmarkLink[];
  addLink: (input: { url: string; folderId: string }) => void;
  deleteLinksByFolder: (folderId: string) => void;
};

const LinkContext = createContext<LinkContextValue | null>(null);

export function LinkProvider({
  initialLinks,
  children,
}: {
  initialLinks: BookmarkLink[];
  children: ReactNode;
}) {
  const [links, setLinks] = useState<BookmarkLink[]>(initialLinks);

  function addLink({ url, folderId }: { url: string; folderId: string }) {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || !folderId) return;

    let title: string;
    try {
      title = new URL(trimmedUrl).hostname.replace(/^www\./, "");
    } catch {
      return;
    }

    const newLink: BookmarkLink = {
      id: `link-${Date.now()}`,
      title,
      url: trimmedUrl,
      folderId,
    };
    setLinks((prev) => [...prev, newLink]);
  }

  function deleteLinksByFolder(folderId: string) {
    setLinks((prev) => prev.filter((link) => link.folderId !== folderId));
  }

  return (
    <LinkContext.Provider value={{ links, addLink, deleteLinksByFolder }}>
      {children}
    </LinkContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinkContext);
  if (!context) {
    throw new Error("useLinks must be used within a LinkProvider");
  }
  return context;
}
