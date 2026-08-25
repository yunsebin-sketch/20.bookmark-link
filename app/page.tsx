import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LinkGrid from "@/components/LinkGrid";
import { folders, links } from "@/app/_lib/mock-data";

export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-[var(--background)]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar folders={folders} />
        <main className="flex-1 overflow-y-auto p-6">
          <LinkGrid links={links} />
        </main>
      </div>
    </div>
  );
}
