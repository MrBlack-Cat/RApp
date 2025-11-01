import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../auth/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any>;

export default function SignInScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) return Alert.alert('Fill all fields');
    try {
      setBusy(true);
      await signIn(email.trim(), password);
    } catch (e:any) {
      Alert.alert('Login failed', e?.message ?? 'Try again');
    } finally { setBusy(false); }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Sign in</Text>
      <TextInput placeholder="Email Address" value={email} onChangeText={setEmail} style={s.input} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={s.input} secureTextEntry />
      <TouchableOpacity style={[s.btn, busy && { opacity:0.6 }]} onPress={onSubmit} disabled={busy}>
        <Text style={s.btnText}>{busy ? '...' : 'Continue'}</Text>
      </TouchableOpacity>
      <Text style={s.footer}>
        Dont have an Account?{' '}
        <Text style={s.link} onPress={() => navigation.navigate('SignUp')}>Create One</Text>
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, padding:24, paddingTop:64, backgroundColor:'#fff' },
  title: { fontSize:32, fontWeight:'800', marginBottom:24 },
  input: { backgroundColor:'#F1F2F4', borderRadius:10, padding:14, marginBottom:14 },
  btn: { backgroundColor:'#7B61FF', padding:16, borderRadius:30, alignItems:'center', marginTop:8 },
  btnText: { color:'#fff', fontWeight:'600' },
  footer: { marginTop:16, color:'#333' },
  link: { fontWeight:'700' }
});
