import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import { getProducts } from './api';
import './App.css';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <Link to={`/product/${product._id}`}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1><Link to="/">Diva Haus</Link></h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ProductGrid />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
