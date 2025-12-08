import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductsMain from "./pages/ProductsMain";
import CategoryProducts from "./pages/CategoryProducts";
import News from "./pages/News";
import Contact from "./pages/Contact";
import PrivatePort from "./pages/PrivatePort";
import Financial from "./pages/Financial";
import Tenders from "./pages/Tenders";
import Complaints from "./pages/Complaints";
import Members from "./pages/Members";
import ProductDetail from "./pages/ProductDetail";
import PostDetail from "./pages/PostDetail";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProductsManagement from "./pages/dashboard/ProductsManagement";
import NewsManagement from "./pages/dashboard/NewsManagement";
import UsersManagement from "./pages/dashboard/UsersManagement";
import MediaLibrary from "./pages/dashboard/MediaLibrary";
import HeroBanners from "./pages/dashboard/HeroBanners";
import PageContentEditor from "./pages/dashboard/PageContentEditor";
import Settings from "./pages/dashboard/Settings";
import Statistics from "./pages/dashboard/Statistics";
import FinancialManagement from "./pages/dashboard/FinancialManagement";
import ContactsManagement from "./pages/dashboard/ContactsManagement";
import ComplaintsManagement from "./pages/dashboard/ComplaintsManagement";
import ChatManagement from "./pages/dashboard/ChatManagement";
import SEOSettings from "./pages/dashboard/SEOSettings";
import TendersManagement from "./pages/dashboard/TendersManagement";
import MembersManagement from "./pages/dashboard/MembersManagement";
import ClientsManagement from "./pages/dashboard/ClientsManagement";
import CategoriesManagement from "./pages/dashboard/CategoriesManagement";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import LiveChatWidget from "./components/LiveChatWidget";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Data is immediately stale
      gcTime: 0, // Don't cache in memory (formerly cacheTime)
      refetchOnMount: true, // Always refetch when component mounts
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnReconnect: true, // Refetch when network reconnects
    },
  },
});

// Force CDN cache refresh on page load
if (typeof window !== 'undefined') {
  // Generate new session ID on each page load to bypass CDN cache
  const pageLoadTime = Date.now().toString();
  sessionStorage.setItem('page_load_time', pageLoadTime);
  sessionStorage.setItem('api_session_id', `${pageLoadTime}-${Math.random().toString(36).substring(7)}`);
  
  // Clear any old cache
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
}

const AppRoutes = () => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<ProductsMain />} />
                <Route path="/products/:categorySlug" element={<CategoryProducts />} />
                <Route path="/category/:categorySlug" element={<CategoryProducts />} />
                <Route path="/industrial-products" element={<Products type="industrial" />} />
                <Route path="/mining-products" element={<Products type="mining" />} />
                <Route path="/private-port" element={<PrivatePort />} />
                <Route path="/financial" element={<Financial />} />
                <Route path="/tenders" element={<Tenders />} />
                <Route path="/members" element={<Members />} />
                <Route path="/news" element={<News />} />
        <Route path="/news/:postId" element={<PostDetail />} />
                <Route path="/contact" element={<Contact />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="financial" element={<FinancialManagement />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="pages" element={<PageContentEditor />} />
          <Route path="banners" element={<HeroBanners />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="contacts" element={<ContactsManagement />} />
          <Route path="complaints" element={<ComplaintsManagement />} />
          <Route path="chat" element={<ChatManagement />} />
          <Route path="tenders" element={<TendersManagement />} />
          <Route path="members" element={<MembersManagement />} />
          <Route path="clients" element={<ClientsManagement />} />
          <Route path="seo" element={<SEOSettings />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
          </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
