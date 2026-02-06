import React from 'react';

const ComingSoonBadge = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: '8px',
        padding: '8px 12px',
        textAlign: 'right',
        pointerEvents: 'none', // Allow clicks to pass through to the canvas
        zIndex: 10, // Ensure it's above the canvas but not interfering
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h4 style={{ margin: 0, fontSize: '1.1em', fontWeight: 'bold' }}>Virtual Try-On — Coming Soon</h4>
      <p style={{ margin: 0, fontSize: '0.9em' }}>We’re improving this feature</p>
    </div>
  );
};

export default ComingSoonBadge;
