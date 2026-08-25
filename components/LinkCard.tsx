import type { BookmarkLink } from "@/app/_lib/types";

export default function LinkCard({ link }: { link: BookmarkLink }) {
  const domain = new URL(link.url).hostname.replace(/^www\./, "");

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover-surface group flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
    >
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
    </a>
  );
}
