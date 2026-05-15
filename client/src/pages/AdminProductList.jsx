import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Package, X } from 'lucide-react';
import { getProducts, deleteProduct } from '../api';
import { toast } from '../components/Toaster';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  // Categories list - in a real app this might come from an API
  const categories = ['Bag', 'Accessory', 'Jewelry', 'Clothe',];

  const fetchProducts = useCallback(async (keyword = "", cat = "", pageNum = 1) => {
    try {
      setLoading(true);
      const data = await getProducts({ 
        keyword, 
        category: cat, 
        pageNumber: pageNum,
        pageSize: 10 
      });
      
      // Backend returns { products, page, pages, count }
      setProducts(data.products || []);
      setPage(data.page || 1);
      setPages(data.pages || 1);
      setTotalCount(data.count || 0);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchTerm, category, 1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, category, fetchProducts]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchProducts(searchTerm, category, page);
      } catch (error) {
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  const handleCreateProduct = () => {
    navigate('/admin/products/add');
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Products Management</h1>
          <p className="text-muted-foreground italic">Manage your hair products inventory</p>
        </div>
        <Button onClick={handleCreateProduct} className="gap-2 bg-gold hover:bg-gold/90 text-black">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name, brand or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {(searchTerm || category) && (
                <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear Filters">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products ({totalCount})</CardTitle>
          {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold"></div>}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/5 border border-glass-border/20 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.image ? (
                              <img src={product.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                              <Package className="w-5 h-5 text-gold/50" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gold">${product.price.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.countInStock > 0 ? "default" : "destructive"}>
                        {product.countInStock > 0 ? `${product.countInStock} in stock` : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No products found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => fetchProducts(searchTerm, category, page - 1)}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {[...Array(pages).keys()].map((x) => (
                  <Button
                    key={x + 1}
                    variant={page === x + 1 ? "default" : "outline"}
                    size="sm"
                    className={page === x + 1 ? "bg-gold text-black" : ""}
                    onClick={() => fetchProducts(searchTerm, category, x + 1)}
                  >
                    {x + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pages}
                onClick={() => fetchProducts(searchTerm, category, page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductList;
