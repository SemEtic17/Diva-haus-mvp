import { Routes, Route, Link } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar'; // Import Navbar
import ProductGrid from './components/ProductGrid'; // Import ProductGrid
import ProfilePage from './pages/ProfilePage'; // NEW: Import ProfilePage
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
