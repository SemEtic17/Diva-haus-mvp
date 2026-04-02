import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../api';
import { toast } from '../components/Toaster'; 
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, UserPlus, Sparkles } from 'lucide-react';

const Register = () => {
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
    if (password !== password2) {
      toast.error(t('auth.passwords_not_match', 'Passwords do not match')); 
      return;
    }
    
    setIsLoading(true);
    try {
      await registerUser({ name, email, password });
      toast.success(t('auth.registration_success', 'Registration successful! Please login.'));
      navigate('/login');
    } catch (error) {
      toast.error(error.message || t('auth.registration_failed', 'Failed to register')); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 relative"
      >
        {/* Decorative Background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neon-pink/5 rounded-full blur-3xl" />

        <div className="relative z-10 backdrop-blur-xl bg-card/60 border border-glass-border/30 p-8 rounded-3xl shadow-luxury">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gold/10 border border-gold/20 mb-4">
              <Sparkles className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground">{t('auth.register_title')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('auth.register_subtitle', 'Join our exclusive community of fashion enthusiasts')}</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1 ml-1">{t('auth.name')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gold/50" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl 
                             bg-background/50 text-foreground placeholder-muted-foreground
                             focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                             transition-all duration-300 sm:text-sm"
                    placeholder={t('auth.name_placeholder', 'Full Name')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1 ml-1">{t('auth.email')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gold/50" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl 
                             bg-background/50 text-foreground placeholder-muted-foreground
                             focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                             transition-all duration-300 sm:text-sm"
                    placeholder={t('auth.email_placeholder', 'you@example.com')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1 ml-1">{t('auth.password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gold/50" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    minLength="6"
                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl 
                             bg-background/50 text-foreground placeholder-muted-foreground
                             focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                             transition-all duration-300 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1 ml-1">{t('auth.confirm_password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gold/50" />
                  </div>
                  <input
                    type="password"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    required
                    minLength="6"
                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl 
                             bg-background/50 text-foreground placeholder-muted-foreground
                             focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                             transition-all duration-300 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                       rounded-xl text-primary-foreground font-semibold bg-gradient-to-r 
                       from-gold to-gold-dark shadow-neon-gold hover:shadow-[0_0_20px_hsl(var(--gold)/0.4)]
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold
                       transition-all duration-300 disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-primary-foreground/50 group-hover:text-primary-foreground/80 transition-colors" />
              </span>
              {isLoading ? t('auth.registering') : t('auth.register_button')}
            </motion.button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {t('auth.have_account')} 
              <Link to="/login" className="ml-1 font-medium text-gold hover:text-gold-light transition-colors underline decoration-gold/30 underline-offset-4">
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
