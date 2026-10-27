import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import ClientPwa from "@/components/ClientPwa";

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
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Headbutt", statusBarStyle: "black-translucent" },
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
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <SmoothScroll>
          <ScrollProgress />
          <CustomCursor />
          <ClientPwa />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
