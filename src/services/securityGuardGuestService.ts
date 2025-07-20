import apiClient from './apiClient';
import {
  SECURITY_GUARD_GUEST_URLS,
  SECURITY_GUARD_RESIDENT_URLS,
  SECURITY_GUARD_VEHICLE_URLS,
} from './apiUrls';
import qs from 'qs';

export interface SecurityGuardGuest {
  id: string;
  name: string;
  phone: string;
  phoneCountryCode?: string;
  phoneCallingCode?: string;
  idNumber: string;
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
    unit: string;
  };
  estate?: {
    id: string;
    name: string;
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
      encodeValuesOnly: false, // prettify URL
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
      encodeValuesOnly: false,
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

// Create security guard guest
const createGuest = async (data: {
  name: string;
  phone: string;
  phoneCountryCode: string;
  phoneCallingCode: string;
  idNumber: string;
  purpose: string;
  arrivalTime: string;
  departureTime: string;
  resident: string;
  vehicleLicensePlate?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleColor?: string;
}) => {
  try {
    const response = await apiClient.post(SECURITY_GUARD_GUEST_URLS.CREATE, {
      data: {
        ...data,
      },
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
    idNumber?: string;
    vehicleLicensePlate?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleColor?: string;
    resident: string;
    purpose?: string;
    arrivalTime?: string;
    departureTime?: string;
    status?: 'pending' | 'arrived' | 'departed' | 'cancelled';
  },
) => {
  try {
    const response = await apiClient.put(SECURITY_GUARD_GUEST_URLS.UPDATE(id), {
      data: {
        ...data,
      },
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
const markGuestAsArrived = async (id: string, arrivalTime?: string) => {
  try {
    const response = await apiClient.put(
      SECURITY_GUARD_GUEST_URLS.MARK_AS_ARRIVED(id),
      arrivalTime ? {data: {arrivalTime}} : {},
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
    const response = await apiClient.put(
      SECURITY_GUARD_GUEST_URLS.MARK_AS_CANCELLED(id),
    );
    return response.data;
  } catch (error) {
    console.error(`Error marking guest with ID ${id} as cancelled:`, error);
    throw error;
  }
};

// Mark guest as departed with departure time
const markGuestAsDeparted = async (id: string, departureTime?: string) => {
  try {
    const response = await apiClient.put(
      SECURITY_GUARD_GUEST_URLS.MARK_AS_DEPARTED(id),
      departureTime ? {data: {departureTime}} : {},
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
        encodeValuesOnly: false, // prettify URL
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

// Get a single resident
const getResidentById = async (id: string, params?: PaginationParams) => {
  try {
    let queryString = '';

    if (params) {
      queryString = qs.stringify(params, {
        encodeValuesOnly: false, // prettify URL
      });
    }
    const response = await apiClient.get(
      `${SECURITY_GUARD_RESIDENT_URLS.GET_ONE(id)}${
        queryString ? `?${queryString}` : ''
      }`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching resident with ID ${id}:`, error);
    throw error;
  }
};

// Get vehicles from the security guard's estate
const getEstateVehicles = async (params?: PaginationParams) => {
  try {
    let queryString = '';

    if (params) {
      queryString = qs.stringify(params, {
        encodeValuesOnly: false, // prettify URL
      });
    }

    const response = await apiClient.get(
      `${SECURITY_GUARD_VEHICLE_URLS.GET_ALL}${
        queryString ? `?${queryString}` : ''
      }`,
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching estate vehicles:', error);
    throw error;
  }
};

// Get a single vehicle
const getVehicleById = async (id: string, params?: PaginationParams) => {
  try {
    let queryString = '';

    if (params) {
      queryString = qs.stringify(params, {
        encodeValuesOnly: false, // prettify URL
      });
    }

    const response = await apiClient.get(
      `${SECURITY_GUARD_VEHICLE_URLS.GET_ONE(id)}${
        queryString ? `?${queryString}` : ''
      }`,
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching vehicle with ID ${id}:`, error);
    throw error;
  }
};

// Verify passCode entered manually or scanned by the security guard
const verifyPassCode = async (passCode: string) => {
  try {
    const response = await apiClient.post(
      SECURITY_GUARD_GUEST_URLS.VERIFY_PASS_CODE,
      {
        data: {passCode},
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error verifying pass code:`, error);
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
  getResidentById,
  markGuestAsArrived,
  markGuestAsCancelled,
  markGuestAsDeparted,
  getEstateVehicles,
  getVehicleById,
  verifyPassCode,
};

export default securityGuardGuestService;
