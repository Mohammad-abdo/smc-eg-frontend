import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useNews } from '@/hooks/useApi';
import slideOne from '@/assets/manganese/one.jpeg';
import slideTwo from '@/assets/manganese/two.jpg';
import slideThree from '@/assets/manganese/three.jpg';
import homeImage from '@/assets/manganese/home3-image3.jpg';
import portfolio14 from '@/assets/manganese/portfolio14.jpg';
import portfolio16 from '@/assets/manganese/portfolio16.jpg';

const News = () => {
  const { t, isRTL, language } = useLanguage();
  const { data: news = [], isLoading: newsLoading } = useNews();

  const defaultImages = [slideOne, slideTwo, slideThree, homeImage, portfolio14, portfolio16];
  
  const newsItemsFromAPI = news
    .filter(n => n.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((item) => ({
      ...item,
      title: language === 'ar' ? item.titleAr : item.title,
      excerpt: language === 'ar' ? (item.contentAr?.substring(0, 150) || '') : (item.content?.substring(0, 150) || ''),
      image: item.image || defaultImages[item.id % defaultImages.length],
    }));

  const fallbackNewsItems = language === 'ar' ? [
    {
      id: 1,
      title: 'شركة سيناء للمنجنيز توسع قدرتها الإنتاجية',
      date: '2024-11-01',
      excerpt: 'تعلن شركة سيناء للمنجنيز عن توسع كبير في مرافق الإنتاج، مما يزيد الإنتاج السنوي بنسبة 20%.',
      category: 'أخبار الشركة',
      image: slideOne,
    },
    {
      id: 2,
      title: 'تحقيق شهادات جودة جديدة',
      date: '2024-10-15',
      excerpt: 'تحصل شركة سيناء للمنجنيز على شهادات جودة دولية، مما يعزز التزامنا بالتميز.',
      category: 'الجوائز',
      image: slideTwo,
    },
    {
      id: 3,
      title: 'إطلاق مبادرة الاستدامة',
      date: '2024-09-28',
      excerpt: 'إطلاق برامج استدامة بيئية جديدة للحد من البصمة الكربونية.',
      category: 'الاستدامة',
      image: slideThree,
    },
    {
      id: 4,
      title: 'شراكة مع مصنعي الصلب الرائدين',
      date: '2024-09-10',
      excerpt: 'توقع شركة سيناء للمنجنيز شراكات استراتيجية مع منتجي الصلب الرئيسيين في جميع أنحاء الشرق الأوسط.',
      category: 'الشراكة',
      image: homeImage,
    },
    {
      id: 5,
      title: 'الاستثمار في الطاقة المتجددة',
      date: '2024-08-22',
      excerpt: 'تركيب طاقة شمسية جديدة لدعم محطة الطاقة الغازية.',
      category: 'البنية التحتية',
      image: portfolio14,
    },
    {
      id: 6,
      title: 'نجاح برنامج تدريب الموظفين',
      date: '2024-08-05',
      excerpt: 'أكمل أكثر من 200 موظف برامج تدريب تقنية متقدمة.',
      category: 'التدريب',
      image: portfolio16,
    },
  ] : [
    {
      id: 1,
      title: 'SMC Expands Production Capacity',
      date: '2024-11-01',
      excerpt: 'Sinai Manganese Company announces major expansion of production facilities, increasing annual output by 20%.',
      category: 'Company News',
      image: slideOne,
    },
    {
      id: 2,
      title: 'New Quality Certifications Achieved',
      date: '2024-10-15',
      excerpt: 'SMC receives international quality certifications, reinforcing our commitment to excellence.',
      category: 'Awards',
      image: slideTwo,
    },
    {
      id: 3,
      title: 'Sustainability Initiative Launch',
      date: '2024-09-28',
      excerpt: 'Introduction of new environmental sustainability programs to reduce carbon footprint.',
      category: 'Sustainability',
      image: slideThree,
    },
    {
      id: 4,
      title: 'Partnership with Leading Steel Manufacturers',
      date: '2024-09-10',
      excerpt: 'SMC signs strategic partnerships with major steel producers across the Middle East.',
      category: 'Partnership',
      image: homeImage,
    },
    {
      id: 5,
      title: 'Investment in Renewable Energy',
      date: '2024-08-22',
      excerpt: 'New solar power installation to supplement gas turbine power station.',
      category: 'Infrastructure',
      image: portfolio14,
    },
    {
      id: 6,
      title: 'Employee Training Program Success',
      date: '2024-08-05',
      excerpt: 'Over 200 employees complete advanced technical training programs.',
      category: 'Training',
      image: portfolio16,
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className={cn("text-center mb-16", isRTL && "text-right")}>
          <h1 className="text-5xl font-bold mb-6">{t('news')}</h1>
          <p className="text-xl text-muted-foreground">
            {language === 'ar' 
              ? 'ابق على اطلاع بآخر الأخبار والتطورات من شركة سيناء للمنجنيز'
              : 'Stay updated with the latest news and developments from Sinai Manganese Company'}
          </p>
        </div>

        {newsLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{language === 'ar' ? 'جاري تحميل الأخبار...' : 'Loading news...'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(newsItemsFromAPI.length > 0 ? newsItemsFromAPI : fallbackNewsItems).map((item) => (
            <Card key={item.id} className="flex flex-col overflow-hidden bg-white hover:shadow-xl transition-all">
              <div className="group relative h-48 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className={cn('absolute bottom-3 left-3 text-xs uppercase tracking-[0.4em] text-white', isRTL && 'left-auto right-3')}>
                  {item.category}
                </div>
              </div>
              <CardHeader>
                <div className={cn(
                  "flex items-center justify-between mb-4",
                  isRTL && "flex-row-reverse"
                )}>
                  <span className="text-sm font-medium text-primary">{item.category}</span>
                  <div className={cn(
                    "flex items-center gap-2 text-sm text-muted-foreground",
                    isRTL && "flex-row-reverse"
                  )}>
                    <Calendar className="w-4 h-4" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{item.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full group">
                  <Link to={`/news/${item.id}`}>
                    Read More
                    <ArrowRight className={cn(
                      "ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform",
                      isRTL && "rotate-180"
                    )} />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
