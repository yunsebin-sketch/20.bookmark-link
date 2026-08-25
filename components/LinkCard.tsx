import type { BookmarkLink } from "@/app/_lib/types";

export default function LinkCard({ link }: { link: BookmarkLink }) {
  const domain = new URL(link.url).hostname.replace(/^www\./, "");

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {link.title.charAt(0).toUpperCase()}
        </span>
        <span className="truncate text-xs text-zinc-400 dark:text-zinc-500">
          {domain}
        </span>
      </div>
      <div>
        <h3 className="line-clamp-1 text-sm font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
          {link.title}
        </h3>
        {link.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {link.description}
          </p>
        )}
      </div>
    </a>
  );
}
