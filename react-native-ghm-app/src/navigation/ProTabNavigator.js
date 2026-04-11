import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontSize } from '../theme/typography';

import ProDashboardScreen from '../screens/pro/ProDashboardScreen';
import MyJobsScreen from '../screens/pro/MyJobsScreen';
import EarningsScreen from '../screens/pro/EarningsScreen';
import CustomersScreen from '../screens/pro/CustomersScreen';
import ProProfileScreen from '../screens/pro/ProProfileScreen';

const Tab = createBottomTabNavigator();

export default function ProTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primaryDark,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, focused }) => {
          const icons = {
            Dashboard: focused ? 'grid' : 'grid-outline',
            Jobs: focused ? 'hammer' : 'hammer-outline',
            Earnings: focused ? 'cash' : 'cash-outline',
            Customers: focused ? 'people' : 'people-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={ProDashboardScreen} />
      <Tab.Screen name="Jobs" component={MyJobsScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Profile" component={ProProfileScreen} />
    </Tab.Navigator>
  );
}
