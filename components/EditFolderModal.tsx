"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useFolders } from "@/app/_lib/folder-context";
import type { BookmarkFolder } from "@/app/_lib/types";

export default function EditFolderModal({
  folder,
  onClose,
}: {
  folder: BookmarkFolder;
  onClose: () => void;
}) {
  const { renameFolder } = useFolders();
  const [name, setName] = useState(folder.name);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  async function handleSave() {
    if (saving || !name.trim()) return;
    setSaving(true);
    try {
      await renameFolder(folder.id, name);
    } finally {
      setSaving(false);
    }
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={saving ? undefined : onClose}
    >
      <div
        className="flex w-full max-w-sm flex-col gap-5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-[var(--text)]">
          폴더 이름 수정
        </h2>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="edit-folder-name"
            className="text-sm font-medium text-[var(--text)]"
          >
            폴더 이름
          </label>
          <input
            id="edit-folder-name"
            type="text"
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSave();
            }}
            placeholder="폴더 이름을 입력하세요"
            className="input-field w-full text-sm"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="hover-surface rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="hover-point rounded-md bg-[var(--point)] px-4 py-2 text-sm font-medium text-[var(--on-point)] disabled:opacity-50"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
