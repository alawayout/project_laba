import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "@/hooks/useToaster";
import { AppShell } from "@/components/layout/AppShell";
import { Search } from "lucide-react";
import { SearchProvider } from "@/hooks/useSearchQuery";

const montserrat = Montserrat({
	subsets: ["latin", "cyrillic"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-montserrat",
});

export const metadata: Metadata = {
	title: "LABBOR STUDIO",
	description: "SaaS CMS для зуботехнических лабораторий",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru" className={`${montserrat.variable} h-full antialiased`}>
			<body className="min-h-full bg-bg text-fg font-sans">
				<SearchProvider>
					<ToasterProvider>{children}</ToasterProvider>
				</SearchProvider>
			</body>
		</html>
	);
}
