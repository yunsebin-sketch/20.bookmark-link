import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NewLinkForm from "@/components/NewLinkForm";
import { folders } from "@/app/_lib/mock-data";

export default function NewLinkPage() {
  return (
    <div className="flex h-screen flex-col bg-[var(--background)]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar folders={folders} />
        <main className="flex flex-1 items-start justify-center overflow-y-auto p-10">
          <NewLinkForm folders={folders} />
        </main>
      </div>
    </div>
  );
}
