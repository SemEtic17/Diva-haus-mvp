import { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addToCart, removeFromCart } from '../api';
import { AuthContext } from './AuthContext';
import { toast } from '../components/Toaster'; // NEW: Import toast
import { useTranslation } from 'react-i18next';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const fetchUserCart = async () => {
    if (isAuthenticated) {
      setLoading(true);
      setError(null);
      try {
        const data = await getCart();
        setCartItems(data);
      } catch (err) {
        setError(err.message);
        toast.error(`${t('cart.fetch_error')}: ${err.message}`); // NEW: Use toast.error
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems([]); // Clear cart if not authenticated
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, [isAuthenticated]); // Refetch cart when authentication status changes

  const addItemToCart = async (productId, qty = 1) => {
    if (!isAuthenticated) {
      toast.error(t('cart.login_required')); // NEW: Use toast.error
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await addToCart(productId, qty);
      setCartItems(updatedCart);
      toast.success(t('cart.item_added')); // NEW: Use toast.success
    } catch (err) {
      setError(err.message);
      toast.error(`${t('cart.add_error')}: ${err.message}`); // NEW: Use toast.error
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error(t('cart.login_required')); // NEW: Use toast.error
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await removeFromCart(productId);
      setCartItems(updatedCart);
      toast.info(t('cart.item_removed')); // NEW: Use toast.info
    } catch (err) {
      setError(err.message);
      toast.error(`${t('cart.remove_error')}: ${err.message}`); // NEW: Use toast.error
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addItemToCart,
        removeItemFromCart,
        fetchUserCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, CartContext };
