import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../auth/useAuth';
import CurrencySelector from '../currency/CurrencySelector';
import { ThemedView, ThemedText, ThemedCard, useColors } from '../ui/Themed';
import ThemeModeSwitch from '../components/ThemeModeSwitch';

export default function ProfileScreen() {
  const { isSignedIn, user, signOut } = useAuth();
  const c = useColors();

  return (
    <ThemedView style={s.container}>
      {/* Header */}
      <View style={s.headerRow}>
        <ThemedText style={s.headerTitle}>Profile</ThemedText>
        <ThemeModeSwitch />
      </View>

      {/* Account section */}
      <ThemedCard style={s.card}>
        <ThemedText style={s.cardTitle}>Account</ThemedText>

        {isSignedIn ? (
          <>
            <ThemedText style={s.mt8}>
              Signed in as <ThemedText style={s.bold}>{user?.email ?? 'User'}</ThemedText>
            </ThemedText>

            <TouchableOpacity
              style={[s.btnOutline, { borderColor: c.border, backgroundColor: c.card }]}
              onPress={signOut}
            >
              <ThemedText style={[s.btnOutlineText, { color: c.text }]}>Sign out</ThemedText>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <ThemedText style={s.mt8}>You’re browsing as a guest.</ThemedText>
            <ThemedText style={[s.mt4, { opacity: 0.8 }]}>
              Please sign in to manage orders and favorites.
            </ThemedText>
          </>
        )}
      </ThemedCard>

      {/* Settings section */}
      <ThemedCard style={s.card}>
        <ThemedText style={s.cardTitle}>Settings</ThemedText>
        <View style={s.mt12}>
          <CurrencySelector />
        </View>
      </ThemedCard>
    </ThemedView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 22, fontWeight: '800' },

  card: { padding: 14, borderRadius: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700' },

  bold: { fontWeight: '800' },

  btnOutline: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  btnOutlineText: { fontWeight: '700' },

  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
});
