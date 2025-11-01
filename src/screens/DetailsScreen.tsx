import React from 'react';
import { View, Text, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Details: { id: number };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailsScreen({ route, navigation }: Props) {
  const { id } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Details</Text>
      <Text style={{ marginBottom: 12 }}>id = {id}</Text>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
