import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import BodyImageUploader from '../components/BodyImageUploader';
import { toast } from '../components/NotificationSystem';

const ProfilePage = () => {
  const { userInfo, isAuthenticated } = useContext(AuthContext);
  const [userBodyImage, setUserBodyImage] = useState(null);

  useEffect(() => {
    if (isAuthenticated && userInfo && userInfo.bodyImage) {
      setUserBodyImage(userInfo.bodyImage);
    } else {
      setUserBodyImage(null);
    }
  }, [isAuthenticated, userInfo]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      {userInfo && (
        <div className="mb-4">
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Virtual Try-On Body Image</h2>
        {userBodyImage ? (
          <div className="mb-4">
            <p className="mb-2">Your current body image:</p>
            <img src={userBodyImage} alt="User Body" className="max-w-xs h-auto mx-auto rounded-lg shadow-md" />
            <button
              onClick={() => setUserBodyImage(null)} // This would ideally trigger a delete API call
              className="mt-2 bg-red-500 text-white p-2 rounded"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <p className="mb-4">No body image uploaded yet. Upload one for virtual try-on!</p>
        )}
        <BodyImageUploader onUploadSuccess={(imageUrl) => {
          setUserBodyImage(imageUrl);
          toast.success('Body image uploaded successfully!');
          // Ideally, update userInfo in AuthContext as well
        }} />
      </div>

      {/* Other profile settings could go here */}
    </div>
  );
};

export default ProfilePage;
