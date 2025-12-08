import { Ship, Package, TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const PrivatePort = () => {
  const { t, isRTL, language } = useLanguage();

  const features = [
    {
      icon: Ship,
      title: language === 'ar' ? 'مرافق حديثة' : 'Modern Facilities',
      description: language === 'ar'
        ? 'مرافق ميناء حديثة مجهزة لعمليات التحميل والشحن الفعالة'
        : 'State-of-the-art port facilities equipped for efficient loading and shipping operations',
    },
    {
      icon: Package,
      title: language === 'ar' ? 'قدرة عالية' : 'High Capacity',
      description: language === 'ar'
        ? 'قادرة على التعامل مع أحجام كبيرة من شحنات خام المنجنيز وسيليكون المنجنيز'
        : 'Capable of handling large volumes of manganese ore and silicomanganese shipments',
    },
    {
      icon: TrendingUp,
      title: language === 'ar' ? 'موقع استراتيجي' : 'Strategic Location',
      description: language === 'ar'
        ? 'يقع في أبو زنيمة للوصول الأمثل إلى طرق الشحن الدولية'
        : 'Located at Abu-Zinima for optimal access to international shipping routes',
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'معايير السلامة' : 'Safety Standards',
      description: language === 'ar'
        ? 'الالتزام الصارم بمعايير السلامة والبيئة الدولية'
        : 'Strict adherence to international safety and environmental regulations',
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className={cn("text-center mb-16", isRTL && "text-right")}>
          <h1 className="text-5xl font-bold mb-6">{t('privatePort')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'ar'
              ? 'تضمن منشأة الميناء الخاص لدينا تصديراً فعالاً وموثوقاً لمنتجاتنا للعملاء في جميع أنحاء العالم'
              : 'Our private port facility ensures efficient and reliable export of our products to customers worldwide'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={cn("bg-muted rounded-lg p-8 md:p-12", isRTL && "text-right")}>
          <h2 className="text-3xl font-bold mb-6">{language === 'ar' ? 'قدرات الميناء' : 'Port Capabilities'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{language === 'ar' ? 'التحميل والشحن' : 'Loading & Shipping'}</h3>
              <ul className={cn("space-y-3 text-muted-foreground", isRTL && "text-right")}>
                <li className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <span className="text-primary mt-1">•</span>
                  <span>{language === 'ar' ? 'تحميل مباشر على السفن مع معالجة minimal' : 'Direct loading to vessels with minimal handling'}</span>
                </li>
                <li className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <span className="text-primary mt-1">•</span>
                  <span>{language === 'ar' ? 'نقاط تحميل متعددة للعمليات الفعالة' : 'Multiple loading points for efficient operations'}</span>
                </li>
                <li className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <span className="text-primary mt-1">•</span>
                  <span>{language === 'ar' ? 'قدرة تشغيلية على مدار الساعة' : '24/7 operational capability'}</span>
                </li>
                <li className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <span className="text-primary mt-1">•</span>
                  <span>{language === 'ar' ? 'أنظمة وزن ومراقبة جودة متقدمة' : 'Advanced weighing and quality control systems'}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">{language === 'ar' ? 'التخزين والمعالجة' : 'Storage & Handling'}</h3>
              <ul className={cn("space-y-3 text-muted-foreground", isRTL && "text-right")}>
                <li className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <span className="text-primary mt-1">•</span>
                  <span>{language === 'ar' ? 'منشآت تخزين مغطاة لحماية المنتجات' : 'Covered storage facilities to protect products'}</span>
                </li>
                <li className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <span className="text-primary mt-1">•</span>
                  <span>{language === 'ar' ? 'مناطق تخزين منفصلة للدرجات المختلفة' : 'Segregated storage areas for different grades'}</span>
                </li>
                <li className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <span className="text-primary mt-1">•</span>
                  <span>{language === 'ar' ? 'معدات معالجة مواد حديثة' : 'Modern material handling equipment'}</span>
                </li>
                <li className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <span className="text-primary mt-1">•</span>
                  <span>{language === 'ar' ? 'أنظمة قمع الغبار' : 'Dust suppression systems'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivatePort;
