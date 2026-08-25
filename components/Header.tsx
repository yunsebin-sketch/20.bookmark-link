import NewLinkButton from "@/components/NewLinkButton";

export default function Header() {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
      <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        북마크 링크
      </span>
      <NewLinkButton />
    </header>
  );
}
