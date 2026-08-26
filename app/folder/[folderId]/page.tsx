import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import FolderView from "@/components/FolderView";

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
