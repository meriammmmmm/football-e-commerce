import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://football-e-commerce-bay.vercel.app",
  ),
  title: {
    default: "Headbutt Barcelona | Vintage Football Shirts",
    template: "%s | Headbutt Barcelona",
  },
  description:
    "Discover standout vintage football shirts, timeless kits, and iconic player jerseys from Headbutt Barcelona.",
  applicationName: "Headbutt Barcelona",
  icons: {
    icon: "/headbutt-logo.jpg",
    apple: "/headbutt-logo.jpg",
  },
  openGraph: {
    type: "website",
    siteName: "Headbutt Barcelona",
    title: "Headbutt Barcelona | Vintage Football Shirts",
    description:
      "Discover standout vintage football shirts, timeless kits, and iconic player jerseys from Headbutt Barcelona.",
    images: [
      {
        url: "/headbutt-logo.jpg",
        width: 1080,
        height: 1080,
        alt: "Headbutt Barcelona football shirts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Headbutt Barcelona | Vintage Football Shirts",
    description:
      "Discover standout vintage football shirts, timeless kits, and iconic player jerseys from Headbutt Barcelona.",
    images: ["/headbutt-logo.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
