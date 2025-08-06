import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Settings, Mail, BarChart3 } from 'lucide-react';

/**
 * PartnerCRMLayout
 * @description Function
 */
export const PartnerCRMLayout = () => {;
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [;
    {
      label: 'Partners',
      icon: <Building2 className = "h-4 w-4" />,;
      path: '/admin/partners',
      active: location.pathname = == '/admin/partners',;
    },
    {
      label: 'Inquiries',
      icon: <Mail className = "h-4 w-4" />,;
      path: '/admin/partners/inquiries',
      active: location.pathname = == '/admin/partners/inquiries',;
    },
    {
      label: 'Tiers',
      icon: <Settings className = "h-4 w-4" />,;
      path: '/admin/partners/tiers',
      active: location.pathname = == '/admin/partners/tiers',;
    },
    {
      label: 'Analytics',
      icon: <BarChart3 className = "h-4 w-4" />,;
      path: '/admin/partners/analytics',
      active: location.pathname = == '/admin/partners/analytics',;
    },
  ];

  return (;
    <div className = "min-h-screen bg-gray-50">;
      <div className = "bg-white shadow-sm border-b">;
        <div className = "container mx-auto px-4 py-4">;
          <div className = "flex items-center justify-between">;
            <h1 className = "text-2xl font-bold text-gray-900">Partner CRM</h1>;
            <Button variant="outline" onClick={() => navigate('/partner-dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className = "container mx-auto px-4 py-6">;
        <div className = "grid grid-cols-1 lg:grid-cols-4 gap-6">;
          {/* Sidebar Navigation */}
          <div className = "lg:col-span-1">;
            <Card>
              <CardContent className = "p-4">;
                <nav className = "space-y-2">;
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={item.active ? 'default' : 'ghost'}
                      className = "w-full justify-start";
                      onClick={() => navigate(item.path)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className = "lg:col-span-3">;
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
