"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useFolders } from "@/app/_lib/folder-context";

export default function NewFolderModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addFolder } = useFolders();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  function handleClose() {
    if (saving) return;
    setName("");
    onClose();
  }

  async function handleSave() {
    if (saving || !name.trim()) return;
    setSaving(true);
    try {
      await addFolder(name);
    } finally {
      setSaving(false);
    }
    setName("");
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleClose}
    >
      <div
        className="flex w-full max-w-sm flex-col gap-5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-[var(--text)]">
          새 폴더
        </h2>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="folder-name"
            className="text-sm font-medium text-[var(--text)]"
          >
            폴더 이름
          </label>
          <input
            id="folder-name"
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
            onClick={handleClose}
            disabled={saving}
            className="hover-surface rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="hover-accent rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
