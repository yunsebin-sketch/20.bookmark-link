import NewFolderButton from "@/components/NewFolderButton";
import NewLinkButton from "@/components/NewLinkButton";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--card-translucent)] px-4 backdrop-blur-md">
      <span className="flex items-center gap-2 text-base font-semibold tracking-tight text-[var(--text)]">
        <Logo className="h-7 w-auto" />
        춘천마임축제 북마크 링크
      </span>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NewFolderButton />
        <NewLinkButton />
      </div>
    </header>
  );
}
