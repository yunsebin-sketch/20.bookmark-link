import FolderNavItem from "@/components/FolderNavItem";
import type { BookmarkFolder } from "@/app/_lib/types";

export default function FolderList({ folders }: { folders: BookmarkFolder[] }) {
  return (
    <nav className="flex flex-col gap-1">
      {folders.map((folder) => (
        <FolderNavItem key={folder.id} folder={folder} />
      ))}
    </nav>
  );
}
