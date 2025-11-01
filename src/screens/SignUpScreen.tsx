import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signUp } from '../api/auth';
import { useAuth } from '../auth/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any>;

export default function SignUpScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [busy, setBusy]           = useState(false);

  const onSubmit = async () => {
    if (!firstname || !lastname || !email || !password) return Alert.alert('Fill all fields');
    try {
      setBusy(true);
      await signUp({ firstname, lastname, email, password });
      await signIn(email, password);
    } catch (e:any) {
      Alert.alert('Sign up failed', e?.message ?? 'Try again');
    } finally { setBusy(false); }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Create Account</Text>
      <TextInput placeholder="Firstname" value={firstname} onChangeText={setFirstname} style={s.input} />
      <TextInput placeholder="Lastname" value={lastname} onChangeText={setLastname} style={s.input} />
      <TextInput placeholder="Email Address" value={email} onChangeText={setEmail} style={s.input} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={s.input} secureTextEntry />
      <TouchableOpacity style={[s.btn, busy && { opacity:0.6 }]} onPress={onSubmit} disabled={busy}>
        <Text style={s.btnText}>{busy ? '...' : 'Continue'}</Text>
      </TouchableOpacity>
      <Text style={s.footer}>
        Already have an Account?{' '}
        <Text style={s.link} onPress={() => navigation.replace('SignIn')}>Sign In</Text>
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
