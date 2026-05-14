import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User, Package, Users, X, Loader2 } from 'lucide-react';
import { useSidebar } from './SidebarProvider';
import { AuthContext } from '../../context/AuthContext';
import { getProducts, getUsers } from '../../api';

const AdminHeader = () => {
  const { toggle } = useSidebar();
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState({ products: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults({ products: [], users: [] });
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      setShowResults(true);
      try {
        const [productsData, usersData] = await Promise.all([
          getProducts({ keyword: searchTerm, pageSize: 5 }),
          getUsers({ keyword: searchTerm, pageSize: 5 })
        ]);
        
        setResults({
          products: productsData.products || [],
          users: usersData.users || []
        });
      } catch (error) {
        console.error("Global search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleResultClick = (type, id) => {
    setShowResults(false);
    setSearchTerm("");
    if (type === 'product') {
      navigate(`/admin/product/${id}/edit`);
    } else {
      // Assuming user edit is not separate yet, just go to list
      navigate(`/admin/users`);
    }
  };

  return (
    <header className="h-16 border-b border-glass-border/30 bg-card/20 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggle}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-foreground/70 hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative hidden md:flex items-center flex-1 max-w-md" ref={searchRef}>
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
            placeholder="Search everything..."
            className="pl-10 pr-10 py-2 bg-white/5 border border-glass-border/20 rounded-lg text-sm focus:outline-none focus:border-gold/50 transition-colors w-full"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}

          {/* Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-glass-border/30 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 max-h-[80vh] overflow-y-auto">
              {loading ? (
                <div className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  Searching...
                </div>
              ) : (
                <>
                  {/* Products Section */}
                  <div className="p-2">
                    <div className="flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <Package className="w-3 h-3" />
                      Products
                    </div>
                    {results.products.length > 0 ? (
                      results.products.map(product => (
                        <button
                          key={product._id}
                          onClick={() => handleResultClick('product', product._id)}
                          className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded bg-white/5 flex-shrink-0 overflow-hidden">
                            {product.image ? (
                              <img src={product.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gold/50 font-bold">W</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{product.brand}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-xs text-muted-foreground italic">No products found</p>
                    )}
                  </div>

                  <div className="h-px bg-glass-border/20 mx-2" />

                  {/* Users Section */}
                  <div className="p-2">
                    <div className="flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <Users className="w-3 h-3" />
                      Users
                    </div>
                    {results.users.length > 0 ? (
                      results.users.map(user => (
                        <button
                          key={user._id}
                          onClick={() => handleResultClick('user', user._id)}
                          className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 border border-gold/20">
                            <User className="w-4 h-4 text-gold" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-xs text-muted-foreground italic">No users found</p>
                    )}
                  </div>

                  {/* View All */}
                  <div className="p-2 border-t border-glass-border/20 bg-white/[0.02]">
                    <button 
                      onClick={() => {
                        setShowResults(false);
                        navigate(`/admin/products?keyword=${searchTerm}`);
                      }}
                      className="w-full py-2 text-xs text-center text-gold hover:text-gold/80 font-medium transition-colors"
                    >
                      View all results for "{searchTerm}"
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-foreground/70 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full border border-black" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-glass-border/30">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{userInfo?.name || 'Admin User'}</p>
            <p className="text-xs text-muted-foreground mt-1">Super Admin</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/40 to-gold/10 border border-gold/30 flex items-center justify-center">
            <User className="w-4 h-4 text-gold" />
          </div>
        </div>
      </div>
    </header>
  );
};

export { AdminHeader };
