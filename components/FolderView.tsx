"use client";

import { useFolders } from "@/app/_lib/folder-context";
import { useLinks } from "@/app/_lib/link-context";
import LinkGrid from "@/components/LinkGrid";

export default function FolderView({ folderId }: { folderId: string }) {
  const { folders } = useFolders();
  const { links } = useLinks();
  const folder = folders.find((item) => item.id === folderId);

  if (!folder) {
    return (
      <p className="text-sm text-[var(--text-sub)]">
        폴더를 찾을 수 없습니다.
      </p>
    );
  }

  const folderLinks = links.filter((link) => link.folderId === folderId);

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-[var(--text)]">
        {folder.name}
      </h1>
      <LinkGrid links={folderLinks} />
    </>
  );
}
