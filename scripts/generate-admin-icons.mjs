/**
 * Generates the PWA icons for the admin app from the Headbutt logo.
 *
 *   node scripts/generate-admin-icons.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'public/headbutt-logo.jpg');
const outDir = join(root, 'public/admin/icons');

await mkdir(outDir, { recursive: true });

const square = (size, file) =>
  sharp(source)
    .resize(size, size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(join(outDir, file));

await square(192, 'icon-192.png');
await square(512, 'icon-512.png');
await square(180, 'apple-touch-icon.png');

// Maskable icons keep the logo inside the safe zone on a brand coloured plate.
await sharp({
  create: { width: 512, height: 512, channels: 4, background: '#0a1628' },
})
  .composite([
    {
      input: await sharp(source).resize(360, 360, { fit: 'contain' }).png().toBuffer(),
      gravity: 'center',
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(join(outDir, 'icon-maskable-512.png'));

console.log(`Admin icons written to ${outDir}`);
