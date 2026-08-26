"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useFolders } from "@/app/_lib/folder-context";
import { useLinks } from "@/app/_lib/link-context";
import type { BookmarkLink } from "@/app/_lib/types";

export default function EditLinkModal({
  link,
  onClose,
}: {
  link: BookmarkLink;
  onClose: () => void;
}) {
  const { folders } = useFolders();
  const { updateLink } = useLinks();
  const [folderId, setFolderId] = useState(link.folderId);
  const [title, setTitle] = useState(link.title);
  const [description, setDescription] = useState(link.description ?? "");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSave() {
    if (!title.trim()) return;
    updateLink(link.id, { folderId, title, description });
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-sm flex-col gap-5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-[var(--text)]">
          링크 정보 수정
        </h2>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="edit-link-folder"
            className="text-sm font-medium text-[var(--text)]"
          >
            폴더
          </label>
          <select
            id="edit-link-folder"
            value={folderId}
            onChange={(event) => setFolderId(event.target.value)}
            className="input-field w-full text-sm"
          >
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="edit-link-title"
            className="text-sm font-medium text-[var(--text)]"
          >
            제목
          </label>
          <input
            id="edit-link-title"
            type="text"
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSave();
            }}
            placeholder="링크 제목을 입력하세요"
            className="input-field w-full text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="edit-link-description"
            className="text-sm font-medium text-[var(--text)]"
          >
            설명
          </label>
          <textarea
            id="edit-link-description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="링크 설명을 입력하세요"
            className="input-field w-full resize-none text-sm"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="hover-surface rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="hover-accent rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
          >
            저장
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
