import { useState, useEffect, useRef } from 'react';
import { Save, Globe, Mail, Phone, MapPin, Image as ImageIcon, Plus, X, Upload, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { t, isRTL } = useLanguage();
  const [settings, setSettings] = useState({
    siteName: 'Sinai Manganese Co.',
    siteNameAr: 'شركة سيناء للمنجنيز',
    email: 'info@smc-eg.com',
    phone: '25740005 / 25740217',
    address: 'Abu Zenima – South Sinai, Egypt',
    addressAr: 'أبو زنيمة – جنوب سيناء، مصر',
    cairoAddress: '1 Kasr El-Nile St., Cairo – Egypt',
    cairoAddressAr: '1 شارع قصر النيل، القاهرة – مصر',
    description: 'Sinai Manganese Co. is the first and largest manganese ore producer in Egypt.',
    descriptionAr: 'شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر.',
    facebook: 'https://www.facebook.com/share/p/1QWB8WE7ZS/',
    twitter: '',
    linkedin: '',
    clientLogos: [] as string[], // Array of base64 images
    phoneNumbersSales: [] as Array<{ number: string; type: 'phone' | 'fax'; label?: string }>,
    faxNumbersSales: [] as Array<{ number: string; type: 'phone' | 'fax'; label?: string }>,
    phoneNumbersAdmin: [] as Array<{ number: string; type: 'phone' | 'fax'; label?: string }>,
    faxNumbersAdmin: [] as Array<{ number: string; type: 'phone' | 'fax'; label?: string }>,
    complaintsEmail: 'info1@smc-eg.com',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    // Load settings from backend
    const loadSettings = async () => {
      try {
        const { settingsAPI } = await import('@/services/api');
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
          const value = setting.valueEn || setting.valueAr;
          if (!value) return [];
          try {
            return JSON.parse(value);
          } catch {
            return [];
          }
        };

        const loadedSettings = {
          siteName: settingsObj.company_name?.valueEn || 'Sinai Manganese Co.',
          siteNameAr: settingsObj.company_name?.valueAr || 'شركة سيناء للمنجنيز',
          email: settingsObj.company_email?.valueEn || 'info@smc-eg.com',
          phone: settingsObj.company_phone?.valueEn || '25740005 / 25740217',
          address: settingsObj.company_address?.valueEn || 'Abu Zenima – South Sinai, Egypt',
          addressAr: settingsObj.company_address?.valueAr || 'أبو زنيمة – جنوب سيناء، مصر',
          cairoAddress: settingsObj.company_address_cairo?.valueEn || '1 Kasr El-Nile St., Cairo – Egypt',
          cairoAddressAr: settingsObj.company_address_cairo?.valueAr || '1 شارع قصر النيل، القاهرة – مصر',
          description: settingsObj.company_description?.valueEn || 'Sinai Manganese Co. is the first and largest manganese ore producer in Egypt.',
          descriptionAr: settingsObj.company_description?.valueAr || 'شركة سيناء للمنجنيز هي أول وأكبر منتج لخام المنجنيز في مصر.',
          facebook: settingsObj.facebook_url?.valueEn || 'https://www.facebook.com/share/p/1QWB8WE7ZS/',
          twitter: settingsObj.twitter_url?.valueEn || '',
          linkedin: settingsObj.linkedin_url?.valueEn || '',
          phoneNumbersSales: parsePhoneNumbers('phone_numbers_sales'),
          faxNumbersSales: parsePhoneNumbers('fax_numbers_sales'),
          phoneNumbersAdmin: parsePhoneNumbers('phone_numbers_admin'),
          faxNumbersAdmin: parsePhoneNumbers('fax_numbers_admin'),
          complaintsEmail: settingsObj.complaints_email?.valueEn || 'info1@smc-eg.com',
          clientLogos: [] as string[],
        };

        setSettings(prev => ({ ...prev, ...loadedSettings }));
        localStorage.setItem('siteSettings', JSON.stringify(loadedSettings));
      } catch (error) {
        console.error('Error loading settings from backend:', error);
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem('siteSettings');
          if (saved) {
            const parsed = JSON.parse(saved);
            setSettings(prev => ({ ...prev, ...parsed, clientLogos: parsed.clientLogos || [] }));
          }
        } catch (e) {
          console.error('Error loading settings from localStorage:', e);
        }
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Save to backend
      const { settingsAPI } = await import('@/services/api');
      
      // Save all settings
      const settingsToSave = [
        { key: 'company_name', valueEn: settings.siteName, valueAr: settings.siteNameAr },
        { key: 'company_email', valueEn: settings.email, valueAr: settings.email },
        { key: 'company_phone', valueEn: settings.phone, valueAr: settings.phone },
        { key: 'company_address', valueEn: settings.address, valueAr: settings.addressAr },
        { key: 'company_address_cairo', valueEn: settings.cairoAddress, valueAr: settings.cairoAddressAr },
        { key: 'facebook_url', valueEn: settings.facebook, valueAr: settings.facebook },
        { key: 'twitter_url', valueEn: settings.twitter, valueAr: settings.twitter },
        { key: 'linkedin_url', valueEn: settings.linkedin, valueAr: settings.linkedin },
        { 
          key: 'phone_numbers_sales', 
          valueEn: JSON.stringify(settings.phoneNumbersSales), 
          valueAr: JSON.stringify(settings.phoneNumbersSales) 
        },
        { 
          key: 'fax_numbers_sales', 
          valueEn: JSON.stringify(settings.faxNumbersSales), 
          valueAr: JSON.stringify(settings.faxNumbersSales) 
        },
        { 
          key: 'phone_numbers_admin', 
          valueEn: JSON.stringify(settings.phoneNumbersAdmin), 
          valueAr: JSON.stringify(settings.phoneNumbersAdmin) 
        },
        { 
          key: 'fax_numbers_admin', 
          valueEn: JSON.stringify(settings.faxNumbersAdmin), 
          valueAr: JSON.stringify(settings.faxNumbersAdmin) 
        },
        { 
          key: 'complaints_email', 
          valueEn: settings.complaintsEmail, 
          valueAr: settings.complaintsEmail 
        },
      ];

      // Save each setting
      await Promise.all(settingsToSave.map(setting => 
        settingsAPI.createOrUpdate(setting.key, setting.valueEn, setting.valueAr)
      ));

      // Also save to localStorage for offline access
      localStorage.setItem('siteSettings', JSON.stringify(settings));
      
      // Trigger storage event to update all components
      window.dispatchEvent(new Event('storage'));
      // Trigger custom event for settings update
      window.dispatchEvent(new CustomEvent('settingsUpdated'));
      
      toast.success(isRTL ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(isRTL ? 'فشل في حفظ الإعدادات' : 'Failed to save settings');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(isRTL ? 'الملف المحدد ليس صورة' : 'Selected file is not an image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSettings(prev => ({
        ...prev,
        clientLogos: [...(prev.clientLogos || []), base64]
      }));
      toast.success(isRTL ? 'تم إضافة الصورة بنجاح' : 'Image added successfully');
    };
    reader.onerror = () => {
      toast.error(isRTL ? 'فشل في قراءة الصورة' : 'Failed to read image');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setSettings(prev => ({
      ...prev,
      clientLogos: prev.clientLogos.filter((_, i) => i !== index)
    }));
    toast.success(isRTL ? 'تم حذف الصورة' : 'Image removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">{t('settings') || 'Settings'}</h2>
          <p className="text-white/70 mt-1">{t('manageSiteSettings') || 'Manage website settings'}</p>
        </div>
        <Button onClick={handleSave} className="bg-[#204393] hover:bg-[#1b356f] text-white">
          <Save className="h-4 w-4 mr-2" />
          {t('save') || 'Save'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="backdrop-blur-xl bg-white/10 border-white/20">
          <TabsTrigger value="general" className="text-white data-[state=active]:bg-[#204393]">{t('general') || 'General'}</TabsTrigger>
          <TabsTrigger value="contact" className="text-white data-[state=active]:bg-[#204393]">{t('contact') || 'Contact'}</TabsTrigger>
          <TabsTrigger value="social" className="text-white data-[state=active]:bg-[#204393]">{t('socialMedia') || 'Social Media'}</TabsTrigger>
          <TabsTrigger value="clients" className="text-white data-[state=active]:bg-[#204393]">{isRTL ? 'معرض صور العملاء' : 'Client Logos Gallery'}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">{t('generalSettings') || 'General Settings'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">{t('siteName') || 'Site Name'} (EN)</Label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('siteName') || 'Site Name'} (AR)</Label>
                  <Input
                    value={settings.siteNameAr}
                    onChange={(e) => setSettings({ ...settings, siteNameAr: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">{t('description') || 'Description'} (EN)</Label>
                  <Textarea
                    value={settings.description}
                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                    rows={3}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('description') || 'Description'} (AR)</Label>
                  <Textarea
                    value={settings.descriptionAr}
                    onChange={(e) => setSettings({ ...settings, descriptionAr: e.target.value })}
                    rows={3}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">{t('contactInformation') || 'Contact Information'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">
                  <Mail className="h-4 w-4 inline mr-2" />
                  {t('email') || 'Email'}
                </Label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">
                  <Phone className="h-4 w-4 inline mr-2" />
                  {t('phone') || 'Phone'} ({isRTL ? 'عرض عام' : 'General Display'})
                </Label>
                <Input
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder={isRTL ? '25740005 / 25740217' : '25740005 / 25740217'}
                />
                <p className="text-xs text-white/50">{isRTL ? 'يستخدم للعرض العام فقط' : 'Used for general display only'}</p>
              </div>
              
              {/* Sales Phone Numbers */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-base font-semibold">
                    <Phone className="h-4 w-4 inline mr-2" />
                    {isRTL ? 'أرقام المبيعات' : 'Sales Phone Numbers'}
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setSettings({
                      ...settings,
                      phoneNumbersSales: [...settings.phoneNumbersSales, { number: '', type: 'phone' }]
                    })}
                    className="bg-[#204393] hover:bg-[#1b356f] text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {isRTL ? 'إضافة' : 'Add'}
                  </Button>
                </div>
                {settings.phoneNumbersSales.map((phone, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={phone.number}
                      onChange={(e) => {
                        const updated = [...settings.phoneNumbersSales];
                        updated[index] = { ...updated[index], number: e.target.value };
                        setSettings({ ...settings, phoneNumbersSales: updated });
                      }}
                      placeholder={isRTL ? 'رقم الهاتف' : 'Phone number'}
                      className="bg-white/10 border-white/20 text-white flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setSettings({
                        ...settings,
                        phoneNumbersSales: settings.phoneNumbersSales.filter((_, i) => i !== index)
                      })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Administration Phone Numbers */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-base font-semibold">
                    <Phone className="h-4 w-4 inline mr-2" />
                    {isRTL ? 'أرقام الإدارة' : 'Administration Phone Numbers'}
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setSettings({
                      ...settings,
                      phoneNumbersAdmin: [...settings.phoneNumbersAdmin, { number: '', type: 'phone' }]
                    })}
                    className="bg-[#204393] hover:bg-[#1b356f] text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {isRTL ? 'إضافة' : 'Add'}
                  </Button>
                </div>
                {settings.phoneNumbersAdmin.map((phone, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={phone.number}
                      onChange={(e) => {
                        const updated = [...settings.phoneNumbersAdmin];
                        updated[index] = { ...updated[index], number: e.target.value };
                        setSettings({ ...settings, phoneNumbersAdmin: updated });
                      }}
                      placeholder={isRTL ? 'رقم الهاتف' : 'Phone number'}
                      className="bg-white/10 border-white/20 text-white flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setSettings({
                        ...settings,
                        phoneNumbersAdmin: settings.phoneNumbersAdmin.filter((_, i) => i !== index)
                      })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Sales Fax Numbers */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-base font-semibold">
                    <Printer className="h-4 w-4 inline mr-2" />
                    {isRTL ? 'أرقام فاكس المبيعات' : 'Sales Fax Numbers'}
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setSettings({
                      ...settings,
                      faxNumbersSales: [...settings.faxNumbersSales, { number: '', type: 'fax', label: 'Sales Fax' }]
                    })}
                    className="bg-[#204393] hover:bg-[#1b356f] text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {isRTL ? 'إضافة' : 'Add'}
                  </Button>
                </div>
                {settings.faxNumbersSales.map((fax, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={fax.number}
                      onChange={(e) => {
                        const updated = [...settings.faxNumbersSales];
                        updated[index] = { ...updated[index], number: e.target.value };
                        setSettings({ ...settings, faxNumbersSales: updated });
                      }}
                      placeholder={isRTL ? 'رقم الفاكس' : 'Fax number'}
                      className="bg-white/10 border-white/20 text-white flex-1"
                    />
                    <Input
                      value={fax.label || ''}
                      onChange={(e) => {
                        const updated = [...settings.faxNumbersSales];
                        updated[index] = { ...updated[index], label: e.target.value };
                        setSettings({ ...settings, faxNumbersSales: updated });
                      }}
                      placeholder={isRTL ? 'التسمية (اختياري)' : 'Label (optional)'}
                      className="bg-white/10 border-white/20 text-white w-32"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setSettings({
                        ...settings,
                        faxNumbersSales: settings.faxNumbersSales.filter((_, i) => i !== index)
                      })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Administration Fax Numbers */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-base font-semibold">
                    <Printer className="h-4 w-4 inline mr-2" />
                    {isRTL ? 'أرقام فاكس الإدارة' : 'Administration Fax Numbers'}
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setSettings({
                      ...settings,
                      faxNumbersAdmin: [...settings.faxNumbersAdmin, { number: '', type: 'fax', label: 'Admin Fax' }]
                    })}
                    className="bg-[#204393] hover:bg-[#1b356f] text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {isRTL ? 'إضافة' : 'Add'}
                  </Button>
                </div>
                {settings.faxNumbersAdmin.map((fax, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={fax.number}
                      onChange={(e) => {
                        const updated = [...settings.faxNumbersAdmin];
                        updated[index] = { ...updated[index], number: e.target.value };
                        setSettings({ ...settings, faxNumbersAdmin: updated });
                      }}
                      placeholder={isRTL ? 'رقم الفاكس' : 'Fax number'}
                      className="bg-white/10 border-white/20 text-white flex-1"
                    />
                    <Input
                      value={fax.label || ''}
                      onChange={(e) => {
                        const updated = [...settings.faxNumbersAdmin];
                        updated[index] = { ...updated[index], label: e.target.value };
                        setSettings({ ...settings, faxNumbersAdmin: updated });
                      }}
                      placeholder={isRTL ? 'التسمية (اختياري)' : 'Label (optional)'}
                      className="bg-white/10 border-white/20 text-white w-32"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setSettings({
                        ...settings,
                        faxNumbersAdmin: settings.faxNumbersAdmin.filter((_, i) => i !== index)
                      })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Complaints Email */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <Label className="text-white">
                  <Mail className="h-4 w-4 inline mr-2" />
                  {isRTL ? 'البريد الإلكتروني للشكاوى' : 'Complaints Email'}
                </Label>
                <Input
                  type="email"
                  value={settings.complaintsEmail}
                  onChange={(e) => setSettings({ ...settings, complaintsEmail: e.target.value })}
                  placeholder={isRTL ? 'info1@smc-eg.com' : 'info1@smc-eg.com'}
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-xs text-white/50">{isRTL ? 'البريد الإلكتروني المخصص لاستقبال الشكاوى' : 'Email address specifically for receiving complaints'}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    {t('headOffice') || 'Head Office'} (EN)
                  </Label>
                  <Input
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    {t('headOffice') || 'Head Office'} (AR)
                  </Label>
                  <Input
                    value={settings.addressAr}
                    onChange={(e) => setSettings({ ...settings, addressAr: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">{t('cairoOffice') || 'Cairo Office'} (EN)</Label>
                  <Input
                    value={settings.cairoAddress}
                    onChange={(e) => setSettings({ ...settings, cairoAddress: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('cairoOffice') || 'Cairo Office'} (AR)</Label>
                  <Input
                    value={settings.cairoAddressAr}
                    onChange={(e) => setSettings({ ...settings, cairoAddressAr: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">{t('socialMedia') || 'Social Media'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Facebook URL</Label>
                <Input
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Twitter URL</Label>
                <Input
                  value={settings.twitter}
                  onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">LinkedIn URL</Label>
                <Input
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">{isRTL ? 'معرض صور العملاء' : 'Client Logos Gallery'}</CardTitle>
              <p className="text-white/70 text-sm mt-2">
                {isRTL 
                  ? 'أضف صور لوجوهات العملاء التي ستظهر في قسم العملاء في الصفحة الرئيسية'
                  : 'Add client logo images that will be displayed in the clients section on the homepage'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#204393] hover:bg-[#1b356f] text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isRTL ? 'إضافة صورة' : 'Add Image'}
                </Button>
                <span className="text-white/70 text-sm">
                  {isRTL 
                    ? `${settings.clientLogos?.length || 0} صورة مضافة`
                    : `${settings.clientLogos?.length || 0} images added`}
                </span>
              </div>

              {settings.clientLogos && settings.clientLogos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                  {settings.clientLogos.map((logo, index) => (
                    <div
                      key={index}
                      className="relative group bg-white/10 rounded-lg p-4 border border-white/20"
                    >
                      <img
                        src={logo}
                        alt={`Client logo ${index + 1}`}
                        className="w-full h-24 object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {(!settings.clientLogos || settings.clientLogos.length === 0) && (
                <div className="text-center py-12 border-2 border-dashed border-white/20 rounded-lg">
                  <ImageIcon className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/50">
                    {isRTL ? 'لا توجد صور مضافة بعد' : 'No images added yet'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

