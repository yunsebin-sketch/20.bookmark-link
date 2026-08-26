"use client";

import { useState } from "react";
import NewFolderModal from "@/components/NewFolderModal";

function FolderPlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="M12 11v4M10 13h4" />
    </svg>
  );
}

export default function NewFolderButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover-surface flex items-center gap-1.5 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)]"
      >
        <FolderPlusIcon />
        새 폴더
      </button>
      <NewFolderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
