"use client";

import { useState, type MouseEvent } from "react";
import { useLinks } from "@/app/_lib/link-context";
import DeleteLinkModal from "@/components/DeleteLinkModal";
import EditLinkModal from "@/components/EditLinkModal";
import type { BookmarkLink } from "@/app/_lib/types";

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

function ImagePlaceholderIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 text-[var(--placeholder)]"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

export default function LinkCard({ link }: { link: BookmarkLink }) {
  const domain = new URL(link.url).hostname.replace(/^www\./, "");
  const { deleteLink } = useLinks();
  const [thumbnailError, setThumbnailError] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const showThumbnail = Boolean(link.thumbnail) && !thumbnailError;

  function handleEditClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setEditOpen(true);
  }

  function handleDeleteClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    await deleteLink(link.id);
    setConfirmOpen(false);
  }

  const actionButtonClass =
    "hover-surface rounded-md border border-[var(--border)] bg-[var(--card)] p-1.5 text-[var(--text-sub)]";

  return (
    <div className="link-card group relative flex h-full flex-col">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover-surface flex h-full flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]"
      >
        {showThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={link.thumbnail}
            alt=""
            onError={() => setThumbnailError(true)}
            className="h-32 w-full shrink-0 object-cover"
          />
        ) : (
          <div className="flex h-32 w-full shrink-0 items-center justify-center bg-[var(--hover-bg)]">
            <ImagePlaceholderIcon />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--hover-bg)] text-sm font-semibold text-[var(--text-sub)]">
              {link.title.charAt(0).toUpperCase()}
            </span>
            <span className="truncate text-xs text-[var(--placeholder)]">
              {domain}
            </span>
          </div>
          <div>
            <h3 className="link-title line-clamp-1 text-sm font-semibold text-[var(--text)]">
              {link.title}
            </h3>
            <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-[var(--text-sub)]">
              {link.description || " "}
            </p>
          </div>
        </div>
      </a>
      <div className="link-actions absolute right-2 top-2 flex items-center gap-1">
        <button
          type="button"
          onClick={handleEditClick}
          aria-label={`${link.title} 링크 수정`}
          className={actionButtonClass}
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          aria-label={`${link.title} 링크 삭제`}
          className={actionButtonClass}
        >
          <TrashIcon />
        </button>
      </div>
      {editOpen && (
        <EditLinkModal link={link} onClose={() => setEditOpen(false)} />
      )}
      <DeleteLinkModal
        open={confirmOpen}
        linkTitle={link.title}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
