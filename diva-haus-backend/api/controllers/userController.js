import User from '../models/User.js';
import path from 'path'; // For mocking file path

// Mock storage for uploaded files (in a real app, use cloud storage like S3)
const mockCloudStorage = {
  upload: async (file) => {
    // Simulate uploading to a cloud service and returning a URL
    const filename = `body-images/${Date.now()}_${file.originalname}`;
    console.log(`Mocking upload of ${file.originalname} to ${filename}`);
    // In a real app, this would be an actual upload and return the secure URL
    return `https://mock-cloud-storage.com/${filename}`;
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

    // In a real application, upload req.file to cloud storage (e.g., S3, Cloudinary)
    // For this MVP, we'll just mock a URL.
    const imageUrl = await mockCloudStorage.upload(req.file);

    user.bodyImage = imageUrl;
    await user.save();

    res.status(200).json({
      message: 'Body image uploaded successfully',
      bodyImage: user.bodyImage,
    });
  } catch (error) {
    next(error);
  }
};
