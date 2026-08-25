import type { BookmarkFolder } from "@/app/_lib/types";

export default function FolderSelect({ folders }: { folders: BookmarkFolder[] }) {
  return (
    <select
      id="folder"
      name="folder"
      className="input-field w-full text-sm"
    >
      {folders.map((folder) => (
        <option key={folder.id} value={folder.id}>
          {folder.name}
        </option>
      ))}
    </select>
  );
}
