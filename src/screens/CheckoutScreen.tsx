import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getBasket, checkoutBasket, type BasketItem } from '../api/basket';
import { useNavigation } from '@react-navigation/native';
import { useCurrency } from '../currency/CurrencyContext';

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { format } = useCurrency();
  const [items, setItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const d = await getBasket();
        setItems(Array.isArray(d) ? d : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = useMemo(
    () => items.reduce((s, it) => s + (Number(it.price ?? it.product?.price ?? 0) * Number(it.count ?? 1)), 0),
    [items]
  );

  const placeOrder = async () => {
    if (!items.length) { Alert.alert('Empty', 'Your cart is empty'); return; }
    try {
      setPlacing(true);
      const res = await checkoutBasket(); 
      navigation.replace('OrderSuccess', { orderId: res.orderId, total: res.total || total, count: res.count || items.length });
    } catch (e:any) {
      Alert.alert('Error', e?.message ?? 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <View style={s.center}><ActivityIndicator /></View>;

  return (
    <View style={s.container}>
      <View style={s.card}>
        <Text style={s.cardTitle}>Delivery</Text>
        <Text style={s.muted}>Standard delivery • Free</Text>
      </View>
      <View style={s.card}>
        <Text style={s.cardTitle}>Payment</Text>
        <Text style={s.muted}>Visa •••• 4242</Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Order Summary</Text>
        <FlatList
          data={items}
          keyExtractor={(it)=>it.id}
          renderItem={({item})=>{
            const line = Number(item.price ?? item.product?.price ?? 0) * Number(item.count ?? 1);
            return (
              <View style={s.row}>
                <Image source={{ uri: item.product?.image || 'https://via.placeholder.com/120?text=%20' }} style={s.img}/>
                <View style={{flex:1, marginLeft:10}}>
                  <Text numberOfLines={1} style={s.itemTitle}>{item.product?.name || item.product?.title || 'Product'}</Text>
                  <Text style={s.muted}>Qty: {item.count}</Text>
                </View>
                <Text style={s.price}>{format(line)}</Text>
              </View>
            );
          }}
        />
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalValue}>{format(total)}</Text>
        </View>
      </View>

      <TouchableOpacity style={[s.btn, placing && {opacity:0.6}]} disabled={placing} onPress={placeOrder}>
        <Text style={s.btnTxt}>{placing ? 'Placing…' : 'Place Order'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff', padding:16 },
  center:{ flex:1, alignItems:'center', justifyContent:'center' },
  card:{ backgroundColor:'#F6F7F9', borderRadius:14, padding:14, marginBottom:12 },
  cardTitle:{ fontWeight:'800', marginBottom:6 },
  muted:{ color:'#6b7280' },
  row:{ flexDirection:'row', alignItems:'center', marginBottom:10 },
  img:{ width:56, height:56, borderRadius:10, backgroundColor:'#eee' },
  itemTitle:{ fontWeight:'700' },
  price:{ fontWeight:'800' },
  totalRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:6, borderTopWidth:1, borderTopColor:'#e5e7eb', paddingTop:8 },
  totalLabel:{ fontWeight:'700' },
  totalValue:{ fontSize:18, fontWeight:'900' },
  btn:{ backgroundColor:'#7B61FF', padding:16, borderRadius:24, alignItems:'center', marginTop:8 },
  btnTxt:{ color:'#fff', fontWeight:'800' }
});
