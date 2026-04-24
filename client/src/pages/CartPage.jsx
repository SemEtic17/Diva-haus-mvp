import { useContext } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; 
import { useTranslation } from 'react-i18next';
import { Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { isAuthenticated } = useContext(AuthContext); 
  const { cartItems, loading, error, removeItemFromCart } = useContext(CartContext); 
  const { t } = useTranslation();

  const handleRemove = async (productId) => {
    await removeItemFromCart(productId); 
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">{t('cart.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-serif font-bold text-foreground mb-2">Error Occurred</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const total = cartItems.reduce((acc, item) => acc + item.qty * item.product.price, 0);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-4">
            <ShoppingBag className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold uppercase tracking-widest">{t('cart.your_bag', 'Your Selection')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">{t('cart.title')}</h1>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </header>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 backdrop-blur-xl bg-card/40 border border-glass-border/30 rounded-3xl p-12 shadow-luxury"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h2 className="text-2xl font-serif font-medium text-foreground mb-4">{t('cart.empty')}</h2>
            <Link to="/" className="inline-flex items-center text-gold font-medium hover:text-gold-light transition-colors group">
              {t('cart.continue_shopping', 'Explore our collections')}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-4 p-4 backdrop-blur-xl bg-card/40 border border-glass-border/30 rounded-2xl shadow-sm group"
                  >
                    <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden rounded-xl border border-border">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-serif font-medium text-foreground truncate">{item.product.name}</h3>
                      <p className="text-gold font-serif font-semibold text-xl">${item.product.price.toFixed(2)}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{t('cart.qty')}: {item.qty}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-300"
                      aria-label={t('cart.remove')}
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 backdrop-blur-xl bg-card/60 border border-glass-border/30 rounded-3xl shadow-luxury space-y-6">
                <h3 className="text-xl font-serif font-bold text-foreground border-b border-border pb-4">{t('cart.summary', 'Order Summary')}</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('cart.subtotal', 'Subtotal')}</span>
                    <span className="text-foreground font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('cart.shipping', 'Shipping')}</span>
                    <span className="text-gold font-medium uppercase tracking-tighter">{t('cart.complimentary', 'Complimentary')}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-baseline">
                  <span className="text-lg font-serif font-bold text-foreground">{t('cart.total')}</span>
                  <span className="text-2xl font-serif font-bold text-gradient-gold">${total.toFixed(2)}</span>
                </div>

                <button 
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-primary-foreground font-semibold uppercase tracking-widest shadow-neon-gold hover:shadow-[0_0_30px_hsl(var(--gold)/0.4)] transition-all duration-300 flex items-center justify-center group"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('cart.checkout', 'Secure Checkout')}
                </button>
                
                <p className="text-[10px] text-center text-muted-foreground/60 uppercase tracking-widest pt-2">
                  {t('cart.secure_payment', 'Secure Payment Guaranteed')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
