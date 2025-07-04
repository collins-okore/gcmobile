import apiClient from "./apiClient";
import apiUrls from "./apiUrls";
import qs from "qs";

// Types
export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: {
    id: string;
    name: string;
  };
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface UserCreateData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  role_id: string;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  role_id?: string;
  status?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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

// User service functions
const userService = {
  // Find user by email
  findUserByEmail: async (email: string) => {
    try {
      const queryString = qs.stringify(
        {
          filters: {
            email: {
              equals: email,
            },
          },
        },
        { encodeValuesOnly: true }
      );

      const response = await apiClient.get<{
        data: User[];
        meta: PaginationMeta;
      }>(`${apiUrls.USER_URLS.GET_ALL}?${queryString}`);

      return response.data.data.length > 0 ? response.data.data[0] : null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  },
  // Get all users with pagination, search and filtering
  getAllUsers: async (params?: PaginationParams) => {
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

    const url = `${apiUrls.USER_URLS.GET_ALL}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await apiClient.get<{
      data: User[];
      meta: PaginationMeta;
    }>(url);
    return response.data;
  },

  // Get all roles
  getAllRoles: async () => {
    const response = await apiClient.get<Role[]>(apiUrls.ROLE_URLS.GET_ALL);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await apiClient.get<User>(apiUrls.USER_URLS.GET_ONE(id));
    return response.data;
  },

  // Create new user
  createUser: async (userData: UserCreateData) => {
    const response = await apiClient.post<User>(
      apiUrls.USER_URLS.CREATE,
      userData
    );
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: UserUpdateData) => {
    const response = await apiClient.put<User>(
      apiUrls.USER_URLS.UPDATE(id),
      userData
    );
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(apiUrls.USER_URLS.DELETE(id));
    return response.data;
  },

  // Block/unblock user
  blockUser: async (id: string, blocked: boolean) => {
    const response = await apiClient.patch(apiUrls.USER_URLS.BLOCK(id), {
      blocked,
    });
    return response.data;
  },

  // Get current user profile
  getCurrentUserProfile: async () => {
    const response = await apiClient.get<User>(apiUrls.USER_URLS.PROFILE);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: ChangePasswordData) => {
    const response = await apiClient.post(
      apiUrls.USER_URLS.CHANGE_PASSWORD,
      passwordData
    );
    return response.data;
  },
};

export default userService;
