import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { getProducts, getUsers } from '../api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function AdminOverview() {
  const [products, setProducts] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, usersData] = await Promise.all([
          getProducts(),
          getUsers()
        ]);
        
        setProducts(productsData || []);
        setUsersCount(usersData?.length || 0);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: products.length.toString(),
      icon: Package,
      change: "+2 this week",
      changeType: "positive",
    },
    {
      title: "Active Orders",
      value: "23",
      icon: ShoppingCart,
      change: "+5 today",
      changeType: "positive",
    },
    {
      title: "Total Customers",
      value: usersCount.toString(),
      icon: Users,
      change: "+12 this month",
      changeType: "positive",
    },
    {
      title: "Revenue",
      value: "$12,456",
      icon: TrendingUp,
      change: "+8.2% vs last month",
      changeType: "positive",
    },
  ];

  const recentActivity = [
    { action: "New order received", time: "2 minutes ago", type: "order" },
    { action: "Product updated", time: "15 minutes ago", type: "product" },
    { action: "New customer registered", time: "1 hour ago", type: "customer" },
    { action: "Review submitted", time: "2 hours ago", type: "review" },
  ];

  const topProducts = products
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground italic">Welcome back! Here's what's happening with your luxury store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gold/70">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'order' ? 'bg-gold' :
                      item.type === 'product' ? 'bg-blue-400' :
                      item.type === 'customer' ? 'bg-purple-400' : 'bg-orange-400'
                    }`} />
                    <span className="text-sm">{item.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-glass-border/20">
                    <img 
                      src={product.image || product.images?.[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">${product.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.countInStock > 0 ? (
                      <Badge variant="outline" className="text-xs">In Stock</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                    )}
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No products found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
