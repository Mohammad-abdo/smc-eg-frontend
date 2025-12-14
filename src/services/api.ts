// API Service for Dashboard
// Backend is hosted at: https://smc-eg.com/api
// 
// IMPORTANT: Set VITE_API_URL in Vercel Environment Variables if you need to override:
// VITE_API_URL=https://smc-eg.com/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://back.smc-eg.com/api';

// Types
export interface ProductCategory {
  id: number;
  name: string;
  nameAr: string;
  slug: string;
  order: number;
  status: 'active' | 'inactive';
  parent_id?: number | null; // Deprecated - kept for backward compatibility, but should always be null
  image?: string;
}

export interface ProductSpecificationTable {
  title?: string; // Optional title for the table
  columns: string[];
  rows: Array<Array<string>>;
}

export interface ProductSpecificationTables {
  tables: ProductSpecificationTable[]; // Array of tables, each with optional title
}

export interface Product {
  id: number;
  name: string;
  nameAr: string;
  category_id?: number;
  category: 'Industrial' | 'Mining';
  category_name?: string;
  category_nameAr?: string;
  category_slug?: string;
  status: 'active' | 'inactive';
  views: number;
  description: string;
  descriptionAr: string;
  image?: string;
  gallery?: string[]; // Array of base64 images
  specifications_table?: ProductSpecificationTable | ProductSpecificationTables | null;
}

export interface News {
  id: number;
  title: string;
  titleAr: string;
  date: string;
  category: string;
  views: number;
  status: 'published' | 'draft';
  content: string;
  contentAr: string;
  image?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  permissions: string[];
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: 'new' | 'read';
}

export interface Complaint {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'pending' | 'in-progress' | 'resolved';
}

export interface HeroBanner {
  id: number;
  image: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  order: number;
  active: boolean;
}

export interface MediaItem {
  id: number;
  name: string;
  type: 'image' | 'video' | 'file';
  url: string;
  size: string;
  uploaded: string;
}

export interface TenderSubmission {
  id: number;
  tenderId: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  files: string[]; // Base64 encoded files
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface Tender {
  id: number;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  deadline: string;
  description: string;
  descriptionAr: string;
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
  documentFile?: string; // Base64 encoded PDF or document file
  documentFileName?: string; // Original file name
  submissions: TenderSubmission[];
}

export interface Member {
  id: number;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  order: number;
  status: 'active' | 'inactive';
}

export interface Client {
  id: number;
  name: string;
  nameAr: string;
  logo?: string;
  website?: string;
  order: number;
  status: 'active' | 'inactive';
}

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminAuth') : null;
  
  // Get session-based cache buster (changes on each page load)
  let sessionId = '';
  if (typeof window !== 'undefined') {
    sessionId = sessionStorage.getItem('api_session_id') || '';
    if (!sessionId) {
      // Generate new session ID on first load
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      sessionStorage.setItem('api_session_id', sessionId);
    }
  }
  
  // Add aggressive cache-busting with timestamp, random number, version, and session
  const separator = endpoint.includes('?') ? '&' : '?';
  const version = typeof window !== 'undefined' ? localStorage.getItem('api_version') || '1' : '1';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const cacheBuster = `_t=${timestamp}&_r=${random}&_v=${version}&_s=${sessionId}&_cb=${btoa(`${timestamp}-${random}`)}`;
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Log API call in development and production (for debugging)
  console.log('API Call:', {
    method: options?.method || 'GET',
    url,
    endpoint,
    apiBaseUrl: API_BASE_URL,
    isProd: import.meta.env.PROD,
    envApiUrl: import.meta.env.VITE_API_URL,
  });
  
  let response: Response;
  try {
    response = await fetch(url, {
    ...options,
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Request-ID': `${timestamp}-${random}`,
      'X-Session-ID': sessionId,
      // Vercel CDN bypass headers - VERY AGGRESSIVE
      'X-Vercel-Cache-Control': 'no-cache',
      'CDN-Cache-Control': 'no-cache',
      'Vercel-CDN-Cache-Control': 'no-cache',
      'X-Cache-Bypass': 'true',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    cache: 'no-store', // Prevent browser caching
    credentials: 'omit', // Don't send cookies that might affect caching
    });
  } catch (networkError: unknown) {
    // Network error (no internet, CORS, etc.)
    const errorMessage = (networkError instanceof Error ? networkError.message : String(networkError)) || 'Network request failed';
    const errorString = String(networkError).toLowerCase();
    
    // Check for CORS errors - "Failed to fetch" with CORS policy message is usually CORS
    const isCorsError = errorMessage.includes('CORS') || 
                       errorMessage.includes('cors') || 
                       errorMessage.includes('Access-Control') ||
                       (errorMessage.includes('Failed to fetch') && errorString.includes('cors')) ||
                       (errorMessage.includes('Failed to fetch') && typeof window !== 'undefined' && window.location.origin !== new URL(API_BASE_URL).origin);
    
    const isConnectionError = errorMessage.includes('Failed to fetch') || 
                             errorMessage.includes('NetworkError') || 
                             errorMessage.includes('ERR_');
    
    let userFriendlyMessage = '';
    if (isCorsError) {
      userFriendlyMessage = `CORS Error: The backend at ${API_BASE_URL} is not allowing requests from ${typeof window !== 'undefined' ? window.location.origin : 'this origin'}. Please configure CORS on the backend to allow requests from your frontend domain. See CORS_FIX_GUIDE.md for instructions.`;
    } else if (isConnectionError) {
      userFriendlyMessage = `Connection failed: Cannot reach the backend server at ${API_BASE_URL}. Please ensure the backend is running and accessible.`;
    } else {
      userFriendlyMessage = `Network error: ${errorMessage}. Please check your internet connection and ensure the backend is running at ${API_BASE_URL}.`;
    }
    
    console.error('Network Error:', {
      url,
      endpoint,
      apiBaseUrl: API_BASE_URL,
      error: networkError,
      message: errorMessage,
      userFriendlyMessage,
      isCorsError,
      isConnectionError,
    });
    
    throw new Error(userFriendlyMessage);
  }

  if (!response.ok) {
    // Try to get error message from response body
    let errorMessage = response.statusText || `HTTP ${response.status} error`;
    let errorDetails = '';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorData.msg || response.statusText || `HTTP ${response.status} error`;
      errorDetails = errorData.details || '';
      
      // Log full error for debugging
      console.error('API Error Response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        errorData,
        endpoint,
      });
    } catch (e) {
      // If response is not JSON, try to get text
      try {
        const text = await response.text();
        if (text && text.trim()) {
          errorMessage = text;
          // Try to parse as JSON if it looks like JSON
          try {
            const parsed = JSON.parse(text);
            errorMessage = parsed.error || parsed.message || parsed.msg || text;
            errorDetails = parsed.details || '';
          } catch (e2) {
            // Use text as is (might be HTML error page)
            if (text.length > 200) {
              errorMessage = `Server returned error (${response.status}): ${text.substring(0, 200)}...`;
            } else {
              errorMessage = `Server returned error (${response.status}): ${text}`;
            }
          }
        } else {
          // No text content, use status
          errorMessage = response.statusText || `HTTP ${response.status} error`;
        }
      } catch (e2) {
        // Use status text as fallback
        errorMessage = response.statusText || `HTTP ${response.status} error`;
      }
      
      console.error('API Error (non-JSON response):', {
        url,
        status: response.status,
        statusText: response.statusText,
        errorMessage,
        endpoint,
      });
    }
    
    // Add more context to error message
    const fullErrorMessage = errorDetails 
      ? `${errorMessage}${errorDetails ? ` (${errorDetails})` : ''}`
      : errorMessage;
    
    // Provide user-friendly error messages based on status code
    let userFriendlyMessage = fullErrorMessage;
    if (response.status === 0 || response.status === 500) {
      userFriendlyMessage = `Server error: ${fullErrorMessage}. Please check if the backend is running.`;
    } else if (response.status === 404) {
      userFriendlyMessage = `Not found: ${fullErrorMessage}`;
    } else if (response.status === 400) {
      userFriendlyMessage = `Invalid request: ${fullErrorMessage}`;
    } else if (response.status === 401 || response.status === 403) {
      userFriendlyMessage = `Authentication error: ${fullErrorMessage}`;
    } else if (response.status >= 500) {
      userFriendlyMessage = `Server error (${response.status}): ${fullErrorMessage}`;
    }
    
    console.error('API Error (final):', {
      url,
      status: response.status,
      statusText: response.statusText,
      errorMessage: fullErrorMessage,
      userFriendlyMessage,
      endpoint,
    });
    
    throw new Error(userFriendlyMessage);
  }

  return response.json();
}

// Products API
export const productsAPI = {
  getAll: () => apiCall<Product[]>('/products'),
  getById: (id: number) => apiCall<Product>(`/products/${id}`),
  create: (product: Omit<Product, 'id'>) => apiCall<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id: number, product: Partial<Product>) => apiCall<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  delete: (id: number) => apiCall<void>(`/products/${id}`, { method: 'DELETE' }),
};

// News API
export const newsAPI = {
  getAll: () => apiCall<News[]>('/news'),
  getById: (id: number) => apiCall<News>(`/news/${id}`),
  create: (news: Omit<News, 'id'>) => apiCall<News>('/news', {
    method: 'POST',
    body: JSON.stringify(news),
  }),
  update: (id: number, news: Partial<News>) => apiCall<News>(`/news/${id}`, {
    method: 'PUT',
    body: JSON.stringify(news),
  }),
  delete: (id: number) => apiCall<void>(`/news/${id}`, { method: 'DELETE' }),
};

// Users API
export const usersAPI = {
  getAll: () => apiCall<User[]>('/users'),
  getById: (id: number) => apiCall<User>(`/users/${id}`),
  create: (user: Omit<User, 'id'>) => apiCall<User>('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  update: (id: number, user: Partial<User>) => apiCall<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  }),
  delete: (id: number) => apiCall<void>(`/users/${id}`, { method: 'DELETE' }),
};

// Contacts API
export const contactsAPI = {
  getAll: () => apiCall<Contact[]>('/contacts'),
  getById: (id: number) => apiCall<Contact>(`/contacts/${id}`),
  update: (id: number, contact: Partial<Contact>) => apiCall<Contact>(`/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(contact),
  }),
  delete: (id: number) => apiCall<void>(`/contacts/${id}`, { method: 'DELETE' }),
};

// Complaints API
export const complaintsAPI = {
  getAll: () => apiCall<Complaint[]>('/complaints'),
  getById: (id: number) => apiCall<Complaint>(`/complaints/${id}`),
  update: (id: number, complaint: Partial<Complaint>) => apiCall<Complaint>(`/complaints/${id}`, {
    method: 'PUT',
    body: JSON.stringify(complaint),
  }),
  delete: (id: number) => apiCall<void>(`/complaints/${id}`, { method: 'DELETE' }),
};

// Hero Banners API
export const bannersAPI = {
  getAll: () => apiCall<HeroBanner[]>('/banners'),
  getById: (id: number) => apiCall<HeroBanner>(`/banners/${id}`),
  create: (banner: Omit<HeroBanner, 'id'>) => apiCall<HeroBanner>('/banners', {
    method: 'POST',
    body: JSON.stringify(banner),
  }),
  update: (id: number, banner: Partial<HeroBanner>) => apiCall<HeroBanner>(`/banners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(banner),
  }),
  delete: (id: number) => apiCall<void>(`/banners/${id}`, { method: 'DELETE' }),
};

// Media API
export const mediaAPI = {
  getAll: () => apiCall<MediaItem[]>('/media'),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiCall<MediaItem>('/media/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it
    });
  },
  delete: (id: number) => apiCall<void>(`/media/${id}`, { method: 'DELETE' }),
};

// Statistics API
export const statisticsAPI = {
  getOverview: () => apiCall<{
    totalProducts: number;
    totalNews: number;
    totalContacts: number;
    totalComplaints: number;
    totalRevenue: string;
    monthlyGrowth: string;
    totalViews: number;
  }>('/statistics/overview'),
  getMonthlyData: () => apiCall<Array<{ month: string; views: number; visitors: number }>>('/statistics/monthly'),
  getProductViews: () => apiCall<Array<{ product: string; views: number }>>('/statistics/product-views'),
};

// Tenders API
export const tendersAPI = {
  getAll: () => apiCall<Tender[]>('/tenders'),
  getById: (id: number) => apiCall<Tender>(`/tenders/${id}`),
  create: (tender: Omit<Tender, 'id' | 'createdAt' | 'submissions'>) => apiCall<Tender>('/tenders', {
    method: 'POST',
    body: JSON.stringify(tender),
  }),
  update: (id: number, tender: Partial<Tender>) => apiCall<Tender>(`/tenders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tender),
  }),
  delete: (id: number) => apiCall<void>(`/tenders/${id}`, { method: 'DELETE' }),
  submit: (tenderId: number, submission: Omit<TenderSubmission, 'id' | 'submittedAt' | 'status'>) => apiCall<TenderSubmission>('/tenders/submit', {
    method: 'POST',
    body: JSON.stringify({ tenderId, ...submission }),
  }),
  getSubmissions: (tenderId: number) => apiCall<TenderSubmission[]>(`/tenders/${tenderId}/submissions`),
  updateSubmissionStatus: (tenderId: number, submissionId: number, status: TenderSubmission['status']) => apiCall<TenderSubmission>(`/tenders/${tenderId}/submissions/${submissionId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};

// Members API
export const membersAPI = {
  getAll: () => apiCall<Member[]>('/members'),
  getById: (id: number) => apiCall<Member>(`/members/${id}`),
  create: (member: Omit<Member, 'id'>) => apiCall<Member>('/members', {
    method: 'POST',
    body: JSON.stringify(member),
  }),
  update: (id: number, member: Partial<Member>) => apiCall<Member>(`/members/${id}`, {
    method: 'PUT',
    body: JSON.stringify(member),
  }),
  delete: (id: number) => apiCall<void>(`/members/${id}`, { method: 'DELETE' }),
};

// Clients API
export const clientsAPI = {
  getAll: () => apiCall<Client[]>('/clients'),
  getById: (id: number) => apiCall<Client>(`/clients/${id}`),
  create: (client: Omit<Client, 'id'>) => apiCall<Client>('/clients', {
    method: 'POST',
    body: JSON.stringify(client),
  }),
  update: (id: number, client: Partial<Client>) => apiCall<Client>(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(client),
  }),
  delete: (id: number) => apiCall<void>(`/clients/${id}`, { method: 'DELETE' }),
};

// Product Categories API
export const productCategoriesAPI = {
  getAll: () => apiCall<ProductCategory[]>('/product-categories'),
  getById: (id: number) => apiCall<ProductCategory>(`/product-categories/${id}`),
  create: (category: Omit<ProductCategory, 'id'>) => apiCall<ProductCategory>('/product-categories', {
    method: 'POST',
    body: JSON.stringify(category),
  }),
  update: (id: number, category: Partial<ProductCategory>) => apiCall<ProductCategory>(`/product-categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  }),
  delete: (id: number) => apiCall<void>(`/product-categories/${id}`, { method: 'DELETE' }),
};

