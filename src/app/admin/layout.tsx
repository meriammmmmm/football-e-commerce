import type { Metadata, Viewport } from 'next';
import ServiceWorkerRegistrar from '@/components/admin/ServiceWorkerRegistrar';

export const metadata: Metadata = {
  title: 'Headbutt Admin',
  description: 'Add shirts to the Headbutt catalogue from your phone.',
  applicationName: 'Headbutt Admin',
  manifest: '/admin/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Headbutt Admin', statusBarStyle: 'black-translucent' },
  icons: { apple: '/admin/icons/apple-touch-icon.png' },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#0a1628',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-[#0a1628] text-white">
      {/* Paints the full viewport so the shop's light body never shows through. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[#0a1628]" />
      <ServiceWorkerRegistrar />
      {children}
    </div>
  );
}
