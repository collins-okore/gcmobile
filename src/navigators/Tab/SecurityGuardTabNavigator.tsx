/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform, View, StyleSheet} from 'react-native';
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
import SecurityCheckIn from '../../screens/SecurityGuard/SecurityCheckIn';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({focused, color, size, IconSolid, IconOutline}: any) => {
  const Icon = focused ? IconSolid : IconOutline;
  return (
    <View style={styles.iconContainer}>
      <Icon color={color} size={size} />
    </View>
  );
};

const SecurityGuardTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grayIconColor,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}>
      <Tab.Screen
        name="SecurityCheckIn"
        component={SecurityCheckIn}
        options={{
          tabBarIcon: (props) => (
            <TabBarIcon
              {...props}
              IconSolid={ShieldCheckSolid}
              IconOutline={ShieldCheckOutline}
            />
          ),
          tabBarLabel: 'Check In',
        }}
      />
      <Tab.Screen
        name="Guests"
        component={GuestsScreen}
        options={{
          tabBarIcon: (props) => (
            <TabBarIcon
              {...props}
              IconSolid={UserGroupSolid}
              IconOutline={UserGroupOutline}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: (props) => (
            <TabBarIcon
              {...props}
              IconSolid={UserCircleSolid}
              IconOutline={UserCircleOutline}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    elevation: 5,
    backgroundColor: colors.whiteBg,
    height: Platform.OS === 'ios' ? 85 : 60,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SecurityGuardTabNavigator;
