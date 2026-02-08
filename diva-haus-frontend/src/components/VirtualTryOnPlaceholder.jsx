import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Sparkles, Upload, Zap } from 'lucide-react';

/**
 * VirtualTryOnPlaceholder
 * - This file replaces previous duplicate upload component.
 * - It keeps the aspirational "Coming Soon" marketing and also provides a simple upload skeleton
 *   for users to submit their photo (mocked server will reply with previewUrl).
 *
 * Props:
 * - productId (string) optional: used in the POST body
 * - showUploader (boolean) optional: if true, show upload controls by default
 *
 * Important: Do NOT add 3D logic; this is purely UI.
 */
const VirtualTryOnPlaceholder = ({ productId, showUploader = false }) => {
  // upload state
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, done, error
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [uploaderOpen, setUploaderOpen] = useState(showUploader);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setError(null);
      setResponse(null);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!file || !productId) {
      setError('Please select an image and ensure product ID is provided.');
      return;
    }
    setStatus('uploading');
    setError(null);
    setResponse(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];
        const res = await fetch('/api/virtual-tryon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, imageBase64: base64Image }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setResponse(data);
        setStatus('done');
      };
    } catch (err) {
      console.error('[VirtualTryOnPlaceholder] upload err', err);
      setError(err?.message || 'Upload failed');
      setStatus('error');
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Background glow effects (preserve original design) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: 'easeOut' }} className="max-w-4xl mx-auto relative">
        <div className="relative rounded-3xl overflow-hidden bg-black/50">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400 p-[1px]" style={{ zIndex: 1 }}>
            <div className="w-full h-full rounded-3xl bg-black" />
          </div>

          <div className="relative backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16" style={{ zIndex: 2 }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }} className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Camera className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />
                </div>
                <motion.div animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }} className="text-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Coming Soon
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                AI Virtual{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
                  Try-On
                </span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Experience the future of fashion. Upload your photo and we'll notify you when the virtual preview is ready.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }} className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
              {['AI-Powered Fitting', 'Instant Preview', 'Size Recommendations'].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm md:text-base text-gray-300/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  {feature}
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.5 }} className="flex justify-center">
              <button onClick={() => setUploaderOpen((v) => !v)} className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-semibold px-8 py-4 text-base rounded-xl shadow-md hover:shadow-lg transition">
                <Upload className="w-5 h-5 mr-2 inline" />
                {uploaderOpen ? 'Close uploader' : 'Upload Your Photo'}
              </button>
            </motion.div>

            {/* Inline uploader panel */}
            {uploaderOpen && (
              <div className="mt-8 bg-gray-900 p-6 rounded-xl border border-white/6">
                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-2">
                  Upload (JPG/PNG)
                </label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-400 mb-4" />
                {previewUrl && <img src={previewUrl} alt="preview" className="max-w-xs rounded-md border border-gray-700 mb-4" />}
                <div className="flex gap-3">
                  <button disabled={!file || status === 'uploading'} onClick={handleSubmit} className={`px-4 py-2 rounded-md text-sm font-medium ${!file ? 'bg-gray-600 text-gray-200' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                    {status === 'uploading' ? 'Uploading...' : 'Submit for Try-On'}
                  </button>
                  <button onClick={() => { setFile(null); setPreviewUrl(null); setError(null); setResponse(null); setStatus('idle'); }} className="px-4 py-2 rounded-md bg-gray-700 text-white text-sm">
                    Reset
                  </button>
                </div>

                {status === 'done' && <p className="mt-3 text-sm text-green-400">Upload complete — preview available.</p>}
                {status === 'error' && <p className="mt-3 text-sm text-red-400">Error: {error}</p>}
                {status === 'idle' && <p className="mt-3 text-sm text-gray-400">Status: Ready</p>}

                {response && (
                  <div className="mt-4 p-3 bg-gray-800 rounded-md border border-white/6">
                    <p className="text-sm text-gray-300 mb-2">Backend Response:</p>
                    <pre className="text-xs text-gray-200 overflow-auto whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}

            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.5 }} className="text-center text-gray-500 text-sm mt-6">
              Your photos are processed securely and never stored permanently. This is a preview interface; final virtual try-on will be available soon.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VirtualTryOnPlaceholder;