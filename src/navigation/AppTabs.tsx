// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import HomeScreen from '../screens/HomeScreen';
// import FavoritesScreen from '../screens/FavoritesScreen';
// import CartScreen from '../screens/CartScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import NotificationsScreen from '../screens/NotificationsScreen';
// import type { TabsParamList } from './types';

// import HomeIcon from '../../assets/icons/home.svg';
// import BellIcon from '../../assets/icons/notification.svg';
// import HeartIcon from '../../assets/icons/heart.svg';
// import ProfileIcon from '../../assets/icons/profile.svg';
// import TabIcon from '../components/TabIcon';

// const Tab = createBottomTabNavigator<TabsParamList>();

// export default function AppTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         headerTitleAlign: 'center',
//         tabBarShowLabel: false,               
//         tabBarActiveTintColor: '#8E6CEF',     
//         tabBarInactiveTintColor: '#9CA3AF',
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <TabIcon Icon={HomeIcon} focused={focused} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Notifications"
//         component={NotificationsScreen}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <TabIcon Icon={BellIcon} focused={focused} color={color} size={26} strokeWidth={1.6} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Favorites"
//         component={FavoritesScreen}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <TabIcon Icon={HeartIcon} focused={focused} color={color} />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <TabIcon Icon={ProfileIcon} focused={focused} color={color} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }



import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import type { TabsParamList } from './types';

import HomeIcon from '../../assets/icons/home.svg';
import BellIcon from '../../assets/icons/notification.svg';
import HeartIcon from '../../assets/icons/heart.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import TabIcon from '../components/TabIcon';

import { useColors } from '../ui/Themed';
import { useThemeMode } from '../theme/ThemeMode';

const Tab = createBottomTabNavigator<TabsParamList>();

export default function AppTabs() {
  const c = useColors();
  const { isDark } = useThemeMode();

  return (
    <Tab.Navigator
      key={isDark ? 'tabs-dark' : 'tabs-light'} 
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: {
          backgroundColor: c.card,
          borderTopColor: c.border,
        },
        
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon Icon={HomeIcon} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon Icon={BellIcon} focused={focused} color={color} size={26} strokeWidth={1.6} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon Icon={HeartIcon} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon Icon={ProfileIcon} focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
