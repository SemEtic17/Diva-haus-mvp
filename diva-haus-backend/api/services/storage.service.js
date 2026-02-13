// diva-haus-backend/api/services/storage.service.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @typedef {object} UploadResult
 * @property {boolean} success - Whether the upload succeeded
 * @property {string} [url] - The public URL of the uploaded file
 * @property {string} [publicId] - The unique identifier for the file (for deletion)
 * @property {string} [error] - Error message if upload failed
 */

/**
 * @typedef {object} StorageFile
 * @property {Buffer} buffer - The file data
 * @property {string} originalname - Original filename
 * @property {string} mimetype - MIME type of the file
 * @property {number} [size] - File size in bytes
 */

// Get storage provider from environment
const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'local';
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

/**
 * Generate a unique filename to prevent collisions
 * @param {string} originalname - Original filename
 * @returns {string} Unique filename
 */
function generateUniqueFilename(originalname) {
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalname);
  const baseName = path.basename(originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
  return `${baseName}-${timestamp}-${randomStr}${ext}`;
}

/**
 * Local Storage Provider
 * Saves files to disk for development use
 */
const localStorageProvider = {
  name: 'local',

  /**
   * Upload a file to local storage
   * @param {StorageFile} file - The file to upload
   * @param {string} folder - Subfolder to store the file in
   * @returns {Promise<UploadResult>}
   */
  async upload(file, folder = 'general') {
    try {
      const folderPath = path.join(UPLOADS_DIR, folder);
      
      // Ensure directory exists
      await fs.mkdir(folderPath, { recursive: true });
      
      const filename = generateUniqueFilename(file.originalname);
      const filePath = path.join(folderPath, filename);
      
      // Write file to disk
      await fs.writeFile(filePath, file.buffer);
      
      // Return public URL
      const url = `${BASE_URL}/uploads/${folder}/${filename}`;
      
      console.log(`[LocalStorage] Uploaded: ${filePath}`);
      
      return {
        success: true,
        url,
        publicId: `${folder}/${filename}`,
      };
    } catch (error) {
      console.error('[LocalStorage] Upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Delete a file from local storage
   * @param {string} publicId - The file identifier (folder/filename)
   * @returns {Promise<boolean>}
   */
  async delete(publicId) {
    try {
      const filePath = path.join(UPLOADS_DIR, publicId);
      await fs.unlink(filePath);
      console.log(`[LocalStorage] Deleted: ${filePath}`);
      return true;
    } catch (error) {
      console.error('[LocalStorage] Delete error:', error);
      return false;
    }
  },
};

/**
 * Cloudinary Storage Provider
 * For production use with cloud-based image storage and optimization
 */
const cloudinaryProvider = {
  name: 'cloudinary',
  _client: null,

  /**
   * Get or initialize Cloudinary client
   */
  _getClient() {
    if (!this._client) {
      // Dynamic import would be better, but for simplicity we'll check env vars
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        throw new Error('Cloudinary credentials not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');
      }

      // We'll lazy-load cloudinary to avoid errors if not installed
      try {
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });
        this._client = cloudinary;
      } catch (err) {
        throw new Error('Cloudinary package not installed. Run: npm install cloudinary');
      }
    }
    return this._client;
  },

  /**
   * Upload a file to Cloudinary
   * @param {StorageFile} file - The file to upload
   * @param {string} folder - Subfolder in Cloudinary
   * @returns {Promise<UploadResult>}
   */
  async upload(file, folder = 'diva-haus') {
    try {
      const cloudinary = this._getClient();
      
      // Convert buffer to base64 data URI for Cloudinary
      const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      
      const result = await cloudinary.uploader.upload(base64Data, {
        folder: folder,
        resource_type: 'image',
        // Optional: add transformations for optimization
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      });

      console.log(`[Cloudinary] Uploaded: ${result.public_id}`);

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error('[Cloudinary] Upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Delete a file from Cloudinary
   * @param {string} publicId - The Cloudinary public ID
   * @returns {Promise<boolean>}
   */
  async delete(publicId) {
    try {
      const cloudinary = this._getClient();
      await cloudinary.uploader.destroy(publicId);
      console.log(`[Cloudinary] Deleted: ${publicId}`);
      return true;
    } catch (error) {
      console.error('[Cloudinary] Delete error:', error);
      return false;
    }
  },
};

/**
 * Storage Service
 * Unified interface for file storage operations
 */
class StorageService {
  constructor() {
    this.provider = this._getProvider();
    console.log(`[StorageService] Using provider: ${this.provider.name}`);
  }

  _getProvider() {
    switch (STORAGE_PROVIDER) {
      case 'cloudinary':
        return cloudinaryProvider;
      case 'local':
      default:
        return localStorageProvider;
    }
  }

  /**
   * Upload a file
   * @param {StorageFile} file - The file to upload
   * @param {string} folder - Category/folder for organization
   * @returns {Promise<UploadResult>}
   */
  async upload(file, folder = 'general') {
    return this.provider.upload(file, folder);
  }

  /**
   * Delete a file
   * @param {string} publicId - The file identifier
   * @returns {Promise<boolean>}
   */
  async delete(publicId) {
    return this.provider.delete(publicId);
  }

  /**
   * Upload a body image for user profiles
   * @param {StorageFile} file - The image file
   * @returns {Promise<UploadResult>}
   */
  async uploadBodyImage(file) {
    return this.upload(file, 'body-images');
  }

  /**
   * Upload an image for virtual try-on processing
   * @param {StorageFile} file - The image file
   * @returns {Promise<UploadResult>}
   */
  async uploadTryOnImage(file) {
    return this.upload(file, 'try-on-uploads');
  }

  /**
   * Get the current provider name
   * @returns {string}
   */
  getProviderName() {
    return this.provider.name;
  }
}

// Export singleton instance
const storageService = new StorageService();
export default storageService;

// Also export for named imports
export { storageService, StorageService };
