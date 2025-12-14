// Custom hook to switch between real API and mock API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, newsAPI, usersAPI, contactsAPI, complaintsAPI, bannersAPI, mediaAPI, statisticsAPI, tendersAPI, membersAPI, clientsAPI, productCategoriesAPI } from '@/services/api';
import { mockApi } from '@/services/mockApi';
import type { Product, News, User, Contact, Complaint, HeroBanner, Tender, TenderSubmission, Member, Client, ProductCategory } from '@/services/api';

// Use real API by default - set VITE_USE_MOCK_API=true in .env to use mock API
// For production, always use real API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'; // Default to false (use real API)

// Products Hooks
export const useProducts = () => {
  // Generate unique query key with timestamp to force fresh fetch
  const sessionTimestamp = typeof window !== 'undefined' 
    ? sessionStorage.getItem('page_load_time') || Date.now().toString()
    : Date.now().toString();
  
  if (typeof window !== 'undefined' && !sessionStorage.getItem('page_load_time')) {
    sessionStorage.setItem('page_load_time', sessionTimestamp);
  }
  
  return useQuery({
    queryKey: ['products', sessionTimestamp], // Add timestamp to force new query on each page load
    queryFn: async () => {
      // Force fresh fetch every time - no caching
      // Add small delay to ensure CDN doesn't cache
      if (!USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      const result = USE_MOCK_API ? mockApi.products.getAll() : productsAPI.getAll();
      return result;
    },
    staleTime: 0, // Data is immediately stale, will refetch on mount
    gcTime: 0, // Don't cache in memory (formerly cacheTime) - set to 0 to disable cache completely
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    refetchInterval: false, // Don't auto-refetch, but allow manual refetch
    networkMode: 'online', // Only fetch when online
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => USE_MOCK_API ? mockApi.products.getById(id) : productsAPI.getById(id),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Omit<Product, 'id'>) => 
      USE_MOCK_API ? mockApi.products.create(product) : productsAPI.create(product),
    onSuccess: async (newProduct) => {
      // Increment API version to force CDN refresh on Vercel
      if (typeof window !== 'undefined') {
        const currentVersion = parseInt(localStorage.getItem('api_version') || '1', 10);
        localStorage.setItem('api_version', (currentVersion + 1).toString());
      }
      // Remove ALL product queries from cache
      queryClient.removeQueries({ queryKey: ['products'], exact: false });
      // Invalidate all product queries
      await queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
      // Force refetch all product queries with new timestamp
      await queryClient.refetchQueries({ queryKey: ['products'], exact: false });
      // Clear and reset cache
      queryClient.resetQueries({ queryKey: ['products'], exact: false });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Product> }) =>
      USE_MOCK_API ? mockApi.products.update(id, updates) : productsAPI.update(id, updates),
    onSuccess: async (updatedProduct, variables) => {
      // Increment API version to force CDN refresh on Vercel
      if (typeof window !== 'undefined') {
        const currentVersion = parseInt(localStorage.getItem('api_version') || '1', 10);
        localStorage.setItem('api_version', (currentVersion + 1).toString());
      }
      // Remove ALL product queries from cache
      queryClient.removeQueries({ queryKey: ['products'], exact: false });
      // Invalidate all product queries
      await queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
      await queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      // Force refetch all product queries
      await queryClient.refetchQueries({ queryKey: ['products'], exact: false });
      // Clear and reset cache
      queryClient.resetQueries({ queryKey: ['products'], exact: false });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.products.delete(id) : productsAPI.delete(id),
    onSuccess: async (_, deletedId) => {
      // Increment API version to force CDN refresh on Vercel
      if (typeof window !== 'undefined') {
        const currentVersion = parseInt(localStorage.getItem('api_version') || '1', 10);
        localStorage.setItem('api_version', (currentVersion + 1).toString());
      }
      // Remove ALL product queries from cache
      queryClient.removeQueries({ queryKey: ['products'], exact: false });
      // Invalidate all product queries
      await queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
      // Force refetch all product queries
      await queryClient.refetchQueries({ queryKey: ['products'], exact: false });
      // Clear and reset cache
      queryClient.resetQueries({ queryKey: ['products'], exact: false });
    },
  });
};

// News Hooks
export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => USE_MOCK_API ? mockApi.news.getAll() : newsAPI.getAll(),
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (news: Omit<News, 'id'>) =>
      USE_MOCK_API ? mockApi.news.create(news) : newsAPI.create(news),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<News> }) =>
      USE_MOCK_API ? mockApi.news.update(id, updates) : newsAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.news.delete(id) : newsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

// Users Hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => USE_MOCK_API ? mockApi.users.getAll() : usersAPI.getAll(),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: Omit<User, 'id'>) =>
      USE_MOCK_API ? mockApi.users.create(user) : usersAPI.create(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<User> }) =>
      USE_MOCK_API ? mockApi.users.update(id, updates) : usersAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.users.delete(id) : usersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Contacts Hooks
export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: () => USE_MOCK_API ? mockApi.contacts.getAll() : contactsAPI.getAll(),
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Contact> }) =>
      USE_MOCK_API ? mockApi.contacts.update(id, updates) : contactsAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

// Complaints Hooks
export const useComplaints = () => {
  return useQuery({
    queryKey: ['complaints'],
    queryFn: () => USE_MOCK_API ? mockApi.complaints.getAll() : complaintsAPI.getAll(),
  });
};

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Complaint> }) =>
      USE_MOCK_API ? mockApi.complaints.update(id, updates) : complaintsAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
};

// Banners Hooks
export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: () => USE_MOCK_API ? mockApi.banners.getAll() : bannersAPI.getAll(),
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (banner: Omit<HeroBanner, 'id'>) =>
      USE_MOCK_API ? mockApi.banners.create(banner) : bannersAPI.create(banner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<HeroBanner> }) =>
      USE_MOCK_API ? mockApi.banners.update(id, updates) : bannersAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.banners.delete(id) : bannersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};

// Media Hooks
export const useMedia = () => {
  return useQuery({
    queryKey: ['media'],
    queryFn: () => USE_MOCK_API ? mockApi.media.getAll() : mediaAPI.getAll(),
    retry: 1, // Only retry once to prevent infinite loops
    retryDelay: 1000, // Wait 1 second before retry
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) =>
      USE_MOCK_API ? mockApi.media.upload(file) : mediaAPI.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
};

// Statistics Hooks
export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: () => USE_MOCK_API ? mockApi.statistics.getOverview() : statisticsAPI.getOverview(),
  });
};

export const useMonthlyData = () => {
  return useQuery({
    queryKey: ['statistics', 'monthly'],
    queryFn: () => USE_MOCK_API ? mockApi.statistics.getMonthlyData() : statisticsAPI.getMonthlyData(),
  });
};

export const useProductViews = () => {
  return useQuery({
    queryKey: ['statistics', 'product-views'],
    queryFn: () => USE_MOCK_API ? mockApi.statistics.getProductViews() : statisticsAPI.getProductViews(),
  });
};

// Tenders Hooks
export const useTenders = () => {
  return useQuery({
    queryKey: ['tenders'],
    queryFn: () => USE_MOCK_API ? mockApi.tenders.getAll() : tendersAPI.getAll(),
  });
};

export const useTender = (id: number) => {
  return useQuery({
    queryKey: ['tenders', id],
    queryFn: () => USE_MOCK_API ? mockApi.tenders.getById(id) : tendersAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tender: Omit<Tender, 'id' | 'createdAt' | 'submissions'>) =>
      USE_MOCK_API ? mockApi.tenders.create(tender) : tendersAPI.create(tender),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
    },
  });
};

export const useUpdateTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Tender> }) =>
      USE_MOCK_API ? mockApi.tenders.update(id, updates) : tendersAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
    },
  });
};

export const useDeleteTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.tenders.delete(id) : tendersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
    },
  });
};

export const useSubmitTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenderId, submission }: { tenderId: number; submission: Omit<TenderSubmission, 'id' | 'submittedAt' | 'status'> }) =>
      USE_MOCK_API ? mockApi.tenders.submit(tenderId, submission) : tendersAPI.submit(tenderId, submission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
    },
  });
};

export const useTenderSubmissions = (tenderId: number) => {
  return useQuery({
    queryKey: ['tenders', tenderId, 'submissions'],
    queryFn: () => USE_MOCK_API ? mockApi.tenders.getSubmissions(tenderId) : tendersAPI.getSubmissions(tenderId),
    enabled: !!tenderId,
  });
};

export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenderId, submissionId, status }: { tenderId: number; submissionId: number; status: TenderSubmission['status'] }) =>
      USE_MOCK_API ? mockApi.tenders.updateSubmissionStatus(tenderId, submissionId, status) : tendersAPI.updateSubmissionStatus(tenderId, submissionId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenders', variables.tenderId, 'submissions'] });
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
    },
  });
};

// Members Hooks
export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: () => USE_MOCK_API ? mockApi.members.getAll() : membersAPI.getAll(),
  });
};

export const useMember = (id: number) => {
  return useQuery({
    queryKey: ['members', id],
    queryFn: () => USE_MOCK_API ? mockApi.members.getById(id) : membersAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (member: Omit<Member, 'id'>) =>
      USE_MOCK_API ? mockApi.members.create(member) : membersAPI.create(member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Member> }) =>
      USE_MOCK_API ? mockApi.members.update(id, updates) : membersAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.members.delete(id) : membersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

// Product Categories Hooks
export const useProductCategories = () => {
  return useQuery({
    queryKey: ['product-categories'],
    queryFn: () => USE_MOCK_API ? mockApi.productCategories.getAll() : productCategoriesAPI.getAll(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Omit<ProductCategory, 'id'>) =>
      USE_MOCK_API ? mockApi.productCategories.create(category) : productCategoriesAPI.create(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    },
  });
};

export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<ProductCategory> }) =>
      USE_MOCK_API ? mockApi.productCategories.update(id, updates) : productCategoriesAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    },
  });
};

export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.productCategories.delete(id) : productCategoriesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Clients Hooks
export const useClients = (includeInactive: boolean = false) => {
  return useQuery({
    queryKey: ['clients', includeInactive],
    queryFn: async () => {
      if (USE_MOCK_API) return [];
      try {
        // Use the same API_BASE_URL as other API calls
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://back.smc-eg.com/api';
        const url = includeInactive ? `${API_BASE_URL}/clients?status=all` : `${API_BASE_URL}/clients`;
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch clients:', response.status, errorText);
          throw new Error(`Failed to fetch clients: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched clients:', data);
        const clients = Array.isArray(data) ? data : [];
        console.log('Returning clients:', clients);
        return clients;
      } catch (error) {
        console.error('Error in useClients:', error);
        return [];
      }
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 0, // Don't cache at all
    retry: 1, // Only retry once to prevent infinite loops
  });
};

export const useClient = (id: number) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => USE_MOCK_API ? null : clientsAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (client: Omit<Client, 'id'>) =>
      USE_MOCK_API ? Promise.resolve({ id: 1, ...client } as Client) : clientsAPI.create(client),
    onSuccess: async (newClient) => {
      console.log('Client created successfully:', newClient);
      // Update cache for both includeInactive=true and includeInactive=false
      queryClient.setQueriesData({ queryKey: ['clients'] }, (oldData: Client[] | undefined) => {
        console.log('Updating cache with new client. Old data:', oldData);
        if (!oldData) {
          console.log('No old data, returning new client array');
          return [newClient];
        }
        const updated = [...oldData, newClient];
        console.log('Updated data:', updated);
        return updated;
      });
      // Invalidate and refetch to ensure consistency
      await queryClient.invalidateQueries({ queryKey: ['clients'], exact: false });
      await queryClient.refetchQueries({ queryKey: ['clients'], exact: false });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Client> }) =>
      USE_MOCK_API ? Promise.resolve({ id, ...updates } as Client) : clientsAPI.update(id, updates),
    onSuccess: async (updatedClient) => {
      console.log('Client updated successfully:', updatedClient);
      // Invalidate all client queries first
      await queryClient.invalidateQueries({ queryKey: ['clients'], exact: false });
      // Then refetch all client queries
      await queryClient.refetchQueries({ queryKey: ['clients'], exact: false });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? Promise.resolve() : clientsAPI.delete(id),
    onSuccess: async (_, deletedId) => {
      console.log('Client deleted successfully:', deletedId);
      // Invalidate all client queries first
      await queryClient.invalidateQueries({ queryKey: ['clients'], exact: false });
      // Then refetch all client queries
      await queryClient.refetchQueries({ queryKey: ['clients'], exact: false });
    },
  });
};

