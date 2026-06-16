import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import React, { useContext } from 'react';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminOverview from './pages/AdminOverview';
import AdminProductList from './pages/AdminProductList';
import AdminProductAdd from './pages/AdminProductAdd';
import AdminProductEdit from './pages/AdminProductEdit';
import AdminUserList from './pages/AdminUserList';
import AdminSettings from './pages/AdminSettings';
import MaintenanceMode from './components/MaintenanceMode';
import { useConfig } from './context/ConfigContext';
import { AuthContext } from './context/AuthContext';
import './App.css';

// Public Layout Wrapper
const PublicLayout = () => {
  const { settings, loading } = useConfig();
  const { userInfo } = useContext(AuthContext);
  const location = useLocation();

  // If maintenance mode is on, we show the maintenance screen
  // UNLESS it's the login page (so admins can still log in)
  // OR the user is an admin (so they can see the site they are working on)
  const isLoginPage = location.pathname === '/login';
  const isAdmin = userInfo?.isAdmin;

  if (!loading && settings.maintenanceMode && !isLoginPage && !isAdmin) {
    return <MaintenanceMode settings={settings} />;
  }

  return (
    <div className="App min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="" element={<ProfilePage />} />
        </Route>
        <Route path="/cart" element={<PrivateRoute />}>
          <Route path="" element={<CartPage />} />
        </Route>
        <Route path="/wishlist" element={<PrivateRoute />}>
          <Route path="" element={<WishlistPage />} />
        </Route>
      </Route>

      {/* Admin Routes - No Public Navbar, No Centering Container */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminDashboard />}>
          <Route index element={<AdminOverview />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="products/add" element={<AdminProductAdd />} />
          <Route path="product/:id/edit" element={<AdminProductEdit />} />
          <Route path="users" element={<AdminUserList />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
