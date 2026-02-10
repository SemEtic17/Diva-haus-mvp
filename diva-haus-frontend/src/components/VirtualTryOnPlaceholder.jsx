// diva-haus-frontend/src/components/VirtualTryOnPlaceholder.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Sparkles, Upload, Zap } from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

/**
 * VirtualTryOnPlaceholder
 * - Backwards-compatible: accepts either `productId` OR `product` props.
 * - If parent passes product object, we read product._id automatically.
 *
 * Props:
 * - productId (string) optional: used in the POST body
 * - product (object) optional: whole product object (we try product._id)
 * - showUploader (boolean) optional: if true, show upload controls by default
 *
 * Important: Do NOT add 3D logic; this is purely UI.
 */
const VirtualTryOnPlaceholder = ({ productId, showUploader = false }) => {
  // CircularProgressIndicator component
  const CircularProgressIndicator = ({ progress }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <motion.svg
          className="w-full h-full"
          viewBox="0 0 44 44"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="text-gray-700"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="22"
            cy="22"
          />
          <motion.circle
            className="text-green-500"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="22"
            cy="22"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 22 22)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </motion.svg>
        <span className="absolute text-xs font-semibold text-white">
          {Math.round(progress)}%
        </span>
      </div>
    );
  };

  // upload state
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, done, error
  const [uploadProgress, setUploadProgress] = useState(0); // For circular loading indicator
  const [response, setResponse] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null); // For the processed image from the API
  const [error, setError] = useState(null);
  const [uploaderOpen, setUploaderOpen] = useState(showUploader);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      // Validate file size
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File size exceeds the 10MB limit.');
        setFile(null);
        setPreviewUrl(null);
        return; // Stop processing
      }

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
    setUploadProgress(0); // Reset progress
    setError(null);
    setResponse(null);

    // Mock progress update
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 90) { // Simulate up to 90% before actual response
        setUploadProgress(progress);
      } else {
        clearInterval(interval);
      }
    }, 200);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];
        const res = await fetch('/api/products/virtual-tryon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, imageBase64: base64Image }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log('[VirtualTryOn] server response', data);
        setResponse(data);
        if (data.previewUrl) {
          setProcessedImageUrl(data.previewUrl);
        }
        clearInterval(interval); // Stop mock progress
        setUploadProgress(100); // Set to 100% on completion
        setStatus('done');
      };
    } catch (err) {
      console.error('[VirtualTryOnPlaceholder] upload err', err);
      setError(err?.message || 'Upload failed');
      clearInterval(interval); // Stop mock progress on error
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-4xl mx-auto relative"
      >
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
            {uploaderOpen && status !== 'done' && (
              <div className="mt-8 bg-gray-900 p-6 rounded-xl border border-white/6">
                <div className="flex items-center justify-center w-full mb-4">
                  <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 bg-gray-900 border border-dashed border-gray-700 rounded-md cursor-pointer hover:bg-gray-800">
                      <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"/></svg>
                          <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500">JPG/PNG (Max 10MB)</p>
                      </div>
                      <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
                {previewUrl && !processedImageUrl && (
                  <img src={previewUrl} alt="preview" className="max-w-xs rounded-md border border-gray-700 mb-4 mx-auto" />
                )}
                <div className="flex gap-3">
                  <button disabled={!file || status === 'uploading'} onClick={handleSubmit} className={`px-4 py-2 rounded-md text-sm font-medium ${!file ? 'bg-gray-600 text-gray-200' : 'bg-green-600 text-white hover:bg-green-700'} flex items-center justify-center gap-2`}>
                    {status === 'uploading' ? (
                      <>
                        <CircularProgressIndicator progress={uploadProgress} />
                        <span>Uploading {uploadProgress}%</span>
                      </>
                    ) : (
                      'Submit for Try-On'
                    )}
                  </button>
                  <button onClick={() => { setFile(null); setPreviewUrl(null); setError(null); setResponse(null); setStatus('idle'); setProcessedImageUrl(null); setUploaderOpen(false); }} className="px-4 py-2 rounded-md bg-gray-700 text-white text-sm">
                    Reset
                  </button>
                </div>

                {status === 'done' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-3 text-sm text-green-400 flex items-center gap-2"
                  >
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <motion.path
                        d="M20 6L9 17L4 12"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </motion.svg>
                    Upload complete — preview available.
                  </motion.div>
                )}
                {status === 'error' && <p className="mt-3 text-sm text-red-400">Error: {error}</p>}
                {status === 'idle' && <p className="mt-3 text-sm text-gray-400">Status: Ready</p>}
              </div>
            )}

            {/* Results Display */}
            {status === 'done' && processedImageUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="mt-8 bg-gray-900 p-6 rounded-xl border border-white/6 text-center"
              >
                <h3 className="font-semibold text-xl text-white mb-4">Your Virtual Try-On</h3>
                <div className="mb-6">
                  <ReactCompareSlider
                    itemOne={<ReactCompareSliderImage src={previewUrl} alt="before" />}
                    itemTwo={<ReactCompareSliderImage src={processedImageUrl} alt="after" />}
                    className="max-w-md rounded-md border border-gray-700 mx-auto"
                  />
                </div>
                <div className="flex justify-center gap-4">
                  <a
                    href={processedImageUrl}
                    download="diva-haus-tryon.png"
                    className="bg-green-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-green-700 transition"
                  >
                    Download
                  </a>
                  <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition">
                    Share
                  </button>
                </div>
              </motion.div>
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
