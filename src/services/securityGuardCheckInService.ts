import apiClient from "./apiClient";
import { SECURITY_GUARD_CHECK_IN_URLS } from "./apiUrls";

// Define interfaces for the different types of search results
export interface ResidentResult {
  type: 'resident';
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email: string;
  avatar_url: string;
  house_number: string;
  block_court: string;
  is_verified: boolean;
}

export interface VehicleResult {
  type: 'vehicle';
  id: string;
  license_plate: string;
  make: string;
  model: string;
  color: string;
  resident: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    phone: string;
    house_number: string;
    block_court: string;
  };
}

export interface HouseholdMemberResult {
  type: 'household_member';
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  resident: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    phone: string;
    house_number: string;
    block_court: string;
  };
}

export interface GuestResult {
  type: 'guest';
  id: string;
  name: string;
  phone: string;
  id_number: string;
  purpose: string;
  expected_arrival: string;
  arrival_time: string | null;
  departure_time: string | null;
  status: string;
  vehicle_info: {
    license_plate: string;
    make: string;
    model: string;
    color: string;
  } | null;
  resident: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    phone: string;
    house_number: string;
    block_court: string;
  };
}

export type SearchResult = ResidentResult | VehicleResult | HouseholdMemberResult | GuestResult;

// Search for residents, vehicles, household members, and guests
const searchCheckIn = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await apiClient.get(SECURITY_GUARD_CHECK_IN_URLS.SEARCH(query));
    return response.data;
  } catch (error) {
    console.error("Error searching for check-in:", error);
    throw error;
  }
};

// Scan QR code and get entity details
const scanQrCode = async (qrCode: string): Promise<SearchResult> => {
  try {
    // This is a placeholder - the actual endpoint will be implemented later
    // For now, we'll simulate a response
    console.log("QR code scanned:", qrCode);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a mock response based on the QR code
    // In a real implementation, this would call an API endpoint
    throw new Error("QR code scanning endpoint not implemented yet");
  } catch (error) {
    console.error("Error scanning QR code:", error);
    throw error;
  }
};

// Record check-in for a resident, vehicle, household member, or guest
const recordCheckIn = async (entityType: string, entityId: string, checkInData: any): Promise<any> => {
  try {
    // This is a placeholder - the actual endpoint will be implemented later
    console.log("Recording check-in for:", entityType, entityId, checkInData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would call an API endpoint
    throw new Error("Record check-in endpoint not implemented yet");
  } catch (error) {
    console.error("Error recording check-in:", error);
    throw error;
  }
};

export const securityGuardCheckInService = {
  searchCheckIn,
  scanQrCode,
  recordCheckIn
};

export default securityGuardCheckInService;
