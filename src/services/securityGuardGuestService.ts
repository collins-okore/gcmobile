import apiClient from './apiClient';
import {
  SECURITY_GUARD_GUEST_URLS,
  SECURITY_GUARD_RESIDENT_URLS,
} from './apiUrls';
import qs from 'qs';

export interface SecurityGuardGuest {
  id: string;
  name: string;
  phone: string;
  id_number: string;
  vehicle_license_plate?: string;
  purpose: string;
  arrival_time: string;
  departure_time?: string;
  status: 'pending' | 'arrived' | 'departed' | 'cancelled';
  resident?: {
    id: string;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
    house_number: string;
    unit: string;
  };
  estate?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  pagination: {
    page?: number;
    pageSize?: number;
  };
  sort?: string | string[] | object;
  populate?: string | string[] | object;
  filters?: any;
}

// Get all estate manager guests with pagination, search and filtering
const getAllGuests = async (params?: PaginationParams) => {
  // Convert the params object to a query string compatible with Strapi v4
  let queryString = '';

  if (params) {
    queryString = qs.stringify(params, {
      encodeValuesOnly: true, // prettify URL
    });
  }

  try {
    const response = await apiClient.get(
      `${SECURITY_GUARD_GUEST_URLS.GET_ALL}${
        queryString ? `?${queryString}` : ''
      }`,
    );
    return {
      data: response.data.data as SecurityGuardGuest[],
      meta: response.data.meta.pagination as PaginationMeta,
    };
  } catch (error) {
    console.error('Error fetching estate manager guests:', error);
    throw error;
  }
};

// Get estate manager guest by ID
const getGuestById = async (id: string, params?: PaginationParams) => {
  let queryString = '';

  if (params) {
    queryString = qs.stringify(params, {
      encodeValuesOnly: true,
    });
  }

  try {
    const response = await apiClient.get(
      `${SECURITY_GUARD_GUEST_URLS.GET_ONE(id)}${
        queryString ? `?${queryString}` : ''
      }`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching estate manager guest with ID ${id}:`, error);
    throw error;
  }
};

// Create estate manager guest
const createGuest = async (data: {
  name: string;
  phone: string;
  id_number: string;
  vehicle_license_plate?: string;
  purpose: string;
  arrival_time: string;
  departure_time?: string;
  resident_id: string;
  estate_id: string;
}) => {
  try {
    const response = await apiClient.post(SECURITY_GUARD_GUEST_URLS.CREATE, {
      ...data,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating estate manager guest:', error);
    throw error;
  }
};

// Update guest
const updateGuest = async (
  id: string,
  data: {
    name?: string;
    phone?: string;
    id_number?: string;
    vehicle_license_plate?: string;
    purpose?: string;
    arrival_time?: string;
    departure_time?: string;
    status?: 'pending' | 'arrived' | 'departed' | 'cancelled';
    resident_id?: string;
    estate_id?: string;
  },
) => {
  try {
    const response = await apiClient.put(SECURITY_GUARD_GUEST_URLS.UPDATE(id), {
      ...data,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating estate manager guest with ID ${id}:`, error);
    throw error;
  }
};

// Delete  guest
const deleteGuest = async (id: string) => {
  try {
    const response = await apiClient.delete(
      SECURITY_GUARD_GUEST_URLS.DELETE(id),
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting security guard guest with ID ${id}:`, error);
    throw error;
  }
};

// Mark guest as arrived
const markGuestAsArrived = async (id: string) => {
  try {
    const response = await apiClient.patch(
      SECURITY_GUARD_GUEST_URLS.MARK_AS_ARRIVED(id),
    );
    return response.data;
  } catch (error) {
    console.error(`Error marking guest with ID ${id} as arrived:`, error);
    throw error;
  }
};

// Mark guest as cancelled
const markGuestAsCancelled = async (id: string) => {
  try {
    const response = await apiClient.patch(
      SECURITY_GUARD_GUEST_URLS.MARK_AS_CANCELLED(id),
    );
    return response.data;
  } catch (error) {
    console.error(`Error marking guest with ID ${id} as cancelled:`, error);
    throw error;
  }
};

// Mark guest as departed with departure time
const markGuestAsDeparted = async (id: string, departure_time: string) => {
  try {
    const response = await apiClient.patch(
      SECURITY_GUARD_GUEST_URLS.MARK_AS_DEPARTED(id),
      {departure_time},
    );
    return response.data;
  } catch (error) {
    console.error(`Error marking guest with ID ${id} as departed:`, error);
    throw error;
  }
};

// Get all residents for the current security guard
const getAllResidents = async (params?: PaginationParams) => {
  try {
    let queryString = '';

    if (params) {
      queryString = qs.stringify(params, {
        encodeValuesOnly: true, // prettify URL
      });
    }

    const response = await apiClient.get(
      `${SECURITY_GUARD_RESIDENT_URLS.GET_ALL}${
        queryString ? `?${queryString}` : ''
      }`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching residents:', error);
    throw error;
  }
};

export const securityGuardGuestService = {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
  getAllResidents,
  markGuestAsArrived,
  markGuestAsCancelled,
  markGuestAsDeparted,
};

export default securityGuardGuestService;
