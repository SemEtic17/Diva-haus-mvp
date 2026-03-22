import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { uploadBodyImage, deleteBodyImage } from '../api';
import { toast } from '../components/Toaster';
import { Upload, User, Check, X, Camera, Sparkles, LogOut, Mail, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// Sub-component for Photo Guidelines
const ExampleCard = ({ isGood, label, description, imageUrl }) => (
  <motion.div variants={itemVariants} className="relative group">
    <div className={`relative overflow-hidden rounded-2xl border-2 aspect-[3/4] ${isGood ? 'border-green-600/50 bg-green-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <User className="w-16 h-16 text-muted-foreground/30" />
        </div>
      )}
      <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center ${isGood ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-500'}`}>
        {isGood ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      </div>
    </div>
    <p className="mt-3 text-sm text-center font-medium text-foreground/80">{label}</p>
    <p className="text-xs text-center text-muted-foreground">{description}</p>
  </motion.div>
);

const ProfilePage = () => {
  const { userInfo, isAuthenticated, logout, refreshUserInfo } = useContext(AuthContext);
  const [userBodyImage, setUserBodyImage] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userInfo && userInfo.bodyImage) {
      setUserBodyImage(userInfo.bodyImage);
    } else {
      setUserBodyImage(null);
    }
  }, [isAuthenticated, userInfo]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const tempPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(tempPreviewUrl);
      handleUpload(file); 
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('bodyImage', file);
      const response = await uploadBodyImage(formData);

      setUserBodyImage(response.bodyImage);
      await refreshUserInfo();
      toast.success(t('profile.upload_success'));

      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(error.message || 'Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!userBodyImage) return;

    setRemoving(true);
    try {
      await deleteBodyImage();
      setUserBodyImage(null);
      await refreshUserInfo(); 
      toast.success(t('profile.delete_success'));
    } catch (error) {
      toast.error(error.message || 'Error deleting image.');
    } finally {
      setRemoving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('nav.profile')}</h1>
        <p className="text-muted-foreground">{t('profile.login_required')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-background text-foreground transition-colors duration-300">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4 mt-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">{t('profile.subtitle')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">{t('profile.title')}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('profile.description')}</p>
        </motion.div>

        {/* Main Glass Panel */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-neon-cyan/10 via-neon-pink/10 to-neon-cyan/10 blur-sm" />
          <div className="relative backdrop-blur-xl bg-card/60 border border-glass-border/30 rounded-3xl p-6 sm:p-8 shadow-luxury">

            {/* User Info Section */}
            {userInfo && (
              <div className="mb-8 p-4 rounded-2xl bg-muted/30 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">{t('profile.account_details')}</h3>
                <div className="space-y-2 text-sm text-foreground/80">
                  <div className="flex items-center gap-3"><User className="w-4 h-4 text-gold"/><span>{userInfo.name}</span></div>
                  <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-gold"/><span>{userInfo.email}</span></div>
                  <div className="pt-2">
                    <button onClick={logout} className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors font-medium"><LogOut className="w-4 h-4"/><span>{t('profile.logout')}</span></button>
                  </div>
                </div>
              </div>
            )}

            {/* Current Image & Upload Section */}
            <h3 className="text-lg font-medium text-foreground mb-4">{t('profile.current_image')}</h3>
            <div className="grid sm:grid-cols-3 gap-6 items-center">
              <div className="sm:col-span-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={userBodyImage || 'empty'}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`relative overflow-hidden rounded-2xl border-2 border-dashed aspect-[3/4] w-full max-w-xs mx-auto ${userBodyImage ? 'border-gold/40 bg-gold/5' : 'border-border bg-muted/20'}`}
                  >
                    {userBodyImage ? (
                      <img src={userBodyImage} alt="User Body" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center"><Camera className="w-10 h-10 text-muted-foreground/50" /></div>
                        <p className="text-sm text-muted-foreground font-medium">{t('profile.no_image')}</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="sm:col-span-2 text-center sm:text-left">
                <h4 className="text-xl font-serif font-semibold text-foreground mb-3">{t('profile.why_image_matters')}</h4>
                <p className="text-muted-foreground leading-relaxed mb-6">{t('profile.why_image_desc')}</p>

                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <motion.button
                    onClick={() => fileInputRef.current.click()}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={uploading}
                    className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-gold to-gold-dark text-primary-foreground font-medium px-6 py-3 rounded-xl shadow-neon-gold transition-all duration-300 disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {uploading ? t('profile.uploading') : (userBodyImage ? t('profile.update_photo') : t('profile.upload_photo'))}
                  </motion.button>

                  {userBodyImage && (
                    <motion.button
                      onClick={handleRemoveImage}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={removing}
                      className="w-full sm:w-auto flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/30 font-medium px-6 py-3 rounded-xl transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      {removing ? t('profile.removing') : t('profile.remove_photo')}
                    </motion.button>
                  )}
                </div>

              </div>
            </div>
          </div>
        </motion.div>

        {/* Photo Guidelines */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl shadow-lg">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-neon-pink/5 via-transparent to-neon-cyan/5" />
          <div className="relative backdrop-blur-xl bg-card/50 border border-glass-border/20 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-serif font-semibold text-foreground mb-2">{t('profile.guidelines_title')}</h2>
            <p className="text-muted-foreground mb-6">{t('profile.guidelines_desc')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <ExampleCard isGood={true} label={t('profile.full_body')} description={t('profile.full_body_desc')} imageUrl="/assets/examples/full_body.jpeg" />
              <ExampleCard isGood={true} label={t('profile.good_lighting')} description={t('profile.good_lighting_desc')} imageUrl="/assets/examples/good_lighting.jpeg" />
              <ExampleCard isGood={false} label={t('profile.cropped')} description={t('profile.cropped_desc')} imageUrl="/assets/examples/cropped.jpeg" />
              <ExampleCard isGood={false} label={t('profile.blurry')} description={t('profile.blurry_desc')} imageUrl="/assets/examples/blurry.jpeg" />
            </div>
          </div>
        </motion.div>

        {/* Privacy Note */}
        <motion.p variants={itemVariants} className="text-center text-xs text-muted-foreground/80 max-w-md mx-auto">
          {t('profile.privacy_note')}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
