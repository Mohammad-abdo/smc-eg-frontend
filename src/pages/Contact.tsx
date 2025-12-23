import { useState } from 'react';
import { MapPin, Mail, Clock, Building, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/hooks/usePageContent';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import heroSlideOne from '@/assets/manganese/one.jpeg';
import mnFacility from '@/assets/manganese/portfolio14.jpg';
import PhoneNumbers from '@/components/PhoneNumbers';

const Contact = () => {
  const { t, isRTL, language } = useLanguage();
  const settings = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  // Combine all phone numbers for display
  const allPhones = [
    ...(settings.phoneNumbersSales || []),
    ...(settings.faxNumbersSales || []),
    ...(settings.phoneNumbersAdmin || []),
    ...(settings.faxNumbersAdmin || []),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(language === 'ar' 
      ? 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.' 
      : 'Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { 
      icon: MapPin, 
      label: t('contactHeadOfficeLabel'), 
      value: settings.address || t('contactHeadOfficeValue'),
      isPhoneSection: false
    },
    { 
      icon: Mail, 
      label: t('contactEmailLabel'), 
      value: settings.email || 'info@smc-eg.com',
      isPhoneSection: false
    },
    { 
      icon: Clock, 
      label: language === 'ar' ? 'ساعات العمل' : 'Working Hours', 
      value: language === 'ar' ? 'الأحد - الخميس · 8:00 صباحاً - 5:00 مساءً' : 'Sun - Thu · 8:00 AM - 5:00 PM',
      isPhoneSection: false
    },
  ];

  const highlights = [
    { title: t('contactHighlight1Title'), subtitle: t('contactHighlight1Subtitle') },
    { title: t('contactHighlight2Title'), subtitle: t('contactHighlight2Subtitle') },
    { title: t('contactHighlight3Title'), subtitle: t('contactHighlight3Subtitle') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-[#204393] text-white">
        <img src={heroSlideOne} alt="SMC facility" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#204393] via-[#0f2566] to-transparent" />
        <div className="relative container mx-auto flex flex-col gap-10 px-4 py-32 lg:flex-row lg:items-center">
          <div className={cn('space-y-6 max-w-2xl', isRTL && 'text-right ml-auto')}>
            <p className="text-sm uppercase tracking-[0.4em] text-white/70">{t('contactSubtitle')}</p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{t('contactUs')}</h1>
            <p className="text-white/80 text-lg">{t('contactHeroBody')}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/30 bg-white/10 p-4 text-center">
                  <p className="text-2xl font-semibold">{item.title}</p>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/70">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-md rounded-[32px] border border-white/30 bg-white/10 p-8 backdrop-blur">
            <div className="space-y-4 text-sm text-white/80">
              {contactInfo.map((item, idx) => (
                <div
                  key={idx}
                  className={cn('flex gap-4 rounded-2xl border border-white/20 bg-white/5 p-4', isRTL && 'flex-row-reverse text-right')}
                >
                  <item.icon className="h-5 w-5 text-white flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-1">{item.label}</p>
                    <p className="text-base">{item.value}</p>
                  </div>
                </div>
              ))}
              {allPhones.length > 0 && (
                <div className={cn('rounded-2xl border border-white/20 bg-white/5 p-4', isRTL && 'text-right')}>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-3">
                    {language === 'ar' ? 'أرقام الهاتف والفاكس' : 'Phone & Fax Numbers'}
                  </p>
                  <PhoneNumbers 
                    phones={allPhones} 
                    className="space-y-2"
                    textClassName="text-white/80"
                    showLabels={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-16 pb-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Card className="rounded-[32px] border border-border shadow-2xl">
            <CardContent className="p-10">
              <div className={cn('mb-8 space-y-2', isRTL && 'text-right')}>
                <p className="text-sm uppercase tracking-[0.4em] text-primary">{t('contactFormSectionLabel')}</p>
                <h2 className="text-3xl font-semibold">{t('contactFormTitle')}</h2>
              </div>
              <form onSubmit={handleSubmit} className={cn('space-y-6', isRTL && 'text-right')}>
                <div className={cn('grid gap-4 sm:grid-cols-2', isRTL && 'text-right')}>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {t('name')}
                    </label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {t('email')}
                    </label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    {t('phone')}
                  </label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {t('message')}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#204393] text-white hover:bg-[#1b356f]"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {t('send')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[32px] border border-border shadow-xl">
              <CardContent className="space-y-4 p-8">
                <div className="flex items-center gap-3 text-primary">
                  <Building className="h-5 w-5" />
                  <p className="text-sm uppercase tracking-[0.4em]">{t('contactFactoryLabel')}</p>
                </div>
                <p className="text-lg font-semibold text-foreground">{t('contactFactoryTitle')}</p>
                <p className="text-sm text-muted-foreground">{t('contactFactoryDescription')}</p>
                <img
                  src={mnFacility}
                  alt="Abu Zenima industrial facility"
                  className="h-48 w-full rounded-2xl object-cover"
                />
              </CardContent>
            </Card>
            <Card className="rounded-[32px] border border-border shadow-xl">
              <CardContent className="space-y-4 p-8">
                <h3 className="text-lg font-semibold">{t('contactProcessTitle')}</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li>• {t('contactProcessStep1')}</li>
                  <li>• {t('contactProcessStep2')}</li>
                  <li>• {t('contactProcessStep3')}</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
