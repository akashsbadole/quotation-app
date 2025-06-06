import axios from 'axios';
import { 
  ClientType, 
  ProductType, 
  QuotationType, 
  TemplateType,
  QuotationItemType 
} from '../types/window';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// API Response type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

// Client API
export const clientsApi = {
  getAll: async (): Promise<ClientType[]> => {
    const response = await api.get<ApiResponse<ClientType[]>>('/clients');
    return response.data.data;
  },

  getById: async (id: string): Promise<ClientType> => {
    const response = await api.get<ApiResponse<ClientType>>(`/clients/${id}`);
    return response.data.data;
  },

  create: async (client: Omit<ClientType, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientType> => {
    const response = await api.post<ApiResponse<ClientType>>('/clients', client);
    return response.data.data;
  },

  update: async (id: string, client: Partial<ClientType>): Promise<ClientType> => {
    const response = await api.put<ApiResponse<ClientType>>(`/clients/${id}`, client);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};

// Product API
export const productsApi = {
  getAll: async (params?: { type?: string; search?: string }): Promise<ProductType[]> => {
    const response = await api.get<ApiResponse<ProductType[]>>('/products', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<ProductType> => {
    const response = await api.get<ApiResponse<ProductType>>(`/products/${id}`);
    return response.data.data;
  },

  create: async (product: Omit<ProductType, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductType> => {
    const response = await api.post<ApiResponse<ProductType>>('/products', product);
    return response.data.data;
  },

  update: async (id: string, product: Partial<ProductType>): Promise<ProductType> => {
    const response = await api.put<ApiResponse<ProductType>>(`/products/${id}`, product);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// Quotation API
export const quotationsApi = {
  getAll: async (params?: { status?: string; clientId?: string; search?: string }): Promise<QuotationType[]> => {
    const response = await api.get<ApiResponse<QuotationType[]>>('/quotations', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<QuotationType> => {
    const response = await api.get<ApiResponse<QuotationType>>(`/quotations/${id}`);
    return response.data.data;
  },

  create: async (quotation: {
    clientId: string;
    date: string;
    expiryDate: string;
    items: QuotationItemType[];
    notes?: string;
    terms?: string;
    status?: 'draft' | 'pending' | 'sent' | 'approved' | 'rejected';
  }): Promise<QuotationType> => {
    const response = await api.post<ApiResponse<QuotationType>>('/quotations', quotation);
    return response.data.data;
  },

  update: async (id: string, quotation: Partial<QuotationType>): Promise<QuotationType> => {
    const response = await api.put<ApiResponse<QuotationType>>(`/quotations/${id}`, quotation);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/quotations/${id}`);
  },

  duplicate: async (id: string): Promise<QuotationType> => {
    const response = await api.post<ApiResponse<QuotationType>>(`/quotations/${id}/duplicate`);
    return response.data.data;
  },
};

// Template API
export const templatesApi = {
  getAll: async (params?: { category?: string; search?: string }): Promise<TemplateType[]> => {
    const response = await api.get<ApiResponse<TemplateType[]>>('/templates', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<TemplateType> => {
    const response = await api.get<ApiResponse<TemplateType>>(`/templates/${id}`);
    return response.data.data;
  },

  create: async (template: Omit<TemplateType, 'id' | 'createdAt' | 'updatedAt'>): Promise<TemplateType> => {
    const response = await api.post<ApiResponse<TemplateType>>('/templates', template);
    return response.data.data;
  },

  update: async (id: string, template: Partial<TemplateType>): Promise<TemplateType> => {
    const response = await api.put<ApiResponse<TemplateType>>(`/templates/${id}`, template);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/templates/${id}`);
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string; database: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
