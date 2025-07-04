import apiClient from './apiClient';
import {GUEST_URLS} from './apiUrls';
import qs from 'qs';

export interface Guest {
  id: string;
  name: string;
  phone?: string;
  purpose: string;
  status: string;
  expected_arrival: string;
  actual_arrival?: string;
  departure_time?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  vehicle_plate?: string;
  resident_id: string;
  resident?: {
    id: string;
    house_number: string;
    unit?: string;
    user?: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
    };
  };
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

// Get all guests with pagination and filters
const getAllGuests = async (params?: PaginationParams) => {
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
      {encodeValuesOnly: true},
    )}`;
  }

  const response = await apiClient.get(`${GUEST_URLS.GET_ALL}${queryString}`);
  return response.data;
};

// Get guest by ID
const getGuestById = async (id: string, params?: PaginationParams) => {
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
    `${GUEST_URLS.GET_ONE(id)}${queryString}`,
  );
  return response.data;
};

// Create new guest
const createGuest = async (data: {
  name: string;
  phone?: string;
  purpose: string;
  status: string;
  arrival_time: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  vehicle_plate?: string;
  resident_id: string;
}) => {
  const response = await apiClient.post(GUEST_URLS.CREATE, {...data});
  return response.data;
};

// Update guest
const updateGuest = async (
  id: string,
  data: {
    name?: string;
    phone?: string;
    purpose?: string;
    status?: string;
    arrival_time?: string;
    actual_arrival?: string;
    departure_time?: string;
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_color?: string;
    vehicle_plate?: string;
    resident_id?: string;
  },
) => {
  const response = await apiClient.put(GUEST_URLS.UPDATE(id), {
    ...data,
  });
  return response.data;
};

// Delete guest
const deleteGuest = async (id: string) => {
  const response = await apiClient.delete(GUEST_URLS.DELETE(id));
  return response.data;
};

// Mark guest as arrived
const markGuestAsArrived = async (id: string) => {
  try {
    const response = await apiClient.patch(GUEST_URLS.MARK_AS_ARRIVED(id));
    return response.data;
  } catch (error) {
    console.error(`Error marking guest with ID ${id} as arrived:`, error);
    throw error;
  }
};

// Mark guest as departed with departure time
const markGuestAsDeparted = async (id: string, departure_time: string) => {
  try {
    const response = await apiClient.patch(GUEST_URLS.MARK_AS_DEPARTED(id), {
      departure_time,
    });
    return response.data;
  } catch (error) {
    console.error(`Error marking guest with ID ${id} as departed:`, error);
    throw error;
  }
};

// Mark guest as cancelled
const markGuestAsCancelled = async (id: string) => {
  try {
    const response = await apiClient.patch(GUEST_URLS.MARK_AS_CANCELLED(id));
    return response.data;
  } catch (error) {
    console.error(`Error marking guest with ID ${id} as cancelled:`, error);
    throw error;
  }
};

const guestService = {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
  markGuestAsArrived,
  markGuestAsDeparted,
  markGuestAsCancelled,
};

export default guestService;
