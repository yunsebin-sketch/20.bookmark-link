"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { useFolders } from "@/app/_lib/folder-context";
import { useLinks } from "@/app/_lib/link-context";
import DeleteFolderModal from "@/components/DeleteFolderModal";
import type { BookmarkFolder } from "@/app/_lib/types";

function FolderIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  );
}

function TrashIcon() {
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
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7h14Z" />
    </svg>
  );
}

export default function FolderNavItem({ folder }: { folder: BookmarkFolder }) {
  const pathname = usePathname();
  const router = useRouter();
  const { deleteFolder } = useFolders();
  const { deleteLinksByFolder } = useLinks();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const href = `/folder/${folder.id}`;
  const active = pathname === href;

  function handleDeleteClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setConfirmOpen(true);
  }

  function handleConfirmDelete() {
    deleteFolder(folder.id);
    deleteLinksByFolder(folder.id);
    setConfirmOpen(false);
    if (active) {
      router.push("/");
    }
  }

  return (
    <div className="folder-row group relative">
      <Link
        href={href}
        className={`flex w-full items-center justify-between gap-2 rounded-lg py-2 pl-3 pr-8 text-sm font-medium ${
          active
            ? "bg-[var(--accent)] text-white"
            : "hover-surface text-[var(--text-sub)]"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <FolderIcon />
          <span className="truncate">{folder.name}</span>
        </span>
        <span
          className={`folder-count text-xs ${active ? "text-white/80" : "text-[var(--placeholder)]"}`}
        >
          {folder.count}
        </span>
      </Link>
      <button
        type="button"
        onClick={handleDeleteClick}
        aria-label={`${folder.name} 폴더 삭제`}
        className={`folder-delete-btn hover-surface absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 ${
          active ? "text-white" : "text-[var(--text-sub)]"
        }`}
      >
        <TrashIcon />
      </button>
      <DeleteFolderModal
        open={confirmOpen}
        folderName={folder.name}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
