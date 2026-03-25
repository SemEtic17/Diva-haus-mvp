import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, BarChart, Settings } from 'lucide-react';
import HolographicContainer from '../components/HolographicContainer';

const AdminDashboard = () => {
  const adminCards = [
    {
      title: 'Products',
      description: 'Manage inventory, add new items, and edit details.',
      icon: <ShoppingBag size={24} className="text-neon-cyan" />,
      link: '/admin/products',
      color: 'from-neon-cyan/20 to-neon-cyan/5'
    },
    {
      title: 'Users',
      description: 'View and manage registered customers.',
      icon: <Users size={24} className="text-neon-pink" />,
      link: '/admin/users',
      color: 'from-neon-pink/20 to-neon-pink/5'
    },
    {
      title: 'Analytics',
      description: 'Track sales performance and try-on engagement.',
      icon: <BarChart size={24} className="text-gold" />,
      link: '/admin/analytics',
      color: 'from-gold/20 to-gold/5'
    },
    {
      title: 'Settings',
      description: 'System configurations and AI API management.',
      icon: <Settings size={24} className="text-foreground/70" />,
      link: '/admin/settings',
      color: 'from-foreground/10 to-foreground/5'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif mb-2 tracking-tight">Admin <span className="text-gradient-gold">Control Center</span></h1>
        <p className="text-foreground/60 max-w-2xl mx-auto italic">
          Manage your luxury ecosystem, inventory, and AI-driven experiences from one unified dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminCards.map((card, index) => (
          <Link key={index} to={card.link} className="group">
            <HolographicContainer className="h-full p-6 transition-transform duration-300 group-hover:-translate-y-2">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 border border-white/10 group-hover:border-neon-cyan/30 transition-colors`}>
                {card.icon}
              </div>
              <h2 className="text-xl font-medium mb-2 group-hover:text-gold transition-colors">{card.title}</h2>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {card.description}
              </p>
            </HolographicContainer>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
