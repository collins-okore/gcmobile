import apiClient from './apiClient';
import apiUrls from './apiUrls';
import qs from 'qs';

// Types
export interface Estate {
  id: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  units?: number;
  created_at: string;
  updated_at?: string;
}

export interface EstateCreateData {
  name: string;
  address: string;
  city: string;
  description?: string;
  units?: number;
}

export interface EstateUpdateData {
  name?: string;
  address?: string;
  city?: string;
  description?: string;
  units?: number;
}

// Pagination parameters interface (same as in userService)
export interface PaginationParams {
  filters?: any;
  sort?: object;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  populate?: string | string[];
}

// Pagination meta interface (same as in userService)
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Estate service functions
const estateService = {
  // Get all estates with pagination, search and filtering
  getAllEstates: async (params?: PaginationParams) => {
    // Convert the params object to a query string compatible with Strapi v4
    let queryString = "";
    
    if (params) {
      // Handle pagination
      const paginationParams: Record<string, any> = {};
      if (params.pagination) {
        if (params.pagination.page) {
          paginationParams["pagination[page]"] = params.pagination.page;
        }
        if (params.pagination.pageSize) {
          paginationParams["pagination[pageSize]"] = params.pagination.pageSize;
        }
      }
      
      // Handle filters
      const filterParams: Record<string, any> = {};
      if (params.filters) {
        // Process filters object
        Object.entries(params.filters).forEach(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            // Handle complex filters like $contains, $eq, etc.
            Object.entries(value).forEach(([operator, operatorValue]) => {
              filterParams[`filters[${key}][${operator}]`] = operatorValue;
            });
          } else {
            // Simple equality filter
            filterParams[`filters[${key}][$eq]`] = value;
          }
        });
      }
      
      // Handle sort
      const sortParams: Record<string, any> = {};
      if (params.sort) {
        if (Array.isArray(params.sort)) {
          sortParams["sort"] = params.sort.join(",");
        } else {
          sortParams["sort"] = params.sort;
        }
      }
      
      // Handle populate
      const populateParams: Record<string, any> = {};
      if (params.populate) {
        if (Array.isArray(params.populate)) {
          params.populate.forEach((field, index) => {
            populateParams[`populate[${index}]`] = field;
          });
        } else {
          populateParams["populate"] = params.populate;
        }
      }
      
      // Combine all params
      const allParams = {
        ...paginationParams,
        ...filterParams,
        ...sortParams,
        ...populateParams,
      };
      
      // Convert to query string using qs library
      queryString = qs.stringify(allParams, { encodeValuesOnly: true });
    }
    
    const url = `${apiUrls.ESTATE_URLS.GET_ALL}${queryString ? `?${queryString}` : ""}`;
    
    const response = await apiClient.get<{
      data: Estate[];
      meta: PaginationMeta;
    }>(url);
    return response.data;
  },

  // Get estate by ID
  getEstateById: async (id: string) => {
    const response = await apiClient.get<Estate>(apiUrls.ESTATE_URLS.GET_ONE(id));
    return response.data;
  },

  // Create new estate
  createEstate: async (estateData: EstateCreateData) => {
    const response = await apiClient.post<Estate>(apiUrls.ESTATE_URLS.CREATE, estateData);
    return response.data;
  },

  // Update estate
  updateEstate: async (id: string, estateData: EstateUpdateData) => {
    const response = await apiClient.put<Estate>(apiUrls.ESTATE_URLS.UPDATE(id), estateData);
    return response.data;
  },

  // Delete estate
  deleteEstate: async (id: string) => {
    const response = await apiClient.delete(apiUrls.ESTATE_URLS.DELETE(id));
    return response.data;
  }
};

export default estateService;
