
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Package, 
  Calendar,
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';

export const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Plans', href: '/admin/plans', icon: Package },
    { name: 'Sessions', href: '/admin/sessions', icon: Calendar },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-6">
        <Logo layout="horizontal" size="small" />
        <p className="text-sm text-gray-500 mt-2">Admin Dashboard</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive(item.href)
                ? 'bg-cap-teal text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
