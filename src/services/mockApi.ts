// Mock API for development - simulates backend API
import type { Product, News, User, Contact, Complaint, HeroBanner, MediaItem, Tender, TenderSubmission, Member, ProductCategory } from './api';
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

// Helper functions for localStorage
const getStorageKey = (key: string) => `smc_dashboard_${key}`;

const loadFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const stored = localStorage.getItem(getStorageKey(key));
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T[]) => {
  try {
    localStorage.setItem(getStorageKey(key), JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error);
  }
};

// Mock Data Storage (simulates database) - Load from localStorage or use defaults
const defaultProducts: Product[] = [
  { id: 1, name: 'Silicomanganese Alloy', nameAr: 'سبيكة السيلكون منجنيز', category: 'Industrial', status: 'active', views: 1245, description: 'High-quality silicomanganese ferroalloy used in steel production', descriptionAr: 'سبيكة سيليكون منجنيز عالية الجودة تستخدم في إنتاج الصلب', image: image1 },
  { id: 2, name: 'Calcined Gypsum', nameAr: 'جبس مكلسن', category: 'Industrial', status: 'active', views: 892, description: 'Processed gypsum', descriptionAr: 'جبس معالج' },
  { id: 3, name: 'Kaolin', nameAr: 'كاولين', category: 'Mining', status: 'active', views: 654, description: 'Premium quality kaolin', descriptionAr: 'كاولين عالي الجودة' },
  { id: 4, name: 'Silica Sand', nameAr: 'رمال سيلكا', category: 'Mining', status: 'active', views: 1123, description: 'High-purity silica sand', descriptionAr: 'رمال سيلكا عالية النقاء' },
  { id: 5, name: 'Raw Gypsum', nameAr: 'جبس خام', category: 'Mining', status: 'active', views: 567, description: 'Natural gypsum ore', descriptionAr: 'خام الجبس الطبيعي' },
  { id: 6, name: 'Iron Oxide', nameAr: 'أكسيد الحديد', category: 'Mining', status: 'active', views: 432, description: 'High-grade iron oxide', descriptionAr: 'أكسيد حديد عالي الجودة' },
  { id: 7, name: 'Fine Manganese', nameAr: 'منجنيز ناعم', category: 'Mining', status: 'active', views: 789, description: 'Premium fine manganese powder', descriptionAr: 'مسحوق منجنيز ناعم مميز' },
];

let mockProducts: Product[] = loadFromStorage('products', defaultProducts);

const defaultNews: News[] = [
  { id: 1, title: 'SMC Expands Production Capacity', titleAr: 'شركة سيناء للمنجنيز توسع قدرة الإنتاج', date: '2024-11-01', category: 'Company News', views: 2341, status: 'published', content: 'Full content...', contentAr: 'المحتوى الكامل...' },
  { id: 2, title: 'New Quality Certifications Achieved', titleAr: 'تحقيق شهادات الجودة الجديدة', date: '2024-10-15', category: 'Awards', views: 1892, status: 'published', content: 'Full content...', contentAr: 'المحتوى الكامل...' },
  { id: 3, title: 'Sustainability Initiative Launch', titleAr: 'إطلاق مبادرة الاستدامة', date: '2024-09-28', category: 'Sustainability', views: 1567, status: 'published', content: 'Full content...', contentAr: 'المحتوى الكامل...' },
  { id: 4, title: 'Partnership with Leading Steel Manufacturers', titleAr: 'شراكة مع مصنعي الصلب الرائدين', date: '2024-09-10', category: 'Partnership', views: 2134, status: 'published', content: 'Full content...', contentAr: 'المحتوى الكامل...' },
  { id: 5, title: 'Investment in Renewable Energy', titleAr: 'الاستثمار في الطاقة المتجددة', date: '2024-08-22', category: 'Infrastructure', views: 1789, status: 'published', content: 'Full content...', contentAr: 'المحتوى الكامل...' },
  { id: 6, title: 'Employee Training Program Success', titleAr: 'نجاح برنامج تدريب الموظفين', date: '2024-08-05', category: 'Training', views: 1456, status: 'published', content: 'Full content...', contentAr: 'المحتوى الكامل...' },
];

let mockNews: News[] = loadFromStorage('news', defaultNews);

const defaultUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@smc-eg.com', role: 'admin', status: 'active', permissions: ['all'] },
  { id: 2, name: 'Editor User', email: 'editor@smc-eg.com', role: 'editor', status: 'active', permissions: ['products', 'news'] },
  { id: 3, name: 'Viewer User', email: 'viewer@smc-eg.com', role: 'viewer', status: 'active', permissions: ['view'] },
];

let mockUsers: User[] = loadFromStorage('users', defaultUsers);

const defaultContacts: Contact[] = [
  { id: 1, name: 'Ahmed Mohamed', email: 'ahmed@example.com', phone: '+201234567890', message: 'Interested in your products', date: '2024-11-15', status: 'new' },
  { id: 2, name: 'Sara Ali', email: 'sara@example.com', phone: '+201234567891', message: 'Request for quotation', date: '2024-11-14', status: 'read' },
  { id: 3, name: 'Mohamed Hassan', email: 'mohamed@example.com', phone: '+201234567892', message: 'Partnership inquiry', date: '2024-11-13', status: 'new' },
  { id: 4, name: 'Fatima Ibrahim', email: 'fatima@example.com', phone: '+201234567893', message: 'Product information request', date: '2024-11-12', status: 'read' },
];

let mockContacts: Contact[] = loadFromStorage('contacts', defaultContacts);

const defaultComplaints: Complaint[] = [
  { id: 1, name: 'Omar Khaled', email: 'omar@example.com', subject: 'Product Quality Issue', message: 'The product quality was not as expected...', date: '2024-11-15', status: 'pending' },
  { id: 2, name: 'Layla Ahmed', email: 'layla@example.com', subject: 'Delivery Delay', message: 'My order was delayed...', date: '2024-11-14', status: 'resolved' },
  { id: 3, name: 'Youssef Mohamed', email: 'youssef@example.com', subject: 'Customer Service', message: 'Need better customer service...', date: '2024-11-13', status: 'in-progress' },
];

let mockComplaints: Complaint[] = loadFromStorage('complaints', defaultComplaints);

const defaultBanners: HeroBanner[] = [
  {
    id: 1,
    image: heroSlideOne,
    title: 'Sinai Manganese Co.',
    titleAr: 'شركة سيناء للمنجنيز',
    subtitle: 'First and Largest Producer of Manganese Ore in Egypt',
    subtitleAr: 'أول وأكبر منتج لخام المنجنيز في مصر',
    description: 'Sinai Manganese Co. SMC was founded on May 18th, 1957, to exploit the manganese deposits in Sinai Peninsula, Egypt.',
    descriptionAr: 'تأسست شركة سيناء للمنجنيز في 18 مايو 1957 لاستغلال رواسب المنجنيز في شبه جزيرة سيناء، مصر.',
    order: 1,
    active: true,
  },
  {
    id: 2,
    image: heroSlideTwo,
    title: 'Industrial Excellence',
    titleAr: 'التميز الصناعي',
    subtitle: 'Leading the Manganese Industry',
    subtitleAr: 'ريادة صناعة المنجنيز',
    description: 'Producing high-quality Silicomanganese with state-of-the-art facilities.',
    descriptionAr: 'إنتاج سيليكون منجنيز عالي الجودة بمرافق حديثة.',
    order: 2,
    active: true,
  },
  {
    id: 3,
    image: heroSlideThree,
    title: 'Sustainable Production',
    titleAr: 'الإنتاج المستدام',
    subtitle: 'Committed to Excellence',
    subtitleAr: 'ملتزمون بالتميز',
    description: 'Delivering quality products while maintaining environmental standards.',
    descriptionAr: 'تقديم منتجات عالية الجودة مع الحفاظ على المعايير البيئية.',
    order: 3,
    active: true,
  },
];

let mockBanners: HeroBanner[] = loadFromStorage('banners', defaultBanners);

const defaultMedia: MediaItem[] = [
  { id: 1, name: 'hero-slide-1.jpg', type: 'image', url: heroSlideOne, size: '147 KB', uploaded: '2024-11-01' },
  { id: 2, name: 'hero-slide-2.jpg', type: 'image', url: heroSlideTwo, size: '44 KB', uploaded: '2024-11-01' },
  { id: 3, name: 'hero-slide-3.jpg', type: 'image', url: heroSlideThree, size: '82 KB', uploaded: '2024-11-01' },
  { id: 4, name: 'about-image.jpg', type: 'image', url: mnHome, size: '51 KB', uploaded: '2024-10-28' },
  { id: 5, name: 'portfolio-14.jpg', type: 'image', url: mnPortfolio14, size: '87 KB', uploaded: '2024-10-25' },
  { id: 6, name: 'portfolio-16.jpg', type: 'image', url: mnPortfolio16, size: '117 KB', uploaded: '2024-10-25' },
];

let mockMedia: MediaItem[] = loadFromStorage('media', defaultMedia);

// Members Mock Data
const defaultMembers: Member[] = [
  {
    id: 1,
    name: 'Eng. Gamal Fathy Abdel Fattah',
    nameAr: 'السيد الكيمائي / جمال فتحي عبدالفتاح',
    title: 'Chairman of the Board',
    titleAr: 'رئيس مجلس الادارة',
    order: 1,
    status: 'active',
  },
  {
    id: 2,
    name: 'Eng. Mostafa Taher',
    nameAr: 'السيد الجيولوجي / مصطفي طاهر',
    title: 'Executive Managing Director',
    titleAr: 'العضو المنتدب التنفيذي',
    order: 2,
    status: 'active',
  },
];

let mockMembers: Member[] = loadFromStorage('members', defaultMembers);

// Product Categories Mock Data
const defaultProductCategories: ProductCategory[] = [
  {
    id: 1,
    name: 'Industrial Products',
    nameAr: 'المنتجات الصناعية',
    slug: 'industrial',
    order: 1,
    status: 'active',
  },
  {
    id: 2,
    name: 'Mining Products',
    nameAr: 'منتجات التعدين',
    slug: 'mining',
    order: 2,
    status: 'active',
  },
];

let mockProductCategories: ProductCategory[] = loadFromStorage('productCategories', defaultProductCategories);

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Implementation
export const mockApi = {
  products: {
    getAll: async () => {
      await delay(300);
      return [...mockProducts];
    },
    getById: async (id: number) => {
      await delay(200);
      return mockProducts.find(p => p.id === id);
    },
    create: async (product: Omit<Product, 'id'>) => {
      await delay(400);
      const newProduct = { ...product, id: Math.max(...mockProducts.map(p => p.id), 0) + 1 };
      mockProducts.push(newProduct);
      saveToStorage('products', mockProducts);
      return newProduct;
    },
    update: async (id: number, updates: Partial<Product>) => {
      await delay(400);
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...updates };
        saveToStorage('products', mockProducts);
        return mockProducts[index];
      }
      throw new Error('Product not found');
    },
    delete: async (id: number) => {
      await delay(300);
      mockProducts = mockProducts.filter(p => p.id !== id);
      saveToStorage('products', mockProducts);
    },
  },
  news: {
    getAll: async () => {
      await delay(300);
      return [...mockNews];
    },
    getById: async (id: number) => {
      await delay(200);
      return mockNews.find(n => n.id === id);
    },
    create: async (news: Omit<News, 'id'>) => {
      await delay(400);
      const newNews = { ...news, id: Math.max(...mockNews.map(n => n.id), 0) + 1 };
      mockNews.push(newNews);
      saveToStorage('news', mockNews);
      return newNews;
    },
    update: async (id: number, updates: Partial<News>) => {
      await delay(400);
      const index = mockNews.findIndex(n => n.id === id);
      if (index !== -1) {
        mockNews[index] = { ...mockNews[index], ...updates };
        saveToStorage('news', mockNews);
        return mockNews[index];
      }
      throw new Error('News not found');
    },
    delete: async (id: number) => {
      await delay(300);
      mockNews = mockNews.filter(n => n.id !== id);
      saveToStorage('news', mockNews);
    },
  },
  users: {
    getAll: async () => {
      await delay(300);
      return [...mockUsers];
    },
    getById: async (id: number) => {
      await delay(200);
      return mockUsers.find(u => u.id === id);
    },
    create: async (user: Omit<User, 'id'>) => {
      await delay(400);
      const newUser = { ...user, id: Math.max(...mockUsers.map(u => u.id), 0) + 1 };
      mockUsers.push(newUser);
      saveToStorage('users', mockUsers);
      return newUser;
    },
    update: async (id: number, updates: Partial<User>) => {
      await delay(400);
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...updates };
        saveToStorage('users', mockUsers);
        return mockUsers[index];
      }
      throw new Error('User not found');
    },
    delete: async (id: number) => {
      await delay(300);
      mockUsers = mockUsers.filter(u => u.id !== id);
      saveToStorage('users', mockUsers);
    },
  },
  contacts: {
    getAll: async () => {
      await delay(300);
      return [...mockContacts];
    },
    getById: async (id: number) => {
      await delay(200);
      return mockContacts.find(c => c.id === id);
    },
    update: async (id: number, updates: Partial<Contact>) => {
      await delay(400);
      const index = mockContacts.findIndex(c => c.id === id);
      if (index !== -1) {
        mockContacts[index] = { ...mockContacts[index], ...updates };
        saveToStorage('contacts', mockContacts);
        return mockContacts[index];
      }
      throw new Error('Contact not found');
    },
    delete: async (id: number) => {
      await delay(300);
      mockContacts = mockContacts.filter(c => c.id !== id);
      saveToStorage('contacts', mockContacts);
    },
  },
  complaints: {
    getAll: async () => {
      await delay(300);
      return [...mockComplaints];
    },
    getById: async (id: number) => {
      await delay(200);
      return mockComplaints.find(c => c.id === id);
    },
    update: async (id: number, updates: Partial<Complaint>) => {
      await delay(400);
      const index = mockComplaints.findIndex(c => c.id === id);
      if (index !== -1) {
        mockComplaints[index] = { ...mockComplaints[index], ...updates };
        saveToStorage('complaints', mockComplaints);
        return mockComplaints[index];
      }
      throw new Error('Complaint not found');
    },
    delete: async (id: number) => {
      await delay(300);
      mockComplaints = mockComplaints.filter(c => c.id !== id);
      saveToStorage('complaints', mockComplaints);
    },
  },
  banners: {
    getAll: async () => {
      await delay(300);
      return [...mockBanners];
    },
    getById: async (id: number) => {
      await delay(200);
      return mockBanners.find(b => b.id === id);
    },
    create: async (banner: Omit<HeroBanner, 'id'>) => {
      await delay(400);
      const newBanner = { ...banner, id: Math.max(...mockBanners.map(b => b.id), 0) + 1 };
      mockBanners.push(newBanner);
      saveToStorage('banners', mockBanners);
      return newBanner;
    },
    update: async (id: number, updates: Partial<HeroBanner>) => {
      await delay(400);
      const index = mockBanners.findIndex(b => b.id === id);
      if (index !== -1) {
        mockBanners[index] = { ...mockBanners[index], ...updates };
        saveToStorage('banners', mockBanners);
        return mockBanners[index];
      }
      throw new Error('Banner not found');
    },
    delete: async (id: number) => {
      await delay(300);
      mockBanners = mockBanners.filter(b => b.id !== id);
      saveToStorage('banners', mockBanners);
    },
  },
  media: {
    getAll: async () => {
      await delay(300);
      return [...mockMedia];
    },
    upload: async (file: File) => {
      await delay(500);
      const newMedia: MediaItem = {
        id: Math.max(...mockMedia.map(m => m.id), 0) + 1,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploaded: new Date().toISOString().split('T')[0],
      };
      mockMedia.push(newMedia);
      saveToStorage('media', mockMedia);
      return newMedia;
    },
    delete: async (id: number) => {
      await delay(300);
      mockMedia = mockMedia.filter(m => m.id !== id);
      saveToStorage('media', mockMedia);
    },
  },
  statistics: {
    getOverview: async () => {
      await delay(300);
      return {
        totalProducts: mockProducts.length,
        totalNews: mockNews.length,
        totalContacts: mockContacts.length,
        totalComplaints: mockComplaints.length,
        totalRevenue: '78M',
        monthlyGrowth: '+15%',
        totalViews: 12456,
      };
    },
    getMonthlyData: async () => {
      await delay(300);
      return [
        { month: 'Jan', views: 1200, visitors: 800 },
        { month: 'Feb', views: 1900, visitors: 1200 },
        { month: 'Mar', views: 3000, visitors: 1800 },
        { month: 'Apr', views: 2780, visitors: 1900 },
        { month: 'May', views: 1890, visitors: 1300 },
        { month: 'Jun', views: 2390, visitors: 1500 },
      ];
    },
    getProductViews: async () => {
      await delay(300);
      return mockProducts.map(p => ({ product: p.name, views: p.views }));
    },
  },
  tenders: {
    getAll: async () => {
      await delay(300);
      // Load submissions for each tender
      const tendersWithSubmissions = mockTenders.map(tender => ({
        ...tender,
        submissions: mockSubmissions.filter(s => s.tenderId === tender.id),
      }));
      return tendersWithSubmissions;
    },
    getById: async (id: number) => {
      await delay(200);
      const tender = mockTenders.find(t => t.id === id);
      if (tender) {
        return {
          ...tender,
          submissions: mockSubmissions.filter(s => s.tenderId === id),
        };
      }
      return undefined;
    },
    create: async (tender: Omit<Tender, 'id' | 'createdAt' | 'submissions'>) => {
      await delay(400);
      const maxId = mockTenders.length > 0 ? Math.max(...mockTenders.map(t => t.id)) : 0;
      const newTender: Tender = {
        ...tender,
        id: maxId + 1,
        createdAt: new Date().toISOString().split('T')[0],
        submissions: [],
      };
      mockTenders.push(newTender);
      saveToStorage('tenders', mockTenders);
      return newTender;
    },
    update: async (id: number, updates: Partial<Tender>) => {
      await delay(400);
      const index = mockTenders.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTenders[index] = { ...mockTenders[index], ...updates };
        saveToStorage('tenders', mockTenders);
        return {
          ...mockTenders[index],
          submissions: mockSubmissions.filter(s => s.tenderId === id),
        };
      }
      throw new Error('Tender not found');
    },
    delete: async (id: number) => {
      await delay(300);
      mockTenders = mockTenders.filter(t => t.id !== id);
      mockSubmissions = mockSubmissions.filter(s => s.tenderId !== id);
      saveToStorage('tenders', mockTenders);
      saveToStorage('tenderSubmissions', mockSubmissions);
    },
    submit: async (tenderId: number, submission: Omit<TenderSubmission, 'id' | 'submittedAt' | 'status'>) => {
      await delay(500);
      const newSubmission: TenderSubmission = {
        ...submission,
        id: Math.max(...mockSubmissions.map(s => s.id), 0) + 1,
        tenderId,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      };
      mockSubmissions.push(newSubmission);
      saveToStorage('tenderSubmissions', mockSubmissions);
      return newSubmission;
    },
    getSubmissions: async (tenderId: number) => {
      await delay(300);
      return mockSubmissions.filter(s => s.tenderId === tenderId);
    },
    updateSubmissionStatus: async (tenderId: number, submissionId: number, status: TenderSubmission['status']) => {
      await delay(400);
      const index = mockSubmissions.findIndex(s => s.id === submissionId && s.tenderId === tenderId);
      if (index !== -1) {
        mockSubmissions[index] = { ...mockSubmissions[index], status };
        saveToStorage('tenderSubmissions', mockSubmissions);
        return mockSubmissions[index];
      }
      throw new Error('Submission not found');
    },
  },
  members: {
    getAll: async () => {
      await delay(300);
      return mockMembers.filter(m => m.status === 'active').sort((a, b) => a.order - b.order);
    },
    getById: async (id: number) => {
      await delay(200);
      return mockMembers.find(m => m.id === id);
    },
    create: async (member: Omit<Member, 'id'>) => {
      await delay(400);
      const maxId = mockMembers.length > 0 ? Math.max(...mockMembers.map(m => m.id)) : 0;
      const newMember: Member = {
        ...member,
        id: maxId + 1,
      };
      mockMembers.push(newMember);
      saveToStorage('members', mockMembers);
      return newMember;
    },
    update: async (id: number, updates: Partial<Member>) => {
      await delay(400);
      const index = mockMembers.findIndex(m => m.id === id);
      if (index !== -1) {
        mockMembers[index] = { ...mockMembers[index], ...updates };
        saveToStorage('members', mockMembers);
        return mockMembers[index];
      }
      throw new Error('Member not found');
    },
    delete: async (id: number) => {
      await delay(300);
      mockMembers = mockMembers.filter(m => m.id !== id);
      saveToStorage('members', mockMembers);
    },
  },
  productCategories: {
    getAll: async () => {
      await delay(300);
      return mockProductCategories.filter(c => c.status === 'active').sort((a, b) => a.order - b.order);
    },
    getById: async (id: number) => {
      await delay(200);
      return mockProductCategories.find(c => c.id === id);
    },
    create: async (category: Omit<ProductCategory, 'id'>) => {
      await delay(400);
      const maxId = mockProductCategories.length > 0 ? Math.max(...mockProductCategories.map(c => c.id)) : 0;
      const newCategory: ProductCategory = {
        ...category,
        id: maxId + 1,
      };
      mockProductCategories.push(newCategory);
      saveToStorage('productCategories', mockProductCategories);
      return newCategory;
    },
    update: async (id: number, updates: Partial<ProductCategory>) => {
      await delay(400);
      const index = mockProductCategories.findIndex(c => c.id === id);
      if (index !== -1) {
        mockProductCategories[index] = { ...mockProductCategories[index], ...updates };
        saveToStorage('productCategories', mockProductCategories);
        return mockProductCategories[index];
      }
      throw new Error('Category not found');
    },
    delete: async (id: number) => {
      await delay(300);
      mockProductCategories = mockProductCategories.filter(c => c.id !== id);
      saveToStorage('productCategories', mockProductCategories);
    },
  },
};

