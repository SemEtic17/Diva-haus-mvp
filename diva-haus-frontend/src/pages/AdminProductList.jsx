import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { getProducts, deleteProduct, createProduct } from '../api';
import { toast } from '../components/Toaster';
import HolographicContainer from '../components/HolographicContainer';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const createdProduct = await createProduct();
      toast.success('Sample product created');
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Link to="/admin" className="text-gold flex items-center gap-2 mb-2 hover:underline">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-serif tracking-tight">Product <span className="text-gradient-gold">Management</span></h1>
        </div>
        <button
          onClick={createProductHandler}
          className="flex items-center gap-2 bg-gradient-to-r from-neon-cyan to-neon-pink hover:from-neon-cyan/80 hover:to-neon-pink/80 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-neon-cyan/20"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      ) : products.length === 0 ? (
        <HolographicContainer className="p-10 text-center">
          <p className="text-foreground/60 italic">No products found. Start by adding one!</p>
        </HolographicContainer>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border/30">
                <th className="py-4 px-4 font-medium text-gold/80">ID</th>
                <th className="py-4 px-4 font-medium text-gold/80">NAME</th>
                <th className="py-4 px-4 font-medium text-gold/80">PRICE</th>
                <th className="py-4 px-4 font-medium text-gold/80">CATEGORY</th>
                <th className="py-4 px-4 font-medium text-gold/80">BRAND</th>
                <th className="py-4 px-4 font-medium text-gold/80">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-glass-border/10 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4 text-xs font-mono text-foreground/40">{product._id.substring(product._id.length - 6)}</td>
                  <td className="py-4 px-4 font-medium">{product.name}</td>
                  <td className="py-4 px-4 font-mono text-neon-cyan">${product.price.toFixed(2)}</td>
                  <td className="py-4 px-4 text-sm uppercase tracking-wider">{product.category}</td>
                  <td className="py-4 px-4 text-sm">{product.brand}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/product/${product._id}/edit`}
                        className="p-2 text-foreground/60 hover:text-gold hover:bg-gold/10 rounded-lg transition-all"
                        title="Edit Product"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="p-2 text-foreground/60 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductList;
