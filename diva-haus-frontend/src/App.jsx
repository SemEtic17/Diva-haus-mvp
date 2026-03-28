import { Routes, Route, Outlet } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminOverview from './pages/AdminOverview';
import AdminProductList from './pages/AdminProductList';
import AdminProductEdit from './pages/AdminProductEdit';
import AdminUserList from './pages/AdminUserList';
import AdminSettings from './pages/AdminSettings';
import './App.css';

// Public Layout Wrapper
const PublicLayout = () => (
  <div className="App min-h-screen bg-background text-foreground transition-colors duration-300">
    <Navbar />
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-20 md:pt-24">
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<ProductGrid />} />
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
          <Route path="product/:id/edit" element={<AdminProductEdit />} />
          <Route path="users" element={<AdminUserList />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
