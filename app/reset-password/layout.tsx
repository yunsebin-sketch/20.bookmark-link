import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "비밀번호 재설정",
	description: "새로운 비밀번호를 설정하고 다시 로그인하세요.",
};

export default function ResetPasswordLayout({
	children,
}: LayoutProps<"/reset-password">) {
	return children;
}
