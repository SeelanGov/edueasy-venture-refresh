
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Building2, Users, Settings, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from 'react-router-dom';

export const PartnerCRMLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/partners', label: 'All Partners', icon: Building2 },
    { path: '/admin/partners/tiers', label: 'Tier Management', icon: Settings },
    { path: '/admin/partners/payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900">Partner CRM</h2>
          <p className="text-sm text-gray-600">Manage institutional partnerships</p>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};
