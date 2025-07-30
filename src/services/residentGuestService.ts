import apiClient from './apiClient';
import {RESIDENT_GUEST_URLS} from './apiUrls';
import qs from 'qs';

export interface ResidentGuest {
  id: string;
  name: string;
  phone?: string;
  phoneCountryCode?: string;
  phoneCallingCode?: string;
  idNumber?: string;
  vehicleLicensePlate?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  purpose: string;
  arrivalTime: string;
  departureTime?: string;
  status: 'pending' | 'arrived' | 'departed' | 'cancelled';
  resident?: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    houseNumber: string;
    blockCourt: string;
    estate?: {
      id: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: object | string[];
  populate?: string | string[] | object;
  filters?: any;
}

// Get all resident guests with pagination, search and filtering
const getAllResidentGuests = async (params?: PaginationParams) => {
  // Convert the params object to a query string compatible with Strapi v4
  let queryString = '';

  if (params) {
    queryString = qs.stringify(params, {
      encodeValuesOnly: false, // prettify URL
    });
  }

  try {
    const response = await apiClient.get<{
      data: ResidentGuest[];
      meta: {pagination: PaginationMeta};
    }>(`${RESIDENT_GUEST_URLS.GET_ALL}${queryString ? `?${queryString}` : ''}`);
    return {
      data: response.data.data as ResidentGuest[],
      meta: response.data.meta.pagination as PaginationMeta,
    };
  } catch (error) {
    console.error('Error fetching resident guests:', error);
    throw error;
  }
};

// Get resident guest by ID
const getResidentGuestById = async (id: string, params?: PaginationParams) => {
  let queryString = '';

  if (params) {
    queryString = qs.stringify(params, {
      encodeValuesOnly: false,
    });
  }

  try {
    const response = await apiClient.get(
      `${RESIDENT_GUEST_URLS.GET_ONE(id)}${
        queryString ? `?${queryString}` : ''
      }`,
    );

    return response;
  } catch (error) {
    console.error(`Error fetching resident guest with ID ${id}:`, error);
    throw error;
  }
};

// Create resident guest
const createResidentGuest = async (data: {
  name: string;
  phone?: string;
  phoneCountryCode?: string;
  phoneCallingCode?: string;
  idNumber?: string;
  vehicleLicensePlate?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  purpose: string;
  arrivalTime: string;
}) => {
  try {
    const response = await apiClient.post(RESIDENT_GUEST_URLS.CREATE, {
      data: {
        ...data,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating resident guest:', error);
    throw error;
  }
};

// Update resident guest
const updateResidentGuest = async (
  id: string,
  data: {
    name?: string;
    phone?: string;
    phoneCountryCode?: string;
    phoneCallingCode?: string;
    idNumber?: string;
    vehicleLicensePlate?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleColor?: string;
    purpose?: string;
    arrivalTime?: string;
    departureTime?: string;
  },
) => {
  try {
    const response = await apiClient.put(RESIDENT_GUEST_URLS.UPDATE(id), {
      data: {
        ...data,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating resident guest with ID ${id}:`, error);
    throw error;
  }
};

// Delete resident guest
const deleteResidentGuest = async (id: string) => {
  try {
    const response = await apiClient.delete(RESIDENT_GUEST_URLS.DELETE(id));
    return response.data;
  } catch (error) {
    console.error(`Error deleting resident guest with ID ${id}:`, error);
    throw error;
  }
};

// Mark guest as cancelled
const markGuestAsCancelled = async (id: string) => {
  try {
    const response = await apiClient.put(
      `${RESIDENT_GUEST_URLS.UPDATE(id)}/mark-as-cancelled`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error marking guest with ID ${id} as cancelled:`, error);
    throw error;
  }
};

// Mark guest as departed with departure time
const markGuestAsDeparted = async (id: string, departureTime: string) => {
  try {
    const response = await apiClient.put(
      `${RESIDENT_GUEST_URLS.UPDATE(id)}/mark-as-departed`,
      {departureTime},
    );
    return response.data;
  } catch (error) {
    console.error(`Error marking guest with ID ${id} as departed:`, error);
    throw error;
  }
};

export const residentGuestService = {
  getAllResidentGuests,
  getResidentGuestById,
  createResidentGuest,
  updateResidentGuest,
  deleteResidentGuest,
  markGuestAsCancelled,
  markGuestAsDeparted,
};

export default residentGuestService;
