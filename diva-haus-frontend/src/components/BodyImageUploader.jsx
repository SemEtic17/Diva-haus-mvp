import React, { useState } from 'react';
import { uploadBodyImage } from '../api'; // This API call needs to be created
import { toast } from './NotificationSystem';

const BodyImageUploader = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('bodyImage', selectedFile);

      const response = await uploadBodyImage(formData); // API call
      onUploadSuccess(response.bodyImage);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(error.message || 'Error uploading image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Upload Body Image</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />
      {previewUrl && (
        <div className="mt-4">
          <p className="mb-2">Image Preview:</p>
          <img src={previewUrl} alt="Preview" className="max-w-xs h-auto mx-auto rounded-lg" />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="mt-4 bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default BodyImageUploader;
