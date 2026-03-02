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

    // debug: storage provider and file info (suppressed in production)

    // Delete old image if it exists (to free up storage)
    if (user.bodyImagePublicId) {
      // deleting old image (info suppressed)
      await storageService.delete(user.bodyImagePublicId);
    }

    // Upload new image to storage service (local or cloud based on config)
    const uploadResult = await storageService.uploadBodyImage(req.file);

    // upload result logged at higher logging level when needed

    if (!uploadResult.success) {
      res.status(500);
      throw new Error(uploadResult.error || 'Failed to upload image');
    }

    // Store the URL and publicId (publicId needed for future deletion/replacement)
    user.bodyImage = uploadResult.url;
    user.bodyImagePublicId = uploadResult.publicId; // Store for deletion capability
    await user.save();

    // saved body image URL (info suppressed in production)

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
