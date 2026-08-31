import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FolderProvider } from "@/app/_lib/folder-context";
import { LinkProvider } from "@/app/_lib/link-context";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "BOOKMARK LINKS";
const siteDescription =
	"자주 보는 링크를 폴더로 정리하고 한곳에서 관리하는 북마크 서비스입니다.";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: siteName,
		template: `%s | ${siteName}`,
	},
	description: siteDescription,
	applicationName: siteName,
	// app/favicon.ico 파일이 자동으로 파비콘으로 인식된다.
	// og:title / twitter:title 은 각 페이지의 title(및 상위 template)에서 자동으로 채워진다.
	openGraph: {
		type: "website",
		siteName,
		description: siteDescription,
		url: "/",
		locale: "ko_KR",
		images: [
			{
				url: "/thumbnail.png",
				width: 2400,
				height: 1260,
				alt: siteName,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		description: siteDescription,
		images: ["/thumbnail.png"],
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<FolderProvider>
					<LinkProvider>{children}</LinkProvider>
				</FolderProvider>
			</body>
		</html>
	);
}
