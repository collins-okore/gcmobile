/**
 * API URLs for Gate Estate Connect
 *
 * This file centralizes all API endpoint URLs used in the application.
 * Using this approach makes it easier to:
 * 1. Maintain and update endpoints in one place
 * 2. Keep URL structure consistent
 * 3. Quickly see all available endpoints
 */

// Auth endpoints
export const AUTH_URLS = {
  LOGIN: '/auth/local',
  REGISTER: '/auth/local/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  GET_ASSIGNED_ESTATE: '/auth/assigned-estate',
  GET_PROFILE: '/users/me',
  UPDATE_PROFILE: '/users',
  CHANGE_PASSWORD: '/auth/change-password',
};

// Estate endpoints
export const ESTATE_URLS = {
  GET_ALL: '/estates',
  GET_ONE: (id: string) => `/estates/${id}`,
  CREATE: '/estates',
  UPDATE: (id: string) => `/estates/${id}`,
  DELETE: (id: string) => `/estates/${id}`,
};

// User endpoints
export const USER_URLS = {
  GET_ALL: '/users',
  GET_ONE: (id: string) => `/users/${id}`,
  CREATE: '/users',
  UPDATE: (id: string) => `/users/${id}`,
  DELETE: (id: string) => `/users/${id}`,
  PROFILE: '/users/me',
  CHANGE_PASSWORD: '/users/change-password',
  BLOCK: (id: string) => `/users/${id}/block`,
};

// Role endpoints
export const ROLE_URLS = {
  GET_ALL: '/roles',
  GET_ONE: (id: string) => `/roles/${id}`,
  CREATE: '/roles',
  UPDATE: (id: string) => `/roles/${id}`,
  DELETE: (id: string) => `/roles/${id}`,
};

// Estate Managers
export const ESTATE_MANAGER_URLS = {
  GET_ALL: '/estate-managers',
  GET_ONE: (id: string) => `/estate-managers/${id}`,
  CREATE: '/estate-managers',
  UPDATE: (id: string) => `/estate-managers/${id}`,
  DELETE: (id: string) => `/estate-managers/${id}`,
};

// Estate Managers - Residents
export const ESTATE_MANAGER_RESIDENT_URLS = {
  GET_ALL: '/estate-managers/residents',
  GET_ONE: (id: string) => `/estate-managers/residents/${id}`,
  CREATE: '/estate-managers/residents',
  UPDATE: (id: string) => `/estate-managers/residents/${id}`,
  DELETE: (id: string) => `/estate-managers/residents/${id}`,
};

// Estate Managers - Guests
export const ESTATE_MANAGER_GUEST_URLS = {
  GET_ALL: '/estate-managers/guests',
  GET_ONE: (id: string) => `/estate-managers/guests/${id}`,
  CREATE: '/estate-managers/guests',
  UPDATE: (id: string) => `/estate-managers/guests/${id}`,
  DELETE: (id: string) => `/estate-managers/guests/${id}`,
  MARK_AS_ARRIVED: (id: string) =>
    `/estate-managers/guests/${id}/mark-as-arrived`,
  MARK_AS_DEPARTED: (id: string) =>
    `/estate-managers/guests/${id}/mark-as-departed`,
  MARK_AS_CANCELLED: (id: string) =>
    `/estate-managers/guests/${id}/mark-as-cancelled`,
};

// Estate Manager Security Guard URLS
export const ESTATE_MANAGER_SECURITY_GUARD_URLS = {
  GET_ALL: '/estate-managers/security-guards',
  GET_ONE: (id: string) => `/estate-managers/security-guards/${id}`,
  CREATE: '/estate-managers/security-guards',
  UPDATE: (id: string) => `/estate-managers/security-guards/${id}`,
  DELETE: (id: string) => `/estate-managers/security-guards/${id}`,
};

// Estate Manager Vehicles
export const ESTATE_MANAGER_VEHICLE_URLS = {
  GET_ALL: '/estate-managers/vehicles',
  GET_ONE: (id: string) => `/estate-managers/vehicles/${id}`,
  CREATE: '/estate-managers/vehicles',
  UPDATE: (id: string) => `/estate-managers/vehicles/${id}`,
  DELETE: (id: string) => `/estate-managers/vehicles/${id}`,
};

// Residents
export const RESIDENT_URLS = {
  GET_ALL: '/residents',
  GET_ONE: (id: string) => `/residents/${id}`,
  CREATE: '/residents',
  UPDATE: (id: string) => `/residents/${id}`,
  DELETE: (id: string) => `/residents/${id}`,
};

// Residents - Guests
export const RESIDENT_GUEST_URLS = {
  GET_ALL: '/residents/me/guests',
  GET_ONE: (id: string) => `/residents/me/guests/${id}`,
  CREATE: '/residents/me/guests',
  UPDATE: (id: string) => `/residents/me/guests/${id}`,
  DELETE: (id: string) => `/residents/me/guests/${id}`,
};

// Residents - Vehicles
export const RESIDENT_VEHICLE_URLS = {
  GET_ALL: '/residents/me/vehicles',
  GET_ONE: (id: string) => `/residents/me/vehicles/${id}`,
  CREATE: '/residents/me/vehicles',
  UPDATE: (id: string) => `/residents/me/vehicles/${id}`,
  DELETE: (id: string) => `/residents/me/vehicles/${id}`,
};

// Resident Household Members
export const RESIDENT_HOUSEHOLD_MEMBER_URLS = {
  GET_ALL: '/residents/me/household-members',
  GET_ONE: (id: string) => `/residents/me/household-members/${id}`,
  CREATE: '/residents/me/household-members',
  UPDATE: (id: string) => `/residents/me/household-members/${id}`,
  DELETE: (id: string) => `/residents/me/household-members/${id}`,
};

// Guests
export const GUEST_URLS = {
  GET_ALL: '/guests',
  GET_ONE: (id: string) => `/guests/${id}`,
  CREATE: '/guests',
  UPDATE: (id: string) => `/guests/${id}`,
  DELETE: (id: string) => `/guests/${id}`,
  MARK_AS_ARRIVED: (id: string) => `/guests/${id}/mark-as-arrived`,
  MARK_AS_DEPARTED: (id: string) => `/guests/${id}/mark-as-departed`,
  MARK_AS_CANCELLED: (id: string) => `/guests/${id}/mark-as-cancelled`,
};

// Security Guard URLs
export const SECURITY_GUARD_URLS = {
  GET_ALL: '/security-guards',
  GET_ONE: (id: string) => `/security-guards/${id}`,
  CREATE: '/security-guards',
  UPDATE: (id: string) => `/security-guards/${id}`,
  DELETE: (id: string) => `/security-guards/${id}`,
};

// Security Guard Guests URLs
export const SECURITY_GUARD_GUEST_URLS = {
  GET_ALL: '/security-guards/me/guests',
  GET_ONE: (id: string) => `/security-guards/me/guests/${id}`,
  CREATE: '/security-guards/me/guests',
  UPDATE: (id: string) => `/security-guards/me/guests/${id}`,
  DELETE: (id: string) => `/security-guards/me/guests/${id}`,
  MARK_AS_ARRIVED: (id: string) =>
    `/security-guards/me/guests/${id}/mark-as-arrived`,
  MARK_AS_DEPARTED: (id: string) =>
    `/security-guards/me/guests/${id}/mark-as-departed`,
  MARK_AS_CANCELLED: (id: string) =>
    `/security-guards/me/guests/${id}/mark-as-cancelled`,
  VERIFY_PASS_CODE: '/security-guards/me/guests/verify',
};

// Security Guard Check In URLs
export const SECURITY_GUARD_CHECK_IN_URLS = {
  SEARCH: (query: string) =>
    `/security-guards/me/security-check-in?query=${query}`,
};

// Security Guard Residents URLs
export const SECURITY_GUARD_RESIDENT_URLS = {
  GET_ALL: '/security-guards/me/residents',
  GET_ONE: (id: string) => `/security-guards/me/residents/${id}`,
};

// Security Guard Vehicles URLs
export const SECURITY_GUARD_VEHICLE_URLS = {
  GET_ALL: '/security-guards/me/vehicles',
  GET_ONE: (id: string) => `/security-guards/me/vehicles/${id}`,
};

// Vehicles
export const VEHICLE_URLS = {
  GET_ALL: '/vehicles',
  GET_ONE: (id: string) => `/vehicles/${id}`,
  CREATE: '/vehicles',
  UPDATE: (id: string) => `/vehicles/${id}`,
  DELETE: (id: string) => `/vehicles/${id}`,
};

// Export all URL objects
export default {
  AUTH_URLS,
  ESTATE_URLS,
  USER_URLS,
  ROLE_URLS,
  ESTATE_MANAGER_URLS,
  RESIDENT_URLS,
  SECURITY_GUARD_URLS,
  SECURITY_GUARD_GUEST_URLS,
  RESIDENT_VEHICLE_URLS,
};
