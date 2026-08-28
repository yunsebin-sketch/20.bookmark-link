"use client";

import NavItem from "@/components/NavItem";
import FolderList from "@/components/FolderList";
import LogoutButton from "@/components/LogoutButton";
import { useFolders } from "@/app/_lib/folder-context";

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

export default function Sidebar() {
  const { folders } = useFolders();

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-5 overflow-y-auto border-r border-[var(--border)] bg-[var(--card)] px-3 py-6">
      <NavItem href="/" label="All" icon={<AllIcon />} />
      <div className="flex flex-col gap-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wide text-[var(--placeholder)]">
          폴더
        </p>
        <FolderList folders={folders} />
      </div>
      <div className="mt-auto border-t border-[var(--border)] pt-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
