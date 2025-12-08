import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageContent {
  [key: string]: {
    en: { [key: string]: string };
    ar: { [key: string]: string };
  };
}

const defaultContent: PageContent = {
  home: {
    en: {
      heroTitle: 'Sinai Manganese Co.',
      heroSubtitle: 'First and Largest Producer of Manganese Ore in Egypt',
      heroDescription: 'Sinai Manganese Co. SMC was founded on May 18th, 1957, to exploit the manganese deposits in Sinai Peninsula, Egypt.',
      productsSectionLabel: 'Our Products',
      productsSectionTitle: 'Industrial & Mining Products',
      productsSectionSubtitle: 'High-quality products for various industries',
      industrialProducts: 'Industrial Products',
      industrialProductsDescription: 'Products for industrial applications',
      miningProducts: 'Mining Products',
      miningProductsDescription: 'Raw materials and minerals',
    },
    ar: {
      heroTitle: 'شركة سيناء للمنجنيز',
      heroSubtitle: 'أول وأكبر منتج لخام المنجنيز في مصر',
      heroDescription: 'تأسست شركة سيناء للمنجنيز في 18 مايو 1957 لاستغلال رواسب المنجنيز في شبه جزيرة سيناء، مصر.',
      productsSectionLabel: 'منتجاتنا',
      productsSectionTitle: 'المنتجات الصناعية والتعدينية',
      productsSectionSubtitle: 'منتجات عالية الجودة لمختلف الصناعات',
      industrialProducts: 'المنتجات الصناعية',
      industrialProductsDescription: 'منتجات للتطبيقات الصناعية',
      miningProducts: 'منتجات التعدين',
      miningProductsDescription: 'المواد الخام والمعادن',
    },
  },
  footer: {
    en: {
      description: 'Sinai Manganese Co. is Egypt\'s first and largest manganese ore producer.',
      quickLinks: 'Quick Links',
      contactInfo: 'Contact Information',
      followUs: 'Follow Us',
      copyright: '© 2024 Sinai Manganese Co. All rights reserved.',
    },
    ar: {
      description: 'شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر.',
      quickLinks: 'روابط سريعة',
      contactInfo: 'معلومات الاتصال',
      followUs: 'تابعنا',
      copyright: '© 2024 شركة سيناء للمنجنيز. جميع الحقوق محفوظة.',
    },
  },
};

export const usePageContent = (page: string, key: string, fallback?: string): string => {
  const { language } = useLanguage();
  const [content, setContent] = useState<PageContent>(defaultContent);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    // Load saved content from localStorage
    try {
      const saved = localStorage.getItem('pageContent');
      if (saved) {
        const parsed = JSON.parse(saved);
        setContent({ ...defaultContent, ...parsed });
      }
    } catch (error) {
      console.error('Error parsing pageContent:', error);
      // Use default content on error
      setContent(defaultContent);
    }
  }, []);

  // Listen for changes in localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('pageContent');
        if (saved) {
          const parsed = JSON.parse(saved);
          setContent({ ...defaultContent, ...parsed });
        }
      } catch (error) {
        console.error('Error parsing pageContent:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check periodically for changes (in case of same-tab updates)
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem('pageContent');
        if (saved) {
          const parsed = JSON.parse(saved);
          setContent((prevContent) => {
            const newContent = { ...defaultContent, ...parsed };
            const currentStr = JSON.stringify(prevContent);
            const newStr = JSON.stringify(newContent);
            if (currentStr !== newStr) {
              return newContent;
            }
            return prevContent;
          });
        }
      } catch (error) {
        console.error('Error parsing pageContent:', error);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const pageContent = content[page];
  if (!pageContent) return fallback || key;

  const langContent = pageContent[language] || pageContent.en;
  return langContent[key] || fallback || key;
};

const defaultSettings = {
  siteName: 'Sinai Manganese Co.',
  siteNameAr: 'شركة سيناء للمنجنيز',
  email: 'info@smc-eg.com',
  phone: '25740005 / 25740217',
  address: 'Abu Zenima – South Sinai, Egypt',
  addressAr: 'أبو زنيمة – جنوب سيناء، مصر',
  cairoAddress: '1 Kasr El-Nile St., Cairo – Egypt',
  cairoAddressAr: '1 شارع قصر النيل، القاهرة – مصر',
  description: 'Sinai Manganese Co. is Egypt\'s first and largest manganese ore producer.',
  descriptionAr: 'شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر.',
  facebook: 'https://www.facebook.com/share/p/1QWB8WE7ZS/',
  twitter: '',
  linkedin: '',
};

export const useSettings = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<any>(defaultSettings);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem('siteSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Error parsing siteSettings:', error);
      setSettings(defaultSettings);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('siteSettings');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsed });
        }
      } catch (error) {
        console.error('Error parsing siteSettings:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem('siteSettings');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings((prevSettings) => {
            const newSettings = { ...defaultSettings, ...parsed };
            const currentStr = JSON.stringify(prevSettings);
            const newStr = JSON.stringify(newSettings);
            if (currentStr !== newStr) {
              return newSettings;
            }
            return prevSettings;
          });
        }
      } catch (error) {
        console.error('Error parsing siteSettings:', error);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Ensure settings is always defined
  const safeSettings = settings || defaultSettings;

  return {
    siteName: language === 'ar' ? (safeSettings.siteNameAr || defaultSettings.siteNameAr) : (safeSettings.siteName || defaultSettings.siteName),
    email: safeSettings.email || defaultSettings.email,
    phone: safeSettings.phone || defaultSettings.phone,
    address: language === 'ar' ? (safeSettings.addressAr || defaultSettings.addressAr) : (safeSettings.address || defaultSettings.address),
    cairoAddress: language === 'ar' ? (safeSettings.cairoAddressAr || defaultSettings.cairoAddressAr) : (safeSettings.cairoAddress || defaultSettings.cairoAddress),
    description: language === 'ar' ? (safeSettings.descriptionAr || defaultSettings.descriptionAr) : (safeSettings.description || defaultSettings.description),
    facebook: safeSettings.facebook || defaultSettings.facebook,
    twitter: safeSettings.twitter || defaultSettings.twitter,
    linkedin: safeSettings.linkedin || defaultSettings.linkedin,
  };
};

