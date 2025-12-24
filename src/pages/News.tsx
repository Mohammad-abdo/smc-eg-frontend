import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
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
  console.log(news);

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
        ) : newsItemsFromAPI.length === 0 ? (
          <div className={cn("flex flex-col items-center justify-center py-20", isRTL && "text-right")}>
            <div className="mb-6 p-6 rounded-full bg-muted">
              <Newspaper className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">
              {language === 'ar' ? 'لا توجد أخبار بعد' : 'No News Yet'}
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              {language === 'ar' 
                ? 'لم يتم نشر أي أخبار حتى الآن. تحقق مرة أخرى لاحقاً للحصول على آخر التحديثات.'
                : 'No news have been published yet. Check back later for the latest updates.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItemsFromAPI.map((item) => (
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
                  <Link to={getLocalizedLink(`/news/${item.id}`, language)}>
                    {language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
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
