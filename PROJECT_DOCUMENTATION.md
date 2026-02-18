# Diva Haus MVP - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Backend Structure](#backend-structure)
4. [Frontend Structure](#frontend-structure)
5. [How Everything Connects](#how-everything-connects)
6. [Key Features and User Flows](#key-features-and-user-flows)
7. [Important Concepts Explained](#important-concepts-explained)
8. [File-by-File Breakdown](#file-by-file-breakdown)
9. [Next Steps for Days 21-30](#next-steps-for-days-21-30)
10. [Quick Reference](#quick-reference)

---

## Project Overview

**Diva Haus** is an e-commerce platform with virtual try-on capabilities. Users can:

- Browse a catalog of products
- Register and log in
- Add products to a shopping cart
- Upload a body image to their profile
- (Soon) Use AI-powered virtual try-on

This repository is a monorepo containing:

- `diva-haus-frontend`: React SPA built with Vite and Tailwind
- `diva-haus-backend`: Node.js/Express API with MongoDB

---

## Architecture Overview

High-level view:

```
Frontend (React, Vite, Tailwind)  <─── HTTP (REST API, JSON) ───>  Backend (Express, MongoDB)
         http://localhost:5173                                      http://localhost:5000
```

The backend then talks to:

- MongoDB (via Mongoose) for data storage
- Local disk or Cloudinary for image storage

Key patterns:

- **Backend**: Route → Middleware → Controller → Service → Model
- **Frontend**: Page → Components → Contexts → API functions

---

## Backend Structure

Root: `diva-haus-backend/api`

```
api/
├── index.js                # Main server entry point
├── models/                 # Database schemas
│   ├── User.js
│   └── Product.js
├── routes/                 # API endpoints
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── userRoutes.js
│   └── uploadRoutes.js
├── controllers/            # Request handlers
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── userController.js
│   └── uploadController.js
├── services/               # Reusable logic
│   ├── storage.service.js
│   └── virtualTryOn.service.js
└── middleware/             # Code that runs before controllers
    ├── authMiddleware.js
    └── upload.js
```

### `index.js` (Server entry point)

Responsibilities:

- Load environment variables (`dotenv.config()`)
- Connect to MongoDB using `MONGO_URI`
- Configure middleware:
  - `cors` with `origin: 'http://localhost:5173'` and `credentials: true`
  - `express.json()` for JSON bodies (with 10 MB limit)
  - `cookieParser()` to read auth cookies
  - Static serving of `/uploads` for locally stored images
- Register routes:
  - `/api/products` → `productRoutes`
  - `/api/auth` → `authRoutes`
  - `/api/cart` → `cartRoutes`
  - `/api/users` → `userRoutes`
  - `/api/uploads` → `uploadRoutes`
- Global error handler (catches thrown errors and formats responses)

---

### Models

#### `models/User.js`

Defines the shape of a user document in MongoDB:

- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed before save)
- `cart` (Array of items, each with:
  - `product` (ObjectId ref to `Product`)
  - `qty` (Number)
  )
- `bodyImage` (String, URL to stored body image)
- `bodyImagePublicId` (String, storage reference for deletion)

Extra logic:

- `matchPassword(enteredPassword)` compares plain text to hashed password using bcrypt.
- `pre('save')` hook automatically hashes password if it has been modified.

#### `models/Product.js`

Very simple product schema:

- `name` (String, required)
- `price` (Number, required)
- `image` (String, required, URL)
- `createdAt` (Date, default `Date.now`)

---

### Routes and Controllers

#### Auth: `routes/authRoutes.js` and `controllers/authController.js`

Routes:

- `POST /api/auth/register` → `registerUser`
- `POST /api/auth/login` → `loginUser`
- `GET /api/auth/status` → `getAuthStatus` (protected)
- `POST /api/auth/logout` → `logoutUser`

Controller responsibilities:

- **registerUser**
  - Validate `name`, `email`, `password`
  - Check if user already exists
  - Create new `User`
  - Generate JWT token and store it in an `HttpOnly` cookie named `token`
  - Respond with public user data (id, name, email)

- **loginUser**
  - Find user by `email`
  - Compare password with `user.matchPassword`
  - If valid, generate and set JWT cookie (same as register)

- **getAuthStatus**
  - Uses `req.user` from `protect` middleware
  - Returns user id, name, email, `bodyImage`, and `isAuthenticated: true`

- **logoutUser**
  - Clears the `token` cookie by setting it to empty and expiring it

#### Auth middleware: `middleware/authMiddleware.js`

`protect`:

- Reads `req.cookies.token`
- Verifies JWT using `JWT_SECRET`
- Loads user from DB and attaches to `req.user` (without password)
- If token missing/invalid, sets status 401 and throws an error

This middleware is used for all “private” routes, such as cart, profile image, and upload.

---

#### Products: `routes/productRoutes.js` and `controllers/productController.js`

Routes:

- `GET /api/products` → `getProducts`
- `GET /api/products/:id` → `getProductById`

Controllers:

- `getProducts`:
  - `Product.find({})`
  - Returns array of products

- `getProductById`:
  - `Product.findById(req.params.id)`
  - If found, return product; if not, send 404

---

#### Cart: `routes/cartRoutes.js` and `controllers/cartController.js`

Routes (all protected by `protect`):

- `POST /api/cart` → `addToCart`
- `GET /api/cart` → `getCart`
- `DELETE /api/cart/:productId` → `removeFromCart`

Key idea: Cart is embedded in the `User` document as an array.

Controllers:

- `addToCart`
  - Extracts `productId` and `qty` from `req.body`
  - Finds user by `req.user.id`
  - Finds product by `productId` (to ensure it exists)
  - If item already in cart, update quantity; otherwise, push new item
  - Saves user and returns the updated, populated cart

- `getCart`
  - Loads user with `cart.product` populated
  - Returns `user.cart`

- `removeFromCart`
  - Filters `user.cart` to remove matching `productId`
  - Saves user and returns updated cart

---

#### User profile / body image: `routes/userRoutes.js` and `controllers/userController.js`

Routes (all protected):

- `POST /api/users/upload-body-image`
  - Middleware: `protect`, then `uploadImage.single('bodyImage')`
  - Controller: `uploadBodyImage`

- `DELETE /api/users/body-image`
  - Middleware: `protect`
  - Controller: `deleteBodyImage`

`upload.js` middleware:

- Uses Multer with in-memory storage
- Validates:
  - Max size: 10 MB
  - Allowed types: JPEG, PNG, WebP

`userController.js`:

- `uploadBodyImage`
  - Ensures `req.file` exists
  - If user already has `bodyImagePublicId`, deletes old image via `storageService.delete`
  - Uploads new image using `storageService.uploadBodyImage(req.file)`
  - Stores returned `url` and `publicId` on user (`bodyImage`, `bodyImagePublicId`)
  - Saves user and returns success response

- `deleteBodyImage`
  - If no `bodyImagePublicId`, responds with 404
  - Calls `storageService.delete(user.bodyImagePublicId)`
  - Clears `bodyImage` and `bodyImagePublicId` on user
  - Saves user and returns success response

---

#### Upload / virtual try-on: `routes/uploadRoutes.js` and `controllers/uploadController.js`

Routes:

- `POST /api/uploads/virtual-tryon`
  - Middleware: `protect`, `uploadTryOnImage.single('image')`
  - Controller: `handleTryOnUpload`

- `POST /api/uploads/virtual-tryon/saved`
  - Middleware: `protect`
  - Controller: `handleTryOnWithSavedImage`

`handleTryOnUpload`:

- Validates that `productId` is present in `req.body`
- Validates that an image file exists in `req.file`
- Saves uploaded file using `storageService.uploadTryOnImage(file)`
- Calls `runVirtualTryOn` service with:
  - File buffer and metadata
  - Stored image URL and publicId
  - `productId`
- Returns the result (currently a mock)

`handleTryOnWithSavedImage`:

- Validates `productId`
- Checks that `req.user.bodyImage` exists
- Calls `runVirtualTryOn` with:
  - `imageUrl: user.bodyImage`
  - `imagePublicId: user.bodyImagePublicId`
  - `productId`
- Returns result

---

### Services

#### `services/storage.service.js`

Purpose: Provide a single interface for file storage, with two underlying providers:

- Local disk
- Cloudinary

Important parts:

- `localStorageProvider`:
  - Writes files to `uploads/{folder}` directory
  - Generates unique filenames
  - Returns URLs like `http://localhost:5000/uploads/{folder}/{filename}`

- `cloudinaryProvider`:
  - Lazily loads Cloudinary package and credentials
  - Uploads images via Cloudinary API
  - Returns `secure_url` and `public_id`

- `StorageService` class:
  - Chooses provider based on `process.env.STORAGE_PROVIDER` (`local` or `cloudinary`)
  - Methods:
    - `upload(file, folder)`
    - `delete(publicId)`
    - `uploadBodyImage(file)` (folder `body-images`)
    - `uploadTryOnImage(file)` (folder `try-on-uploads`)
    - `getProviderName()`

You can switch providers just by changing `STORAGE_PROVIDER` in `.env`.

#### Python VTON Micro‑service

As part of Day 22 we added a small Python service that wraps the open‑source
[FASHN VTON v1.5](https://github.com/fashn-AI/fashn-vton-1.5) model. The
service lives in the top‑level `vton-service` directory and exposes a simple
`POST /vton` HTTP endpoint. It accepts two image URLs (person + garment),
downloads them, executes the try‑on pipeline, and returns a base64‑encoded
preview image.

The Node backend does **not** run the heavy model itself; instead it calls this
service via the new `FashnProvider` implementation in
`api/services/ai/providers/FashnProvider.js`. The provider downloads the
base64 result, saves it using the existing `storageService`, and returns a URL
to the frontend. Environment variables configure which provider is active:

```
AI_PROVIDER=mock      # default value for development
VTON_SERVICE_URL=http://localhost:8000/vton   # Python service address
```

Running the Python service locally requires a GPU or a cloud instance. For
quick testing you can use a Colab notebook or Hugging Face Space; the code
structure is identical.



#### `services/virtualTryOn.service.js`

Currently a mock:

- Waits 2 seconds
- Verifies there is an image and a `productId`
- Logs image info
- Returns:
  - `ok: true`
  - `previewUrl`: placeholder image URL
  - `processingTimeMs`: mock value
  - `modelVersion: 'mock-v1'`

Later, you will replace this with a real AI call.

---

## Frontend Structure

Root: `diva-haus-frontend/src`

```
src/
├── main.jsx                # App bootstrap
├── App.jsx                 # Routes and layout
├── api.js                  # API helper functions
├── config/
│   └── features.js         # Feature flags (e.g. isTryOnEnabled)
├── context/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── WishlistContext.jsx
├── pages/
│   ├── ProductPage.jsx
│   ├── ProfilePage.jsx
│   ├── CartPage.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── components/
│   ├── Navbar.jsx
│   ├── ProductGrid.jsx
│   ├── ProductCard.jsx
│   ├── VirtualTryOnPlaceholder.jsx
│   ├── HolographicContainer.jsx
│   ├── PrivateRoute.jsx
│   └── Toaster.jsx
└── three/                  # 3D / visual components
    ├── ThreeScene.jsx
    ├── MannequinModel.jsx
    ├── HoloPedestal.jsx
    └── others...
```

### `main.jsx` (frontend entry)

Responsibilities:

- Mount React app into `#root`
- Wrap the app in:
  - `BrowserRouter` (routing)
  - `AuthProvider` (auth state)
  - `CartProvider` (cart state)
  - `WishlistProvider` (wishlist state)
  - `Toaster` (notification system)

### `App.jsx`

Defines the main layout and routes:

- Shows `Navbar` at the top
- Wraps the routed content in a `<main>` container

Routes:

- `/` → `ProductGrid`
- `/product/:id` → `ProductPage`
- `/login` → `Login`
- `/register` → `Register`
- `/profile` → Private route → `ProfilePage`
- `/cart` → Private route → `CartPage`
- `/wishlist` → Private route → `WishlistPage`

`PrivateRoute` uses `AuthContext` to:

- Show "Loading..." while `isLoading` is true
- If `isAuthenticated`, render nested route
- Otherwise, redirect to `/login`

---

## API Layer: `src/api.js`

At the top:

- `API_BASE_URL = import.meta.env.VITE_API_BASE_URL`
  - This should point to your backend, e.g. `http://localhost:5000/api`

Helper:

- `fetchWithAuth(url, options)`:
  - Adds JSON headers
  - Sends cookies via `credentials: 'include'`
  - Throws JavaScript `Error` when response is not OK

Key functions:

- Products:
  - `getProducts()`
  - `getProductById(id)`

- Auth:
  - `registerUser(userData)`
  - `loginUser(credentials)`

- Cart:
  - `getCart()`
  - `addToCart(productId, qty)`
  - `removeFromCart(productId)`

- Body image:
  - `uploadBodyImage(formData)`
  - `deleteBodyImage()`

- Virtual try-on:
  - `uploadForTryOn(imageFile, productId)` (multipart/form-data)
  - `tryOnWithSavedImage(productId)`

This file centralizes all backend communication so that your UI does not need to know exact URL strings everywhere.

---

## Auth Context: `src/context/AuthContext.jsx`

Holds global authentication state:

- `isAuthenticated` (boolean)
- `userInfo` (object with `id`, `name`, `email`, `bodyImage`)
- `isLoading` (boolean for initial auth check)

On mount, `checkAuthStatus`:

- Calls `GET /auth/status` with `credentials: 'include'`
- If OK:
  - Sets `isAuthenticated = true`
  - Sets `userInfo` based on response
- If not OK or error:
  - Sets `isAuthenticated = false`
  - Clears `userInfo`

Exposed methods:

- `login(email, password)`
  - Uses `loginUser` from `api.js`
  - On success, re-runs `checkAuthStatus`

- `logout()`
  - Posts to `/auth/logout`
  - Clears auth state

Other parts of the UI read this context to know if the user is logged in and to access profile info.

---

## Cart Context: `src/context/CartContext.jsx`

Manages:

- `cartItems` (array of items from backend)
- `loading` and `error` states
- `addItemToCart`, `removeItemFromCart`, `fetchUserCart`

Behavior:

- When `isAuthenticated` changes (from `AuthContext`), `useEffect` calls `fetchUserCart`:
  - If logged in, calls `getCart()` from `api.js`
  - If not logged in, clears `cartItems`

- `addItemToCart(productId, qty)`:
  - If not authenticated, shows error toast
  - Otherwise, calls backend and updates `cartItems` from response

- `removeItemFromCart(productId)`:
  - Same idea, but calls `removeFromCart`

Navbar and `CartPage` read data from this context.

---

## Profile Page: `src/pages/ProfilePage.jsx`

Key responsibilities:

- Show account details (name, email)
- Show current body image (if any)
- Allow uploading a new body image
- Allow removing existing body image

State inside `ProfilePage`:

- `userBodyImage` (current URL from `AuthContext` / backend)
- `selectedFile`, `previewUrl` (temporary while uploading)
- `uploading` (boolean)
- `removing` (boolean)

Important flows:

- On mount or when auth/userInfo changes:
  - If `userInfo.bodyImage` exists, set `userBodyImage`

- `handleFileChange(event)`:
  - Reads the chosen file
  - Sets preview URL
  - Immediately calls `handleUpload(file)`

- `handleUpload(file)`:
  - Creates `FormData` with `bodyImage`
  - Calls `uploadBodyImage(formData)` from `api.js`
  - On success:
    - Updates `userBodyImage`
    - Calls `refreshUserInfo()` from `AuthContext` to keep context in sync

- `handleRemoveImage()`:
  - Calls `deleteBodyImage()` API
  - Clears `userBodyImage`
  - Refreshes `userInfo`

Buttons:

- Upload button:
  - `disabled={uploading}`
  - Shows text `"Uploading..."` when `uploading` is true

- Remove button:
  - Only rendered when `userBodyImage` exists
  - `disabled={removing}`
  - Shows `"Removing..."` while removing

This page ties together frontend UI, auth context, and the backend upload/delete flows.

---

## Product Page: `src/pages/ProductPage.jsx`

Responsibilities:

- Fetch a single product based on `:id` in the URL
- Show product details (image, name, price)
- Allow adding to cart via `CartContext`
- Provide entry point to virtual try-on (currently showing placeholder and messages)

Important parts:

- `useParams()` gets `id` from URL
- `useEffect` fetches product via `getProductById(id)`
- `handleAddToCart` uses `addItemToCart(product._id, 1)`
- `handleTryOn`:
  - If not authenticated, show a message and return
  - If user has no `bodyImage`, prompt to go to `/profile`
  - Otherwise show an informational toast (try-on is “coming soon”)

This page is where users directly interact with products and will later be the main entry point for AI try-on.

---

## Navbar: `src/components/Navbar.jsx`

Responsibilities:

- Show brand / navigation links
- Show icons for cart and wishlist with counts
- Show user icon, profile link, login/logout state

It reads:

- `isAuthenticated`, `logout` from `AuthContext`
- `cartItems` from `CartContext`
- `wishlist` from `WishlistContext`

It also handles mobile menu toggling and basic animations with Framer Motion.

---

## PrivateRoute: `src/components/PrivateRoute.jsx`

Purpose:

- Protects routes that require login (like `/profile`, `/cart`, `/wishlist`)

Logic:

- While `isLoading` is true, shows a loading message
- If `isAuthenticated`, renders `<Outlet />` (the nested route)
- If not authenticated, redirects to `/login`

Any route nested under `PrivateRoute` will only be available for logged-in users.

---

## Feature Flags: `src/config/features.js`

Currently:

- `isTryOnEnabled = import.meta.env.VITE_FEATURE_TRYON_ENABLED === 'true'`

This allows you to toggle the virtual try-on related UI based on an environment variable at build time.

---

## How Everything Connects

### Example 1: Register / Login

1. User fills in form on `Login.jsx` or `Register.jsx`
2. Component calls `login` or `registerUser` from `AuthContext` / `api.js`
3. Backend:
   - Creates or verifies user
   - Issues JWT token into HttpOnly cookie
4. Frontend immediately calls `/auth/status` (via `checkAuthStatus`)
5. If success:
   - `isAuthenticated` becomes true
   - `userInfo` is set
6. `Navbar`, `PrivateRoute`, and other components react to this state

### Example 2: Upload Body Image

1. User goes to `/profile`
2. `ProfilePage` shows existing `userBodyImage` if present
3. User clicks “Upload Photo”:
   - Opens file picker
   - Calls `handleUpload(file)` when chosen
4. `uploadBodyImage` in `api.js` sends multipart request with `bodyImage` field
5. Backend:
   - `protect` middleware ensures user is logged in
   - `uploadImage` middleware validates file
   - `uploadBodyImage` controller saves it using `storageService`
   - URL is stored on `user.bodyImage`, and `user.bodyImagePublicId` is tracked
6. Response returns updated URL
7. Frontend updates `userBodyImage` and refreshes `AuthContext`

### Example 3: Cart

1. User clicks “Add to Cart” in `ProductPage`
2. `ProductPage` uses `CartContext.addItemToCart(product._id, 1)`
3. `CartContext`:
   - Calls `addToCart` API
   - Updates `cartItems` from server response
4. `Navbar` shows updated count
5. `CartPage` shows updated cart details

---

## Important Concepts Explained

### React Context

You use context for:

- Auth state
- Cart state
- Wishlist state

This avoids passing props down many components. Any child can do:

```js
const { isAuthenticated, userInfo } = useContext(AuthContext);
```

### Middleware

In Express:

- A function that runs before your route handler
- Used for authentication, validation, logging, etc.

You use middleware for:

- Checking JWT tokens (`protect`)
- Validating upload size/type (`upload.js`)

### Services vs Controllers

- **Controller**: Talks in HTTP terms (`req`, `res`), knows about status codes
- **Service**: No HTTP knowledge, just “does a job” given some data

Benefit: You can reuse services from different controllers and keep controllers simple.

### Models (Mongoose)

- Define the structure of data in MongoDB
- Add helpful methods and hooks (like hashing passwords)

You have:

- `User` with cart and body image fields
- `Product` with simple fields

---

## Next Steps for Days 21-30

High-level plan based on your roadmap:

- **Day 21**: Strengthen the AI service interface
  - Make sure `runVirtualTryOn` has a clear input and output contract
  - Add more detailed error codes if needed

- **Day 22**: Plug in a real AI model
  - Replace mock logic in `virtualTryOn.service.js` with API calls to a model
  - Keep the same function signature so the rest of the app does not change

- **Day 23**: Frontend result rendering
  - Add UI in `ProductPage` to display returned `previewUrl`
  - Add loading spinners and error messages

- **Day 24**: Performance and payload optimization
  - Reduce uploaded image size if necessary (client-side or server-side)
  - Consider caching frequent responses

- **Day 25**: Profile body image flow
  - You have this working end-to-end; just refine UX if needed

- **Days 26–30**:
  - Complete end-to-end try-on journey
  - Add more robust error recovery and edge-case handling
  - Perform testing, clean code, and prepare for deployment

---

## Quick Reference

### Adding a New Backend Endpoint

1. Create a route file or add to an existing one in `api/routes/`
2. Add a controller function in `api/controllers/`
3. Wire route to controller in `index.js` if it is a new route file
4. Add a function in `src/api.js` to call the endpoint
5. Call that function from a React component or context

### Adding a New Page

1. Create a new file under `src/pages/`
2. Add a `<Route>` entry in `App.jsx`
3. Optionally add a link in `Navbar.jsx`

### Adding a New Field to User or Product

1. Update the Mongoose model (`User.js` or `Product.js`)
2. Update any controllers that should read or write that field
3. Update the frontend to send that field (for writes) or display it (for reads)

---

This documentation should give you a clear mental model of how everything fits together so you can confidently work through the remaining days. If you want, we can next go file-by-file in the editor and I can quiz you or walk you through specific flows in more detail. 

