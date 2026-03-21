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
# HF models often require you to "accept" the license on the model page.
# if you do not, the backend will report a 404 model‑not‑found error even
# though your token is valid.  run `npm run check:ai` to confirm.
HF_API_TOKEN=your_hf_inference_api_token
HF_API_MODEL=runwayml/stable-diffusion-v1-5  # optional, defaults to the same
# -----------------------------------------------
```

Replace `YOUR_MONGODB_CONNECTION_STRING` with your actual MongoDB connection string (e.g., `mongodb://localhost:27017/divahaus` or your MongoDB Atlas URI.

> **Diagnostics:**
> * With the backend running you can hit `/api/ai/health` to see the status
>   of each provider (token validity, service reachability, etc.).
> * Alternatively run `npm run check:ai` from `diva-haus-backend` – it prints
>   the same information without starting the server.  These checks help
>   determine whether Pixazo is failing due to an exhausted balance or whether
>   a Hugging Face token lacks inference permissions.

### Running the Development Environment

You can run all three services (Frontend, Backend, and AI VTON Service) simultaneously from the root directory using a single command:

```bash
npm run dev
```

Alternatively, you can run them individually:

- **Frontend:** `npm run dev:frontend` (available at `http://localhost:5173`)
- **Backend:** `npm run dev:backend` (available at `http://localhost:5000`)
- **AI VTON Service:** `npm run dev:vton` (available at `http://localhost:8000`)

---

### Prerequisites for AI Try-On (Python VTON Service)

The virtual try-on feature requires the Python micro-service to be running.

1.  **Set up the Python Environment:**
    Navigate to the `vton-service` directory and create a virtual environment:
    ```bash
    cd vton-service
    python3 -m venv .venv
    source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
    pip install -r requirements.txt
    ```

2.  **Download AI Weights:**
    Run the script to download the necessary model weights (approx. 5GB):
    ```bash
    python3 scripts/download_weights.py --weights-dir ./weights
    ```

3.  **Run the Service:**
    You can now run it from the root directory using `npm run dev:vton`. 
    By default, it uses the CPU. If you have a GPU with CUDA support, you can modify the `dev` script in `vton-service/package.json` to set `VTON_DEVICE=cuda`.

---

### Environment Variables (Backend)

Ensure your `.env` file in `diva-haus-backend` is correctly configured:

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
