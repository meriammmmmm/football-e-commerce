import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Headbutt Barcelona',
    short_name: 'Headbutt',
    id: '/',
    description: 'Vintage football shirts and iconic player jerseys.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f7f5f0',
    theme_color: '#0a1628',
    icons: [
      {
        src: '/headbutt-logo.jpg',
        sizes: '1080x1080',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
    ],
  };
}
