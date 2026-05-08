import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X, Heart, LogOut, UserPlus, Languages, ChevronDown, Sun, Moon, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      {/* Main Navbar */}
      <div className="relative z-30 bg-background/80 backdrop-blur-xl border-b border-glass-border/30 pointer-events-auto">
        {/* Holographic neon border effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/50 to-neon-pink/50" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-neon-pink/0 via-gold/30 to-neon-cyan/0 blur-sm" />

        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Left: Brand & Mobile Menu Toggle */}
            <div className="flex-1 flex items-center justify-start space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-foreground/70 hover:text-gold transition-colors md:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
              <Link to="/" className="flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col items-start"
                >
                  <h1 className="font-serif text-2xl md:text-3xl tracking-wider leading-none">
                    <span className="text-gradient-gold">DIVA</span>
                    <span className="text-foreground ml-1">HAUS</span>
                  </h1>
                  <span className="hidden md:block text-[10px] tracking-[0.4em] text-gold/60 uppercase mt-1">
                    Luxury Boutique
                  </span>
                </motion.div>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex-1 flex items-center justify-end space-x-1 md:space-x-4">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-foreground/70 hover:text-gold transition-colors duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </motion.button>

              {/* Language Switcher */}
              <div className="relative flex items-center" ref={langMenuRef}>
                <div className="hidden md:flex items-center space-x-1 mr-2 border-r border-border pr-4">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`text-xs px-2 py-1 rounded transition-colors ${i18n.language === 'en' ? 'bg-gold text-primary-foreground' : 'text-foreground/60 hover:text-foreground'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => changeLanguage('am')}
                    className={`text-xs px-2 py-1 rounded transition-colors ${i18n.language === 'am' ? 'bg-gold text-primary-foreground' : 'text-foreground/60 hover:text-foreground'}`}
                  >
                    አማ
                  </button>
                </div>

                <motion.button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="md:hidden flex items-center space-x-1 p-2 text-foreground/70 hover:text-gold transition-colors duration-300 sm:border-r sm:border-border sm:pr-4"
                >
                  <Languages size={18} />
                  <span className="text-xs font-medium uppercase">{i18n.language === 'am' ? 'አማ' : 'EN'}</span>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-32 bg-popover backdrop-blur-xl border border-glass-border/30 rounded-lg shadow-2xl overflow-hidden z-[60]"
                    >
                      <button onClick={() => changeLanguage('en')} className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${i18n.language === 'en' ? 'bg-gold text-primary-foreground' : 'text-foreground/60 hover:bg-muted hover:text-gold'}`}>English</button>
                      <button onClick={() => changeLanguage('am')} className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${i18n.language === 'am' ? 'bg-gold text-primary-foreground' : 'text-foreground/60 hover:bg-muted hover:text-gold'}`}>አማርኛ</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop Icons - Hidden on Mobile */}
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/wishlist" aria-label="Wishlist">
                  <motion.div whileHover={linkHover} className="relative p-2 text-foreground/70 hover:text-gold transition-colors duration-300">
                    <Heart size={20} />
                    {wishlistItemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium bg-gradient-to-r from-neon-cyan to-neon-pink text-white rounded-full px-1">
                        {wishlistItemCount}
                      </span>
                    )}
                  </motion.div>
                </Link>

                <Link to="/cart" aria-label="Shopping cart">
                  <motion.div whileHover={linkHover} className="relative p-2 text-foreground/70 hover:text-gold transition-colors duration-300">
                    <ShoppingBag size={20} />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium bg-gradient-to-r from-neon-cyan to-neon-pink text-white rounded-full px-1">
                        {cartItemCount}
                      </span>
                    )}
                  </motion.div>
                </Link>

                <Link to={isAuthenticated ? '/profile' : '/login'} aria-label={isAuthenticated ? 'Profile' : 'Login'}>
                  <motion.div whileHover={linkHover} className="relative p-2 text-foreground/70 hover:text-gold transition-colors duration-300">
                    <User size={20} />
                    {isAuthenticated && <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />}
                  </motion.div>
                </Link>

                {isAuthenticated && userInfo?.isAdmin && (
                  <Link to="/admin" aria-label="Admin Dashboard">
                    <motion.div whileHover={linkHover} className="p-2 text-gold hover:text-neon-cyan transition-colors duration-300">
                      <ShieldCheck size={20} />
                    </motion.div>
                  </Link>
                )}
                
                {isAuthenticated && (
                  <motion.button onClick={logout} whileHover={linkHover} className="p-2 text-foreground/70 hover:text-gold transition-colors duration-300" aria-label="Logout">
                    <LogOut size={20} />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden overflow-hidden border-t border-border"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="bg-background/95 backdrop-blur-xl px-4 py-6 space-y-1 pointer-events-auto">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-3 py-3 px-4 text-base font-medium text-foreground/80 hover:text-gold hover:bg-muted rounded-lg transition-all duration-200">
                      <User size={18} />
                      {t('nav.my_account')}
                    </Link>
                    <button onClick={logout} className="w-full text-left flex items-center gap-3 py-3 px-4 text-base font-medium text-foreground/80 hover:text-gold hover:bg-muted rounded-lg transition-all duration-200">
                      <LogOut size={18} />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center gap-3 py-3 px-4 text-base font-medium text-foreground/80 hover:text-gold hover:bg-muted rounded-lg transition-all duration-200">
                      <User size={18} />
                      {t('nav.sign_in')}
                    </Link>
                    <Link to="/register" className="flex items-center gap-3 py-3 px-4 text-base font-medium text-foreground/80 hover:text-gold hover:bg-muted rounded-lg transition-all duration-200">
                      <UserPlus size={18} />
                      {t('nav.register')}
                    </Link>
                  </>
                )}
                <div className="my-4 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <Link to="/wishlist" className="flex items-center gap-3 py-3 px-4 text-base font-medium text-foreground/80 hover:text-gold hover:bg-muted rounded-lg transition-all duration-200">
                  <Heart size={18} />
                  {t('nav.wishlist')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Liquid Floating Dock for Mobile */}
      <div className="md:hidden relative z-10 flex justify-end px-4 pointer-events-none">
        {/* The "Liquid" Connection Line */}
        <div className="absolute top-0 right-14 w-8 h-8 flex justify-center">
          <div className="w-[2px] h-full bg-gradient-to-b from-gold/40 to-transparent" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 4, scale: 1 }}
          className="bg-background/60 backdrop-blur-md border border-glass-border/30 rounded-full px-2 py-1 flex items-center gap-1 shadow-luxury pointer-events-auto"
        >
          <Link to="/wishlist" className="relative p-2 text-foreground/70 active:text-gold transition-colors">
            <Heart size={18} />
            {wishlistItemCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-[14px] flex items-center justify-center text-[8px] font-bold bg-gradient-to-r from-neon-cyan to-neon-pink text-white rounded-full">
                {wishlistItemCount}
              </span>
            )}
          </Link>
          
          <Link to="/cart" className="relative p-2 text-foreground/70 active:text-gold transition-colors">
            <ShoppingBag size={18} />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-[14px] flex items-center justify-center text-[8px] font-bold bg-gradient-to-r from-neon-cyan to-neon-pink text-white rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>

          <Link to={isAuthenticated ? '/profile' : '/login'} className="p-2 text-foreground/70 active:text-gold transition-colors">
            <User size={18} />
          </Link>

          {isAuthenticated && userInfo?.isAdmin && (
            <Link to="/admin" className="p-2 text-gold active:text-neon-cyan transition-colors">
              <ShieldCheck size={18} />
            </Link>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Navbar;