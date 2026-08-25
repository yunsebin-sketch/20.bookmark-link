import FolderSelect from "@/components/FolderSelect";
import SaveButton from "@/components/SaveButton";
import type { BookmarkFolder } from "@/app/_lib/types";

export default function NewLinkForm({ folders }: { folders: BookmarkFolder[] }) {
  return (
    <form className="flex w-full max-w-lg flex-col gap-5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="url"
          className="text-sm font-medium text-[var(--text)]"
        >
          링크 주소
        </label>
        <input
          id="url"
          name="url"
          type="url"
          placeholder="https://example.com"
          className="input-field w-full text-sm"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="folder"
          className="text-sm font-medium text-[var(--text)]"
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
