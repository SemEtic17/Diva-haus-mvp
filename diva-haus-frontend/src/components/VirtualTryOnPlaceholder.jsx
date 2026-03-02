// diva-haus-frontend/src/components/VirtualTryOnPlaceholder.jsx
import React, { useState, useCallback, useContext } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Upload, Zap, XCircle, CheckCircle, RotateCcw, User } from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { uploadForTryOn, tryOnWithSavedImage } from '../api';
import { AuthContext } from '../context/AuthContext';

/* (JSDoc types omitted for brevity in this snippet) */

const VirtualTryOnPlaceholder = ({ productId: propProductId, product = null, showUploader = false }) => {
  const productId = propProductId || product?._id;
  const { userInfo, isAuthenticated } = useContext(AuthContext);
  const hasSavedBodyImage = isAuthenticated && userInfo?.bodyImage;

  // CircularProgressIndicator component (unchanged)
  const CircularProgressIndicator = ({ progress }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <motion.svg className="w-full h-full" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
          <circle className="text-gray-700" strokeWidth="4" stroke="currentColor" fill="transparent" r={radius} cx="22" cy="22" />
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
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </motion.svg>
        <span className="absolute text-xs font-semibold text-white">{Math.round(progress)}%</span>
      </div>
    );
  };

  // state machine
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [responseMetadata, setResponseMetadata] = useState(null);
  const [uploaderOpen, setUploaderOpen] = useState(showUploader);

  const resetState = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    setProcessedImageUrl(null);
    setCurrentStatus('idle');
    setUploadProgress(0);
    setErrorMessage('');
    setResponseMetadata(null);
    setUploaderOpen(false);
  }, []);

  const handleFileChange = (event) => {
    setErrorMessage('');
    setProcessedImageUrl(null);
    setCurrentStatus('idle');

    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrorMessage('File size exceeds the 10MB limit.');
        setFile(null);
        setPreviewUrl(null);
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      resetState();
    }
  };

  const handleSubmit = async () => {
    if (!file || !productId) {
      setErrorMessage('Please select an image and ensure product ID is available.');
      setCurrentStatus('error');
      return;
    }

    setErrorMessage('');
    setProcessedImageUrl(null);
    setCurrentStatus('uploading');
    setUploadProgress(0);

    // Simulate upload -> processing progress
    let currentProgress = 0;
    const uploadInterval = setInterval(() => {
      currentProgress += 5;
      if (currentProgress >= 50) {
        clearInterval(uploadInterval);
        setUploadProgress(50);
      } else {
        setUploadProgress(currentProgress);
      }
    }, 100);

    try {
      clearInterval(uploadInterval);
      setUploadProgress(50);
      setCurrentStatus('processing');

      let processingProgress = 50;
      const processingInterval = setInterval(() => {
        processingProgress += 2;
        if (processingProgress >= 99) {
          clearInterval(processingInterval);
        } else {
          setUploadProgress(processingProgress);
        }
      }, 300);

      const data = await uploadForTryOn(file, productId);

      clearInterval(processingInterval);
      // prefer a URL; if unavailable use the base64 string returned by the
      // backend. this keeps the UI working even if the result upload fails.
      if (data.previewUrl) {
        setProcessedImageUrl(data.previewUrl);
      } else if (data.previewBase64) {
        setProcessedImageUrl(`data:image/png;base64,${data.previewBase64}`);
      } else {
        setProcessedImageUrl('');
      }
      setResponseMetadata({
        processingTimeMs: data.processingTimeMs,
        modelVersion: data.modelVersion,
      });
      setUploadProgress(100);
      setCurrentStatus('success');
    } catch (err) {
      setUploadProgress(0);
      console.error('[VirtualTryOnPlaceholder] Try-on error:', err);
      setErrorMessage(err.message || 'An error occurred during try-on.');
      setCurrentStatus('error');
    }
  };

  const handleUseSavedImage = async () => {
    if (!productId) {
      setErrorMessage('Product ID is required.');
      setCurrentStatus('error');
      return;
    }

    if (!hasSavedBodyImage) {
      setErrorMessage('No saved body image found. Please upload one in your profile first.');
      setCurrentStatus('error');
      return;
    }

    setErrorMessage('');
    setProcessedImageUrl(null);
    setCurrentStatus('processing');
    setUploadProgress(0);
    setUploaderOpen(false); // hide uploader UI while processing

    // Simulate processing progress
    let processingProgress = 0;
    const processingInterval = setInterval(() => {
      processingProgress += 2;
      if (processingProgress >= 99) {
        clearInterval(processingInterval);
      } else {
        setUploadProgress(processingProgress);
      }
    }, 300);

    try {
      const data = await tryOnWithSavedImage(productId);

      clearInterval(processingInterval);
      if (data.previewUrl) {
        setProcessedImageUrl(data.previewUrl);
      } else if (data.previewBase64) {
        setProcessedImageUrl(`data:image/png;base64,${data.previewBase64}`);
      } else {
        setProcessedImageUrl('');
      }
      setResponseMetadata({
        processingTimeMs: data.processingTimeMs,
        modelVersion: data.modelVersion,
      });
      setUploadProgress(100);
      setCurrentStatus('success');
      
      // Set preview URL to the saved body image for comparison
      setPreviewUrl(userInfo.bodyImage);
    } catch (err) {
      setUploadProgress(0);
      console.error('[VirtualTryOnPlaceholder] Try-on with saved image error:', err);
      setErrorMessage(err.message || 'An error occurred during try-on.');
      setCurrentStatus('error');
    }
  };

  const handleRetry = () => {
    resetState();
    setUploaderOpen(true);
  };

  const isUploadingOrProcessing = currentStatus === 'uploading' || currentStatus === 'processing';

  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      {/* ... header and marketing omitted for brevity (keep your original) ... */}

      {/* Uploader button and Use Saved Image button */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-4">
        {/* show status message while processing or uploading */}
        {isUploadingOrProcessing && (
          <p className="w-full text-center text-gray-300 mb-2">
            {currentStatus === 'uploading'
              ? `Uploading image (${Math.round(uploadProgress)}%)...`
              : `Processing try-on (${Math.round(uploadProgress)}%)...`}
          </p>
        )}
        {currentStatus !== 'success' && (
          <>
            {hasSavedBodyImage && (
              <button 
                onClick={handleUseSavedImage}
                disabled={isUploadingOrProcessing}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-4 text-base rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploadingOrProcessing ? (
                  // show spinner + progress when processing
                  <>
                    <CircularProgressIndicator progress={uploadProgress} />
                    <span>
                      {currentStatus === 'uploading'
                        ? `Uploading ${Math.round(uploadProgress)}%`
                        : `Processing ${Math.round(uploadProgress)}%`}
                    </span>
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    Use Saved Body Image
                  </>
                )}
              </button>
            )}
            <button 
              onClick={() => setUploaderOpen((v) => !v)} 
              className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-semibold px-8 py-4 text-base rounded-xl shadow-md hover:shadow-lg transition"
            >
              <Upload className="w-5 h-5 mr-2 inline" />
              {uploaderOpen ? 'Close uploader' : 'Upload New Photo'}
            </button>
          </>
        )}
      </div>

      {/* Inline uploader panel */}
      {uploaderOpen && currentStatus !== 'success' && (
        <div className="mt-8 bg-gray-900 p-6 rounded-xl border border-white/6">
          {/* dropzone (your design) */}
          <div className="flex items-center justify-center w-full mb-4">
            <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 bg-gray-900 border border-dashed border-gray-700 rounded-md cursor-pointer hover:bg-gray-800">
              <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">JPG/PNG (Max 10MB)</p>
              </div>
              <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          {previewUrl && <img src={previewUrl} alt="uploaded preview" className="max-w-xs rounded-md border border-gray-700 mb-4 mx-auto" />}

          <div className="flex gap-3 justify-center">
            <button
              disabled={!file || isUploadingOrProcessing}
              onClick={handleSubmit}
              className={`px-4 py-2 rounded-md text-sm font-medium ${!file || isUploadingOrProcessing ? 'bg-gray-600 text-gray-200 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'} flex items-center justify-center gap-2`}
            >
              {currentStatus === 'uploading' ? (
                <>
                  <CircularProgressIndicator progress={uploadProgress} />
                  <span>Uploading {Math.round(uploadProgress)}%</span>
                </>
              ) : currentStatus === 'processing' ? (
                <>
                  <CircularProgressIndicator progress={uploadProgress} />
                  <span>Processing {Math.round(uploadProgress)}%</span>
                </>
              ) : (
                'Submit for Try-On'
              )}
            </button>

            <button onClick={resetState} className="px-4 py-2 rounded-md bg-gray-700 text-white text-sm hover:bg-gray-600" disabled={isUploadingOrProcessing}>
              Reset
            </button>
          </div>

          {currentStatus === 'error' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="mt-3 text-sm text-red-400 flex items-center gap-2 justify-center">
              <XCircle className="w-5 h-5" />
              <span>Error: {errorMessage}</span>
              <button onClick={handleRetry} className="ml-2 text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <RotateCcw className="w-4 h-4" /> Try again
              </button>
            </motion.div>
          )}

          {currentStatus === 'idle' && errorMessage && <p className="mt-3 text-sm text-red-400 text-center">Error: {errorMessage}</p>}
          {currentStatus === 'idle' && !errorMessage && <p className="mt-3 text-sm text-gray-400 text-center">Status: Ready to upload</p>}
        </div>
      )}

      {/* Results Display */}
      {currentStatus === 'success' && processedImageUrl && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="mt-8 bg-gray-900 p-6 rounded-xl border border-white/6 text-center">
          <h3 className="font-semibold text-xl text-white mb-4 flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" /> Your Virtual Try-On is Ready!
          </h3>
          {responseMetadata && (
            <p className="text-gray-500 text-xs mb-4">Processed in {responseMetadata.processingTimeMs}ms by {responseMetadata.modelVersion}</p>
          )}

          <div className="mb-6">
            <ReactCompareSlider
              itemOne={<ReactCompareSliderImage src={previewUrl} alt="before" />}
              itemTwo={<ReactCompareSliderImage src={processedImageUrl} alt="after" />}
              className="max-w-md rounded-md border border-gray-700 mx-auto"
            />
          </div>

          <div className="flex justify-center gap-4">
            <a href={processedImageUrl} download="diva-haus-tryon.png" className="bg-green-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-green-700 transition">Download</a>
            <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition">Share</button>
            <button onClick={handleRetry} className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-purple-700 transition flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </motion.div>
      )}

      {/* footer note */}
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.5 }} className="text-center text-gray-500 text-sm mt-6">
        Your photos are processed securely and never stored permanently. This is a preview interface; final virtual try-on will be available soon.
      </motion.p>
    </section>
  );
};

export default VirtualTryOnPlaceholder;
