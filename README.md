# Diva Haus MVP Monorepo

This monorepo contains the essential components for the Diva Haus MVP: a React frontend and a Node.js/Express backend.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Frontend](#running-the-frontend)
  - [Running the Backend](#running-the-backend)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Diva Haus is a Minimum Viable Product (MVP) designed to showcase [brief description of what Diva Haus is, e.g., "an e-commerce platform for unique fashion items" or "a social networking app for artists"]. This monorepo architecture allows for streamlined development and deployment of both the client and server applications.

## Features

- **User Authentication:** Secure user registration and login (planned).
- **Product Catalog:** Browse and view product details (planned).
- **Shopping Cart:** Add, update, and remove items from the cart (planned).
- **Order Management:** Place and track orders (planned).
- **Admin Panel:** Manage products, users, and orders (planned).
- **Virtual Try‑On:** AI‑powered image-based clothing previews (Day 22+).
- **Responsive Design:** Optimal viewing experience across various devices.

## Technologies Used

**Frontend (diva-haus-frontend):**
- React (Vite)
- [Add any UI libraries, e.g., Tailwind CSS, Ant Design]

**Backend (diva-haus-backend):**
- Node.js
- Express.js
- MongoDB (via Mongoose)
- CORS
- Dotenv

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended)
- npm (comes with Node.js)
- Git
- MongoDB (either locally or a cloud instance like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/diva-haus-mvp.git
    cd diva-haus-mvp
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd diva-haus-frontend
    npm install
    cd ..
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd diva-haus-backend
    npm install
    cd ..
    ```

### Environment Variables

Create a `.env` file in the `diva-haus-backend` directory with the following content:

```
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
# JWT_SECRET=YOUR_JWT_SECRET (if authentication is added later)

# picks which AI provider to use for virtual try-on ("mock", "fashn" or "huggingface")
AI_PROVIDER=mock  # or 'fashn' to call the Python VTON service or 'huggingface' for a free HF fallback
# when using the FASHN provider this should point at the Python service
VTON_SERVICE_URL=http://localhost:8000/vton

# ---- only needed when AI_PROVIDER=pixazo ----
# Pixazo offers a nominal free tier for development; sign up at
# https://api-console.pixazo.ai/api_keys and copy the key below.
PIXAZO_API_KEY=your_pixazo_subscription_key
# optional override of gateway URL:
# PIXAZO_BASE_URL=https://gateway.pixazo.ai/fashn-virtual-try-on/v1
# -----------------------------------------------

# ---- only needed when AI_PROVIDER=huggingface ----
# (now generally requires a paid plan)
# token is free and no credit card is required; create one at
# https://huggingface.co/settings/tokens (login with GitHub/Gmail etc.)
# the service now uses the newer router.huggingface.co endpoint – you may
# see a 410 error if you hit the old URL in your browser.
HF_API_TOKEN=your_hf_inference_api_token
HF_API_MODEL=runwayml/stable-diffusion-v1-5  # optional, defaults to the same
# -----------------------------------------------
```

Replace `YOUR_MONGODB_CONNECTION_STRING` with your actual MongoDB connection string (e.g., `mongodb://localhost:27017/divahaus` or your MongoDB Atlas URI).

### Running the Frontend

Navigate to the `diva-haus-frontend` directory and start the development server:

```bash
cd diva-haus-frontend
npm run dev
```
The frontend application will typically be accessible at `http://localhost:5173` (or another port if 5173 is in use).

### Running the Backend

Navigate to the `diva-haus-backend` directory and start the server:

```bash
cd diva-haus-backend
node server.js
# Or using nodemon for automatic restarts during development:
# npm install -g nodemon
# nodemon server.js
```

### Running the Python VTON Service (for AI try-on)

The FASHN VTON micro‑service is implemented in the `vton-service` folder. It
must be running if you configure `AI_PROVIDER=fashn` in your backend (the new `huggingface` provider works without it). A GPU is
strongly recommended for acceptable inference times; you can also deploy the
service to Colab, a Hugging Face Space, or any machine with CUDA support.

```bash
cd vton-service
python -m venv .venv            # create virtualenv if needed
source .venv/bin/activate        # activate (use venv\Scripts\activate on Windows)
pip install -r requirements.txt  # install dependencies and the library
python scripts/download_weights.py --weights-dir ./weights
python server.py
```

The service listens on port `8000` by default and exposes:

* `POST /vton` – run the try‑on pipeline, returning a JSON response with
  `previewBase64` image data.
* `GET /health` – simple liveliness check.

When using the FASHN provider the backend environment should include:

```
AI_PROVIDER=fashn    # or AI_PROVIDER=huggingface for free text-to-image fallback
VTON_SERVICE_URL=http://localhost:8000/vton
```

You can fall back to the built‑in mock provider by setting
`AI_PROVIDER=mock` or leaving the variable unset.  

The backend API will be running on `http://localhost:5000` (or the port specified in your `.env` file).

## Folder Structure

```
.
├── diva-haus-backend/
│   ├── node_modules/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── ... (other backend files)
├── diva-haus-frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .eslintrc.cjs
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── ... (other frontend files)
├── .gitignore
├── README.md
└── package.json (root package.json - optional for monorepo tools like Lerna/Yarn Workspaces)
```

## Contributing

We welcome contributions! Please see our (planned) `CONTRIBUTING.md` for guidelines.

## License

This project is licensed under the MIT License - see the `LICENSE` file (planned) for details.
