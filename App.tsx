// import React from 'react';
// import { StatusBar, View, Text } from 'react-native';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// import RootNavigator from './src/navigation/RootNavigator';
// import { ThemeModeProvider, useThemeMode } from './src/theme/ThemeMode';


// function AppBody() {
//   const { isDark } = useThemeMode();

//   return (
//     <>
//       <SafeAreaView edges={['top']} style={{ backgroundColor: isDark ? '#0f172a' : '#fff' }} />
//       <StatusBar
//         translucent={false}
//         backgroundColor={isDark ? '#0f172a' : '#ffffff'}
//         barStyle={isDark ? 'light-content' : 'dark-content'}
//       />
//       <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
//         <RootNavigator />
//       </View>

//     </>
//   );
// }


// export default function App() {
//   return (
//     <ThemeModeProvider>
//       <SafeAreaProvider>
//         <AppBody />
//       </SafeAreaProvider>
//     </ThemeModeProvider>
//   );
// }



import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';

import RootNavigator from './src/navigation/RootNavigator';
import { ThemeModeProvider, useThemeMode } from './src/theme/ThemeMode';
import { navigationRef } from './src/navigation/navigationRef';

import { initNotifications, registerFcm, bindHandlers } from './src/notifications';

function AppBody() {
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

  useEffect(() => {
    (async () => {
      await initNotifications();

      await registerFcm(async (token) => {
        console.log('FCM token (send to backend if needed):', token);
      });

      bindHandlers(() => {
      });
    })();
  }, []);

  return (
    <>
      <SafeAreaView edges={['top']} style={{ backgroundColor: isDark ? '#0f172a' : '#fff' }} />
      <StatusBar
        translucent={false}
        backgroundColor={isDark ? '#0f172a' : '#ffffff'}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
        <NavigationContainer ref={navigationRef} theme={navTheme}>
          <RootNavigator />
        </NavigationContainer>
      </View>
    </>
  );
}

export default function App() {
  return (
    <ThemeModeProvider>
      <SafeAreaProvider>
        <AppBody />
      </SafeAreaProvider>
    </ThemeModeProvider>
  );
}
