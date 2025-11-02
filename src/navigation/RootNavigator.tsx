import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider } from '../auth/AuthContext';
import { useAuth } from '../auth/useAuth';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

import AppTabs from './AppTabs';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import CartScreen from '../screens/CartScreen';
import ProductsListScreen from '../screens/ProductsListScreen';

import { FavoritesProvider } from '../favorites/FavoritesContext';
import { CurrencyProvider } from '../currency/CurrencyContext';

import { useThemeMode } from '../theme/ThemeMode';
import type { AppStackParamList, RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AppStack  = createNativeStackNavigator<AppStackParamList>();

function AppStackNavigator() {
  const { isDark } = useThemeMode();

  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle:   { backgroundColor: isDark ? '#111827' : '#F3F4F6' },
        headerTintColor:             isDark ? '#F9FAFB' : '#111827',
      }}
    >
      <AppStack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false }} />
      <AppStack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product' }} />
      <AppStack.Screen name="Categories" component={CategoriesScreen} />
      <AppStack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <AppStack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <AppStack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false }} />
      <AppStack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <AppStack.Screen name="ProductsList" component={ProductsListScreen} />
    </AppStack.Navigator>
  );
}

function Gate() {
  const { user, loading } = useAuth();
  if (loading) return <SplashScreen />;
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="App" component={AppStackNavigator} />
      ) : (
        <>
          <RootStack.Screen name="SignIn" component={SignInScreen} />
          <RootStack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </RootStack.Navigator>
  );
}

export default function RootNavigator() {
  const { isDark } = useThemeMode();
  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: isDark ? '#0f172a' : '#ffffff',
      card:       isDark ? '#111827' : '#F3F4F6',
      text:       isDark ? '#F9FAFB' : '#111827',
      border:     isDark ? '#1F2937' : '#E5E7EB',
      primary:    isDark ? '#93C5FD' : '#2563EB',
    },
  };

  return (
    <AuthProvider>
      <FavoritesProvider>
        <CurrencyProvider>
          <NavigationContainer theme={navTheme}>
            <Gate />
          </NavigationContainer>
        </CurrencyProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

