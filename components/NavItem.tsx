"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItemProps = {
  href: string;
  label: string;
  count?: number;
  icon?: ReactNode;
};

export default function NavItem({ href, label, count, icon }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
        active
          ? "bg-[var(--accent)] text-[var(--on-accent)]"
          : "hover-surface text-[var(--text-sub)]"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {typeof count === "number" && (
        <span
          className={`text-xs ${active ? "text-[var(--on-accent)] opacity-80" : "text-[var(--placeholder)]"}`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
