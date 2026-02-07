import React, { useState } from 'react';

const VirtualTryOnUpload = ({ productId }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, done, error
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
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
        const base64Image = reader.result.split(',')[1]; // Get base64 string without data:image/...

        const res = await fetch('/api/virtual-tryon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: productId,
            imageBase64: base64Image,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setResponse(data);
        setStatus('done');
      };
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image.');
      setStatus('error');
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-gray-800 text-white">
      <h3 className="text-xl font-bold mb-4">Virtual Try-On Upload</h3>

      <div className="mb-4">
        <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-2">
          Upload your image (JPG, PNG)
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-400
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-purple-500 file:text-white
                     hover:file:bg-purple-600"
        />
      </div>

      {previewUrl && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-300 mb-2">Image Preview:</p>
          <img src={previewUrl} alt="Preview" className="max-w-xs h-auto rounded-md border border-gray-600" />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || status === 'uploading'}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                    ${!file || status === 'uploading' ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}
      >
        {status === 'uploading' ? 'Uploading...' : 'Submit for Try-On'}
      </button>

      {status === 'idle' && <p className="mt-2 text-sm text-gray-400">Status: Ready to upload.</p>}
      {status === 'uploading' && <p className="mt-2 text-sm text-blue-400">Status: Uploading image...</p>}
      {status === 'done' && <p className="mt-2 text-sm text-green-400">Status: Upload successful!</p>}
      {status === 'error' && <p className="mt-2 text-sm text-red-400">Status: Error occurred!</p>}

      {error && (
        <div className="mt-4 p-2 bg-red-900 rounded-md">
          <p className="text-red-300 text-sm">Error: {error}</p>
        </div>
      )}

      {response && (
        <div className="mt-4 p-2 bg-gray-700 rounded-md">
          <p className="text-gray-300 text-sm mb-2">Backend Response:</p>
          <pre className="text-xs text-gray-200 overflow-auto whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default VirtualTryOnUpload;