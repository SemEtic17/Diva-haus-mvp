import { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/CartPage';
import PrivateRoute from './components/PrivateRoute';
import { getProducts, addToCart } from './api';
import { AuthContext } from './context/AuthContext';
import './App.css';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please login first');
      return;
    }
    try {
      await addToCart(productId, 1);
      alert('Added to cart');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <Link to={`/product/${product._id}`}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
          </Link>
          <button
            onClick={() => handleAddToCart(product._id)}
            disabled={!user}
            className="bg-blue-500 text-white p-2 rounded mt-2 disabled:bg-gray-400"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl"><Link to="/">Diva Haus</Link></h1>
        <div>
          <Link to="/cart" className="mr-4">Cart</Link>
          {user ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<ProductGrid />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<PrivateRoute />}>
            <Route path="" element={<CartPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
