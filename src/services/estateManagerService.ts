import apiClient from "./apiClient";
import apiUrls from "./apiUrls";
import qs from "qs";

// Types
export interface EstateManager {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  estate: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at?: string;
}

export interface EstateManagerCreateData {
  user_id: string;
  estate_id: string;
}

export interface EstateManagerUpdateData {
  user_id?: string;
  estate_id?: string;
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

// Estate Manager service functions
const estateManagerService = {
  // Get estate manager by user ID (to find the estate manager's assigned estate)
  getEstateManagerByUserId: async (userId: string) => {
    try {
      const params = {
        filters: {
          user: {
            id: {
              equals: userId,
            },
          },
        },
        populate: ["estate"],
      };

      const queryString = qs.stringify(params, { encodeValuesOnly: true });
      const url = `${apiUrls.ESTATE_MANAGER_URLS.GET_ALL}?${queryString}`;

      const response = await apiClient.get(url);
      return response.data.data[0] || null;
    } catch (error) {
      console.error(
        `Error fetching estate manager for user ID ${userId}:`,
        error
      );
      throw error;
    }
  },
  // Get all estate managers with pagination, search and filtering
  getAllEstateManagers: async (params?: PaginationParams) => {
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

    const url = `${apiUrls.ESTATE_MANAGER_URLS.GET_ALL}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await apiClient.get<{
      data: EstateManager[];
      meta: PaginationMeta;
    }>(url);
    return response.data;
  },

  // Get estate manager by ID
  getEstateManagerById: async (id: string) => {
    const response = await apiClient.get<EstateManager>(
      apiUrls.ESTATE_MANAGER_URLS.GET_ONE(id)
    );
    return response.data;
  },

  // Create new estate manager
  createEstateManager: async (estateManagerData: EstateManagerCreateData) => {
    const response = await apiClient.post<EstateManager>(
      apiUrls.ESTATE_MANAGER_URLS.CREATE,
      estateManagerData
    );
    return response.data;
  },

  // Update estate manager
  updateEstateManager: async (
    id: string,
    estateManagerData: EstateManagerUpdateData
  ) => {
    const response = await apiClient.put<EstateManager>(
      apiUrls.ESTATE_MANAGER_URLS.UPDATE(id),
      estateManagerData
    );
    return response.data;
  },

  // Delete estate manager
  deleteEstateManager: async (id: string) => {
    const response = await apiClient.delete(
      apiUrls.ESTATE_MANAGER_URLS.DELETE(id)
    );
    return response.data;
  },
};

export default estateManagerService;
