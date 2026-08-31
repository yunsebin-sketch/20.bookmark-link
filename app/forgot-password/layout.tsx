import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "비밀번호 찾기",
	description: "가입한 이메일로 비밀번호 재설정 링크를 받아보세요.",
};

export default function ForgotPasswordLayout({
	children,
}: LayoutProps<"/forgot-password">) {
	return children;
}
