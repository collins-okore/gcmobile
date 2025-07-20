import apiClient from './apiClient';
import {RESIDENT_VEHICLE_URLS} from './apiUrls';
import qs from 'qs';

export interface Vehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  resident?: {
    id: string;
    houseNumber: string;
    unit?: string;
    estate?: {
      id: string;
      name: string;
    };
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
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

// Get all vehicles with pagination and filters
const getAllVehicles = async (params?: PaginationParams) => {
  // Convert the params object to a query string compatible with Strapi v4
  let queryString = '';

  if (params) {
    queryString = `?${qs.stringify(
      {
        populate: params.populate,
        filters: params.filters,
        pagination: params.pagination,
        sort: params.sort,
      },
      {encodeValuesOnly: false},
    )}`;
  }

  const response = await apiClient.get(
    `${RESIDENT_VEHICLE_URLS.GET_ALL}${queryString}`,
  );

  return response.data;
};

// Get vehicle by ID
const getVehicleById = async (id: string, params?: PaginationParams) => {
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
    `${RESIDENT_VEHICLE_URLS.GET_ONE(id)}${queryString}`,
  );

  return response;
};

// Create new vehicle
const createVehicle = async (data: {
  licensePlate: string;
  make: string;
  model: string;
  color?: string;
}) => {
  const response = await apiClient.post(RESIDENT_VEHICLE_URLS.CREATE, {
    data: {
      ...data,
    },
  });
  return response.data;
};

// Update vehicle
const updateVehicle = async (
  id: string,
  data: {
    licensePlate?: string;
    make?: string;
    model?: string;
    color?: string;
  },
) => {
  const response = await apiClient.put(RESIDENT_VEHICLE_URLS.UPDATE(id), {
    data: {
      ...data,
    },
  });
  return response.data;
};

// Delete vehicle
const deleteVehicle = async (id: string) => {
  const response = await apiClient.delete(RESIDENT_VEHICLE_URLS.DELETE(id));
  return response.data;
};

const residentVehicleService = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};

export default residentVehicleService;
