import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax', // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        // token: token, // Token is now in HttpOnly cookie
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax', // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        // token: token, // Token is now in HttpOnly cookie
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user auth status
// @route   GET /api/auth/status
// @access  Private
export const getAuthStatus = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    if (req.user) {
      res.json({
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        isAuthenticated: true,
      });
    } else {
      res.status(401);
      throw new Error('Not authenticated');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private (though clearing cookie can be public if handled right)
export const logoutUser = (req, res, next) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Expire cookie immediately
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.NODE_ENV === 'development' ? '1d' : '30d', // Shorter for dev
  });
};
