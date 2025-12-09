import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.cookies.token) { // NEW: Check for token in cookies
      token = req.cookies.token;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found for this token');
      }

      next();
    } else { // NEW: Simplified else block
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  } catch (error) {
    // Ensure status is set correctly for JWT-related errors before passing to global handler
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401);
    }
    next(error);
  }
};
