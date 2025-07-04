import apiClient from "./apiClient";
import { ESTATE_MANAGER_SECURITY_GUARD_URLS } from "./apiUrls";
import type { Estate } from "./estateService";
import qs from "qs";

// Types
export interface SecurityGuard {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
  };
  estate: Estate;
  created_at: string;
  updated_at?: string;
}

export interface SecurityGuardCreateData {
  user_id: string;
  estate_id: string;
}

export interface SecurityGuardUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  status?: string;
}

// Pagination parameters interface
export interface PaginationParams {
  filters?: any;
  sort?: object;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  populate?: string | string[];
}

// Pagination meta interface
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Security Guard service functions
const estateManagerSecurityGuardService = {
  // Get all security guards with pagination, search and filtering
  getAllSecurityGuards: async (params?: PaginationParams) => {
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

    const url = `${ESTATE_MANAGER_SECURITY_GUARD_URLS.GET_ALL}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await apiClient.get<{
      data: SecurityGuard[];
      meta: PaginationMeta;
    }>(url);
    return response.data;
  },

  // Get security guard by ID
  getSecurityGuardById: async (id: string) => {
    const response = await apiClient.get<SecurityGuard>(
      ESTATE_MANAGER_SECURITY_GUARD_URLS.GET_ONE(id)
    );
    return response.data;
  },

  // Create new security guard
  createSecurityGuard: async (securityGuardData: SecurityGuardCreateData) => {
    const response = await apiClient.post<SecurityGuard>(
      ESTATE_MANAGER_SECURITY_GUARD_URLS.CREATE,
      securityGuardData
    );
    return response.data;
  },

  // Update security guard
  updateSecurityGuard: async (
    id: string,
    securityGuardData: SecurityGuardUpdateData
  ) => {
    const response = await apiClient.put<SecurityGuard>(
      ESTATE_MANAGER_SECURITY_GUARD_URLS.UPDATE(id),
      securityGuardData
    );
    return response.data;
  },

  // Delete security guard
  deleteSecurityGuard: async (id: string) => {
    const response = await apiClient.delete(
      ESTATE_MANAGER_SECURITY_GUARD_URLS.DELETE(id)
    );
    return response.data;
  },
};

export default estateManagerSecurityGuardService;
