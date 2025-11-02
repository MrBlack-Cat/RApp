import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../auth/useAuth';
import CurrencySelector from '../currency/CurrencySelector';
import { ThemedView, ThemedText, ThemedCard, useColors } from '../ui/Themed';
import ThemeModeSwitch from '../components/ThemeModeSwitch';

export default function ProfileScreen() {
  const { isSignedIn, user, signOut } = useAuth();
  const c = useColors();

  return (
    <ThemedView style={s.container}>
      
      <ThemeModeSwitch />

      {isSignedIn ? (
        <>
          <ThemedText style={s.mt16}>
            Signed in as <ThemedText style={s.bold}>{user?.email ?? 'User'}</ThemedText>
          </ThemedText>

          <ThemedCard style={s.mt12}>
            <CurrencySelector />
          </ThemedCard>

          <TouchableOpacity style={[s.btnOutline, { borderColor: c.border }]} onPress={signOut}>
            <ThemedText style={s.btnOutlineText}>Sign out</ThemedText>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <ThemedText style={s.mt16}>You’re browsing as a guest.</ThemedText>
          <ThemedText style={s.mt8}>Please sign in to manage orders and favorites.</ThemedText>
          <ThemedCard style={s.mt12}>
            <CurrencySelector />
          </ThemedCard>
        </>
      )}
    </ThemedView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  bold: { fontWeight: '800' },
  btnOutline: { marginTop: 16, padding: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  btnOutlineText: { fontWeight: '700' },
  mt8: { marginTop: 8 }, mt12: { marginTop: 12 }, mt16: { marginTop: 16 },
});
