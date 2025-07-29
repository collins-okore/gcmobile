/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform} from 'react-native';
import HomeScreen from '../../screens/Home/HomeStack';
import ProfileScreen from '../../screens/Profile/ProfileStack';
import {
  HomeIcon as HomeOutline,
  UserGroupIcon as UserGroupOutline,
  UserCircleIcon as UserCircleOutline,
} from 'react-native-heroicons/outline';
import {
  HomeIcon as HomeSolid,
  UserGroupIcon as UserGroupSolid,
  UserCircleIcon as UserCircleSolid,
} from 'react-native-heroicons/solid';
import colors from '../../themes/colors';
import GuestsScreen from '../../screens/Guests/GuestsStack';
import fonts from '../../themes/fonts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const ResidentTabNavigator = () => {
  const insets = useSafeAreaInsets();

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
        tabBarStyle: {
          paddingBottom: insets.bottom + 10,
          marginBottom: Platform.OS === 'android' ? 10 : 0,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => {
            const Icon = focused ? HomeSolid : HomeOutline;
            return <Icon color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="ResidentGuests"
        component={GuestsScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => {
            const Icon = focused ? UserGroupSolid : UserGroupOutline;
            return <Icon color={color} size={size} />;
          },
          tabBarLabel: 'Guests',
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

export default ResidentTabNavigator;
