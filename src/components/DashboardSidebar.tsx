import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Newspaper,
  Users,
  Image,
  Settings,
  FileText,
  BarChart3,
  Mail,
  MessageSquare,
  LogOut,
  Menu,
  X,
  DollarSign,
  MessageCircle,
  Search,
  Moon,
  Sun,
  ClipboardList,
  FolderTree,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const DashboardSidebar = () => {
  const { t, isRTL, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const savedTheme = localStorage.getItem('dashboardTheme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('dashboardTheme', newTheme ? 'dark' : 'light');
    // Force update to trigger re-render
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Force component re-render
    window.dispatchEvent(new Event('themechange'));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/login');
  };

  const menuItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: t('dashboard') || 'Dashboard', path: '/dashboard/home' },
    { icon: BarChart3, label: t('statistics') || 'Statistics', path: '/dashboard/statistics' },
    { icon: DollarSign, label: t('financial') || 'Financial', path: '/dashboard/financial' },
    { icon: Package, label: t('products') || 'Products', path: '/dashboard/products' },
    { icon: FolderTree, label: language === 'ar' ? 'أقسام المنتجات' : 'Product Categories', path: '/dashboard/categories' },
    { icon: Newspaper, label: t('news') || 'News', path: '/dashboard/news' },
    { icon: FileText, label: t('pageContent') || 'Page Content', path: '/dashboard/pages' },
    { icon: Image, label: t('heroBanners') || 'Hero Banners', path: '/dashboard/banners' },
    { icon: Image, label: t('mediaLibrary') || 'Media Library', path: '/dashboard/media' },
    { icon: Mail, label: t('contacts') || 'Contacts', path: '/dashboard/contacts' },
    { icon: MessageSquare, label: t('complaints') || 'Complaints', path: '/dashboard/complaints' },
    { icon: MessageCircle, label: t('chatMessages') || 'Chat Messages', path: '/dashboard/chat', badge: 0 },
    { icon: ClipboardList, label: t('tenders') || 'Tenders', path: '/dashboard/tenders' },
    { icon: Users, label: language === 'ar' ? 'الأعضاء' : 'Members', path: '/dashboard/members' },
    { icon: Building2, label: language === 'ar' ? 'العملاء' : 'Clients', path: '/dashboard/clients' },
    { icon: Search, label: t('seoSettings') || 'SEO Settings', path: '/dashboard/seo' },
    { icon: Users, label: t('users') || 'Users', path: '/dashboard/users' },
    { icon: Settings, label: t('settings') || 'Settings', path: '/dashboard/settings' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        <h2 className="text-xl font-bold text-white">SMC Admin</h2>
        <p className="text-xs text-white/60 mt-1">Control Panel</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-[#204393] text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle & Logout */}
      <div className="p-4 border-t border-white/20 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <>
              <Sun className="h-5 w-5 mr-3" />
              {t('lightMode') || 'Light Mode'}
            </>
          ) : (
            <>
              <Moon className="h-5 w-5 mr-3" />
              {t('darkMode') || 'Dark Mode'}
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/20"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          {t('logout') || 'Logout'}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-background"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay - Only show on mobile when menu is open */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50"
          style={{ zIndex: 40 }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 backdrop-blur-xl bg-white/10 border-r border-white/20 transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
        style={{ zIndex: 50 }}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default DashboardSidebar;

