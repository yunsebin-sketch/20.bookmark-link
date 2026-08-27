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
import type { BookmarkLink } from "@/app/_lib/types";

type LinkContextValue = {
  links: BookmarkLink[];
  addLink: (input: { url: string; folderId: string }) => Promise<void>;
  updateLink: (
    id: string,
    updates: { folderId: string; title: string; description: string },
  ) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  deleteLinksByFolder: (folderId: string) => void;
};

const LinkContext = createContext<LinkContextValue | null>(null);

type LinkRow = {
  id: number | string;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  folder_id: number | string | null;
};

function toBookmarkLink(row: LinkRow): BookmarkLink {
  return {
    id: String(row.id),
    title: row.title ?? row.url,
    url: row.url,
    description: row.description ?? undefined,
    thumbnail: row.thumbnail_url ?? undefined,
    folderId: row.folder_id == null ? "" : String(row.folder_id),
  };
}

export function LinkProvider({
  initialLinks = [],
  children,
}: {
  initialLinks?: BookmarkLink[];
  children: ReactNode;
}) {
  const [links, setLinks] = useState<BookmarkLink[]>(initialLinks);
  const [supabase] = useState(() => createClient());
  // 링크 추가 요청이 진행 중인지 추적해 저장 버튼 중복 클릭으로 인한 중복 삽입을 막는다.
  const addingRef = useRef(false);
  // 링크 수정 요청이 진행 중인지 추적해 중복 요청을 막는다.
  const updatingRef = useRef(false);
  // 링크 삭제 요청이 진행 중인지 추적해 중복 요청을 막는다.
  const deletingRef = useRef(false);

  useEffect(() => {
    let active = true;

    async function loadLinks() {
      const { data, error } = await supabase
        .from("links")
        .select("id, url, title, description, thumbnail_url, folder_id")
        .order("created_at", { ascending: true });

      if (!active || error || !data) return;

      setLinks(data.map((row) => toBookmarkLink(row as LinkRow)));
    }

    loadLinks();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addLink({
    url,
    folderId,
  }: {
    url: string;
    folderId: string;
  }) {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || !folderId || addingRef.current) return;

    let normalizedUrl: string;
    try {
      normalizedUrl = new URL(trimmedUrl).toString();
    } catch {
      return;
    }

    addingRef.current = true;
    try {
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

      const { data, error } = await supabase
        .from("links")
        .insert({
          url: normalizedUrl,
          title,
          description: description ?? null,
          thumbnail_url: thumbnail ?? null,
          folder_id: Number(folderId),
        })
        .select("id, url, title, description, thumbnail_url, folder_id")
        .single();

      if (error || !data) return;

      setLinks((prev) => [...prev, toBookmarkLink(data as LinkRow)]);
    } finally {
      addingRef.current = false;
    }
  }

  async function updateLink(
    id: string,
    updates: { folderId: string; title: string; description: string },
  ) {
    const trimmedTitle = updates.title.trim();
    if (!trimmedTitle || !updates.folderId || updatingRef.current) return;

    const trimmedDescription = updates.description.trim();

    updatingRef.current = true;
    try {
      const { data, error } = await supabase
        .from("links")
        .update({
          folder_id: Number(updates.folderId),
          title: trimmedTitle,
          description: trimmedDescription || null,
        })
        .eq("id", id)
        .select("id, url, title, description, thumbnail_url, folder_id")
        .single();

      if (error || !data) return;

      setLinks((prev) =>
        prev.map((link) =>
          link.id === id ? toBookmarkLink(data as LinkRow) : link,
        ),
      );
    } finally {
      updatingRef.current = false;
    }
  }

  async function deleteLink(id: string) {
    if (deletingRef.current) return;

    deletingRef.current = true;
    try {
      const { error } = await supabase.from("links").delete().eq("id", id);

      if (error) return;

      setLinks((prev) => prev.filter((link) => link.id !== id));
    } finally {
      deletingRef.current = false;
    }
  }

  function deleteLinksByFolder(folderId: string) {
    setLinks((prev) => prev.filter((link) => link.folderId !== folderId));
  }

  return (
    <LinkContext.Provider
      value={{ links, addLink, updateLink, deleteLink, deleteLinksByFolder }}
    >
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
