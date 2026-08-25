import FolderSelect from "@/components/FolderSelect";
import SaveButton from "@/components/SaveButton";
import type { BookmarkFolder } from "@/app/_lib/types";

export default function NewLinkForm({ folders }: { folders: BookmarkFolder[] }) {
  return (
    <form className="flex w-full max-w-lg flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="url"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          링크 주소
        </label>
        <input
          id="url"
          name="url"
          type="url"
          placeholder="https://example.com"
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="folder"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          폴더
        </label>
        <FolderSelect folders={folders} />
      </div>
      <div className="flex justify-end">
        <SaveButton />
      </div>
    </form>
  );
}
