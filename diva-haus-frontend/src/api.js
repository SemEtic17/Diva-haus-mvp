export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper for authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers, credentials: 'include' }); // Added credentials: 'include'

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Something went wrong');
  }

  // If response has no content, don't try to parse it
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return; // Or return response.text() if you expect text
  }
};

// --- Uploads ---

/**
 * Upload image for virtual try-on using multipart/form-data
 * @param {File} imageFile - The image file to upload
 * @param {string} productId - The product ID to try on
 * @returns {Promise<{ok: boolean, previewUrl?: string, error?: string, processingTimeMs?: number, modelVersion?: string}>}
 */
export const uploadForTryOn = async (imageFile, productId) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('productId', productId);

  const response = await fetch(`${API_BASE_URL}/uploads/virtual-tryon`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Virtual try-on upload failed');
  }

  return data;
};

// --- User (Body Image) ---
export const uploadBodyImage = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/users/upload-body-image`, {
    method: 'POST',
    body: formData, // formData will automatically set Content-Type: multipart/form-data
    credentials: 'include', // Ensure cookies are sent
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Error uploading body image');
  }
  return response.json();
};

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

// --- Auth ---
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to register');
  }
  return response.json();
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
    }
    return response.json();
};


// --- Cart ---
export const getCart = async () => {
  return fetchWithAuth(`${API_BASE_URL}/cart`);
};

export const addToCart = async (productId, qty) => {
  return fetchWithAuth(`${API_BASE_URL}/cart`, {
    method: 'POST',
    body: JSON.stringify({ productId, qty }),
  });
};

export const removeFromCart = async (productId) => {
  return fetchWithAuth(`${API_BASE_URL}/cart/${productId}`, {
    method: 'DELETE',
  });
};
