import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabsParamList = {
  Home: undefined;
  Notifications: undefined;  
  Favorites: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
  ProductDetails: { id: string };
  Categories: undefined;
  CategoryProducts: { categoryId: string; name: string };
  Checkout: undefined;
  OrderSuccess: { orderId: string; total: number; count: number }; 
  Cart: undefined;
    ProductsList: { mode: 'all' | 'new'; title?: string };

 
};

export type RootStackParamList = {
  App: undefined;
  SignIn: undefined;
  SignUp: undefined;
};
