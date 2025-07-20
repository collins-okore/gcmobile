import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useAuth} from '../contexts/AuthContext';
import Search from '../screens/SecurityGuard/SecurityCheckIn/Search';
import AddSecurityGuardGuest from '../screens/SecurityGuard/Guests/AddGuest';
import ViewSecurityGuardGuest from '../screens/SecurityGuard/Guests/ViewGuest';
import EditSecurityGuardGuest from '../screens/SecurityGuard/Guests/EditGuest';
import EditSecurityGuardProfile from '../screens/SecurityGuard/Profile/EditProfile';
import SecurityGuardTabNavigator from './Tab/SecurityGuardTabNavigator';
import AddVehicle from '../screens/Vehicles/AddVehicle';
import EditVehicle from '../screens/Vehicles/EditVehicle';
import Vehicles from '../screens/Vehicles';
import HouseholdMembers from '../screens/HouseholdMembers';
import AddHouseholdMember from '../screens/HouseholdMembers/AddHouseholdMember';
import EditHouseholdMember from '../screens/HouseholdMembers/EditHouseholdMember';
import ResidentTabNavigator from './Tab/ResidentTabNavigator';
import AddResidentGuest from '../screens/Guests/AddGuest';
import ViewResidentGuest from '../screens/Guests/ViewGuest';
import EditResidentGuest from '../screens/Guests/EditGuest';
import EditResidentProfile from '../screens/Profile/EditProfile';
import ScanQrCode from '../screens/SecurityGuard/SecurityCheckIn/ScanQrCode';
import colors from '../themes/colors';
import ViewVehicle from '../screens/Vehicles/ViewVehicle';
import ViewResident from '../screens/SecurityGuard/Residents/ViewResident';
import ViewSecurityGuardVehicle from '../screens/SecurityGuard/Vehicles/ViewSecurityGuardVehicle';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  const {user, isLoading} = useAuth();

  // Show loading spinner while determining user role
  if (isLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Get user role and determine if user is Security Guard
  const userRole = user.role?.name;

  const isSecurityGuard = userRole === 'Security Guard';

  // Security Guard Navigator
  if (isSecurityGuard) {
    return (
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        <RootStack.Screen
          name="SecurityGuardApp"
          component={SecurityGuardTabNavigator}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Search"
          component={Search}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="AddSecurityGuardGuest"
          component={AddSecurityGuardGuest}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="ViewSecurityGuardGuest"
          component={ViewSecurityGuardGuest}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="EditSecurityGuardGuest"
          component={EditSecurityGuardGuest}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="EditProfile"
          component={EditSecurityGuardProfile}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="ScanQrCode"
          component={ScanQrCode}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="ViewResident"
          component={ViewResident}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="ViewSecurityGuardVehicle"
          component={ViewSecurityGuardVehicle}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    );
  }

  // Resident Navigator (default)
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="ResidentApp"
        component={ResidentTabNavigator}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="AddResidentGuest"
        component={AddResidentGuest}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="ViewResidentGuest"
        component={ViewResidentGuest}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="EditResidentGuest"
        component={EditResidentGuest}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="EditResidentProfile"
        component={EditResidentProfile}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="ResidentHouseholdMembers"
        component={HouseholdMembers}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="AddResidentHouseholdMember"
        component={AddHouseholdMember}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="EditResidentHouseholdMember"
        component={EditHouseholdMember}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="ResidentVehicles"
        component={Vehicles}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="AddResidentVehicle"
        component={AddVehicle}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="EditResidentVehicle"
        component={EditVehicle}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="ViewResidentVehicle"
        component={ViewVehicle}
        options={{headerShown: false}}
      />
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.whiteBg,
  },
});
