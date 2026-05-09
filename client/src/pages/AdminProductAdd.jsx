import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Package, Upload, X } from 'lucide-react';
import { createProduct, uploadProductImage } from '../api';
import { toast } from '../components/Toaster';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

const AdminProductAdd = () => {
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: '',
    price: 0,
    image: '',
    brand: '',
    category: '',
    countInStock: 0,
    description: ''
  });
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'countInStock' ? Number(value) : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setUploading(true);
      const data = await uploadProductImage(file);
      setProductData(prev => ({ ...prev, image: data.url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!productData.image) {
      toast.error('Please upload a product image');
      return;
    }

    try {
      setCreating(true);
      await createProduct(productData);
      toast.success('Product created successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/admin/products')}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground italic">Enter details for the new fashion item</p>
        </div>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input
                  name="name"
                  value={productData.name}
                  onChange={handleChange}
                  placeholder="e.g. Brazilian Deep Wave Wig"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  placeholder="Describe the product details, texture, etc."
                  rows={6}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Side Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price ($)</label>
                  <Input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock Quantity</label>
                  <Input
                    type="number"
                    name="countInStock"
                    value={productData.countInStock}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    placeholder="e.g. Wigs"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand</label>
                  <Input
                    name="brand"
                    value={productData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Diva Haus"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Product Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Image</label>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative group">
                    <div className="w-48 h-48 rounded-xl border-2 border-dashed border-glass-border/30 overflow-hidden flex items-center justify-center bg-white/5 group-hover:border-gold/50 transition-colors">
                      {productData.image ? (
                        <img 
                          src={productData.image} 
                          alt="Product" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-12 h-12 text-muted-foreground/20" />
                      )}
                      
                      {uploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <Loader2 className="w-10 h-10 text-gold animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <h4 className="font-medium">Upload Image</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: Square aspect ratio, high resolution.<br />
                        Supports JPG, PNG and WebP (Max 10MB).
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="relative overflow-hidden cursor-pointer bg-white/5"
                        disabled={uploading}
                        onClick={() => document.getElementById('image-upload').click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {productData.image ? 'Change' : 'Upload'}
                        <input
                          id="image-upload"
                          type="file"
                          className="hidden"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </Button>
                      
                      {productData.image && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setProductData(prev => ({ ...prev, image: '' }))}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pb-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={creating || uploading}
            className="min-w-[150px] bg-gold text-black hover:bg-gold/90"
          >
            {creating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Create Product
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductAdd;
