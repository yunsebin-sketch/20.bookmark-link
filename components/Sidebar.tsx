import NavItem from "@/components/NavItem";
import FolderList from "@/components/FolderList";
import type { BookmarkFolder } from "@/app/_lib/types";

function AllIcon() {
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
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export default function Sidebar({ folders }: { folders: BookmarkFolder[] }) {
  return (
    <aside className="flex w-56 shrink-0 flex-col gap-5 overflow-y-auto border-r border-zinc-200 bg-white px-3 py-6 dark:border-zinc-800 dark:bg-zinc-950">
      <NavItem href="/" label="All" icon={<AllIcon />} />
      <div className="flex flex-col gap-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          폴더
        </p>
        <FolderList folders={folders} />
      </div>
    </aside>
  );
}
