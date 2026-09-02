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
        <span className="min-w-[1.125rem] rounded-full bg-[var(--point)] px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none text-[var(--on-point)]">
          {count}
        </span>
      )}
    </Link>
  );
}
