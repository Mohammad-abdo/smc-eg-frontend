import { Link, useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts, useProductCategories } from '@/hooks/useApi';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowLeft, Loader2, Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CategoryProducts = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();
  const { data: categories = [], isLoading: categoriesLoading } = useProductCategories();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  // Find main category by slug
  const mainCategory = categories.find(cat => 
    cat.slug === categorySlug && !cat.parent_id && cat.status === 'active'
  );

  // Filter products that belong to this category
  const categoryProducts = products.filter(p => {
    if (p.status !== 'active') return false;
    // Match by category_id if set, or by category name/slug
    if (p.category_id && mainCategory) {
      return p.category_id === mainCategory.id;
    }
    // Fallback: match by category enum or slug
    if (mainCategory) {
      const categoryMatch = 
        (p.category === 'Mining' && mainCategory.slug === 'mining') ||
        (p.category === 'Industrial' && mainCategory.slug === 'industrial') ||
        (p.category_slug === mainCategory.slug);
      return categoryMatch;
    }
    return false;
  });

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!mainCategory) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {language === 'ar' ? 'القسم غير موجود' : 'Category not found'}
          </p>
          <Button onClick={() => navigate('/products')}>
            {language === 'ar' ? 'العودة للمنتجات' : 'Back to Products'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/products')}
          className={cn('mb-6', isRTL && 'ml-auto')}
        >
          <ArrowLeft className={cn('h-4 w-4 mr-2', isRTL && 'ml-2 mr-0 rotate-180')} />
          {language === 'ar' ? 'العودة للمنتجات' : 'Back to Products'}
        </Button>

        <div className={cn('text-center mb-12', isRTL && 'text-right')}>
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">
            {language === 'ar' ? mainCategory.nameAr : mainCategory.name}
          </p>
          <h1 className="text-5xl font-bold mb-6">
            {language === 'ar' ? 'المنتجات' : 'Products'}
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            {language === 'ar' 
              ? `اكتشف منتجاتنا في ${mainCategory.nameAr}`
              : `Discover our products in ${mainCategory.name}`}
          </p>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'لا توجد منتجات متاحة في هذا القسم' : 'No products available in this category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:max-w-6xl lg:mx-auto">
            {categoryProducts.map((product) => {
              // Use product image if available, otherwise use a placeholder
              const productImage = (product.image && product.image.trim() !== '') 
                ? product.image 
                : undefined;
              
              return (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="group overflow-hidden border border-border shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                    <div className="relative h-64 overflow-hidden bg-muted">
                      {productImage ? (
                        <img
                          src={productImage.startsWith('data:image') || productImage.startsWith('data:')
                            ? productImage
                            : `${productImage}${productImage.includes('?') ? '&' : '?'}_cb=${product.updated_at ? new Date(product.updated_at).getTime() : Date.now()}`}
                          alt={language === 'ar' ? product.nameAr : product.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          key={`${product.id}-${product.updated_at || Date.now()}`}
                          onError={(e) => {
                            console.error('Category product image load error');
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                          <Factory className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                      <div className={cn('absolute top-4 rounded-full bg-primary/90 p-3 backdrop-blur', isRTL ? 'left-4' : 'right-4')}>
                        <Factory className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <CardTitle className="text-2xl mb-3">
                        {language === 'ar' ? product.nameAr : product.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {language === 'ar' ? product.descriptionAr : product.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;

