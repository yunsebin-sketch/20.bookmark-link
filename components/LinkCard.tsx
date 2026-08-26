"use client";

import { useState } from "react";
import type { BookmarkLink } from "@/app/_lib/types";

export default function LinkCard({ link }: { link: BookmarkLink }) {
  const domain = new URL(link.url).hostname.replace(/^www\./, "");
  const [thumbnailError, setThumbnailError] = useState(false);
  const showThumbnail = Boolean(link.thumbnail) && !thumbnailError;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover-surface group flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]"
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
  );
}
