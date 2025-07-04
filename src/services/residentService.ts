import apiClient from "./apiClient";
import { RESIDENT_URLS } from "./apiUrls";
import qs from "qs";

export interface HouseholdMember {
  id: string;
  name: string;

  relationship: string;
  age?: number;
}

export interface Resident {
  id: string;
  user_id: string;
  estate_id: string;
  house_number: string;
  household_size: number;
  block_court?: string;
  householdMembers: HouseholdMember[];
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  estate?: {
    id: string;
    name: string;
  };
}

// Pagination parameters interface (same as in estateService)
export interface PaginationParams {
  filters?: any;
  sort?: object;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  populate?: string | string[];
}

// Pagination meta interface (same as in estateService)
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Get all residents with pagination and filters
const getAllResidents = async (params?: PaginationParams) => {
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

  const url = `${RESIDENT_URLS.GET_ALL}${queryString ? `?${queryString}` : ""}`;

  const response = await apiClient.get(url);
  return response.data;
};

// Get resident by ID
const getResidentById = async (id: string, params?: PaginationParams) => {
  let queryString = "";

  if (params) {
    queryString = `?${qs.stringify(
      {
        populate: params.populate,
        filters: params.filters,
      },
      { encodeValuesOnly: true }
    )}`;
  }

  const response = await apiClient.get(
    `${RESIDENT_URLS.GET_ONE(id)}${queryString}`
  );
  return response.data;
};

// Create new resident
const createResident = async (data: {
  user_id: string;
  estate_id: string;
  house_number: string;
  household_size: number;
  block_court?: string;
  householdMembers?: HouseholdMember[];
}) => {
  const response = await apiClient.post(RESIDENT_URLS.CREATE, data);
  return response.data;
};

// Update resident
const updateResident = async (
  id: string,
  data: {
    estate_id?: string;
    house_number?: string;
    household_size?: number;
    block_court?: string;
    householdMembers?: HouseholdMember[];
  }
) => {
  const response = await apiClient.put(RESIDENT_URLS.UPDATE(id), data);
  return response.data;
};

// Delete resident
const deleteResident = async (id: string) => {
  const response = await apiClient.delete(RESIDENT_URLS.DELETE(id));
  return response.data;
};

// Get residents by estate ID
const getResidentsByEstateId = async (
  estateId: string,
  params?: PaginationParams
) => {
  const queryParams = params
    ? qs.stringify(
        {
          ...params,
          filters: {
            ...params.filters,
            estate_id: estateId,
          },
        },
        { encodeValuesOnly: true }
      )
    : qs.stringify(
        {
          filters: {
            estate_id: estateId,
          },
        },
        { encodeValuesOnly: true }
      );

  const response = await apiClient.get(
    `${RESIDENT_URLS.GET_ALL}?${queryParams}`
  );
  return response.data;
};

const residentService = {
  getAllResidents,
  getResidentById,
  createResident,
  updateResident,
  deleteResident,
  getResidentsByEstateId,
};

export default residentService;
