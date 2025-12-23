import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { useSettings, usePageContent } from '@/hooks/usePageContent';
import { cn } from '@/lib/utils';
import smcLogo from '@/assets/manganese/logo.png';
import whatsappIcon from '@/assets/manganese/icons8-whatsapp-logo-64.png';
import PhoneNumbers, { PhoneNumber } from '@/components/PhoneNumbers';

const Footer = () => {
  const { t, isRTL, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const settings = useSettings();
  const footerDescription = usePageContent('footer', 'description', t('footerDescription'));
  const quickLinks = usePageContent('footer', 'quickLinks', t('quickLinks'));
  const followUs = usePageContent('footer', 'followUs', t('followUs'));
  
  // Get phone numbers from settings
  const salesPhones: PhoneNumber[] = settings.phoneNumbersSales || [];
  const salesFax: PhoneNumber[] = settings.faxNumbersSales || [];
  const adminPhones: PhoneNumber[] = settings.phoneNumbersAdmin || [];
  const adminFax: PhoneNumber[] = settings.faxNumbersAdmin || [];
  const complaintsEmail = settings.complaintsEmail || settings.email || 'info1@smc-eg.com';

  const footerNavigation = [
    { name: t('home'), href: getLocalizedLink('/', language) },
    { name: t('about'), href: getLocalizedLink('/about', language) },
    { name: t('products'), href: getLocalizedLink('/products', language) },
    { name: t('news'), href: getLocalizedLink('/news', language) },
  ];

  return (
    <footer className="bg-[#204393] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_55%)]" />
        </div>
        <div className="relative container mx-auto px-4 py-14">
          <div className={cn('grid gap-10 lg:grid-cols-4', isRTL && 'text-right')}>
            {/* Column 1: Phone Numbers */}
            <div>
              {/* Sales Numbers Section */}
              {(salesPhones.length > 0 || salesFax.length > 0) && (
                <>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-white/90">
                    {isRTL ? 'أرقام المبيعات' : 'Sales Numbers'}
                  </h3>
                  <div className="mb-4">
                    {salesPhones.length > 0 && <PhoneNumbers phones={salesPhones} />}
                    {salesFax.length > 0 && (
                      <div className="mt-3">
                        <PhoneNumbers phones={salesFax} showLabels />
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {/* Administration Numbers Section */}
              {(adminPhones.length > 0 || adminFax.length > 0) && (
                <>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-white/90">
                    {isRTL ? 'أرقام الإدارة' : 'Administration Numbers'}
                  </h3>
                  <div className="mb-4">
                    {adminPhones.length > 0 && <PhoneNumbers phones={adminPhones} />}
                    {adminFax.length > 0 && (
                      <div className="mt-3">
                        <PhoneNumbers phones={adminFax} showLabels />
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {/* Complaints Email */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <a 
                  href={`mailto:${complaintsEmail}`} 
                  className={cn('flex items-center gap-3 text-white/70 hover:text-white transition', isRTL && 'flex-row-reverse')}
                >
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{complaintsEmail}</span>
                  <span className="text-xs text-white/50">({isRTL ? 'للشكاوى' : 'For Complaints'})</span>
                </a>
              </div>
            </div>

            {/* Column 2: Logo and Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={smcLogo} alt="Sinai Manganese Co." className="h-14 w-auto object-contain drop-shadow-xl" />
                <div>
                  <p className="text-xl font-semibold">{settings.siteName}</p>
                  <p className="text-xs text-white/70">Since 1957</p>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{footerDescription}</p>
            </div>

            {/* Column 3: Navigation Links */}
            <div>
              <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.4em] text-white/90">
                {quickLinks}
              </h3>
              <div className="space-y-3">
                {footerNavigation.map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.href} 
                    className="block text-white/70 hover:text-white transition"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 4: Social Media Icons with Names */}
            <div>
              <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.4em] text-white/90">
                {followUs}
              </h3>
              <div className="space-y-4">
                {settings.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn('flex items-center gap-3 text-white/70 hover:text-white transition', isRTL && 'flex-row-reverse')}
                  >
                    <Facebook className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Facebook</span>
                  </a>
                )}
                <a
                  href="https://wa.me/201282055059"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('flex items-center gap-3 text-white/70 hover:text-white transition', isRTL && 'flex-row-reverse')}
                >
                  <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5 object-contain flex-shrink-0" />
                  <span>WhatsApp</span>
                </a>
                {settings.linkedin && (
                  <a
                    href={settings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn('flex items-center gap-3 text-white/70 hover:text-white transition', isRTL && 'flex-row-reverse')}
                  >
                    <Linkedin className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between">
            <p>© {currentYear} {settings.siteName}. {t('allRightsReserved')}. {isRTL ? 'صمم بواسطة' : 'Designed by'} <a href="https://qeematech.com" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">QeemaTech</a></p>
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-white/40">
              <span>{t('contactHeadOfficeLabel')}</span>
              <span>{quickLinks}</span>
              <span>{followUs}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
