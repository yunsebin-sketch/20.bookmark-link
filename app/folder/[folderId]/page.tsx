import type { Metadata } from "next";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import FolderView from "@/components/FolderView";
import { createClient } from "@/utils/supabase/server";

export async function generateMetadata(
	props: PageProps<"/folder/[folderId]">,
): Promise<Metadata> {
	const { folderId } = await props.params;

	// RLS가 적용되므로 로그인한 사용자 본인의 폴더 이름만 조회된다.
	const supabase = createClient(await cookies());
	const { data } = await supabase
		.from("folders")
		.select("name")
		.eq("id", folderId)
		.maybeSingle();

	const name = data?.name ?? "폴더";

	return {
		title: name,
		description: `'${name}' 폴더에 저장한 링크 모음입니다.`,
	};
}

export default async function FolderPage(props: PageProps<"/folder/[folderId]">) {
  const { folderId } = await props.params;

  return (
    <div className="flex h-screen flex-col bg-[var(--background)]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <FolderView folderId={folderId} />
        </main>
      </div>
    </div>
  );
}
