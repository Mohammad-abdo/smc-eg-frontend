import { useState, useEffect } from 'react';
import { Save, FileText, Globe, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PageContent {
  [key: string]: {
    en: { [key: string]: string };
    ar: { [key: string]: string };
  };
}

const PageContentEditor = () => {
  const { t, isRTL } = useLanguage();
  const [selectedPage, setSelectedPage] = useState('home');
  const [content, setContent] = useState<PageContent>({
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
        clientsSectionLabel: 'Our Clients',
        clientsSectionTitle: 'Our Success Partners',
        clientsSectionDescription: 'We are proud of our partnerships with industry-leading companies',
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
        clientsSectionLabel: 'عملاؤنا',
        clientsSectionTitle: 'شركاؤنا في النجاح',
        clientsSectionDescription: 'نفتخر بشراكاتنا مع الشركات الرائدة في الصناعة',
      },
    },
    about: {
      en: {
        title: 'About Us',
        description: 'SMC produces both high and low grades of manganese ore and operates an electrical furnace at Abu-Zinima, Sinai.',
        mission: 'Our Mission',
        missionText: 'To be the leading producer of manganese products in Egypt and the region.',
        vision: 'Our Vision',
        visionText: 'To expand our operations and serve more industries globally.',
        values: 'Our Values',
        valuesText: 'Quality, Innovation, Sustainability, and Excellence.',
      },
      ar: {
        title: 'من نحن',
        description: 'تنتج شركة سيناء للمنجنيز درجات عالية ومنخفضة من خام المنجنيز وتدير فرناً كهربائياً في أبو زنيمة، سيناء.',
        mission: 'مهمتنا',
        missionText: 'أن نكون المنتج الرائد لمنتجات المنجنيز في مصر والمنطقة.',
        vision: 'رؤيتنا',
        visionText: 'توسيع عملياتنا وخدمة المزيد من الصناعات عالمياً.',
        values: 'قيمنا',
        valuesText: 'الجودة، الابتكار، الاستدامة، والتميز.',
      },
    },
    contact: {
      en: {
        title: 'Contact Us',
        subtitle: 'Get in touch with us',
        formTitle: 'Send us a message',
        formSubtitle: 'We will get back to you as soon as possible',
        nameLabel: 'Name',
        emailLabel: 'Email',
        messageLabel: 'Message',
        submitButton: 'Send Message',
      },
      ar: {
        title: 'اتصل بنا',
        subtitle: 'تواصل معنا',
        formTitle: 'أرسل لنا رسالة',
        formSubtitle: 'سنتواصل معك في أقرب وقت ممكن',
        nameLabel: 'الاسم',
        emailLabel: 'البريد الإلكتروني',
        messageLabel: 'الرسالة',
        submitButton: 'إرسال الرسالة',
      },
    },
    footer: {
      en: {
        description: 'Sinai Manganese Co. is Egypt\'s first and largest manganese ore producer.',
        quickLinks: 'Quick Links',
        contactInfo: 'Contact Information',
        contactTitle: 'Contact Information',
        salesNumbersTitle: 'Sales Numbers',
        salesNumber2: '01033528821',
        salesNumber3: '01099791439',
        followUs: 'Follow Us',
        copyright: '© 2024 Sinai Manganese Co. All rights reserved.',
      },
      ar: {
        description: 'شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر.',
        quickLinks: 'روابط سريعة',
        contactInfo: 'معلومات الاتصال',
        contactTitle: 'معلومات الاتصال',
        salesNumbersTitle: 'أرقام المبيعات',
        salesNumber2: '01033528821',
        salesNumber3: '01099791439',
        followUs: 'تابعنا',
        copyright: '© 2024 شركة سيناء للمنجنيز. جميع الحقوق محفوظة.',
      },
    },
  });

  const [editingKey, setEditingKey] = useState<{ page: string; lang: string; key: string } | null>(null);
  const [newKeyName, setNewKeyName] = useState('');

  useEffect(() => {
    // Load saved content
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('pageContent');
    if (saved) {
      setContent(JSON.parse(saved));
    }
  }, []);

  const pages = [
    { value: 'home', label: 'Home Page' },
    { value: 'about', label: 'About Page' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'footer', label: 'Footer' },
    { value: 'products', label: 'Products Page' },
    { value: 'news', label: 'News Page' },
  ];

  const handleSave = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('pageContent', JSON.stringify(content));
    // Trigger storage event to update all components
    window.dispatchEvent(new Event('storage'));
    toast.success('Content saved successfully');
  };

  const handleAddField = (page: string, lang: string) => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a field name');
      return;
    }
    
    const key = newKeyName.trim();
    setContent({
      ...content,
      [page]: {
        ...content[page],
        [lang]: {
          ...content[page][lang],
          [key]: '',
        },
      },
    });
    setNewKeyName('');
    toast.success('Field added');
  };

  const handleDeleteField = (page: string, lang: string, key: string) => {
    const newContent = { ...content };
    delete newContent[page][lang][key];
    setContent(newContent);
    toast.success('Field deleted');
  };

  const currentContent = content[selectedPage] || { en: {}, ar: {} };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">{t('pageContent') || 'Page Content'}</h2>
          <p className="text-white/70 mt-1">{t('editPageContent') || 'Edit content for all pages'}</p>
        </div>
        <Button onClick={handleSave} className="bg-[#204393] hover:bg-[#1b356f] text-white">
          <Save className="h-4 w-4 mr-2" />
          {t('saveAll') || 'Save All'}
        </Button>
      </div>

      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Label className="text-white">{t('selectPage') || 'Select Page'}</Label>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger className="w-64 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2744] border-white/20">
                {pages.map((page) => (
                  <SelectItem key={page.value} value={page.value} className="text-white">
                    {page.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en" className="space-y-4">
            <TabsList className="backdrop-blur-xl bg-white/10 border-white/20">
              <TabsTrigger value="en" className="text-white data-[state=active]:bg-[#204393]">
                <Globe className="h-4 w-4 mr-2" />
                English
              </TabsTrigger>
              <TabsTrigger value="ar" className="text-white data-[state=active]:bg-[#204393]">
                <Globe className="h-4 w-4 mr-2" />
                العربية
              </TabsTrigger>
            </TabsList>

            {(['en', 'ar'] as const).map((lang) => (
              <TabsContent key={lang} value={lang} className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(currentContent[lang] || {}).map(([key, value]) => (
                    <div key={key} className="space-y-2 p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label className="text-white font-medium">{key}</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteField(selectedPage, lang, key)}
                          className="text-red-400 hover:bg-red-500/20 h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <Textarea
                        value={value}
                        onChange={(e) => {
                          setContent({
                            ...content,
                            [selectedPage]: {
                              ...content[selectedPage],
                              [lang]: {
                                ...currentContent[lang],
                                [key]: e.target.value,
                              },
                            },
                          });
                        }}
                        rows={3}
                        className="bg-white/10 border-white/20 text-white"
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  ))}

                  {/* Add New Field */}
                  <Card className="backdrop-blur-xl bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex gap-2">
                        <Input
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          placeholder={lang === 'ar' ? 'اسم الحقل الجديد' : 'New field name'}
                          className="bg-white/10 border-white/20 text-white flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddField(selectedPage, lang);
                            }
                          }}
                        />
                        <Button
                          onClick={() => handleAddField(selectedPage, lang)}
                          className="bg-[#204393] hover:bg-[#1b356f] text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {t('addField') || 'Add Field'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageContentEditor;
