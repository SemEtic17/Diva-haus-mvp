import React from 'react';

const VirtualTryOnPlaceholder = () => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-blue-50 text-blue-800 text-center my-4">
      <h3 className="text-xl font-semibold mb-2">Virtual Try-On Coming Soon!</h3>
      <p className="mb-2">
        Upload your body image in your <a href="/profile" className="text-blue-600 underline">profile</a> to be ready for this exciting feature.
      </p>
      <p className="text-sm">
        Soon, you'll be able to see how this item looks on you, powered by AI.
      </p>
      {/* Optional: Add a static demo image here */}
      {/* <img src="/path/to/demo-image.jpg" alt="Virtual Try-On Demo" className="mt-4 max-w-sm mx-auto rounded-lg" /> */}
    </div>
  );
};

export default VirtualTryOnPlaceholder;
