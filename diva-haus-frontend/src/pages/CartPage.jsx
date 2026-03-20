import { useContext } from 'react'; 
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; 
import { useTranslation } from 'react-i18next';

const CartPage = () => {
  const { isAuthenticated } = useContext(AuthContext); 
  const { cartItems, loading, error, removeItemFromCart } = useContext(CartContext); 
  const { t } = useTranslation();

  const handleRemove = async (productId) => {
    await removeItemFromCart(productId); 
  };

  if (loading) {
    return <div className="container mx-auto p-4">{t('cart.loading')}</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 mt-4">{t('cart.title')}</h1>
      {cartItems.length === 0 ? (
        <p>{t('cart.empty')}</p>
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
                 <p className="mr-4">{t('cart.qty')}: {item.qty}</p>
                <button
                  onClick={() => handleRemove(item.product._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  {t('cart.remove')}
                </button>
              </div>
            </div>
          ))}
          <div className="text-right mt-4 text-xl font-bold">
            {t('cart.total')}: ${cartItems.reduce((acc, item) => acc + item.qty * item.product.price, 0).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
