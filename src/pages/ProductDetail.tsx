import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Factory, Sparkles, Beaker, Flame, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useProduct } from '@/hooks/useApi';
import heroSlideOne from '@/assets/manganese/one.jpeg';
import heroSlideTwo from '@/assets/manganese/two.jpg';
import heroSlideThree from '@/assets/manganese/three.jpg';
import mnHome from '@/assets/manganese/home3-image3.jpg';
import mnPortfolio14 from '@/assets/manganese/portfolio14.jpg';
import mnPortfolio16 from '@/assets/manganese/portfolio16.jpg';
import image1 from '@/assets/manganese/image 1.jpg';
import image2 from '@/assets/manganese/image 2.jpg';
import image3 from '@/assets/manganese/image 3.jpg';
import image4 from '@/assets/manganese/image 4.jpg';
import image5 from '@/assets/manganese/image 5.jpg';
import image6 from '@/assets/manganese/image 6.jpg';
import image7 from '@/assets/manganese/image 7.jpg';
import image8 from '@/assets/manganese/image 8.jpg';
import image9 from '@/assets/manganese/image 9.jpg';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { t, isRTL, language } = useLanguage();
  const { data: product, isLoading } = useProduct(parseInt(productId || '0'));
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number>(0);

  // Use only API product - no fallback hardcoded data
  // If product is not found, show error/not found message
  
  // Parse gallery if it's a string - using useMemo to avoid re-renders
  const productGallery: string[] = useMemo(() => {
    if (!product?.gallery) {
      return [];
    }
    
    try {
      if (typeof product.gallery === 'string') {
        const parsed = JSON.parse(product.gallery);
        return Array.isArray(parsed) ? parsed : [];
      } else if (Array.isArray(product.gallery)) {
        return product.gallery.filter((img: any) => img && typeof img === 'string');
      }
    } catch (e) {
      console.error('Error parsing gallery:', e);
      return [];
    }
    
    return [];
  }, [product?.gallery]);
  
  const iconMap: Record<string, any> = {
    'Silicomanganese': Factory,
    'Silicomanganese Alloy': Factory,
    'Calcined Gypsum': Sparkles,
    'Kaolin': Beaker,
    'Silica Sand': Factory,
    'Raw Gypsum': Sparkles,
    'Iron Oxide': Flame,
    'Fine Manganese': Factory,
  };
  const ProductIcon = product ? iconMap[product.name] : Factory;
  // Use product.image if it exists and is not empty, otherwise undefined (show placeholder)
  const productImage = (product?.image && product.image.trim() !== '') 
    ? product.image 
    : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className={cn('text-center', isRTL && 'text-right')}>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  // Product not found - show error message
  if (!product && !isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className={cn('text-center', isRTL && 'text-right')}>
          <h1 className="text-4xl font-bold mb-4">
            {language === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'ar' 
              ? 'المنتج الذي تبحث عنه غير موجود في قاعدة البيانات.'
              : 'The product you\'re looking for doesn\'t exist in the database.'}
          </p>
          <Button asChild>
            <Link to="/products">
              {language === 'ar' ? 'العودة للمنتجات' : 'Back to Products'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Extract product data from API - no fallbacks
  const productName = language === 'ar' 
    ? (product?.nameAr || product?.name || 'Product')
    : (product?.name || 'Product');
  const productDescription = language === 'ar' 
    ? (product?.descriptionAr || product?.description || '')
    : (product?.description || '');
  const productCategory = product?.category || t('industrialProducts') || 'Industrial';

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost" className={cn('gap-2', isRTL && 'flex-row-reverse')}>
            <Link to={productCategory === t('industrialProducts') ? '/industrial-products' : '/mining-products'}>
              <ArrowLeft className={cn('h-4 w-4', isRTL && 'rotate-180')} />
              {t('backToProducts') || 'Back to Products'}
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-[32px] border border-border shadow-2xl bg-muted">
                {productImage ? (
                  <img
                    src={productImage.includes('data:image') ? `${productImage}` : `${productImage}${productImage.includes('?') ? '&' : '?'}_cb=${Date.now()}`}
                    alt={productName || 'Product image'}
                    className="h-full w-full object-cover"
                    key={`${productId}-${product?.updated_at || Date.now()}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.nextElementSibling as HTMLElement;
                      if (placeholder && placeholder.classList.contains('placeholder-fallback')) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                {!productImage && (
                  <div className="h-full w-full flex items-center justify-center bg-muted placeholder-fallback">
                    {ProductIcon && <ProductIcon className="h-24 w-24 text-muted-foreground" />}
                  </div>
                )}
                <div className="absolute top-6 right-6 rounded-full bg-primary/90 p-4 backdrop-blur">
                  {ProductIcon && <ProductIcon className="h-8 w-8 text-white" />}
                </div>
              </div>
              
              {/* Gallery with Large Image and Thumbnail Strip */}
              {productGallery && productGallery.length > 0 && (
                <div>
                  <h3 className={cn("text-xl font-semibold mb-4", isRTL && "text-right")}>
                    {language === 'ar' ? 'معرض الصور' : 'Image Gallery'}
                  </h3>
                  
                  {/* Large Main Image */}
                  <div className="mb-4">
                    <div className="relative w-full h-96 lg:h-[500px] overflow-hidden rounded-lg border border-border shadow-lg">
                      {productGallery[selectedGalleryIndex] && (
                        <img
                          src={productGallery[selectedGalleryIndex].includes('data:image') ? productGallery[selectedGalleryIndex] : `${productGallery[selectedGalleryIndex]}${productGallery[selectedGalleryIndex].includes('?') ? '&' : '?'}_cb=${Date.now()}`}
                          alt={`${productName} - Image ${selectedGalleryIndex + 1}`}
                          className="w-full h-full object-contain bg-muted/30"
                          key={`gallery-${selectedGalleryIndex}-${Date.now()}`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {productGallery.length > 1 && (
                    <div className="overflow-x-auto">
                      <div className={cn(
                        "flex gap-2 pb-2",
                        isRTL && "flex-row-reverse"
                      )}>
                        {productGallery.map((img: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setSelectedGalleryIndex(index)}
                            className={cn(
                              "relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-lg border-2 transition-all",
                              selectedGalleryIndex === index
                                ? "border-primary shadow-lg scale-105"
                                : "border-border hover:border-primary/50 hover:shadow-md"
                            )}
                          >
                            <img
                              src={img.includes('data:image') ? img : `${img}${img.includes('?') ? '&' : '?'}_cb=${Date.now()}`}
                              alt={`${productName} - Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              key={`thumb-${index}-${Date.now()}`}
                            />
                            {selectedGalleryIndex === index && (
                              <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-lg" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={cn('space-y-6', isRTL && 'text-right')}>
              <div>
                {productCategory && (
                  <span className="text-sm uppercase tracking-[0.3em] text-primary">{productCategory}</span>
                )}
                {productName && (
                  <h1 className="text-4xl font-bold mt-2 mb-4">{productName}</h1>
                )}
                {productDescription && (
                  <p className="text-lg text-muted-foreground leading-relaxed">{productDescription}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/contact">{t('contactUs')}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/industrial-products">{t('viewAllProducts')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Tables from API */}
        {product?.specifications_table && (
          (() => {
            // Check if it's new format (array of tables) or old format (single table)
            const tables = (product.specifications_table as any).tables 
              ? (product.specifications_table as any).tables 
              : (product.specifications_table.columns ? [product.specifications_table] : []);
            
            return tables.length > 0 ? (
              <div className="space-y-8 mb-8">
                {tables.map((table: any, tableIndex: number) => (
                  table.columns && table.columns.length > 0 ? (
                    <Card key={tableIndex} className="mb-8">
                      <CardContent className="p-8">
                        {table.title && (
                          <h2 className={cn('text-2xl font-bold mb-6', isRTL && 'text-right')}>
                            {table.title}
                          </h2>
                        )}
                        {!table.title && tableIndex === 0 && (
                          <h2 className={cn('text-2xl font-bold mb-6', isRTL && 'text-right')}>
                            {language === 'ar' ? 'المواصفات الكيميائية' : 'Chemical Specifications'}
                          </h2>
                        )}
                        <div className="overflow-x-auto rounded-2xl border border-border">
                          <table className={cn('w-full text-sm', isRTL && 'text-right')}>
                            <thead className="bg-muted/70">
                              <tr>
                                {table.columns.map((col: string, idx: number) => (
                                  <th key={idx} className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {table.rows && table.rows.map((row: string[], rowIndex: number) => (
                                <tr key={rowIndex} className="border-t border-border/60">
                                  {row.map((value: string, colIdx: number) => (
                                    <td key={colIdx} className="px-4 py-3">
                                      {value}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  ) : null
                ))}
              </div>
            ) : null;
          })()
        )}

        {/* Applications & Features - Only show if product has this data in database */}
        {/* Note: These fields are not in the current database schema, so they won't display */}
        {/* If you need applications/features, add them to the database schema */}
      </div>
    </div>
  );
};

export default ProductDetail;

