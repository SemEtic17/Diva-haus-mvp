import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getCart, removeFromCart } from '../api';

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCart();
        setCartItems(items);
      } catch (error) {
        console.error('Failed to fetch cart', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user]);

  const handleRemove = async (productId) => {
    try {
      const updatedCart = await removeFromCart(productId);
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Failed to remove item from cart', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover mr-4" />
                <div>
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                  <p>${item.product.price}</p>
                </div>
              </div>
              <div className="flex items-center">
                 <p className="mr-4">Qty: {item.qty}</p>
                <button
                  onClick={() => handleRemove(item.product._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right mt-4 text-xl font-bold">
            Total: ${cartItems.reduce((acc, item) => acc + item.qty * item.product.price, 0).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
