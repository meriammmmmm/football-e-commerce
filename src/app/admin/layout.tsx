export const dynamic = 'force-dynamic';
import type { Metadata, Viewport } from 'next';
import ServiceWorkerRegistrar from '@/components/admin/ServiceWorkerRegistrar';
import InstallBanner from '@/components/admin/InstallBanner';

export const metadata: Metadata = {
  title: 'Headbutt Admin',
  description: 'Add shirts to the Headbutt catalogue from your phone.',
  applicationName: 'Headbutt Admin',
  // manifest is intentionally omitted from Next.js metadata because Next.js
  // does not reliably override the root layout's manifest link for nested
  // layouts. We inject <link rel="manifest"> directly in the layout JSX below
  // so Safari always reads the admin manifest (scope=/admin, start_url=/admin/login)
  // instead of the shop manifest (start_url=/) when a shared admin URL is opened.
  appleWebApp: { capable: true, title: 'Headbutt Admin', statusBarStyle: 'black-translucent' },
  icons: {
    apple: [
      { url: '/admin/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
    icon: [
      { url: '/admin/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/admin/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#0a1628',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-[#0a1628] text-white">
      {/* Paints the full viewport so the shop's light body never shows through. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[#0a1628]" />
      {/*
        Override the shop manifest with the admin manifest. React hoists <link>
        tags found in the body into <head> automatically in React 19 / Next.js 15+,
        so this produces a second <link rel="manifest"> that shadows the root one.
        Safari reads the LAST manifest link, giving us the correct scope=/admin.
      */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <link rel="manifest" href="/admin/manifest.webmanifest" />
      <ServiceWorkerRegistrar />
      <InstallBanner />
      {children}
    </div>
  );
}
