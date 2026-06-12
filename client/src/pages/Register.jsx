import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../api';
import { toast } from '../components/Toaster'; 
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, UserPlus, Sparkles, AlertCircle } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const Register = () => {
  const { settings, loading: configLoading } = useConfig();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!settings.enableRegistration) {
      toast.error('auth.registration_disabled');
      return;
    }

    if (password !== password2) {
      toast.error('auth.passwords_not_match'); 
      return;
    }
    
    setIsLoading(true);
    try {
      await registerUser({ name, email, password });
      toast.success('auth.registration_success');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'auth.registration_failed'); 
    } finally {
      setIsLoading(false);
    }
  };

  if (!configLoading && !settings.enableRegistration) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full backdrop-blur-xl bg-card/60 border border-glass-border/30 p-12 rounded-3xl shadow-luxury text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground">Registration Closed</h2>
          <p className="text-muted-foreground italic">
            New account creation is currently disabled by the administrator. 
            Please contact support if you believe this is an error.
          </p>
          <div className="pt-6">
            <Link to="/login">
               <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-xl text-primary-foreground font-semibold bg-gold shadow-neon-gold hover:bg-gold/90 transition-all duration-300"
              >
                Return to Login
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
      {/* Dynamic Background Elements - Anchored to sides */}
      <div className="absolute top-0 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 -left-24 w-96 h-96 bg-neon-pink/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative"
      >
        <div className="relative z-10 backdrop-blur-2xl bg-card/40 border border-glass-border/20 p-10 md:p-12 rounded-[2.5rem] shadow-luxury overflow-hidden group">
          {/* Subtle Shimmer Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="text-center mb-12 relative">
            <h2 className="font-serif text-4xl font-bold text-foreground tracking-tight mb-6">
              {t('auth.register_title')}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/30" />
              <p className="text-xs font-bold text-gold uppercase tracking-[0.3em]">
                {t('auth.register_subtitle', 'Join the Circle')}
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/30" />
            </div>
          </div>

          <form className="space-y-5 relative" onSubmit={onSubmit}>
            <div className="space-y-4">
              <div className="group/input">
                <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-2 ml-1">
                  {t('auth.name')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gold/40 group-focus-within/input:text-gold transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                    className="block w-full pl-12 pr-4 py-3 border border-glass-border/30 rounded-2xl 
                             bg-background/20 text-foreground placeholder-muted-foreground/40
                             focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50
                             transition-all duration-500 sm:text-sm backdrop-blur-sm"
                    placeholder={t('auth.name_placeholder', 'Full Name')}
                  />
                </div>
              </div>

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
                    className="block w-full pl-12 pr-4 py-3 border border-glass-border/30 rounded-2xl 
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
                    minLength="6"
                    className="block w-full pl-12 pr-4 py-3 border border-glass-border/30 rounded-2xl 
                             bg-background/20 text-foreground placeholder-muted-foreground/40
                             focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50
                             transition-all duration-500 sm:text-sm backdrop-blur-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="group/input">
                <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-2 ml-1">
                  {t('auth.confirm_password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gold/40 group-focus-within/input:text-gold transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    required
                    minLength="6"
                    className="block w-full pl-12 pr-4 py-3 border border-glass-border/30 rounded-2xl 
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
                       hover:shadow-[0_15px_30px_hsl(var(--gold)/0.3)]
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold
                       transition-all duration-500 disabled:opacity-50 mt-6"
            >
              {isLoading ? t('auth.registering') : t('auth.register_button')}
            </motion.button>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-glass-border/20 relative">
            <p className="text-xs text-muted-foreground tracking-wide">
              {t('auth.have_account')} 
              <Link to="/login" className="ml-2 font-bold text-gold hover:text-gold-light transition-all duration-300 uppercase tracking-widest text-[10px]">
                {t('auth.login_title')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
