import type { BookmarkFolder } from "@/app/_lib/types";

export default function FolderSelect({ folders }: { folders: BookmarkFolder[] }) {
  return (
    <select
      id="folder"
      name="folder"
      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
    >
      {folders.map((folder) => (
        <option key={folder.id} value={folder.id}>
          {folder.name}
        </option>
      ))}
    </select>
  );
}
