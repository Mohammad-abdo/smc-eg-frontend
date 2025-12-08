import { Building, Users, Zap, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const About = () => {
  const { t, isRTL, language } = useLanguage();

  const features = [
    {
      icon: Building,
      title: language === 'ar' ? 'مرافق حديثة' : 'Modern Facilities',
      description: language === 'ar' 
        ? 'فرن كهربائي بطاقة 36,000 طن سنوياً في أبو زنيمة، سيناء، مصر'
        : '36,000 MTPA electrical furnace at Abu-Zinima Sinai, Egypt',
    },
    {
      icon: Zap,
      title: language === 'ar' ? 'محطة الطاقة' : 'Power Station',
      description: language === 'ar'
        ? 'محطة طاقة غازية خاصة تنتج 21 ميجاوات'
        : 'Own gas turbine power station producing 21 MW',
    },
    {
      icon: Users,
      title: language === 'ar' ? 'أكثر من 500 موظف' : '500+ Employees',
      description: language === 'ar'
        ? 'قوة عمل ماهرة مكرسة للتميز'
        : 'Skilled workforce dedicated to excellence',
    },
    {
      icon: Award,
      title: language === 'ar' ? 'رائد الصناعة' : 'Industry Leader',
      description: language === 'ar'
        ? 'أول وأكبر منتج لخام المنجنيز في مصر'
        : 'First and largest manganese ore producer in Egypt',
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className={cn("text-center mb-16", isRTL && "text-right")}>
          <h1 className="text-5xl font-bold mb-6">{t('aboutTitle')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('aboutDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted rounded-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6">{language === 'ar' ? 'تاريخ الشركة' : 'Company History'}</h2>
          <div className={cn('space-y-4 text-muted-foreground', isRTL && 'text-right')}>
            <p className="text-lg leading-relaxed">
              {language === 'ar' 
                ? 'تأسست شركة سيناء للمنجنيز في 18 مايو 1957 لاستغلال رواسب المنجنيز في شبه جزيرة سيناء، مصر. منذ البداية، كانت مهمتنا توفير خام المنجنيز وسيليكون المنجنيز عالي الجودة للصناعات في جميع أنحاء مصر والشرق الأوسط.'
                : 'Founded on May 18th, 1957, Sinai Manganese Company was established to exploit the manganese deposits in Sinai Peninsula, Egypt. From the beginning, our mission has been to provide high-quality manganese ore and silicomanganese to industries across Egypt and the Middle East.'}
            </p>
            <p className="text-lg leading-relaxed">
              {language === 'ar'
                ? 'على مر العقود، نمنا لتصبح الشركة الرائدة في إنتاج المنجنيز في مصر، مع مرافق حديثة والتزام بالجودة أكسبنا اعترافاً وطنياً ودولياً.'
                : 'Over the decades, we have grown to become Egypt\'s premier manganese producer, with state-of-the-art facilities and a commitment to quality that has earned us recognition both nationally and internationally.'}
            </p>
            <p className="text-lg leading-relaxed">
              {language === 'ar'
                ? 'اليوم، تدير شركة سيناء للمنجنيز فرناً كهربائياً بطاقة 36,000 طن سنوياً وتحتفظ بمحطة طاقة غازية خاصة تنتج 21 ميجاوات، مما يجعلنا مكتفين ذاتياً تماماً في قدراتنا الإنتاجية. نحن فخورون بأن نكون المنتج الوحيد لسبائك سيليكون المنجنيز في الشرق الأوسط.'
                : 'Today, SMC operates a 36,000 MTPA electrical furnace and maintains its own 21 MW gas turbine power station, making us completely self-sufficient in our production capabilities. We are proud to be the only producer of Silicomanganese ferroalloy in the Middle East.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
