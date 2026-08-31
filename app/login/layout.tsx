import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "로그인",
	description: "BOOKMARK LINKS에 로그인하고 내 북마크를 관리하세요.",
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
	return children;
}
