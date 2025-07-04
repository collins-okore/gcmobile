import apiClient from "./apiClient";
import { ESTATE_MANAGER_GUEST_URLS } from "./apiUrls";
import qs from "qs";

export interface EstateManagerGuest {
  id: string;
  name: string;
  phone: string;
  id_number: string;
  vehicle_license_plate?: string;
  purpose: string;
  arrival_time: string;
  departure_time?: string;
  status: "pending" | "arrived" | "departed" | "cancelled";
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
  sort?: string | string[];
  populate?: string | string[] | object;
  filters?: any;
}

// Get all estate manager guests with pagination, search and filtering
const getAllEstateManagerGuests = async (params?: PaginationParams) => {
  // Convert the params object to a query string compatible with Strapi v4
  let queryString = "";

  if (params) {
    queryString = qs.stringify(params, {
      encodeValuesOnly: true, // prettify URL
    });
  }

  try {
    const response = await apiClient.get(
      `${ESTATE_MANAGER_GUEST_URLS.GET_ALL}${
        queryString ? `?${queryString}` : ""
      }`
    );
    return {
      data: response.data.data as EstateManagerGuest[],
      meta: response.data.meta.pagination as PaginationMeta,
    };
  } catch (error) {
    console.error("Error fetching estate manager guests:", error);
    throw error;
  }
};

// Get estate manager guest by ID
const getEstateManagerGuestById = async (
  id: string,
  params?: PaginationParams
) => {
  let queryString = "";

  if (params) {
    queryString = qs.stringify(params, {
      encodeValuesOnly: true,
    });
  }

  try {
    const response = await apiClient.get(
      `${ESTATE_MANAGER_GUEST_URLS.GET_ONE(id)}${
        queryString ? `?${queryString}` : ""
      }`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching estate manager guest with ID ${id}:`, error);
    throw error;
  }
};

// Create estate manager guest
const createEstateManagerGuest = async (data: {
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
    const response = await apiClient.post(ESTATE_MANAGER_GUEST_URLS.CREATE, {
      ...data,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating estate manager guest:", error);
    throw error;
  }
};

// Update estate manager guest
const updateEstateManagerGuest = async (
  id: string,
  data: {
    name?: string;
    phone?: string;
    id_number?: string;
    vehicle_license_plate?: string;
    purpose?: string;
    arrival_time?: string;
    departure_time?: string;
    status?: "pending" | "arrived" | "departed" | "cancelled";
    resident_id?: string;
    estate_id?: string;
  }
) => {
  try {
    const response = await apiClient.put(ESTATE_MANAGER_GUEST_URLS.UPDATE(id), {
      ...data,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating estate manager guest with ID ${id}:`, error);
    throw error;
  }
};

// Delete estate manager guest
const deleteEstateManagerGuest = async (id: string) => {
  try {
    const response = await apiClient.delete(
      ESTATE_MANAGER_GUEST_URLS.DELETE(id)
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting estate manager guest with ID ${id}:`, error);
    throw error;
  }
};

// Mark guest as arrived
const markGuestAsArrived = async (id: string) => {
  try {
    const response = await apiClient.patch(
      ESTATE_MANAGER_GUEST_URLS.MARK_AS_ARRIVED(id)
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
      ESTATE_MANAGER_GUEST_URLS.MARK_AS_CANCELLED(id)
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
      ESTATE_MANAGER_GUEST_URLS.MARK_AS_DEPARTED(id),
      { departure_time }
    );
    return response.data;
  } catch (error) {
    console.error(`Error marking guest with ID ${id} as departed:`, error);
    throw error;
  }
};

export const estateManagerGuestService = {
  getAllEstateManagerGuests,
  getEstateManagerGuestById,
  createEstateManagerGuest,
  updateEstateManagerGuest,
  deleteEstateManagerGuest,
  markGuestAsArrived,
  markGuestAsCancelled,
  markGuestAsDeparted,
};

export default estateManagerGuestService;
