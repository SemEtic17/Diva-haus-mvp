import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { getProductById, updateProduct } from '../api';
import { toast } from '../components/Toaster';
import HolographicContainer from '../components/HolographicContainer';

const AdminProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Link to="/admin/products" className="text-gold flex items-center gap-2 mb-2 hover:underline">
          <ArrowLeft size={16} /> Back to Products
        </Link>
        <h1 className="text-3xl font-serif tracking-tight">Edit <span className="text-gradient-gold">Product</span></h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-gold" size={40} />
        </div>
      ) : (
        <HolographicContainer className="p-8">
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gold/80 ml-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-glass-border/30 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-cyan/50 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gold/80 ml-1">Price ($)</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-white/5 border border-glass-border/30 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-cyan/50 transition-colors font-mono"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gold/80 ml-1">Image URL</label>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-white/5 border border-glass-border/30 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-cyan/50 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gold/80 ml-1">Brand</label>
                <input
                  type="text"
                  placeholder="Enter brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-white/5 border border-glass-border/30 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-cyan/50 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gold/80 ml-1">Count In Stock</label>
                <input
                  type="number"
                  placeholder="Enter stock count"
                  value={countInStock}
                  onChange={(e) => setCountInStock(Number(e.target.value))}
                  className="w-full bg-white/5 border border-glass-border/30 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-cyan/50 transition-colors font-mono"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gold/80 ml-1">Category</label>
                <input
                  type="text"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-glass-border/30 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-cyan/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gold/80 ml-1">Description</label>
              <textarea
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-glass-border/30 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-cyan/50 transition-colors resize-none"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={updating}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold/70 hover:from-gold/80 hover:to-gold/60 text-primary-foreground px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-gold/20 disabled:opacity-50"
              >
                {updating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Update Product
              </button>
            </div>
          </form>
        </HolographicContainer>
      )}
    </div>
  );
};

export default AdminProductEdit;
