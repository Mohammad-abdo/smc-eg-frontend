import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PageContent {
  [key: string]: {
    en: { [key: string]: string };
    ar: { [key: string]: string };
  };
}

const defaultContent: PageContent = {
  home: {
    en: {
      heroTitle: "Sinai Manganese Co.",
      heroSubtitle: "First and Largest Producer of Manganese Ore in Egypt",
      heroDescription:
        "Sinai Manganese Co. SMC was founded on May 18th, 1957, to exploit the manganese deposits in Sinai Peninsula, Egypt.",
      productsSectionLabel: "Our Products",
      productsSectionTitle: "Industrial & Mining Products",
      productsSectionSubtitle: "High-quality products for various industries",
      industrialProducts: "Industrial Products",
      industrialProductsDescription: "Products for industrial applications",
      miningProducts: "Mining Products",
      miningProductsDescription: "Raw materials and minerals",
    },
    ar: {
      heroTitle: "شركة سيناء للمنجنيز",
      heroSubtitle: "أول وأكبر منتج لخام المنجنيز في مصر",
      heroDescription:
        "تأسست شركة سيناء للمنجنيز في 18 مايو 1957 لاستغلال رواسب المنجنيز في شبه جزيرة سيناء، مصر.",
      productsSectionLabel: "منتجاتنا",
      productsSectionTitle: "المنتجات الصناعية والتعدينية",
      productsSectionSubtitle: "منتجات عالية الجودة لمختلف الصناعات",
      industrialProducts: "المنتجات الصناعية",
      industrialProductsDescription: "منتجات للتطبيقات الصناعية",
      miningProducts: "منتجات التعدين",
      miningProductsDescription: "المواد الخام والمعادن",
    },
  },
  footer: {
    en: {
      description:
        "Sinai Manganese Co. is Egypt's first and largest manganese ore producer.",
      quickLinks: "Quick Links",
      contactInfo: "Contact Information",
      followUs: "Follow Us",
      copyright: "© 2024 Sinai Manganese Co. All rights reserved.",
    },
    ar: {
      description:
        "شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر.",
      quickLinks: "روابط سريعة",
      contactInfo: "معلومات الاتصال",
      followUs: "تابعنا",
      copyright: "© 2024 شركة سيناء للمنجنيز. جميع الحقوق محفوظة.",
    },
  },
};

export const usePageContent = (
  page: string,
  key: string,
  fallback?: string,
): string => {
  const { language } = useLanguage();
  const [content, setContent] = useState<PageContent>(defaultContent);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === "undefined") return;

    // Load content from backend
    const loadContent = async () => {
      try {
        const { pageContentAPI } = await import("@/services/api");
        const allContent = await pageContentAPI.getAll();

        // Convert array to object structure
        const contentObj: PageContent = {};
        allContent.forEach((item) => {
          if (!contentObj[item.page]) {
            contentObj[item.page] = { en: {}, ar: {} };
          }
          if (item.valueEn !== null) {
            contentObj[item.page].en[item.key] = item.valueEn;
          }
          if (item.valueAr !== null) {
            contentObj[item.page].ar[item.key] = item.valueAr;
          }
        });

        // Merge with defaults
        setContent({ ...defaultContent, ...contentObj });

        // Also save to localStorage for offline access
        localStorage.setItem("pageContent", JSON.stringify(contentObj));
      } catch (error) {
        console.error("Error loading page content from backend:", error);
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem("pageContent");
          if (saved) {
            const parsed = JSON.parse(saved);
            setContent({ ...defaultContent, ...parsed });
          }
        } catch (e) {
          console.error("Error parsing pageContent:", e);
          setContent(defaultContent);
        }
      }
    };

    loadContent();
  }, []);

  // Listen for changes in localStorage and custom events
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("pageContent");
        if (saved) {
          const parsed = JSON.parse(saved);
          setContent({ ...defaultContent, ...parsed });
        }
      } catch (error) {
        console.error("Error parsing pageContent:", error);
      }
    };

    const handlePageContentUpdate = async () => {
      // Refetch from backend when content is updated
      try {
        const { pageContentAPI } = await import("@/services/api");
        const allContent = await pageContentAPI.getAll();

        const contentObj: PageContent = {};
        allContent.forEach((item) => {
          if (!contentObj[item.page]) {
            contentObj[item.page] = { en: {}, ar: {} };
          }
          if (item.valueEn !== null) {
            contentObj[item.page].en[item.key] = item.valueEn;
          }
          if (item.valueAr !== null) {
            contentObj[item.page].ar[item.key] = item.valueAr;
          }
        });

        setContent({ ...defaultContent, ...contentObj });
        localStorage.setItem("pageContent", JSON.stringify(contentObj));
      } catch (error) {
        console.error("Error refetching page content:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("pageContentUpdated", handlePageContentUpdate);

    // Check periodically for changes (in case of same-tab updates)
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem("pageContent");
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
        console.error("Error parsing pageContent:", error);
      }
    }, 5000); // Check every 5 seconds

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("pageContentUpdated", handlePageContentUpdate);
      clearInterval(interval);
    };
  }, []);

  const pageContent = content[page];
  if (!pageContent) return fallback || key;

  const langContent = pageContent[language] || pageContent.en;
  return langContent[key] || fallback || key;
};

const defaultSettings = {
  siteName: "Sinai Manganese Co.",
  siteNameAr: "شركة سيناء للمنجنيز",
  email: "info@smc-eg.com",
  phone: "25740005 / 25740217",
  address: "Abu Zenima – South Sinai, Egypt",
  addressAr: "أبو زنيمة – جنوب سيناء، مصر",
  cairoAddress: "1 Kasr El-Nile St., Cairo – Egypt",
  cairoAddressAr: "1 شارع قصر النيل، القاهرة – مصر",
  description:
    "Sinai Manganese Co. is Egypt's first and largest manganese ore producer.",
  descriptionAr: "شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر.",
  facebook: "https://www.facebook.com/share/p/1QWB8WE7ZS/",
  twitter: "",
  linkedin: "",
};

export const useSettings = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<any>(defaultSettings);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === "undefined") return;

    // Try to fetch from backend first
    const fetchSettings = async () => {
      try {
        const { settingsAPI } = await import("@/services/api");
        const allSettings = await settingsAPI.getAll();

        // Convert settings array to object
        const settingsObj: any = {};
        allSettings.forEach((setting: any) => {
          settingsObj[setting.key] = setting;
        });

        // Parse phone numbers
        const parsePhoneNumbers = (key: string): any[] => {
          const setting = settingsObj[key];
          if (!setting) return [];

          let value = setting.valueEn || setting.valueAr;
          if (!value) return [];

          try {
            let parsed = typeof value === "string" ? JSON.parse(value) : value;

            if (typeof parsed === "string") {
              parsed = JSON.parse(parsed);
            }

            return Array.isArray(parsed)
              ? parsed
              : [{ number: value, label: "" }];
          } catch (e) {
            console.error("Parsing error for key:", key, e);
            return [{ number: value, label: "" }];
          }
        };

        const newSettings = {
          siteName:
            settingsObj.company_name?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.siteName,
          siteNameAr:
            settingsObj.company_name?.valueAr || defaultSettings.siteNameAr,
          email:
            settingsObj.company_email?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.email,
          phone:
            settingsObj.company_phone?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.phone,
          address:
            settingsObj.company_address?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.address,
          addressAr:
            settingsObj.company_address?.valueAr || defaultSettings.addressAr,
          cairoAddress:
            settingsObj.company_address_cairo?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.cairoAddress,
          cairoAddressAr:
            settingsObj.company_address_cairo?.valueAr ||
            defaultSettings.cairoAddressAr,
          description:
            settingsObj.company_description?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || defaultSettings.description,
          descriptionAr:
            settingsObj.company_description?.valueAr ||
            defaultSettings.descriptionAr,
          facebook:
            settingsObj.facebook_url?.valueEn || defaultSettings.facebook,
          twitter: settingsObj.twitter_url?.valueEn || defaultSettings.twitter,
          linkedin:
            settingsObj.linkedin_url?.valueEn || defaultSettings.linkedin,
          phoneNumbersSales: parsePhoneNumbers("phone_numbers_sales"),
          faxNumbersSales: parsePhoneNumbers("fax_numbers_sales"),
          phoneNumbersAdmin: parsePhoneNumbers("phone_numbers_admin"),
          faxNumbersAdmin: parsePhoneNumbers("fax_numbers_admin"),
          complaintsEmail:
            settingsObj.complaints_email?.[
              language === "ar" ? "valueAr" : "valueEn"
            ] || "",
        };

        setSettings(newSettings);
        // Also save to localStorage for offline access
        localStorage.setItem("siteSettings", JSON.stringify(newSettings));
      } catch (error) {
        console.error("Error fetching settings from backend:", error);
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem("siteSettings");
          if (saved) {
            const parsed = JSON.parse(saved);
            setSettings({ ...defaultSettings, ...parsed });
          }
        } catch (e) {
          console.error("Error parsing siteSettings:", e);
          setSettings(defaultSettings);
        }
      }
    };

    fetchSettings();
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("siteSettings");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsed });
        }
      } catch (error) {
        console.error("Error parsing siteSettings:", error);
      }
    };

    const handleSettingsUpdate = () => {
      // Refetch from backend when settings are updated
      const fetchSettings = async () => {
        try {
          const { settingsAPI } = await import("@/services/api");
          const allSettings = await settingsAPI.getAll();
          const settingsObj: any = {};
          allSettings.forEach((setting: any) => {
            settingsObj[setting.key] = setting;
          });

          const parsePhoneNumbers = (key: string): any[] => {
            const setting = settingsObj[key];
            if (!setting) return [];
            const value = language === "ar" ? setting.valueAr : setting.valueEn;
            if (!value) return [];
            try {
              return JSON.parse(value);
            } catch {
              return [];
            }
          };

          const newSettings = {
            siteName:
              settingsObj.company_name?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.siteName,
            siteNameAr:
              settingsObj.company_name?.valueAr || defaultSettings.siteNameAr,
            email:
              settingsObj.company_email?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.email,
            phone:
              settingsObj.company_phone?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.phone,
            address:
              settingsObj.company_address?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.address,
            addressAr:
              settingsObj.company_address?.valueAr || defaultSettings.addressAr,
            cairoAddress:
              settingsObj.company_address_cairo?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.cairoAddress,
            cairoAddressAr:
              settingsObj.company_address_cairo?.valueAr ||
              defaultSettings.cairoAddressAr,
            description:
              settingsObj.company_description?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || defaultSettings.description,
            descriptionAr:
              settingsObj.company_description?.valueAr ||
              defaultSettings.descriptionAr,
            facebook:
              settingsObj.facebook_url?.valueEn || defaultSettings.facebook,
            twitter:
              settingsObj.twitter_url?.valueEn || defaultSettings.twitter,
            linkedin:
              settingsObj.linkedin_url?.valueEn || defaultSettings.linkedin,
            phoneNumbersSales: parsePhoneNumbers("phone_numbers_sales"),
            faxNumbersSales: parsePhoneNumbers("fax_numbers_sales"),
            phoneNumbersAdmin: parsePhoneNumbers("phone_numbers_admin"),
            faxNumbersAdmin: parsePhoneNumbers("fax_numbers_admin"),
            complaintsEmail:
              settingsObj.complaints_email?.[
                language === "ar" ? "valueAr" : "valueEn"
              ] || "",
          };

          setSettings(newSettings);
          localStorage.setItem("siteSettings", JSON.stringify(newSettings));
        } catch (error) {
          console.error("Error refetching settings:", error);
        }
      };
      fetchSettings();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("settingsUpdated", handleSettingsUpdate);

    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem("siteSettings");
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
        console.error("Error parsing siteSettings:", error);
      }
    }, 5000); // Check every 5 seconds instead of 1

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
      clearInterval(interval);
    };
  }, [language]);

  // Ensure settings is always defined
  const safeSettings = settings || defaultSettings;

  return {
    siteName:
      language === "ar"
        ? safeSettings.siteNameAr || defaultSettings.siteNameAr
        : safeSettings.siteName || defaultSettings.siteName,
    email: safeSettings.email || defaultSettings.email,
    phone: safeSettings.phone || defaultSettings.phone,
    address:
      language === "ar"
        ? safeSettings.addressAr || defaultSettings.addressAr
        : safeSettings.address || defaultSettings.address,
    cairoAddress:
      language === "ar"
        ? safeSettings.cairoAddressAr || defaultSettings.cairoAddressAr
        : safeSettings.cairoAddress || defaultSettings.cairoAddress,
    description:
      language === "ar"
        ? safeSettings.descriptionAr || defaultSettings.descriptionAr
        : safeSettings.description || defaultSettings.description,
    facebook: safeSettings.facebook || defaultSettings.facebook,
    twitter: safeSettings.twitter || defaultSettings.twitter,
    linkedin: safeSettings.linkedin || defaultSettings.linkedin,
    phoneNumbersSales: safeSettings.phoneNumbersSales || [],
    faxNumbersSales: safeSettings.faxNumbersSales || [],
    phoneNumbersAdmin: safeSettings.phoneNumbersAdmin || [],
    faxNumbersAdmin: safeSettings.faxNumbersAdmin || [],
    complaintsEmail: safeSettings.complaintsEmail || "",
  };
};
