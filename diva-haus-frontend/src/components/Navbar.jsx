import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X, Heart, LogOut, UserPlus, Languages } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlist } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const linkHover = {
    y: -2,
    transition: { duration: 0.2 },
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const wishlistItemCount = wishlist.length;

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Glassmorphism background with holographic neon border */}
      <div className="relative bg-navy-deep/80 backdrop-blur-xl border-b border-glass-border/30">
        {/* Holographic neon border effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/50 to-neon-pink/50" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-neon-pink/0 via-gold/30 to-neon-cyan/0 blur-sm" />

        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            <div className="flex-1 flex items-center justify-start space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-300/70 hover:text-yellow-400 transition-colors md:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
              <Link to="/" className="md:hidden">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex-shrink-0"
                >
                  <div className="text-center">
                    <h1 className="font-serif text-2xl tracking-wider">
                      <span className="text-gradient-gold">DIVA</span>
                      <span className="text-foreground ml-1">HAUS</span>
                    </h1>
                    <span className="hidden md:block text-[10px] tracking-[0.4em] text-gold/60 uppercase mt-0.5">
                      Luxury Boutique
                    </span>
                  </div>
                </motion.div>
              </Link>
            </div>

            <motion.div
              className="hidden md:flex flex-1 justify-center"
            >
              <Link to="/" className="flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="mx-auto"
                >
                  <div className="text-center">
                    <h1 className="font-serif text-2xl md:text-3xl tracking-wider">
                      <span className="text-gradient-gold">DIVA</span>
                      <span className="text-foreground ml-1">HAUS</span>
                    </h1>
                    <span className="hidden md:block text-[10px] tracking-[0.4em] text-gold/60 uppercase mt-0.5">
                      Luxury Boutique
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            <div className="flex-1 flex items-center justify-end space-x-2 md:space-x-4">
              <div className="flex items-center space-x-1 mr-2 border-r border-white/10 pr-4">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`text-xs px-2 py-1 rounded transition-colors ${i18n.language === 'en' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage('am')}
                  className={`text-xs px-2 py-1 rounded transition-colors ${i18n.language === 'am' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  አማ
                </button>
              </div>

              <Link to="/wishlist" aria-label="Wishlist">
                <motion.div
                  whileHover={linkHover}
                  className="relative p-2 text-gray-300/70 hover:text-yellow-400 transition-colors duration-300"
                >
                  <Heart size={20} />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium bg-gradient-to-r from-cyan-400 to-pink-500 text-black rounded-full px-1">
                      {wishlistItemCount}
                    </span>
                  )}
                </motion.div>
              </Link>

<Link to={isAuthenticated ? '/profile' : '/login'} aria-label={isAuthenticated ? 'Profile' : 'Login'}>
                <motion.div
                  whileHover={linkHover}
                  className="relative p-2 text-gray-300/70 hover:text-yellow-400 transition-colors duration-300"
                >
                  <User size={20} />
                  {isAuthenticated && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />
                  )}
                </motion.div>
              </Link>
              
              {isAuthenticated && (
                <motion.button
                  onClick={logout}
                  whileHover={linkHover}
                  className="hidden md:flex p-2 text-gray-300/70 hover:text-yellow-400 transition-colors duration-300"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </motion.button>
              )}

              <Link to="/cart" aria-label="Shopping cart">
                 <motion.div
                    whileHover={linkHover}
                    className="relative p-2 text-gray-300/70 hover:text-yellow-400 transition-colors duration-300"
                  >
                  <ShoppingBag size={20} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium bg-gradient-to-r from-cyan-400 to-pink-500 text-black rounded-full px-1">
                      {cartItemCount}
                    </span>
                  )}
                 </motion.div>
              </Link>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden overflow-hidden border-t border-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="bg-black/95 backdrop-blur-xl px-4 py-6 space-y-1">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-widest">{t('nav.language', 'Language')}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); changeLanguage('en'); }}
                      className={`text-xs px-3 py-1 rounded transition-colors ${i18n.language === 'en' ? 'bg-yellow-400 text-black' : 'text-gray-400'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); changeLanguage('am'); }}
                      className={`text-xs px-3 py-1 rounded transition-colors ${i18n.language === 'am' ? 'bg-yellow-400 text-black' : 'text-gray-400'}`}
                    >
                      አማርኛ
                    </button>
                  </div>
                </div>

                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-3 py-3 px-4 text-base font-medium text-gray-200/80 hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-all duration-200">
                      <User size={18} />
                      {t('nav.my_account')}
                    </Link>
                    <button onClick={logout} className="w-full text-left flex items-center gap-3 py-3 px-4 text-base font-medium text-gray-200/80 hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-all duration-200">
                      <LogOut size={18} />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center gap-3 py-3 px-4 text-base font-medium text-gray-200/80 hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-all duration-200">
                      <User size={18} />
                      {t('nav.sign_in')}
                    </Link>
                    <Link to="/register" className="flex items-center gap-3 py-3 px-4 text-base font-medium text-gray-200/80 hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-all duration-200">
                      <UserPlus size={18} />
                      {t('nav.register')}
                    </Link>
                  </>
                )}
                <div className="my-4 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
                <Link to="/wishlist" className="flex items-center gap-3 py-3 px-4 text-base font-medium text-gray-200/80 hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-all duration-200">
                  <Heart size={18} />
                  {t('nav.wishlist')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;