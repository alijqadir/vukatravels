import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || siteUrl;

const displayFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const bodyFont = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VUKA Travels Blog",
    template: "%s | VUKA Travels Blog",
  },
  description:
    "SEO-focused travel advice, destination insights, and booking tips from VUKA Travels.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    siteName: "VUKA Travels Blog",
    url: `${siteUrl}/blog`,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <SiteHeader mainSiteUrl={mainSiteUrl} />
        <main className="site-main">{children}</main>
        <SiteFooter mainSiteUrl={mainSiteUrl} />
      </body>
    </html>
  );
}
