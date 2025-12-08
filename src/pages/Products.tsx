import { Link } from 'react-router-dom';
import { Factory, Atom, Wrench, Sparkles, Beaker, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useProducts, useProductCategories } from '@/hooks/useApi';
import heroSlideOne from '@/assets/manganese/one.jpeg';
import heroSlideTwo from '@/assets/manganese/two.jpg';
import heroSlideThree from '@/assets/manganese/three.jpg';
import mnHome from '@/assets/manganese/home3-image3.jpg';
import mnPortfolio14 from '@/assets/manganese/portfolio14.jpg';
import mnPortfolio16 from '@/assets/manganese/portfolio16.jpg';
import image1 from '@/assets/manganese/image 1.jpg';

interface ProductsProps {
  type: 'industrial' | 'mining';
}

interface MiningTable {
  title: string;
  columns: string[];
  rows: string[][];
}

const MiningTable = ({ table, isRTL }: { table: MiningTable; isRTL: boolean }) => (
  <div className="space-y-3">
    <div className={cn('text-sm font-semibold uppercase tracking-[0.4em] text-primary', isRTL && 'text-right')}>
      {table.title}
    </div>
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className={cn('w-full text-sm', isRTL && 'text-right')}>
        <thead className="bg-muted/70">
          <tr>
            {table.columns.map((col) => (
              <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-border/60">
              {row.map((value, colIdx) => (
                <td key={colIdx} className="px-4 py-3">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Products = ({ type }: ProductsProps) => {
  const { t, isRTL, language: lang } = useLanguage();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useProductCategories();

  if (type === 'mining' || type === 'industrial') {
    // Get main category based on type
    const mainCategory = categories.find(cat => {
      if (type === 'mining') {
        return (cat.slug === 'mining' || cat.name.toLowerCase().includes('mining')) && !cat.parent_id;
      } else {
        return (cat.slug === 'industrial' || cat.name.toLowerCase().includes('industrial')) && !cat.parent_id;
      }
    });

    // Filter products from API - only products that belong to this main category
    let filteredProducts = products.filter(p => {
      if (p.status !== 'active') return false;
      // Match by category_id if set
      if (p.category_id && mainCategory) {
        return p.category_id === mainCategory.id;
      }
      // Fallback: match by category enum or slug
      const categoryMatch = type === 'mining' ? p.category === 'Mining' : (p.category === 'Industrial' || p.category_slug === 'industrial');
      return categoryMatch;
    });

    const productsFromAPI = filteredProducts
      .map((product) => {
        const iconMap: Record<string, any> = {
          'Silicomanganese': Factory,
          'Calcined Gypsum': Sparkles,
          'Kaolin': Beaker,
          'Silica Sand': Factory,
          'Raw Gypsum': Sparkles,
          'Iron Oxide': Flame,
          'Fine Manganese': Factory,
        };
        const ProductIcon = iconMap[product.name] || Factory;
        // Use product.image if it exists and is not empty, otherwise undefined (will show placeholder)
        const productImage = (product.image && product.image.trim() !== '') 
          ? product.image 
          : undefined;
        
        return {
          id: product.id.toString(),
          name: lang === 'ar' ? product.nameAr : product.name,
          description: lang === 'ar' ? product.descriptionAr : product.description,
          image: productImage || product.product?.image || product.image,
          updated_at: product.updated_at || product.updatedAt || product.product?.updated_at,
          icon: ProductIcon,
          product: product,
        };
      });

    const content =
      lang === 'ar'
        ? {
            heroTitle: 'منتجات التعدين',
            heroSubtitle: 'حلول مواد خام تغطي الرمال السيليكية والكاولين والجبس من جنوب سيناء',
            heroBody:
              'تدير شركة سيناء للمنجنيز محاجر ومعامل معالجة متخصصة في أبو زنيمة وزعفرانة ورأس ملاعب، لنغطي الطلب المحلي والعالمي على المواد الخام عالية النقاء.',
            overview: [
              'رمال السيليكا من جنوب سيناء بطاقة 500 ألف طن سنوياً، ورمال زعفرانة بطاقة 60 ألف طن سنوياً بجودة مناسبة للزجاج والكريستال.',
              'الكاولين والصلصال الأبيض بإنتاجية تصل إلى 100 ألف طن سنوياً للأسواق الحرارية والأسمنتية والسيراميكية.',
              'خام الجبس من رأس ملاعب بطاقة 400 ألف طن سنوياً مع مصنع لتجهيز الجبس المحمص بطاقة 300 ألف طن.',
            ],
            silicaCard: {
              title: 'رمال السيليكا',
              description: 'نقاء عالٍ لصناعة الزجاج والألواح الكهروضوئية.',
              points: ['أحجام من الخام إلى 0-30 سم', 'إمدادات مستقرة للتصدير'],
            },
            kaolinCard: {
              title: 'الكاولين والصلصال الأبيض',
              description: 'أربع درجات تلبي صناعات الحراريات والأبيض.',
              points: ['خيارات سحق بحسب الطلب', 'إمداد للأسواق المحلية والعالمية'],
            },
            gypsumCard: {
              title: 'خام الجبس',
              description: 'خام عالي البياض مع خيارات تحميص داخلي.',
              points: ['يشمل تصدير إلى اليابان وأفريقيا', 'مطابق لمواصفات CaSO4·2H2O'],
            },
            tables: [
              {
                title: 'رمال السيليكا – جنوب سيناء',
                columns: ['المكونات', 'النوع 1', 'النوع 2', 'النوع 3'],
                rows: [
                  ['SiO2', '99.60% حد أدنى', '99% حد أدنى', '97% حد أدنى'],
                  ['Fe2O3', '0.016% حد أقصى', '0.016 – 0.030%', '0.05 – 0.120%'],
                  ['Al2O3', '0.30% حد أقصى', '0.15 – 0.30%', '0.70% حد أقصى'],
                  ['TiO2', '0.016 – 0.04%', '0.016 – 0.04%', '0.04% حد أقصى'],
                  ['CaO', '0.03% حد أقصى', '0.03% حد أقصى', '0.07% حد أقصى'],
                  ['MgO', '0.005% حد أقصى', '0.005% حد أقصى', '0.04% حد أقصى'],
                  ['Cr2O3', 'آثار', 'آثار', '0.0005% حد أقصى'],
                ],
              },
              {
                title: 'رمال السيليكا – زعفرانة',
                columns: ['المكونات', 'المواصفات'],
                rows: [
                  ['SiO2', '99.60% حد أدنى'],
                  ['Fe2O3', '0.016% حد أقصى'],
                  ['Al2O3', '0.30% حد أقصى'],
                  ['TiO2', '0.016 – 0.04%'],
                  ['CaO', '0.03% حد أقصى'],
                  ['MgO', '0.005% حد أقصى'],
                  ['Cr2O3', 'آثار'],
                ],
              },
              {
                title: 'الكاولين والصلصال الأبيض',
                columns: ['المكونات', 'النوع 1', 'النوع 2', 'النوع 3', 'النوع 4'],
                rows: [
                  ['SiO2', '≤ 52', '50 – 56', '55 – 62', '58 – 68'],
                  ['Al2O3', '≥ 34', '30 – 34', '25 – 30', '20 – 25'],
                  ['Fe2O3', '0.90 – 1.20', '0.90 – 1.20', '0.90 – 1.10', '0.80 – 1.20'],
                  ['TiO2', '1.5 – 2.30', '1.5 – 2.30', '1.4 – 2.0', '1.3 – 1.8'],
                  ['CaO', '0.10 – 0.15', '0.10 – 0.15', '0.30 – 0.60', '0.20 – 0.30'],
                  ['MgO', '0.05 – 0.10', '0.05 – 0.10', '0.20 – 0.40', '0.10 – 0.20'],
                ],
              },
              {
                title: 'خام الجبس – رأس ملاعب',
                columns: ['المكونات', 'درجة عالية', 'درجة منخفضة'],
                rows: [
                  ['الماء المتحد', '≥ 19.50', '≥ 18.90'],
                  ['CaSO4·2H2O', '≥ 93.00', '≥ 90.40'],
                  ['CaO', '30.5 – 33', '30.5 – 33'],
                  ['SO3', '43.5 – 46', '43.5 – 46'],
                  ['MgO', '≤ 0.10', '≤ 0.10'],
                  ['SiO2 + IR', '≤ 1.00', '≤ 1.50'],
                  ['Al2O3 + Fe2O3', '≤ 0.25', '≤ 0.25'],
                ],
              },
            ],
          }
        : {
            heroTitle: 'Mining Products',
            heroSubtitle: 'High-purity silica, kaolin, and gypsum sourced from South Sinai',
            heroBody:
              'Sinai Manganese Co. operates quarries and processing hubs across Abu-Zinima, Zaafarana, and Ras Malaab to serve glass, cement, and industrial customers worldwide.',
            overview: [
              'Silica sand output of 500,000 MTPA from South Sinai plus 60,000 MTPA from Zaafarana, perfect for float glass, crystalware, and solar applications.',
              'Kaolin and white clay up to 100,000 MTPA supplying refractory, cement, ceramic, and paper industries across Europe and MENA.',
              'Gypsum ore from Ras Malaab totaling 400,000 MTPA, backed by an on-site calcining plant consuming 300,000 MTPA with surplus available for export to Japan and Africa.',
            ],
            silicaCard: {
              title: 'Silica Sand',
              description: 'Ultra-pure feedstock graded for glass sheets, containers, and PV modules.',
              points: ['Run-of-mine or 0–30 cm crushed sizing', 'Stable export programs and local supply'],
            },
            kaolinCard: {
              title: 'Kaolin & White Clay',
              description: 'Four grades engineered for white cement, refractories, ceramics, and paper coating.',
              points: ['Custom crushing per client specs', 'Serves domestic and international markets'],
            },
            gypsumCard: {
              title: 'Gypsum Ore',
              description: 'High-whiteness ore plus in-house calcined production for wallboard and cement.',
              points: ['Export pipelines to Japan and Africa', 'Quality aligned with CaSO4·2H2O specs'],
            },
            tables: [
              {
                title: 'Sinai Silica Sand Grades',
                columns: ['Constituents', 'Type 1', 'Type 2', 'Type 3'],
                rows: [
                  ['SiO2', '99.60% min.', '99% min.', '97% min.'],
                  ['Fe2O3', '0.016% max.', '0.016–0.030%', '0.05–0.120%'],
                  ['Al2O3', '0.30% max.', '0.15–0.30%', '0.70% max.'],
                  ['TiO2', '0.016–0.04%', '0.016–0.04%', '0.04% max.'],
                  ['CaO', '0.03% max.', '0.03% max.', '0.07% max.'],
                  ['MgO', '0.005% max.', '0.005% max.', '0.04% max.'],
                  ['Cr2O3', 'Traces', 'Traces', '0.0005% max.'],
                ],
              },
              {
                title: 'Zaafarana Silica Sand',
                columns: ['Constituents', 'Specifications'],
                rows: [
                  ['SiO2', '99.60% min.'],
                  ['Fe2O3', '0.016% max.'],
                  ['Al2O3', '0.30% max.'],
                  ['TiO2', '0.016–0.04%'],
                  ['CaO', '0.03% max.'],
                  ['MgO', '0.005% max.'],
                  ['Cr2O3', 'Traces'],
                ],
              },
              {
                title: 'Kaolin & White Clay Grades',
                columns: ['Constituents', 'Type 1', 'Type 2', 'Type 3', 'Type 4'],
                rows: [
                  ['SiO2', '≤ 52', '50–56', '55–62', '58–68'],
                  ['Al2O3', '≥ 34', '30–34', '25–30', '20–25'],
                  ['Fe2O3', '0.90–1.20', '0.90–1.20', '0.90–1.10', '0.80–1.20'],
                  ['TiO2', '1.5–2.30', '1.5–2.30', '1.4–2.0', '1.3–1.8'],
                  ['CaO', '0.10–0.15', '0.10–0.15', '0.30–0.60', '0.20–0.30'],
                  ['MgO', '0.05–0.10', '0.05–0.10', '0.20–0.40', '0.10–0.20'],
                ],
              },
              {
                title: 'Gypsum Ore – Ras Malaab',
                columns: ['Constituents', 'High Grade', 'Low Grade'],
                rows: [
                  ['Combined water', '≥ 19.50', '≥ 18.90'],
                  ['CaSO4·2H2O', '≥ 93.00', '≥ 90.40'],
                  ['CaO', '30.5–33', '30.5–33'],
                  ['SO3', '43.5–46', '43.5–46'],
                  ['MgO', '≤ 0.10', '≤ 0.10'],
                  ['SiO2 + IR', '≤ 1.00', '≤ 1.50'],
                  ['Al2O3 + Fe2O3', '≤ 0.25', '≤ 0.25'],
                ],
              },
            ],
          };

    const sectionTitle = type === 'mining' 
      ? (lang === 'ar' ? 'منتجات التعدين' : 'Mining Products')
      : (lang === 'ar' ? 'المنتجات الصناعية' : 'Industrial Products');
    
    const sectionSubtitle = type === 'mining'
      ? (lang === 'ar' ? 'منتجاتنا من التعدين' : 'Our Mining Products')
      : (lang === 'ar' ? 'منتجاتنا الصناعية' : 'Our Industrial Products');
    
    const sectionDescription = type === 'mining'
      ? (lang === 'ar' ? 'اكتشف مجموعة منتجاتنا المتنوعة من التعدين عالية الجودة' : 'Discover our diverse range of high-quality mining products')
      : (lang === 'ar' ? 'اكتشف مجموعة منتجاتنا المتنوعة من الصناعة عالية الجودة' : 'Discover our diverse range of high-quality industrial products');

    return (
      <div className="min-h-screen pt-32 pb-20">
        {/* Products Section - First Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className={cn('text-center mb-12', isRTL && 'text-right')}>
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">
              {sectionTitle}
            </p>
            <h2 className="text-4xl font-bold mb-4">
              {sectionSubtitle}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              {sectionDescription}
            </p>
          </div>


          {productsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {lang === 'ar' ? 'جاري تحميل المنتجات...' : 'Loading products...'}
              </p>
            </div>
          ) : productsFromAPI.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:max-w-6xl lg:mx-auto">
              {productsFromAPI.map((product) => {
                const ProductIcon = product.icon || Factory;
                return (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="group overflow-hidden border border-border shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                    <div className="relative h-64 overflow-hidden bg-muted">
                      {product.image ? (
                        <img
                          src={product.image.includes('data:image') ? product.image : `${product.image}${product.image.includes('?') ? '&' : '?'}_cb=${product.updated_at ? new Date(product.updated_at).getTime() : Date.now()}`}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          key={`${product.id}-${product.updated_at || Date.now()}`}
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
                      {!product.image && (
                        <div className="h-full w-full flex items-center justify-center bg-muted placeholder-fallback">
                          <ProductIcon className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                      <div className={cn('absolute top-4 rounded-full bg-primary/90 p-3 backdrop-blur', isRTL ? 'left-4' : 'right-4')}>
                        <ProductIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <CardTitle className="text-2xl mb-3">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {lang === 'ar' ? 'لا توجد منتجات في هذا القسم' : 'No products in this category'}
              </p>
            </div>
          )}
        </section>

        {/* Only show hero section and tables for mining products */}
        {type === 'mining' && (
          <>
            <section className="relative overflow-hidden rounded-[40px] bg-muted/60">
              <div className="absolute inset-0">
                <img src={heroSlideThree} alt="Mining operations" className="h-full w-full object-cover opacity-30" />
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent',
                    isRTL && 'bg-gradient-to-l'
                  )}
                />
              </div>
              <div className="relative container mx-auto grid gap-8 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr]">
                <div className={cn('space-y-6', isRTL && 'text-right')}>
                  <p className="text-xs uppercase tracking-[0.4em] text-primary">{content.heroSubtitle}</p>
                  <h1 className="text-4xl font-bold">{content.heroTitle}</h1>
                  <p className="text-lg text-muted-foreground">{content.heroBody}</p>
                  <ul className="grid gap-4">
                    {content.overview.map((item, idx) => (
                      <li key={idx} className="rounded-2xl border border-border/70 bg-white/80 p-4 shadow-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid gap-4 rounded-[32px] border border-border/70 bg-white/80 p-6 shadow-xl">
                  {[content.silicaCard, content.kaolinCard, content.gypsumCard].map((card, idx) => (
                    <Card key={idx} className="border-0 bg-white/90 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{card.description}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="text-sm text-muted-foreground">
                          {card.points.map((point) => (
                            <li key={point}>• {point}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            <section className="container mx-auto px-4">
              <div className="space-y-12 py-16">
                {content.tables.map((table) => (
                  <MiningTable key={table.title} table={table} isRTL={isRTL} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    );
  }

  // Industrial Products Section
  const { t: translate, isRTL: rtl, language } = useLanguage();
  
  const industrialProductsFromAPI = products
    .filter(p => (p.category === 'Industrial' || p.category_slug === 'industrial' || p.category_id) && p.status === 'active')
    .map((product) => {
      const iconMap: Record<string, any> = {
        'Silicomanganese': Factory,
        'Silicomanganese Alloy': Factory,
        'Calcined Gypsum': Sparkles,
        'Kaolin': Atom,
        'Silica Sand': Factory,
        'Raw Gypsum': Sparkles,
        'Iron Oxide': Wrench,
        'Fine Manganese': Factory,
      };
      const ProductIcon = iconMap[product.name] || Factory;
      // Use product.image if it exists and is not empty, otherwise undefined (show placeholder)
      const productImage = (product.image && product.image.trim() !== '') 
        ? product.image 
        : undefined;
      
      return {
        id: product.id.toString(),
        name: language === 'ar' ? product.nameAr : product.name,
        description: language === 'ar' ? product.descriptionAr : product.description,
        image: productImage,
        icon: ProductIcon,
      };
    });

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4">
        <div className={cn('text-center mb-16', rtl && 'text-right')}>
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">{translate('productsSectionLabel')}</p>
          <h1 className="text-5xl font-bold mb-6">{translate('industrialProducts')}</h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            {translate('industrialProductsDescription')}
          </p>
        </div>

        {productsLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-5xl lg:mx-auto">
            {industrialProductsFromAPI.map((product) => {
              const ProductIcon = product.icon || Factory;
              return (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="group overflow-hidden border border-border shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                  <div className="relative h-64 overflow-hidden bg-muted">
                    {product.image ? (
                      <img
                        src={product.image.includes('data:image') ? product.image : `${product.image}${product.image.includes('?') ? '&' : '?'}_cb=${product.updated_at ? new Date(product.updated_at).getTime() : Date.now()}`}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        key={`${product.id}-${product.updated_at || Date.now()}`}
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
                    {!product.image && (
                      <div className="h-full w-full flex items-center justify-center bg-muted placeholder-fallback">
                        <ProductIcon className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                    <div className={cn('absolute top-4 rounded-full bg-primary/90 p-3 backdrop-blur', rtl ? 'left-4' : 'right-4')}>
                      <ProductIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <CardTitle className="text-2xl mb-3">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                  </CardContent>
                </Card>
              </Link>
              );
            })}
          </div>
        )}

        <div className="mt-16 bg-muted rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">{translate('ctaTitle')}</h2>
          <p className="text-lg mb-6 opacity-90">
            {translate('ctaSubtitle')}
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
          >
            {translate('contactUs')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Products;
