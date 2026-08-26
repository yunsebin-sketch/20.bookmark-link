"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LinkGrid from "@/components/LinkGrid";
import { useLinks } from "@/app/_lib/link-context";

export default function Home() {
  const { links } = useLinks();

  return (
    <div className="flex h-screen flex-col bg-[var(--background)]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <LinkGrid links={links} />
        </main>
      </div>
    </div>
  );
}
