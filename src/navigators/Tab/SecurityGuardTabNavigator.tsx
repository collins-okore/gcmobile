/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform} from 'react-native';
import ProfileScreen from '../../screens/SecurityGuard/Profile/ProfileStack';
import {
  UserGroupIcon as UserGroupOutline,
  UserCircleIcon as UserCircleOutline,
  ShieldCheckIcon as ShieldCheckOutline,
} from 'react-native-heroicons/outline';
import {
  UserGroupIcon as UserGroupSolid,
  UserCircleIcon as UserCircleSolid,
  ShieldCheckIcon as ShieldCheckSolid,
} from 'react-native-heroicons/solid';
import colors from '../../themes/colors';
import GuestsScreen from '../../screens/SecurityGuard/Guests/GuestsStack';
import fonts from '../../themes/fonts';
import SecurityCheckIn from '../../screens/SecurityGuard/SecurityCheckIn';

const Tab = createBottomTabNavigator();

const SecurityGuardTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grayIconColor,
        tabBarLabelStyle: {
          fontFamily: Platform.select({
            ios: fonts.regular,
            android: fonts.regular,
          }),
          fontSize: 15,
        },
      }}>
      <Tab.Screen
        name="SecurityCheckIn"
        component={SecurityCheckIn}
        options={{
          tabBarIcon: ({color, size, focused}) => {
            const Icon = focused ? ShieldCheckSolid : ShieldCheckOutline;
            return <Icon color={color} size={size} />;
          },
          tabBarLabel: 'Check In',
        }}
      />
      <Tab.Screen
        name="Guests"
        component={GuestsScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => {
            const Icon = focused ? UserGroupSolid : UserGroupOutline;
            return <Icon color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => {
            const Icon = focused ? UserCircleSolid : UserCircleOutline;
            return <Icon color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default SecurityGuardTabNavigator;
