import React from 'react';
import { StatusBar, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import RootNavigator from './src/navigation/RootNavigator';
import { ThemeModeProvider, useThemeMode } from './src/theme/ThemeMode';


function AppBody() {
  const { isDark } = useThemeMode();

  return (
    <>
      <SafeAreaView edges={['top']} style={{ backgroundColor: isDark ? '#0f172a' : '#fff' }} />
      <StatusBar
        translucent={false}
        backgroundColor={isDark ? '#0f172a' : '#ffffff'}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
        <RootNavigator />
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
