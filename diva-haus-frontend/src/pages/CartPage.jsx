import { useContext } from 'react'; // Removed useEffect, useState
import { AuthContext } from '../context/AuthContext';
// Removed getCart, removeFromCart
import { CartContext } from '../context/CartContext'; // NEW: Import CartContext

const CartPage = () => {
  const { isAuthenticated } = useContext(AuthContext); // Use isAuthenticated
  const { cartItems, loading, error, removeItemFromCart, fetchUserCart } = useContext(CartContext); // NEW: Get cart state and functions

  // Fetch cart on mount and when isAuthenticated changes
  // This useEffect replaces the old one, but relies on CartContext's internal useEffect
  // We can call fetchUserCart directly if needed, but CartContext already handles it on auth change

  const handleRemove = async (productId) => {
    await removeItemFromCart(productId); // NEW: Use removeItemFromCart from CartContext
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
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
