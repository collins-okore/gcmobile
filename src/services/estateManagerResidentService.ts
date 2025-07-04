import apiClient from "./apiClient";
import { ESTATE_MANAGER_RESIDENT_URLS } from "./apiUrls";
import qs from "qs";

export interface HouseholdMember {
  id: string;
  first_name: string;
  last_name: string;
  relationship: string;
  age?: number;
}

export interface EstateManagerResident {
  id: string;
  user_id: string;
  estate_id: string;
  house_number: string;
  household_size: number;
  unit?: string;
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

// Get all estate manager residents with pagination and filters
const getAllEstateManagerResidents = async (params?: PaginationParams) => {
  // Convert the params object to a query string compatible with Strapi v4
  let queryString = "";

  if (params) {
    queryString = qs.stringify(params, {
      encodeValuesOnly: true, // prettify URL
      addQueryPrefix: true,
    });
  }

  try {
    const response = await apiClient.get(
      `${ESTATE_MANAGER_RESIDENT_URLS.GET_ALL}${queryString}`
    );

    return {
      data: response.data.data,
      meta: response.data.meta.pagination,
    };
  } catch (error) {
    console.error("Error fetching estate manager residents:", error);
    throw error;
  }
};

// Get estate manager resident by ID
const getEstateManagerResidentById = async (
  id: string,
  params?: PaginationParams
) => {
  let queryString = "";

  if (params) {
    queryString = qs.stringify(params, {
      encodeValuesOnly: true,
      addQueryPrefix: true,
    });
  }

  try {
    const response = await apiClient.get(
      `${ESTATE_MANAGER_RESIDENT_URLS.GET_ONE(id)}${queryString}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching estate manager resident with ID ${id}:`,
      error
    );
    throw error;
  }
};

// Create new estate manager resident
const createEstateManagerResident = async (data: {
  user_id: string;
  estate_id: string;
  house_number: string;
  household_size: number;
  unit?: string;
  householdMembers?: HouseholdMember[];
}) => {
  try {
    const response = await apiClient.post(ESTATE_MANAGER_RESIDENT_URLS.CREATE, {
      ...data,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating estate manager resident:", error);
    throw error;
  }
};

// Update estate manager resident
const updateEstateManagerResident = async (
  id: string,
  data: {
    estate_id?: string;
    house_number?: string;
    household_size?: number;
    unit?: string;
    householdMembers?: HouseholdMember[];
  }
) => {
  try {
    const response = await apiClient.put(
      ESTATE_MANAGER_RESIDENT_URLS.UPDATE(id),
      { data }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating estate manager resident with ID ${id}:`,
      error
    );
    throw error;
  }
};

// Delete estate manager resident
const deleteEstateManagerResident = async (id: string) => {
  try {
    const response = await apiClient.delete(
      ESTATE_MANAGER_RESIDENT_URLS.DELETE(id)
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting estate manager resident with ID ${id}:`,
      error
    );
    throw error;
  }
};

const estateManagerResidentService = {
  getAllEstateManagerResidents,
  getEstateManagerResidentById,
  createEstateManagerResident,
  updateEstateManagerResident,
  deleteEstateManagerResident,
};

export default estateManagerResidentService;
