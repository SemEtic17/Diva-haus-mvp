import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;

    const user = await User.findById(req.user.id);
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (user) {
      const alreadyInCart = user.cart.find(
        (item) => item.product.toString() === productId
      );

      if (alreadyInCart) {
        alreadyInCart.qty = qty;
      } else {
        user.cart.push({ product: productId, qty });
      }

      await user.save();
      const updatedUser = await User.findById(req.user.id).populate('cart.product');
      res.status(200).json(updatedUser.cart);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');

    if (user) {
      res.json(user.cart);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== req.params.productId
      );

      await user.save();
      const updatedUser = await User.findById(req.user.id).populate('cart.product');
      res.json(updatedUser.cart);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
