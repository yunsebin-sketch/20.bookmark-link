import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "회원가입",
	description: "BOOKMARK LINKS 계정을 만들고 나만의 북마크를 정리해 보세요.",
};

export default function SignupLayout({ children }: LayoutProps<"/signup">) {
	return children;
}
