import User from '../models/User.js';
import storageService from '../services/storage.service.js'; // Day 19: Use storage service

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

    // Day 19: Upload to storage service (local or cloud based on config)
    const uploadResult = await storageService.uploadBodyImage(req.file);

    if (!uploadResult.success) {
      res.status(500);
      throw new Error(uploadResult.error || 'Failed to upload image');
    }

    // Store the URL and publicId for potential future deletion
    user.bodyImage = uploadResult.url;
    user.bodyImagePublicId = uploadResult.publicId; // Store for deletion capability
    await user.save();

    res.status(200).json({
      message: 'Body image uploaded successfully',
      bodyImage: user.bodyImage,
      provider: storageService.getProviderName(),
    });
  } catch (error) {
    next(error);
  }
};
