import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import App from './App.jsx';
import NotificationSystem from './components/NotificationSystem.jsx'; // NEW: Import NotificationSystem
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <NotificationSystem /> {/* NEW: Add NotificationSystem */}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);