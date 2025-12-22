import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BatteryCharging,
  Beaker,
  CheckCircle2,
  Factory,
  Flame,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Sun,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useProducts, useProductCategories } from '@/hooks/useApi';
import { useBanners } from '@/hooks/useApi';
import { useNews } from '@/hooks/useApi';
import { usePageContent } from '@/hooks/usePageContent';
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

const heroSlides = [
  {
    src: heroSlideOne,
    alt: 'Manganese smelting hall with liquid metal pouring',
  },
  {
    src: heroSlideTwo,
    alt: 'Industrial ladle moving molten manganese alloy',
  },
  {
    src: heroSlideThree,
    alt: 'Conveyor line handling crushed manganese ore',
  },
];

const Home = () => {
  const { t, isRTL, language } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex]);

  // Fetch data from API
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useProductCategories();
  const { data: banners = [], isLoading: bannersLoading } = useBanners();
  const { data: news = [], isLoading: newsLoading } = useNews();
  // Get client logos from settings instead of API
  const [clientLogos, setClientLogos] = useState<string[]>([]);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    const loadClientLogos = () => {
      try {
        const saved = localStorage.getItem('siteSettings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.clientLogos && Array.isArray(parsed.clientLogos)) {
            setClientLogos(parsed.clientLogos);
          }
        }
      } catch (error) {
        console.error('Error loading client logos:', error);
      }
    };

    loadClientLogos();
    // Listen for storage changes
    window.addEventListener('storage', loadClientLogos);
    window.addEventListener('settingsUpdated', loadClientLogos);

    return () => {
      window.removeEventListener('storage', loadClientLogos);
      window.removeEventListener('settingsUpdated', loadClientLogos);
    };
  }, []);

  // Silicomanganese images
  const silicomanganeseImages = [image1, image2, image3, image4, image5, image6, image7, image8, image9];
  const [selectedSilicomanganeseIndex, setSelectedSilicomanganeseIndex] = useState<number>(0);

  // Carousel API for tracking current slide
  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Find main categories
  const industrialCategory = categories.find(cat =>
    (cat.slug === 'industrial' || cat.name.toLowerCase().includes('industrial')) && !cat.parent_id
  );
  const miningCategory = categories.find(cat =>
    (cat.slug === 'mining' || cat.name.toLowerCase().includes('mining')) && !cat.parent_id
  );

  // Filter and sort products - get last 3 products from industrial category
  const industrialProductsList = products
    .filter(p => {
      if (p.status !== 'active') return false;
      // Check if product belongs to industrial main category
      return p.category_id === industrialCategory?.id ||
        (p.category === 'Industrial' && !p.category_id);
    })
    .sort((a, b) => b.id - a.id) // Sort by ID descending (newest first)
    .slice(0, 3);

  // Filter and sort products - get last 3 products from mining category
  const miningProductsList = products
    .filter(p => {
      if (p.status !== 'active') return false;
      // Check if product belongs to mining main category
      return p.category_id === miningCategory?.id ||
        (p.category === 'Mining' && !p.category_id);
    })
    .sort((a, b) => b.id - a.id) // Sort by ID descending (newest first)
    .slice(0, 3);

  // Get editable content
  const heroTitle = usePageContent('home', 'heroTitle', t('heroTitle'));
  const heroSubtitle = usePageContent('home', 'heroSubtitle', t('heroSubtitle'));
  const heroDescription = usePageContent('home', 'heroDescription', t('heroDescription'));
  const productsSectionLabel = usePageContent('home', 'productsSectionLabel', t('productsSectionLabel'));
  const productsSectionTitle = usePageContent('home', 'productsSectionTitle', t('productsSectionTitle'));
  const productsSectionSubtitle = usePageContent('home', 'productsSectionSubtitle', t('productsSectionSubtitle'));
  const industrialProducts = usePageContent('home', 'industrialProducts', t('industrialProducts'));
  const industrialProductsDescription = usePageContent('home', 'industrialProductsDescription', t('industrialProductsDescription'));
  const miningProducts = usePageContent('home', 'miningProducts', t('miningProducts'));
  const miningProductsDescription = usePageContent('home', 'miningProductsDescription', t('miningProductsDescription'));

  // Use banners from API if available, otherwise use default slides
  const activeBanners = banners.length > 0
    ? banners.filter(b => b.active).sort((a, b) => a.order - b.order)
    : heroSlides.map((slide, idx) => ({
      image: slide.src,
      title: '',
      subtitle: '',
      description: '',
      id: idx
    }));

  useEffect(() => {
    if (activeBanners.length > 0) {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % activeBanners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeBanners.length]);

  const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let start = 0;
            const increment = end / (duration / 16);
            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                setCount(end);
                clearInterval(timer);
              } else {
                setCount(Math.floor(start));
              }
            }, 16);
            return () => clearInterval(timer);
          }
        },
        { threshold: 0.4 }
      );

      if (countRef.current) {
        observer.observe(countRef.current);
      }

      return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return { count, countRef };
  };

  const stats = [
    { value: 30, suffix: '+', label: t('statExperienceLabel'), description: t('statExperienceDescription') },
    { value: 500, suffix: '+', label: t('statWorkersLabel'), description: t('statWorkersDescription') },
    { value: 36000, suffix: ' TON', label: t('statProductionLabel'), description: t('statProductionDescription') },
  ];

  const uses = [
    { icon: Factory, title: t('usesSteelTitle'), description: t('usesSteelDescription') },
    { icon: Beaker, title: t('usesChemicalTitle'), description: t('usesChemicalDescription') },
    { icon: Sparkles, title: t('usesWeldingTitle'), description: t('usesWeldingDescription') },
  ];

  const energySolutions = [
    {
      icon: BatteryCharging,
      title: t('energyChargeTitle'),
      description: t('energyChargeDescription'),
      image: mnHome,
    },
    {
      icon: Flame,
      title: t('energyHeatingTitle'),
      description: t('energyHeatingDescription'),
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      icon: Sun,
      title: t('energyRoofTitle'),
      description: t('energyRoofDescription'),
      image: mnPortfolio16,
    },
  ];

  const aboutBullets = [t('aboutBullet1'), t('aboutBullet2'), t('aboutBullet3')];

  const cases = [
    {
      image: heroSlideOne,
      title: t('case1Title'),
      description: t('case1Description'),
    },
    {
      image: mnHome,
      title: t('case2Title'),
      description: t('case2Description'),
    },
    {
      image: mnPortfolio14,
      title: t('case3Title'),
      description: t('case3Description'),
    },
    {
      image: mnPortfolio16,
      title: t('case4Title'),
      description: t('case4Description'),
    },
  ];

  const productHighlights = [t('productBullet1'), t('productBullet2'), t('productBullet3')];
  const sustainabilityPoints = [t('sustainabilityBullet1'), t('sustainabilityBullet2'), t('sustainabilityBullet3')];

  const contactChannels = [
    { icon: MapPin, label: t('contactHeadOfficeLabel'), value: t('contactHeadOfficeValue') },
    { icon: MapPin, label: t('contactCairoOfficeLabel'), value: t('contactCairoOfficeValue') },
    { icon: Phone, label: t('contactPhoneLabel'), value: t('contactPhoneValue') },
    { icon: Mail, label: t('contactEmailLabel'), value: t('contactEmailValue') },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          {activeBanners.map((banner, index) => (
            <img
              key={banner.id || index}
              src={banner.image || heroSlides[index]?.src}
              alt={banner.title || heroSlides[index]?.alt || 'Hero banner'}
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-all ease-out scale-105',
                index === activeSlide ? 'opacity-90 scale-100' : 'opacity-0'
              )}
            />
          ))}
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
          {/* Additional gradient overlay for text area */}
          <div
            className={cn(
              'absolute inset-0',
              isRTL
                ? 'bg-gradient-to-l from-black/80 via-black/60 to-transparent'
                : 'bg-gradient-to-r from-black/80 via-black/60 to-transparent'
            )}
          />
        </div>
        <div className="relative container mx-auto flex flex-col gap-10 px-4 py-32 lg:flex-row lg:items-center z-10">
          <div className={cn('max-w-2xl space-y-6 py-10', isRTL && 'text-right')}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white drop-shadow-lg">
              {(activeBanners[activeSlide] as any)?.subtitleAr && language === 'ar'
                ? (activeBanners[activeSlide] as any).subtitleAr
                : activeBanners[activeSlide]?.subtitle || heroSubtitle}
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl text-white drop-shadow-lg">
              {(activeBanners[activeSlide] as any)?.titleAr && language === 'ar'
                ? (activeBanners[activeSlide] as any).titleAr
                : activeBanners[activeSlide]?.title || heroTitle}
            </h1>
            <p className="text-lg text-white/90 drop-shadow-md">
              {(activeBanners[activeSlide] as any)?.descriptionAr && language === 'ar'
                ? (activeBanners[activeSlide] as any).descriptionAr
                : activeBanners[activeSlide]?.description || heroDescription}
            </p>
            <div className={cn('flex flex-wrap gap-4', isRTL ? 'flex-row-reverse justify-end' : '')}>
              <Button asChild size="lg" className="bg-[#204393] text-white hover:bg-[#1b356f]">
                <Link to="/contact">
                  {t('heroPrimaryCta')}
                  <ArrowRight className={cn('ml-2 h-5 w-5', isRTL && 'rotate-180')} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#204393] text-[#204393] hover:bg-[#204393]/10"
              >
                <Link to="/about">{t('heroSecondaryCta')}</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border border-primary/20 bg-white/95 backdrop-blur-sm shadow-lg">
                <CardContent className="space-y-3 p-6">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <Award className="h-5 w-5" />
                    {t('awardTitle')}
                  </span>
                  <p className="text-sm text-foreground font-medium">{t('awardDescription')}</p>
                </CardContent>
              </Card>
              <Card className="border border-border bg-white/95 backdrop-blur-sm shadow-lg">
                <CardContent className="space-y-3 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{t('contactHeadOfficeLabel')}</p>
                  <p className="text-base text-foreground font-medium">{t('contactHeadOfficeValue')}</p>
                  <p className="text-base text-foreground font-medium">{t('contactCairoOfficeValue')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Silicomanganese Alloy Gallery - First section after Hero */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className={cn('mb-12 text-center', isRTL && 'text-right')}>
            <h2 className="text-4xl font-bold mb-4">
              {language === 'ar' ? 'سبيكة السيلكون منجنيز' : 'Silicomanganese Alloy'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar'
                ? 'سبيكة سيليكون منجنيز عالية الجودة تستخدم في إنتاج الصلب'
                : 'High-quality silicomanganese ferroalloy used in steel production'}
            </p>
          </div>

          {/* Large Main Image */}
          <div className="mb-6">
            <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl border border-border shadow-2xl bg-muted/30">
              {silicomanganeseImages[selectedSilicomanganeseIndex] && (
                <img
                  src={silicomanganeseImages[selectedSilicomanganeseIndex]}
                  alt={`Silicomanganese Alloy ${selectedSilicomanganeseIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="overflow-x-auto">
            <div className={cn(
              "flex gap-3 justify-center pb-2",
              isRTL && "flex-row-reverse"
            )}>
              {silicomanganeseImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSilicomanganeseIndex(index)}
                  className={cn(
                    "relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 overflow-hidden rounded-lg border-2 transition-all",
                    selectedSilicomanganeseIndex === index
                      ? "border-primary shadow-lg scale-105 ring-2 ring-primary/50"
                      : "border-border hover:border-primary/50 hover:shadow-md opacity-70 hover:opacity-100"
                  )}
                >
                  <img
                    src={img}
                    alt={`Silicomanganese Alloy Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedSilicomanganeseIndex === index && (
                    <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Uses Section - Separate Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className={cn('mb-12 text-center max-w-3xl mx-auto', isRTL && 'text-right')}>
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">{t('usesTitle')}</p>
            <h2 className="text-4xl font-bold mb-4">{t('usesSubtitle')}</h2>
            <p className="text-lg text-muted-foreground">
              {language === 'ar'
                ? 'سبائك متعددة الاستخدامات للصناعات الحرجة'
                : 'Versatile ferroalloys for critical industries'}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {uses.map((item, index) => (
              <Card key={index} className="border border-border/60 bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={cn('flex gap-4', isRTL && 'flex-row-reverse')}>
                    <div className="rounded-full bg-primary/10 p-4 flex-shrink-0">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className={cn('flex-1', isRTL && 'text-right')}>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat, index) => {
              const { count, countRef } = useCountUp(stat.value);
              return (
                <Card key={index} className="border border-border bg-white text-center shadow-md">
                  <CardContent className="space-y-3 p-6">
                    <div ref={countRef} className="text-4xl font-bold text-primary">
                      {count}
                      {stat.suffix}
                    </div>
                    <p className="text-base font-semibold">{stat.label}</p>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Removed: Energy Solutions */}
      {/*<section className="py-20">
        <div className="container mx-auto px-4">
          <div className={cn('mb-12 max-w-3xl', isRTL && 'text-right ml-auto')}>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">{t('energyTitle')}</p>
            <h2 className="mt-4 text-4xl font-bold">{t('energySubtitle')}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {energySolutions.map((solution, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[32px] border border-border/70 bg-black shadow-xl transition hover:-translate-y-1"
              >
                <img
                  src={solution.image}
                  alt={solution.title}
                  className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90" />
                <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-white/30 bg-white/10 p-3">
                      <solution.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-[0.3em]">
                      {t('energyTitle')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{solution.title}</h3>
                    <p className="mt-2 text-sm text-white/80">{solution.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Removed: Extended About, Family, Cases, Product & Sustainability sections */}

      {/* Products Section */}
      <section className="bg-gradient-to-b from-background to-accent py-20">
        <div className="container mx-auto px-4">
          <div className={cn('mb-16 text-center', isRTL && 'text-right')}>
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">{productsSectionLabel}</p>
            <h2 className="text-4xl font-bold mb-4">{productsSectionTitle}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{productsSectionSubtitle}</p>
          </div>

          {/* Industrial Products */}
          <div className="mb-16">
            <div className={cn('mb-8', isRTL && 'text-right')}>
              <h3 className="text-2xl font-semibold mb-2">{industrialProducts}</h3>
              <p className="text-muted-foreground">{industrialProductsDescription}</p>
            </div>
            {productsLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {industrialProductsList.map((product) => {
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
                  const defaultImages = [heroSlideOne, heroSlideTwo, heroSlideThree, mnHome, mnPortfolio14, mnPortfolio16];
                  // Use product.image if it exists and is not empty, otherwise use default
                  const productImage = (product.image && product.image.trim() !== '')
                    ? product.image
                    : defaultImages[product.id % defaultImages.length];

                  return (
                    <Link key={product.id} to={`/product/${product.id}`}>
                      <Card className="group overflow-hidden border border-border shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={productImage.includes('data:image') ? productImage : `${productImage}${productImage.includes('?') ? '&' : '?'}_cb=${product.updated_at ? new Date(product.updated_at).getTime() : Date.now()}`}
                            alt={language === 'ar' ? product.nameAr : product.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            key={`${product.id}-${product.updated_at || Date.now()}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                          <div className="absolute top-4 right-4 rounded-full bg-primary/90 p-3 backdrop-blur">
                            <ProductIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h4 className="text-xl font-semibold mb-2">{language === 'ar' ? product.nameAr : product.name}</h4>
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
            {industrialProductsList.length > 0 && (
              <div className={cn('mt-8 text-center', isRTL && 'text-right')}>
                <Button asChild variant="outline">
                  <Link to="/products/industrial">
                    {t('viewAllProducts')} - {industrialProducts}
                    <ArrowRight className={cn('ml-2 h-4 w-4', isRTL && 'rotate-180')} />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mining Products */}
          <div>
            <div className={cn('mb-8', isRTL && 'text-right')}>
              <h3 className="text-2xl font-semibold mb-2">{miningProducts}</h3>
              <p className="text-muted-foreground">{miningProductsDescription}</p>
            </div>
            {productsLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {miningProductsList.map((product) => {
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
                  const defaultImages = [heroSlideOne, heroSlideTwo, heroSlideThree, mnHome, mnPortfolio14, mnPortfolio16];
                  // Use product.image if it exists and is not empty, otherwise use default
                  const productImage = (product.image && product.image.trim() !== '')
                    ? product.image
                    : defaultImages[product.id % defaultImages.length];

                  return (
                    <Link key={product.id} to={`/product/${product.id}`}>
                      <Card className="group overflow-hidden border border-border shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={productImage.includes('data:image') ? productImage : `${productImage}${productImage.includes('?') ? '&' : '?'}_cb=${product.updated_at ? new Date(product.updated_at).getTime() : Date.now()}`}
                            alt={language === 'ar' ? product.nameAr : product.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            key={`${product.id}-${product.updated_at || Date.now()}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                          <div className="absolute top-4 right-4 rounded-full bg-primary/90 p-3 backdrop-blur">
                            <ProductIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <h4 className="text-lg font-semibold mb-2">{language === 'ar' ? product.nameAr : product.name}</h4>
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
            {miningProductsList.length > 0 && (
              <div className={cn('mt-8 text-center', isRTL && 'text-right')}>
                <Button asChild variant="outline">
                  <Link to="/products/mining">
                    {t('viewAllProducts')} - {miningProducts}
                    <ArrowRight className={cn('ml-2 h-4 w-4', isRTL && 'rotate-180')} />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className={cn('mb-12 text-center', isRTL && 'text-right')}>
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">
              {usePageContent('home', 'clientsSectionLabel', language === 'ar' ? 'عملاؤنا' : 'Our Clients')}
            </p>
            <h2 className="text-4xl font-bold mb-4">
              {usePageContent('home', 'clientsSectionTitle', language === 'ar' ? 'شركاؤنا في النجاح' : 'Our Success Partners')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {usePageContent('home', 'clientsSectionDescription', language === 'ar'
                ? 'نفتخر بشراكاتنا مع الشركات الرائدة في الصناعة'
                : 'We are proud of our partnerships with industry-leading companies')}
            </p>
          </div>

          {/* Clients Carousel */}
          {clientLogos.length > 0 ? (
            <div className="relative overflow-hidden">
              <div className="flex gap-8 animate-scroll" style={{ width: 'max-content' }}>
                {/* Duplicate items for seamless loop */}
                {[...clientLogos, ...clientLogos].map((logo, index) => (
                  <div
                    key={`logo-${index}`}
                    className="flex-shrink-0 w-48 h-32 bg-white rounded-2xl border border-border/70 shadow-lg p-6 flex items-center justify-center hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={logo}
                      alt={`Client logo ${index + 1}`}
                      className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {language === 'ar' ? 'لا توجد صور عملاء متاحة حالياً' : 'No client logos available at the moment'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Removed: Modules CTA section */}

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[minmax(0,1fr)_400px]">
          <Card className="border border-border">
            <CardContent className="space-y-6 p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary">{t('contactSectionTitle')}</p>
                <h3 className="text-3xl font-semibold">{t('contactSectionSubtitle')}</h3>
              </div>
              <div className="space-y-4">
                {contactChannels.map((channel, index) => (
                  <div key={index} className="flex gap-4 rounded-2xl border border-border/70 p-4">
                    <channel.icon className="h-10 w-10 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{channel.label}</p>
                      <p className="text-base font-semibold">{channel.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-lg">
            <CardContent className="space-y-4 p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input placeholder={t('contactFormFirstName')} />
                <Input placeholder={t('contactFormLastName')} />
              </div>
              <Input placeholder={t('contactFormEmail')} />
              <Input placeholder={t('contactFormPhone')} />
              <Textarea placeholder={t('contactFormMessage')} className="h-32" />
              <Button type="submit" className="w-full">
                {t('contactFormSubmit')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
