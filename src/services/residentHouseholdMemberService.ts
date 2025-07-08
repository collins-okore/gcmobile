import apiClient from './apiClient';
import {RESIDENT_HOUSEHOLD_MEMBER_URLS} from './apiUrls';
import qs from 'qs';

export interface HouseholdMember {
  id: string;
  name: string;
  relationship: 'Spouse' | 'Child' | 'Other';
  phone: string;
  phone_country_code: string;
  phone_calling_code: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

// Pagination parameters interface (same as in other services)
export interface PaginationParams {
  filters?: any;
  sort?: object;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  populate?: string | object;
}

// Pagination meta interface (same as in other services)
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Get all household members with pagination and filters
const getAllHouseholdMembers = async (params?: PaginationParams) => {
  // Convert the params object to a query string compatible with Strapi v4
  let queryString = '';

  if (params) {
    queryString = `?${qs.stringify(
      {
        populate: params.populate,
        filters: params.filters,
        sort: params.sort,
        pagination: params.pagination,
      },
      {encodeValuesOnly: true},
    )}`;
  }

  const response = await apiClient.get(
    `${RESIDENT_HOUSEHOLD_MEMBER_URLS.GET_ALL}${queryString}`,
  );
  return response.data;
};

// Get household member by ID
const getHouseholdMemberById = async (
  id: string,
  params?: PaginationParams,
) => {
  let queryString = '';

  if (params) {
    queryString = `?${qs.stringify(
      {
        populate: params.populate,
        filters: params.filters,
      },
      {encodeValuesOnly: true},
    )}`;
  }

  const response = await apiClient.get(
    `${RESIDENT_HOUSEHOLD_MEMBER_URLS.GET_ONE(id)}${queryString}`,
  );
  return response.data;
};

// Create new household member
const createHouseholdMember = async (data: {
  name: string;
  relationship: 'Spouse' | 'Child' | 'Other';
  phone?: string;
  phone_country_code?: string;
  phone_calling_code?: string;
  email?: string;
}) => {
  const response = await apiClient.post(RESIDENT_HOUSEHOLD_MEMBER_URLS.CREATE, {
    ...data,
  });
  return response.data;
};

// Update household member
const updateHouseholdMember = async (
  id: string,
  data: {
    name?: string;
    relationship?: 'Spouse' | 'Child' | 'Other';
    phone?: string;
    phone_country_code?: string;
    phone_calling_code?: string;
    email?: string;
  },
) => {
  const response = await apiClient.put(
    RESIDENT_HOUSEHOLD_MEMBER_URLS.UPDATE(id),
    {
      ...data,
    },
  );
  return response.data;
};

// Delete household member
const deleteHouseholdMember = async (id: string) => {
  const response = await apiClient.delete(
    RESIDENT_HOUSEHOLD_MEMBER_URLS.DELETE(id),
  );
  return response.data;
};

const residentHouseholdMemberService = {
  getAllHouseholdMembers,
  getHouseholdMemberById,
  createHouseholdMember,
  updateHouseholdMember,
  deleteHouseholdMember,
};

export default residentHouseholdMemberService;
