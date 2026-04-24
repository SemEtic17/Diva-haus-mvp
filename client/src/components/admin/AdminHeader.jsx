import React, { useContext } from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';
import { useSidebar } from './SidebarProvider';
import { AuthContext } from '../../context/AuthContext';

const AdminHeader = () => {
  const { toggle } = useSidebar();
  const { userInfo } = useContext(AuthContext);

  return (
    <header className="h-16 border-b border-glass-border/30 bg-card/20 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-foreground/70 hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search everything..."
            className="pl-10 pr-4 py-2 bg-white/5 border border-glass-border/20 rounded-lg text-sm focus:outline-none focus:border-gold/50 transition-colors w-64"
          />
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
