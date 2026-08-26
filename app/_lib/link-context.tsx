"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { BookmarkLink } from "@/app/_lib/types";

type LinkContextValue = {
  links: BookmarkLink[];
  addLink: (input: { url: string; folderId: string }) => Promise<void>;
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

  async function addLink({
    url,
    folderId,
  }: {
    url: string;
    folderId: string;
  }) {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || !folderId) return;

    let normalizedUrl: string;
    try {
      normalizedUrl = new URL(trimmedUrl).toString();
    } catch {
      return;
    }

    let title = new URL(normalizedUrl).hostname.replace(/^www\./, "");
    let description: string | undefined;
    let thumbnail: string | undefined;

    try {
      const response = await fetch(
        `/api/og?url=${encodeURIComponent(normalizedUrl)}`,
      );
      if (response.ok) {
        const og = await response.json();
        if (og.title) title = og.title;
        if (og.description) description = og.description;
        if (og.image) thumbnail = og.image;
      }
    } catch {
      // 오픈 그래프 조회 실패 시 도메인 기반 기본값을 사용
    }

    const newLink: BookmarkLink = {
      id: `link-${Date.now()}`,
      title,
      url: normalizedUrl,
      description,
      thumbnail,
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
