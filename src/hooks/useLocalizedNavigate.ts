import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Hook for navigation with language prefix support
 * Automatically adds language prefix to paths
 */
export const useLocalizedNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ lang?: string }>();
  const { language } = useLanguage();

  // Get current language from URL or context
  const currentLang = params.lang || language;

  /**
   * Get localized path (adds language prefix if not already present)
   */
  const getLocalizedPath = (path: string): string => {
    // Remove leading slash
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Skip language prefix for dashboard and login routes
    if (cleanPath.startsWith('dashboard') || cleanPath.startsWith('login')) {
      return `/${cleanPath}`;
    }

    // If path already has language prefix, return as is
    if (cleanPath.startsWith('ar/') || cleanPath.startsWith('en/')) {
      return `/${cleanPath}`;
    }

    // Add language prefix
    return `/${currentLang}/${cleanPath}`;
  };

  /**
   * Navigate to a localized path
   */
  const localizedNavigate = (path: string, options?: { replace?: boolean; state?: any }) => {
    const localizedPath = getLocalizedPath(path);
    navigate(localizedPath, options);
  };

  /**
   * Get current path without language prefix
   */
  const getPathWithoutLang = (): string => {
    const path = location.pathname;
    if (path.startsWith('/ar/') || path.startsWith('/en/')) {
      return path.slice(4); // Remove '/ar/' or '/en/'
    }
    // Dashboard and login routes don't have language prefix
    if (path.startsWith('/dashboard') || path.startsWith('/login')) {
      return path;
    }
    return path;
  };

  return {
    navigate: localizedNavigate,
    getLocalizedPath,
    getPathWithoutLang,
    currentLang,
  };
};

/**
 * Component for localized Link
 */
export const getLocalizedLink = (path: string, lang: string = 'en'): string => {
  // Skip language prefix for dashboard and login routes
  if (path.startsWith('/dashboard') || path.startsWith('/login')) {
    return path;
  }

  // If path already has language prefix, replace it
  if (path.startsWith('/ar/') || path.startsWith('/en/')) {
    return `/${lang}${path.slice(3)}`;
  }

  // Add language prefix
  return `/${lang}${path}`;
};

