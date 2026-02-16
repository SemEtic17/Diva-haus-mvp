import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { uploadBodyImage, deleteBodyImage } from '../api';
import { toast } from '../components/Toaster';
import { Upload, User, Check, X, Camera, Sparkles, LogOut, Mail, Trash2 } from 'lucide-react';

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
    <div className={`relative overflow-hidden rounded-2xl border-2 aspect-[3/4] ${isGood ? 'border-green-700 bg-gradient-to-br from-yellow-400/10 to-yellow-400/5' : 'border-red-500/40 bg-gradient-to-br from-red-500/10 to-red-500/5'}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <User className="w-16 h-16 text-gray-500/30" />
        </div>
      )}
      <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center ${isGood ? 'bg-green-400/20 text-green-700' : 'bg-red-500/20 text-red-500'}`}>
        {isGood ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      </div>
    </div>
    <p className="mt-3 text-sm text-center text-gray-400">{label}</p>
    <p className="text-xs text-center text-gray-600">{description}</p>
  </motion.div>
);

const ProfilePage = () => {
  // --- Original Logic & State ---
  const { userInfo, isAuthenticated, logout, refreshUserInfo } = useContext(AuthContext);
  const [userBodyImage, setUserBodyImage] = useState(null);
  const fileInputRef = useRef(null);

  // --- State Merged from BodyImageUploader ---
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
  
  // --- Logic Merged from BodyImageUploader ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const tempPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(tempPreviewUrl);
      handleUpload(file); // Automatically upload on select
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('bodyImage', file);
      const response = await uploadBodyImage(formData);
      
      // Update local state
      setUserBodyImage(response.bodyImage);
      
      // Refresh userInfo in AuthContext to persist across page refreshes
      await refreshUserInfo();
      
      toast.success('Body image uploaded successfully!');

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
      await refreshUserInfo(); // Refresh to update userInfo
      toast.success('Image deleted successfully!');
    } catch (error) {
      toast.error(error.message || 'Error deleting image.');
    } finally {
      setRemoving(false);
    }
  };

  // --- Render Logic ---
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Virtual Try-On Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold">Your Body Profile</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Upload a body image to unlock our AI-powered virtual try-on experience.</p>
        </motion.div>

        {/* Main Glass Panel */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-pink-500/20 to-cyan-500/20 blur-sm" />
          <div className="relative backdrop-blur-xl bg-black/60 border border-white/20 rounded-3xl p-6 sm:p-8">
            
            {/* User Info Section (Functionality Preserved) */}
            {userInfo && (
              <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">Account Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3"><User className="w-4 h-4 text-yellow-400/80"/><span>{userInfo.name}</span></div>
                  <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-yellow-400/80"/><span>{userInfo.email}</span></div>
                  <div className="pt-2">
                    <button onClick={logout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors"><LogOut className="w-4 h-4"/><span>Logout</span></button>
                  </div>
                </div>
              </div>
            )}

            {/* Current Image & Upload Section */}
            <h3 className="text-lg font-medium text-white mb-4">Your Current Image</h3>
            <div className="grid sm:grid-cols-3 gap-6 items-center">
              <div className="sm:col-span-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={userBodyImage || 'empty'}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`relative overflow-hidden rounded-2xl border-2 border-dashed aspect-[3/4] w-full max-w-xs mx-auto ${userBodyImage ? 'border-yellow-400/40 bg-gradient-to-br from-yellow-400/5 to-transparent' : 'border-gray-500/50 bg-black/20'}`}
                  >
                    {userBodyImage ? (
                      <img src={userBodyImage} alt="User Body" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                        <div className="w-20 h-20 rounded-full bg-gray-500/20 flex items-center justify-center"><Camera className="w-10 h-10 text-gray-500/50" /></div>
                        <p className="text-sm text-gray-400 font-medium">No Image Yet</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="sm:col-span-2 text-center sm:text-left">
                <h4 className="text-xl font-serif font-semibold text-white mb-3">Why Your Image Matters</h4>
                <p className="text-gray-400 leading-relaxed mb-6">Our AI uses your photo to create realistic virtual try-ons. A clear, well-lit photo ensures the most accurate, personalized results.</p>
                
                {/* Hidden file input */}
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <motion.button
                    onClick={() => fileInputRef.current.click()}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={uploading}
                    className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-medium px-6 py-3 rounded-xl shadow-[0_10px_30px_-5px_rgba(234,179,8,0.3)] hover:shadow-[0_15px_40px_-5px_rgba(234,179,8,0.4)] transition-all duration-300 disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {uploading ? 'Uploading...' : (userBodyImage ? 'Update Photo' : 'Upload Photo')}
                  </motion.button>

                  {userBodyImage && (
                    <motion.button
                      onClick={handleRemoveImage}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={removing}
                      className="w-full sm:w-auto flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/30 font-medium px-6 py-3 rounded-xl transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      {removing ? 'Removing...' : 'Remove'}
                    </motion.button>
                  )}
                </div>

              </div>
            </div>
          </div>
        </motion.div>

        {/* Photo Guidelines */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/10 via-transparent to-cyan-500/10" />
          <div className="relative backdrop-blur-xl bg-black/50 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-serif font-semibold mb-2">Photo Guidelines</h2>
            <p className="text-gray-400 mb-6">Follow these tips for the best virtual try-on results.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <ExampleCard isGood={true} label="Full Body" description="Head to toe visible" imageUrl="/assets/examples/full_body.jpeg" />
              <ExampleCard isGood={true} label="Good Lighting" description="Even, natural light" imageUrl="/assets/examples/good_lighting.jpeg" />
              <ExampleCard isGood={false} label="Cropped" description="Body cut off" imageUrl="/assets/examples/cropped.jpeg" />
              <ExampleCard isGood={false} label="Dark/Blurry" description="Poor visibility" imageUrl="/assets/examples/blurry.jpeg" />
            </div>
          </div>
        </motion.div>

        {/* Privacy Note */}
        <motion.p variants={itemVariants} className="text-center text-xs text-gray-500/80 max-w-md mx-auto">
          Your images are encrypted and stored securely. We never share your personal data with third parties.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ProfilePage;