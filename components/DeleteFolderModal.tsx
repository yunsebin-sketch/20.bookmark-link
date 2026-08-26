"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function DeleteFolderModal({
  open,
  folderName,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  folderName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="flex w-full max-w-sm flex-col gap-5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-[var(--text)]">
          폴더 삭제
        </h2>
        <p className="text-sm leading-6 text-[var(--text-sub)]">
          {`'${folderName}' 폴더를 삭제하시겠습니까?`}
          <br />
          폴더 안의 링크도 함께 삭제되며, 되돌릴 수 없습니다.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="hover-surface rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="hover-danger rounded-md bg-[var(--error)] px-4 py-2 text-sm font-medium text-white"
          >
            삭제
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
