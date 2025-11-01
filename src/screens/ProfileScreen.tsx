import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../auth/useAuth';
import CurrencySelector from '../currency/CurrencySelector';

export default function ProfileScreen() {
  const { isSignedIn, user, signOut } = useAuth();

  return (
    <View style={s.container}>
      {isSignedIn ? (
        <>
          <Text style={s.text}>
            Signed in as <Text style={s.bold}>{user?.email ?? 'User'}</Text>
          </Text>

          <CurrencySelector />

          <TouchableOpacity style={s.btnOutline} onPress={signOut}>
            <Text style={s.btnOutlineText}>Sign out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={s.text}>You’re browsing as a guest.</Text>
          <Text style={[s.text, { marginTop: 8 }]}>
            Please sign in to manage orders and favorites.
          </Text>

          <CurrencySelector />
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:16 },
  text: { color:'#333' },
  bold: { fontWeight:'800' },
  btnOutline: { marginTop:16, padding:12, borderRadius:12, borderWidth:1, borderColor:'#ddd', alignItems:'center' },
  btnOutlineText: { fontWeight:'700' },
});
