"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { useFolders } from "@/app/_lib/folder-context";
import { useLinks } from "@/app/_lib/link-context";
import DeleteFolderModal from "@/components/DeleteFolderModal";
import EditFolderModal from "@/components/EditFolderModal";
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

function PencilIcon() {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
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
  const { links, deleteLinksByFolder } = useLinks();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const linkCount = links.filter((link) => link.folderId === folder.id).length;

  const href = `/folder/${folder.id}`;
  const active = pathname === href;

  function handleEditClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setEditOpen(true);
  }

  function handleDeleteClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    await deleteFolder(folder.id);
    deleteLinksByFolder(folder.id);
    setConfirmOpen(false);
    if (active) {
      router.push("/");
    }
  }

  const actionButtonClass = `hover-surface rounded-md p-1.5 ${
    active ? "text-[var(--on-accent)]" : "text-[var(--text-sub)]"
  }`;

  return (
    <div className="folder-row group relative">
      <Link
        href={href}
        className={`flex w-full items-center gap-2 rounded-lg py-2 pl-3 pr-16 text-sm font-medium ${
          active
            ? "bg-[var(--accent)] text-[var(--on-accent)]"
            : "hover-surface text-[var(--text-sub)]"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <FolderIcon />
          <span className="truncate">{folder.name}</span>
        </span>
      </Link>
      <span
        className={`folder-count pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs ${active ? "text-[var(--on-accent)] opacity-80" : "text-[var(--placeholder)]"}`}
      >
        {linkCount}
      </span>
      <div className="folder-actions absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
        <button
          type="button"
          onClick={handleEditClick}
          aria-label={`${folder.name} 폴더 이름 수정`}
          className={actionButtonClass}
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          aria-label={`${folder.name} 폴더 삭제`}
          className={actionButtonClass}
        >
          <TrashIcon />
        </button>
      </div>
      {editOpen && (
        <EditFolderModal folder={folder} onClose={() => setEditOpen(false)} />
      )}
      <DeleteFolderModal
        open={confirmOpen}
        folderName={folder.name}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
