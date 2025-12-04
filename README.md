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
