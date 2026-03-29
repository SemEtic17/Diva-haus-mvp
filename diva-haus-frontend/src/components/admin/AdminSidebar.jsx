import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { useSidebar } from './SidebarProvider';

const AdminSidebar = () => {
  const { isOpen } = useSidebar();
  const location = useLocation();

  const menuItems = [
    { title: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { title: 'Products', icon: Package, path: '/admin/products' },
    { title: 'Users', icon: Users, path: '/admin/users' },
    { title: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <aside
      className={`bg-card/30 backdrop-blur-xl border-r border-glass-border/30 h-screen transition-all duration-300 flex flex-col ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-black" />
        </div>
        {isOpen && <span className="font-serif font-bold text-xl tracking-tight">DIVA HAUS</span>}
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gold text-black font-medium'
                  : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isOpen && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-glass-border/30">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 text-foreground/70 hover:text-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span>Back to Site</span>}
        </Link>
      </div>
    </aside>
  );
};

export { AdminSidebar };
