import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider } from '../auth/AuthContext';
import { useAuth } from '../auth/useAuth';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

import AppTabs from './AppTabs';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import type { AppStackParamList, RootStackParamList } from './types';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';

import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';

import { FavoritesProvider } from '../favorites/FavoritesContext';

import CartScreen from '../screens/CartScreen';
import ProductsListScreen from '../screens/ProductsListScreen'; 
import { CurrencyProvider } from '../currency/CurrencyContext';



const RootStack = createNativeStackNavigator<RootStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AppRoot() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Tabs"
        component={AppTabs}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product' }}
      />
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
        <RootStack.Screen name="App" component={AppRoot} />
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
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CurrencyProvider> 
          <NavigationContainer>
            <Gate />
          </NavigationContainer>
        </CurrencyProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
