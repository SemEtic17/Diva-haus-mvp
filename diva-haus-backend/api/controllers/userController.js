import User from '../models/User.js';
import storageService from '../services/storage.service.js'; // Day 19: Use storage service

// @desc    Delete user body image
// @route   DELETE /api/users/body-image
// @access  Private
export const deleteBodyImage = async (req, res, next) => {
  try {
    const user = req.user; // req.user is set by the protect middleware

    if (!user.bodyImagePublicId) {
      res.status(404);
      throw new Error('No body image found to delete');
    }

    // Delete from storage service (Cloudinary or local)
    const deleted = await storageService.delete(user.bodyImagePublicId);
    
    if (!deleted) {
      console.warn(`[deleteBodyImage] Failed to delete image ${user.bodyImagePublicId} from storage, but clearing from database`);
    }

    // Clear from user record
    user.bodyImage = null;
    user.bodyImagePublicId = null;
    await user.save();

    res.status(200).json({
      message: 'Body image deleted successfully',
    });
  } catch (error) {
    console.error('[deleteBodyImage] Error:', error);
    next(error);
  }
};

// @desc    Upload user body image for try-on
// @route   POST /api/users/upload-body-image
// @access  Private
export const uploadBodyImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No image file uploaded');
    }

    const user = req.user; // req.user is set by the protect middleware

    console.log(`[uploadBodyImage] Using storage provider: ${storageService.getProviderName()}`);
    console.log(`[uploadBodyImage] File: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // Delete old image if it exists (to free up storage)
    if (user.bodyImagePublicId) {
      console.log(`[uploadBodyImage] Deleting old image with publicId: ${user.bodyImagePublicId}`);
      await storageService.delete(user.bodyImagePublicId);
    }

    // Upload new image to storage service (local or cloud based on config)
    const uploadResult = await storageService.uploadBodyImage(req.file);

    console.log(`[uploadBodyImage] Upload result:`, {
      success: uploadResult.success,
      url: uploadResult.url,
      error: uploadResult.error
    });

    if (!uploadResult.success) {
      res.status(500);
      throw new Error(uploadResult.error || 'Failed to upload image');
    }

    // Store the URL and publicId (publicId needed for future deletion/replacement)
    user.bodyImage = uploadResult.url;
    user.bodyImagePublicId = uploadResult.publicId; // Store for deletion capability
    await user.save();

    console.log(`[uploadBodyImage] Successfully saved body image URL: ${user.bodyImage}`);

    res.status(200).json({
      message: 'Body image uploaded successfully',
      bodyImage: user.bodyImage,
      provider: storageService.getProviderName(),
    });
  } catch (error) {
    console.error('[uploadBodyImage] Error:', error);
    next(error);
  }
};
