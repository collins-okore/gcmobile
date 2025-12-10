/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform, View, StyleSheet} from 'react-native';
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

const Tab = createBottomTabNavigator();

const TabBarIcon = ({focused, color, size, IconSolid, IconOutline}: any) => {
  const Icon = focused ? IconSolid : IconOutline;
  return (
    <View style={styles.iconContainer}>
      <Icon color={color} size={size} />
    </View>
  );
};

const ResidentTabNavigator = () => {
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
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: props => (
            <TabBarIcon
              {...props}
              IconSolid={HomeSolid}
              IconOutline={HomeOutline}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ResidentGuests"
        component={GuestsScreen}
        options={{
          tabBarIcon: props => (
            <TabBarIcon
              {...props}
              IconSolid={UserGroupSolid}
              IconOutline={UserGroupOutline}
            />
          ),
          tabBarLabel: 'Guests',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: props => (
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

export default ResidentTabNavigator;
