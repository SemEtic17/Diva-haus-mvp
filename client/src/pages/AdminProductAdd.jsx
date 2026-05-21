import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Package, Upload, X, Plus, Trash2 } from 'lucide-react';
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
    variants: [],
    brand: '',
    category: '',
    countInStock: 0,
    description: ''
  });
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [variantUploading, setVariantUploading] = useState(null); // stores index of variant being uploaded

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

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setUploading(true);
      const data = await uploadProductImage(file);
      setProductData(prev => ({ ...prev, image: data.url }));
      toast.success('Main image uploaded');
    } catch (error) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleVariantImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setVariantUploading(index);
      const data = await uploadProductImage(file);
      const newVariants = [...productData.variants];
      newVariants[index].image = data.url;
      setProductData(prev => ({ ...prev, variants: newVariants }));
      toast.success(`Variant ${index + 1} image uploaded`);
    } catch (error) {
      toast.error(error.message || 'Failed to upload variant image');
    } finally {
      setVariantUploading(null);
    }
  };

  const addVariant = () => {
    setProductData(prev => ({
      ...prev,
      variants: [...prev.variants, { color: '', colorCode: '#000000', image: '' }]
    }));
  };

  const removeVariant = (index) => {
    setProductData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...productData.variants];
    newVariants[index][field] = value;
    setProductData(prev => ({ ...prev, variants: newVariants }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!productData.image) {
      toast.error('Please upload a main product image');
      return;
    }

    // Validate variants
    for (const variant of productData.variants) {
      if (!variant.color || !variant.colorCode || !variant.image) {
        toast.error('Please complete all variant fields (color, code, and image)');
        return;
      }
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
                  placeholder="e.g. Luxury Silk Evening Dress"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  placeholder="Describe the design, fabric quality, and fit details."
                  rows={6}
                  required
                />
              </div>
            </CardContent>
          </Card>

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
                    placeholder="e.g. Dresses"
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
            <CardTitle>Main Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                    <h4 className="font-medium">Upload Main Image</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: Square aspect ratio, high resolution.
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
          </CardContent>
        </Card>

        {/* Color Variants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Color Variants</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addVariant}
              className="bg-gold/10 text-gold border-gold/20 hover:bg-gold/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Color
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {productData.variants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-glass-border/30 rounded-xl italic">
                No color variants added yet.
              </div>
            ) : (
              <div className="space-y-6">
                {productData.variants.map((variant, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-6 p-4 rounded-xl bg-white/5 border border-glass-border/30">
                    <div className="w-full md:w-32 h-32 relative group rounded-lg overflow-hidden border border-glass-border/30 bg-black/20 flex items-center justify-center">
                      {variant.image ? (
                        <img src={variant.image} alt={`Variant ${index}`} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-8 h-8 text-muted-foreground/20" />
                      )}
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={() => document.getElementById(`variant-upload-${index}`).click()}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {variantUploading === index && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <Loader2 className="w-6 h-6 text-gold animate-spin" />
                        </div>
                      )}
                      
                      <input
                        id={`variant-upload-${index}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleVariantImageUpload(e, index)}
                        accept="image/*"
                      />
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Color Name</label>
                        <Input
                          value={variant.color}
                          onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                          placeholder="e.g. Emerald Green"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Color Hex Code</label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={variant.colorCode}
                            onChange={(e) => handleVariantChange(index, 'colorCode', e.target.value)}
                            className="w-12 h-10 p-1 bg-transparent border-glass-border/30 cursor-pointer"
                          />
                          <Input
                            value={variant.colorCode}
                            onChange={(e) => handleVariantChange(index, 'colorCode', e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            disabled={creating || uploading || variantUploading !== null}
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
