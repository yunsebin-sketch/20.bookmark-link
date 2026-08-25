import NavItem from "@/components/NavItem";
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
      className="h-4 w-4"
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  );
}

export default function FolderList({ folders }: { folders: BookmarkFolder[] }) {
  return (
    <nav className="flex flex-col gap-1">
      {folders.map((folder) => (
        <NavItem
          key={folder.id}
          href={`/folder/${folder.id}`}
          label={folder.name}
          count={folder.count}
          icon={<FolderIcon />}
        />
      ))}
    </nav>
  );
}
