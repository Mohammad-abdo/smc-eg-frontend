import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import DashboardSidebar from '@/components/DashboardSidebar';

const Dashboard = () => {
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('adminEmail');
    if (email) {
      setAdminEmail(email);
    }
    
    // Redirect to dashboard home if on /dashboard
    if (location.pathname === '/dashboard') {
      navigate('/dashboard/home', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Professional Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-cyan-900/20 animate-pulse" />
        {/* Mesh gradient effect */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.3) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.3) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.3) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(14, 165, 233, 0.3) 0px, transparent 50%)
          `,
        }} />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64 relative" style={{ zIndex: 1 }}>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
