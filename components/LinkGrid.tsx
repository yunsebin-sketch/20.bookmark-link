import LinkCard from "@/components/LinkCard";
import type { BookmarkLink } from "@/app/_lib/types";

export default function LinkGrid({ links }: { links: BookmarkLink[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}
