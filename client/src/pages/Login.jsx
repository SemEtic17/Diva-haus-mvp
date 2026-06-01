import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { toast } from '../components/Toaster'; 
import { useTranslation } from 'react-i18next';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      // AuthContext handles error toast usually, but just in case
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-gold/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-neon-cyan/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative"
      >
        <div className="relative z-10 backdrop-blur-2xl bg-card/40 border border-glass-border/20 p-10 md:p-12 rounded-[2.5rem] shadow-luxury overflow-hidden group">
          {/* Subtle Shimmer Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="text-center mb-10 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold-dark/20 border border-gold/30 mb-6 shadow-inner">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-serif text-4xl font-bold text-foreground tracking-tight mb-3">
              {t('auth.login_title')}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/30" />
              <p className="text-xs font-bold text-gold uppercase tracking-[0.2em]">
                {t('auth.subtitle', 'Boutique Access')}
              </p>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/30" />
            </div>
          </div>

          <form className="space-y-6 relative" onSubmit={onSubmit}>
            <div className="space-y-5">
              <div className="group/input">
                <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-2 ml-1">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gold/40 group-focus-within/input:text-gold transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    className="block w-full pl-12 pr-4 py-4 border border-glass-border/30 rounded-2xl 
                             bg-background/20 text-foreground placeholder-muted-foreground/40
                             focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50
                             transition-all duration-500 sm:text-sm backdrop-blur-sm"
                    placeholder={t('auth.email_placeholder', 'you@example.com')}
                  />
                </div>
              </div>

              <div className="group/input">
                <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-2 ml-1">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gold/40 group-focus-within/input:text-gold transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    className="block w-full pl-12 pr-4 py-4 border border-glass-border/30 rounded-2xl 
                             bg-background/20 text-foreground placeholder-muted-foreground/40
                             focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50
                             transition-all duration-500 sm:text-sm backdrop-blur-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="group/btn relative w-full flex justify-center py-4 px-4 border border-transparent 
                       rounded-2xl text-white font-bold uppercase tracking-[0.2em] text-xs
                       bg-gradient-to-r from-gold to-gold-dark shadow-neon-gold 
                       hover:shadow-[0_15px_30px_hsl(var(--gold)/0.4)]
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold
                       transition-all duration-500 disabled:opacity-50 mt-8"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                <LogIn className="h-4 w-4 text-white/50 group-hover/btn:text-white transition-colors" />
              </span>
              {isLoading ? t('auth.signing_in') : t('auth.login_button')}
            </motion.button>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-glass-border/20 relative">
            <p className="text-xs text-muted-foreground tracking-wide">
              {t('auth.no_account')} 
              <Link to="/register" className="ml-2 font-bold text-gold hover:text-gold-light transition-all duration-300 uppercase tracking-widest text-[10px]">
                {t('auth.register_link')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
