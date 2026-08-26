"use client";

import { useState, type MouseEvent } from "react";
import { useLinks } from "@/app/_lib/link-context";
import DeleteLinkModal from "@/components/DeleteLinkModal";
import type { BookmarkLink } from "@/app/_lib/types";

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

export default function LinkCard({ link }: { link: BookmarkLink }) {
  const domain = new URL(link.url).hostname.replace(/^www\./, "");
  const { deleteLink } = useLinks();
  const [thumbnailError, setThumbnailError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const showThumbnail = Boolean(link.thumbnail) && !thumbnailError;

  function handleDeleteClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setConfirmOpen(true);
  }

  function handleConfirmDelete() {
    deleteLink(link.id);
    setConfirmOpen(false);
  }

  return (
    <div className="link-card group relative">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover-surface flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]"
      >
        {showThumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={link.thumbnail}
            alt=""
            onError={() => setThumbnailError(true)}
            className="h-32 w-full object-cover"
          />
        )}
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--hover-bg)] text-sm font-semibold text-[var(--text-sub)]">
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
            {link.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-sub)]">
                {link.description}
              </p>
            )}
          </div>
        </div>
      </a>
      <button
        type="button"
        onClick={handleDeleteClick}
        aria-label={`${link.title} 링크 삭제`}
        className="link-delete-btn hover-surface absolute right-2 top-2 rounded-md border border-[var(--border)] bg-[var(--card)] p-1.5 text-[var(--text-sub)]"
      >
        <TrashIcon />
      </button>
      <DeleteLinkModal
        open={confirmOpen}
        linkTitle={link.title}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
