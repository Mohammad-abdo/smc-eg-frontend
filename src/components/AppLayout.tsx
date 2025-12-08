import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LiveChatWidget from './LiveChatWidget';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isDashboardPage = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      {!isLoginPage && !isDashboardPage && <Header />}
      <main className={cn('flex-grow', !isLoginPage && !isDashboardPage && 'pt-28')}>
        {children}
      </main>
      {!isLoginPage && !isDashboardPage && <Footer />}
      {!isLoginPage && !isDashboardPage && <LiveChatWidget />}
    </div>
  );
};

export default AppLayout;

