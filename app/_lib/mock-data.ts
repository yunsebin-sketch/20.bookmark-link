import type { BookmarkFolder, BookmarkLink } from "@/app/_lib/types";

export const folders: BookmarkFolder[] = [
  { id: "dev", name: "개발", count: 4 },
  { id: "design", name: "디자인", count: 2 },
  { id: "article", name: "아티클", count: 3 },
  { id: "shopping", name: "쇼핑", count: 1 },
];

export const links: BookmarkLink[] = [
  {
    id: "1",
    title: "Next.js Documentation",
    url: "https://nextjs.org/docs",
    description: "Next.js 공식 문서, App Router와 최신 기능을 확인할 수 있습니다.",
    folderId: "dev",
  },
  {
    id: "2",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "웹 표준과 브라우저 API에 대한 레퍼런스 문서입니다.",
    folderId: "dev",
  },
  {
    id: "3",
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    description: "타입스크립트 공식 핸드북입니다.",
    folderId: "dev",
  },
  {
    id: "4",
    title: "GitHub",
    url: "https://github.com",
    description: "코드 저장소와 협업을 위한 플랫폼입니다.",
    folderId: "dev",
  },
  {
    id: "5",
    title: "Dribbble",
    url: "https://dribbble.com",
    description: "디자이너들의 작업물을 구경할 수 있는 커뮤니티입니다.",
    folderId: "design",
  },
  {
    id: "6",
    title: "Figma",
    url: "https://figma.com",
    description: "협업 기반 UI 디자인 툴입니다.",
    folderId: "design",
  },
  {
    id: "7",
    title: "CSS-Tricks",
    url: "https://css-tricks.com",
    description: "CSS와 프론트엔드 관련 아티클 모음입니다.",
    folderId: "article",
  },
  {
    id: "8",
    title: "Smashing Magazine",
    url: "https://www.smashingmagazine.com",
    description: "웹 디자인과 개발에 관한 매거진입니다.",
    folderId: "article",
  },
  {
    id: "9",
    title: "A List Apart",
    url: "https://alistapart.com",
    description: "웹 표준과 UX에 대한 아티클을 제공합니다.",
    folderId: "article",
  },
  {
    id: "10",
    title: "Amazon",
    url: "https://amazon.com",
    description: "온라인 쇼핑몰입니다.",
    folderId: "shopping",
  },
];
