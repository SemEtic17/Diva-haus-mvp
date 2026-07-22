let removeBackgroundLoader;
// Product listings do not need camera-resolution images. Keeping the long edge
// at 2,048px preserves detail on high-density displays while avoiding multi-MB
// transparent images.
const MAX_PRODUCT_IMAGE_DIMENSION = 2048;
const WEBP_QUALITY = 0.92;
const BACKGROUND_REMOVAL_CONFIG = {
  // The quantized model is ~40MB (instead of ~80MB), which is substantially
  // less likely to fail on slower or restricted networks. It still produces
  // high-quality product cutouts.
  model: 'isnet_quint8',
  output: { format: 'image/png', type: 'foreground' },
  // Use the backend proxy by default. It avoids browser HTTP/2 stream resets
  // from staticimgly.com. A self-hosted path can still be supplied in prod.
  publicPath: import.meta.env.VITE_IMGLY_ASSET_PATH || `${window.location.origin}/api/imgly-assets/`,
};

const loadRemoveBackground = async () => {
  removeBackgroundLoader ??= import('@imgly/background-removal').then(({ removeBackground }) => removeBackground);
  return removeBackgroundLoader;
};

/**
 * Converts a transparent image Blob to high-quality WebP. Very large source
 * images are downscaled to a 2,048px long edge before encoding.
 *
 * @param {Blob} blob
 * @returns {Promise<Blob>}
 */
export const toWebpBlob = async (blob) => {
  const bitmap = await createImageBitmap(blob);

  try {
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, MAX_PRODUCT_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Your browser does not support image conversion.');
    }

    context.drawImage(bitmap, 0, 0);

    return await new Promise((resolve, reject) => {
      canvas.toBlob((webpBlob) => {
        if (webpBlob) {
          resolve(webpBlob);
          return;
        }

        reject(new Error('Unable to convert the image to WebP.'));
      }, 'image/webp', WEBP_QUALITY);
    });
  } finally {
    bitmap.close();
  }
};

const toWebpFilename = (filename) => {
  const baseName = filename.replace(/\.[^/.]+$/, '') || 'product-image';
  return `${baseName}.webp`;
};

/**
 * Removes an image background and returns a WebP file ready for upload.
 * The original file is never returned or uploaded by this helper.
 *
 * @param {File} file
 * @param {(stage: string) => void} [onProgress]
 * @returns {Promise<File>}
 */
export const processProductImage = async (file, onProgress) => {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Please select an image file.');
  }

  onProgress?.('Preparing image');
  onProgress?.('Removing background');
  const removeBackground = await loadRemoveBackground();
  let transparentImage;
  try {
    transparentImage = await removeBackground(file, BACKGROUND_REMOVAL_CONFIG);
  } catch (error) {
    const message = String(error?.message || error || '');
    if (/fetch|network|connection|reset/i.test(message)) {
      throw new Error(
        'Background-removal assets could not be downloaded. Check your connection or set VITE_IMGLY_ASSET_PATH to a self-hosted IMG.LY asset path and try again.',
      );
    }
    throw error;
  }

  onProgress?.('Converting to WebP');
  const webpBlob = await toWebpBlob(transparentImage);

  return new File([webpBlob], toWebpFilename(file.name), {
    type: 'image/webp',
    lastModified: Date.now(),
  });
};

/**
 * Processes image files one at a time and delegates upload of each processed WebP.
 *
 * @param {File[]} files
 * @param {(file: File, index: number) => Promise<{url: string}>} upload
 * @param {(stage: string, index: number) => void} [onProgress]
 * @returns {Promise<string[]>}
 */
export const processLocalImages = async (files, upload, onProgress) => {
  const urls = [];

  for (const [index, file] of files.entries()) {
    const processedFile = await processProductImage(file, (stage) => onProgress?.(stage, index));
    onProgress?.('Uploading to Cloudinary', index);
    const result = await upload(processedFile, index);
    urls.push(result.url);
    onProgress?.('Complete', index);
  }

  return urls;
};
