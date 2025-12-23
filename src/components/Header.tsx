import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { cn } from '@/lib/utils';
import smcLogo from '@/assets/manganese/logo.png';

interface NavigationItem {
  name: string;
  href: string;
  hasSubmenu?: boolean;
  submenu?: Array<{ name: string; href: string }>;
}

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t, isRTL } = useLanguage();

  const aboutSubmenu = [
    { name: language === 'ar' ? 'التعريف بالشركة' : 'Company Introduction', href: getLocalizedLink('/about', language) },
    { name: language === 'ar' ? 'رؤية الشركة' : 'Company Vision', href: getLocalizedLink('/about#vision', language) },
    { name: language === 'ar' ? 'الأعضاء' : 'Members', href: getLocalizedLink('/members', language) },
  ];

  const navigation: NavigationItem[] = [
    { name: t('home'), href: getLocalizedLink('/', language) },
    { name: t('about'), href: getLocalizedLink('/about', language), hasSubmenu: true, submenu: aboutSubmenu },
    { name: t('industrialProducts'), href: getLocalizedLink('/products/industrial', language) },
    { name: t('miningProducts'), href: getLocalizedLink('/products/mining', language) },
    { name: t('privatePort'), href: getLocalizedLink('/private-port', language) },
    { name: t('financial'), href: getLocalizedLink('/financial', language) },
    { name: t('tenders'), href: getLocalizedLink('/tenders', language) },
    { name: t('news'), href: getLocalizedLink('/news', language) },
    { name: t('contact'), href: getLocalizedLink('/contact', language) },
    { name: t('complaints'), href: getLocalizedLink('/complaints', language) },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4">
          <div className={cn(
            "flex items-center justify-between py-2 text-sm",
            isRTL && "flex-row-reverse"
          )}>
            <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
              <span className="text-muted-foreground flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Abu-Zinima, Sinai, Egypt
              </span>
              <span className="text-muted-foreground flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@smc-eg.com
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-muted-foreground hover:text-foreground"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <nav className={cn(
          "flex items-center justify-between py-4",
          isRTL && "flex-row-reverse"
        )}>
          {/* Logo */}
          <Link to={getLocalizedLink('/', language)} className="flex items-center gap-4">
            <img
              src={smcLogo}
              alt="Sinai Manganese Co. logo"
              className="w-auto max-h-16 object-contain"
            />
            <div className={cn(isRTL && "text-right")}>
              <div className="font-bold text-xl text-foreground">Sinai Manganese Co.</div>
              <div className="text-xs text-muted-foreground">Since 1957</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              if (item.hasSubmenu && item.submenu) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger
                      className={cn(
                        "px-3 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1",
                        location.pathname === item.href || 
                        location.pathname.startsWith(`/${language}/about`) || 
                        location.pathname.startsWith(`/${language}/members`)
                          ? "text-primary bg-accent"
                          : "text-foreground hover:text-primary hover:bg-accent/50"
                      )}
                    >
                      {item.name}
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={isRTL ? 'end' : 'start'}>
                      {item.submenu.map((subItem) => {
                        const pathWithoutHash = subItem.href.split('#')[0];
                        const isActive = location.pathname === pathWithoutHash || 
                                       location.pathname.startsWith(pathWithoutHash);
                        return (
                          <DropdownMenuItem key={subItem.name} asChild>
                            <Link
                              to={subItem.href}
                              className={cn(
                                "cursor-pointer",
                                isActive && "bg-accent"
                              )}
                            >
                              {subItem.name}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap",
                    location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                      ? "text-primary bg-accent"
                      : "text-foreground hover:text-primary hover:bg-accent/50"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-foreground hover:bg-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => {
              if (item.hasSubmenu && item.submenu) {
                return (
                  <div key={item.name} className="space-y-1">
                    <div className={cn(
                      "px-4 py-2 text-sm font-semibold rounded-md",
                      (location.pathname === item.href || 
                       location.pathname.startsWith(`/${language}/about`) || 
                       location.pathname.startsWith(`/${language}/members`))
                        ? "text-primary bg-accent"
                        : "text-foreground",
                      isRTL && "text-right"
                    )}>
                      {item.name}
                    </div>
                    <div className={cn("pl-4 space-y-1", isRTL && "pr-4 pl-0")}>
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "block px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            location.pathname === subItem.href.split('#')[0] || 
                            location.pathname.startsWith(subItem.href.split('#')[0] + '/')
                              ? "text-primary bg-accent"
                              : "text-foreground hover:text-primary hover:bg-accent/50",
                            isRTL && "text-right"
                          )}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-2 text-sm font-semibold rounded-md transition-colors",
                    location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                      ? "text-primary bg-accent"
                      : "text-foreground hover:text-primary hover:bg-accent/50",
                    isRTL && "text-right"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
