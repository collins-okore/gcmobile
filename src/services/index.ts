// Export all services from a single file for easier imports
import apiClient from "./apiClient";
import authService from "./authService";
import estateService from "./estateService";
import userService from "./userService";
import estateManagerService from "./estateManagerService";
import residentService from "./residentService";
import estateManagerResidentService from "./estateManagerResidentService";
import estateManagerGuestService from "./estateManagerGuestService";
import estateManagerSecurityGuardService from "./estateManagerSecurityGuardService";
import securityGuardService from "./securityGuardService";
import residentGuestService from "./residentGuestService";
import guestService from "./guestService";
import vehicleService from "./vehicleService";
import estateVehicleService from "./estateVehicleService";
import securityGuardGuestService from "./securityGuardGuestService";
import apiUrls from "./apiUrls";
import residentVehicleService from "./residentVehicleService";
import residentHouseholdMemberService from "./residentHouseholdMemberService";
import securityGuardCheckInService from "./securityGuardCheckInService";

export {
  apiClient,
  authService,
  estateService,
  userService,
  estateManagerService,
  residentService,
  estateManagerResidentService,
  residentGuestService,
  estateManagerGuestService,
  estateManagerSecurityGuardService,
  securityGuardService,
  guestService,
  vehicleService,
  securityGuardGuestService,
  apiUrls,
  estateVehicleService,
  residentVehicleService,
  residentHouseholdMemberService,
  securityGuardCheckInService,
};
