import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProductCategories } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Package, Loader2 } from 'lucide-react';

const ProductsMain = () => {
  const { t, isRTL, language } = useLanguage();
  const { data: categories = [], isLoading } = useProductCategories();

  // Get only main categories (no parent_id)
  const mainCategories = categories.filter(cat => !cat.parent_id && cat.status === 'active');

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className={cn('text-center mb-12', isRTL && 'text-right')}>
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">
            {language === 'ar' ? 'المنتجات' : 'Products'}
          </p>
          <h1 className="text-5xl font-bold mb-6">
            {language === 'ar' ? 'منتجاتنا' : 'Our Products'}
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            {language === 'ar' 
              ? 'اكتشف مجموعتنا الواسعة من المنتجات عالية الجودة'
              : 'Discover our wide range of high-quality products'}
          </p>
        </div>

        {mainCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'لا توجد أقسام متاحة' : 'No categories available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:max-w-5xl lg:mx-auto">
            {mainCategories.map((category) => (
              <Link key={category.id} to={`/products/${category.slug}`}>
                <Card className="group overflow-hidden border border-border shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer h-full">
                  <CardHeader>
                    <div className={cn('flex items-center gap-4 mb-4', isRTL && 'flex-row-reverse')}>
                      <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">
                        {language === 'ar' ? category.nameAr : category.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' 
                        ? `استكشف ${category.nameAr}`
                        : `Explore ${category.name}`}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsMain;

