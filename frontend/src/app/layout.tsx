import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ToasterProvider } from "@/hooks";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LABBOR · Зуботехническая STUDIO",
  description: "SaaS CMS для зуботехнических лабораторий",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <body>
        <ToasterProvider>{children}</ToasterProvider>
      </body>
    </html>
  );
}
