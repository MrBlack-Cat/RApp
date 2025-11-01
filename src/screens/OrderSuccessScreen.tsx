import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';

import OrderArt from '../../assets/icons/order.svg';

type Props = NativeStackScreenProps<AppStackParamList, 'OrderSuccess'>;

export default function OrderSuccessScreen({ navigation }: Props) {
  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />

      <View style={s.top}>
        <OrderArt width={260} height={200} />
      </View>

      <View style={s.bottom}>
        <Text style={s.title}>Order Placed{'\n'}Successfully</Text>
        <Text style={s.subtitle}>You will receive an email{'\n'}confirmation</Text>

        <TouchableOpacity
          style={s.btn}
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
        >
          <Text style={s.btnTxt}>Return to Homepage</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#8E6CEF' },

  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  bottom: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,         
    padding: 24,
    alignItems: 'center',
  },

  title: { fontSize: 24, fontWeight: '900', color: '#111', textAlign: 'center', lineHeight: 30, marginTop: 6 },
  subtitle: { marginTop: 12, color: '#6B7280', textAlign: 'center' },

  btn: {
    marginTop: 24,
    backgroundColor: '#8E6CEF',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 28,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  btnTxt: { color: '#fff', fontWeight: '800' },
});
