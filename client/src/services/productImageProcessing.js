let removeBackgroundLoader;

const loadRemoveBackground = async () => {
  removeBackgroundLoader ??= import('@imgly/background-removal').then(({ removeBackground }) => removeBackground);
  return removeBackgroundLoader;
};

/**
 * Converts a transparent image Blob to WebP without changing its dimensions.
 *
 * @param {Blob} blob
 * @returns {Promise<Blob>}
 */
export const toWebpBlob = async (blob) => {
  const bitmap = await createImageBitmap(blob);

  try {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

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
      }, 'image/webp', 0.9);
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
  const transparentImage = await removeBackground(file);

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
