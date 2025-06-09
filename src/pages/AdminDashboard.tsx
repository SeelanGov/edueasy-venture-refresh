
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to new admin CRM dashboard
    navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg">Redirecting to Admin Dashboard...</div>
    </div>
  );
};

export default AdminDashboard;
