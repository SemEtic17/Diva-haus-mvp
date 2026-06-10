import { useContext } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; 
import { useTranslation } from 'react-i18next';
import { Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartSkeleton from '../components/CartSkeleton';

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
    return <CartSkeleton />;
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
    <div className="min-h-screen pt-20 md:pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-4">
            <ShoppingBag className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold uppercase tracking-widest">{t('cart.your_bag')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">{t('cart.title')}</h1>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </header>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 backdrop-blur-xl bg-card/40 border border-glass-border/30 rounded-[2rem] p-12 shadow-luxury max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-8 border border-glass-border/20">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">{t('cart.empty')}</h2>
            <p className="text-muted-foreground mb-10 max-w-xs mx-auto">Discover our curated collection of luxury pieces selected just for you.</p>
            <Link to="/" className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:shadow-neon-gold transition-all duration-500 group">
              {t('cart.continue_shopping')}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.product._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col sm:flex-row items-center gap-6 p-6 backdrop-blur-xl bg-card/40 border border-glass-border/30 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all duration-500 group relative overflow-hidden"
                  >
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative w-full sm:w-32 aspect-[3/4] flex-shrink-0 overflow-hidden rounded-2xl border border-glass-border/20 bg-muted/10">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">{item.product.brand || 'Diva Haus'}</span>
                        <div className="w-1 h-1 rounded-full bg-gold/30" />
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">{item.product.category || 'Luxury'}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground leading-tight">{item.product.name}</h3>
                      <div className="flex items-center justify-center sm:justify-start gap-4">
                        <p className="text-gold font-serif font-bold text-2xl">${item.product.price.toFixed(2)}</p>
                        <div className="h-4 w-px bg-glass-border/30" />
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">{t('cart.qty')}: {item.qty}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center gap-4 sm:pl-6 sm:border-l border-glass-border/20">
                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="p-3 text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all duration-300"
                        title={t('cart.remove')}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <div className="p-8 backdrop-blur-xl bg-card/60 border border-glass-border/30 rounded-[2rem] shadow-luxury space-y-8 relative overflow-hidden">
                {/* Subtle light effect */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-gold/10 rounded-full blur-[80px]" />
                
                <div className="relative">
                  <h3 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
                    {t('cart.summary')}
                    <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
                  </h3>
                </div>
                
                <div className="space-y-4 relative">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">{t('cart.subtotal')}</span>
                    <span className="text-foreground font-serif font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-glass-border/10 pt-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">{t('cart.shipping')}</span>
                      <span className="text-gold font-bold uppercase tracking-widest text-[10px]">{t('cart.complimentary')}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em] leading-tight">
                      International Express
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-glass-border/30 relative">
                  <div className="flex justify-between items-baseline mb-8">
                    <span className="text-lg font-serif font-bold text-foreground uppercase tracking-widest">{t('cart.total')}</span>
                    <span className="text-3xl font-serif font-bold text-gradient-gold">${total.toFixed(2)}</span>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 rounded-[1.25rem] bg-gradient-to-r from-gold to-gold-dark text-white font-bold uppercase tracking-[0.25em] text-xs shadow-neon-gold hover:shadow-[0_20px_40px_hsl(var(--gold)/0.3)] transition-all duration-500 flex items-center justify-center gap-3"
                  >
                    {t('cart.checkout')}
                  </motion.button>
                  
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-muted/20 rounded-full border border-glass-border/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[8px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                        {t('cart.secure_payment')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
