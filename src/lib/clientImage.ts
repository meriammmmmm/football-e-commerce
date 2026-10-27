/**
 * Client-side photo preparation. Phone cameras produce multi-megabyte files, so
 * every photo is scaled down and re-encoded before it is sent to the server.
 */

const MAX_IMAGE_EDGE = 1400;
const IMAGE_QUALITY = 0.82;

type Bitmap = ImageBitmap | HTMLImageElement;

function loadWithImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That file could not be read as an image.'));
    };
    image.src = url;
  });
}

async function loadBitmap(file: File): Promise<Bitmap> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // Safari sometimes refuses HEIC and other formats here. Fall back below.
    }
  }
  return loadWithImageElement(file);
}

/** Reads a picked file and returns it as a JPEG data URL, ready to upload. */
export async function fileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Pick an image file.');
  }

  const source = await loadBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(source.width, source.height));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot process the photo.');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(source, 0, 0, width, height);

  if ('close' in source) source.close();

  return canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
}
