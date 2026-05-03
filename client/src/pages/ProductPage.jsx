import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductById } from '../api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import VirtualTryOnPlaceholder from '../components/VirtualTryOnPlaceholder';
import HolographicContainer from '../components/HolographicContainer';
import { toast } from '../components/Toaster';
import { isTryOnEnabled } from '../config/features';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Sparkles, Ruler, ShieldCheck } from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, userInfo } = useContext(AuthContext);
  const { addItemToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
        toast.error(t('products.error') + ': ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, t]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error(t('products.login_required_cart'));
      return;
    }

    try {
      await addItemToCart(product._id, 1);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleTryOn = () => {
    if (!isAuthenticated) {
      toast.error(t('products.login_required_try_on'));
      return;
    }

    if (!userInfo || !userInfo.bodyImage) {
      toast.info(t('products.upload_body_image_first'));
      navigate('/profile');
      return;
    }

    toast.info(t('products.try_on_coming_soon'));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">{t('products.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-serif font-bold text-foreground mb-2">Error Occurred</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-serif font-bold text-foreground mb-2">{t('products.not_found')}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Product Visuals */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-glass-border/30 shadow-luxury group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Holographic Container / 3D Viewer Placeholder */}
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-glass-border/20 shadow-inner bg-muted/20">
              <HolographicContainer product={product} />
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col space-y-8"
          >
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">{t('products.premium_selection', 'Premium Selection')}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight tracking-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-serif font-semibold text-gradient-gold">
                ${product.price.toFixed(2)}
              </p>
            </header>

            <div className="prose prose-sm text-muted-foreground leading-relaxed max-w-none">
              <p>
                {product.description || 'Experience the epitome of luxury with this meticulously crafted piece. Designed for those who appreciate the finer details, it combines timeless elegance with modern sophistication.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
              <div className="flex items-center gap-3 text-sm text-foreground/70">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-gold" />
                </div>
                <span>{t('products.true_to_size', 'True to Size')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/70">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                </div>
                <span>{t('products.quality_assured', 'Quality Assured')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!isAuthenticated}
                className="flex-1 min-h-[56px] bg-gradient-to-r from-gold to-gold-dark text-primary-foreground font-bold uppercase tracking-widest rounded-xl shadow-neon-gold hover:shadow-[0_0_30px_hsl(var(--gold)/0.4)] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5" />
                {t('products.add_to_cart')}
              </motion.button>

              {isTryOnEnabled && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTryOn}
                  className="flex-1 min-h-[56px] bg-card border border-glass-border/30 text-foreground font-bold uppercase tracking-widest rounded-xl hover:bg-muted transition-all duration-300 flex items-center justify-center gap-3 shadow-luxury"
                >
                  <Sparkles className="w-5 h-5 text-gold" />
                  {t('products.virtual_try_on')}
                </motion.button>
              )}
            </div>

            {isTryOnEnabled && (
              <div className="mt-4">
                <VirtualTryOnPlaceholder productId={product._id} />
              </div>
            )}
            
            <footer className="pt-8 text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] space-y-2">
              <p>• {t('products.free_shipping', 'Complimentary Express Shipping')}</p>
              <p>• {t('products.returns', 'Returns accepted within 14 days')}</p>
            </footer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
