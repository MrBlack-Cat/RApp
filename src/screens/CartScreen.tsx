import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getBasket, updateBasket, removeFromBasket, type BasketItem } from '../api/basket';
import { useAuth } from '../auth/useAuth';
import { useCurrency } from '../currency/CurrencyContext';

import BagIcon from '../../assets/icons/bag.svg';

export default function CartScreen(): React.ReactElement {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { format } = useCurrency();

  const [items, setItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    try {
      setLoading(true);
      const data = await getBasket();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.log('CART LOAD ERROR:', e?.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  useFocusEffect(useCallback(() => {
    load();
  }, [load]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const total = items.reduce(
    (sum, it) =>
      sum + (Number(it.price ?? it.product?.price ?? 0) * Number(it.count ?? 1)),
    0
  );

  const inc = async (it: BasketItem) => {
    const next = Number(it.count ?? 1) + 1;
    await updateBasket(it.id, next).catch(() => {});
    await load();
  };
  const dec = async (it: BasketItem) => {
    const next = Math.max(1, Number(it.count ?? 1) - 1);
    await updateBasket(it.id, next).catch(() => {});
    await load();
  };
  const remove = async (it: BasketItem) => {
    await removeFromBasket(it.id).catch(() => {});
    await load();
  };

  if (!user) {
    return (
      <View style={s.center}>
        <Text style={s.title}>Your cart is empty</Text>
        <Text style={{ color:'#666', marginTop:6 }}>Sign in to see items you’ve added</Text>
        <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('SignIn')}>
          <Text style={s.btnText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) return <View style={s.center}><ActivityIndicator/></View>;

  return (
    <View style={s.container}>
      {items.length === 0 ? (
        <View style={s.center}>
          <BagIcon width={96} height={96} stroke="#9CA3AF" fill="none" opacity={0.9} />
          <Text style={[s.title, { marginTop: 12 }]}>Your cart is empty</Text>

          <TouchableOpacity
            style={[s.btn, { marginTop: 12 }]}
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          >
            <Text style={s.btnText}>Go shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(it) => it.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item }) => {
              const unit = Number(item.price ?? item.product?.price ?? 0);
              return (
                <View style={s.rowItem}>
                  <Image
                    source={{ uri: item.product?.image || item.product?.images?.[0] || 'https://via.placeholder.com/200?text=%20' }}
                    style={s.img}
                  />
                  <View style={{ flex:1, marginLeft:12 }}>
                    <Text numberOfLines={1} style={s.itemTitle}>
                      {item.product?.name || item.product?.title || 'Product'}
                    </Text>
                    <Text style={s.price}>{format(unit)}</Text>
                    <View style={s.actions}>
                      <View style={s.counter}>
                        <TouchableOpacity onPress={() => dec(item)}>
                          <Text style={s.counterBtn}>-</Text>
                        </TouchableOpacity>
                        <Text style={s.count}>{item.count ?? 1}</Text>
                        <TouchableOpacity onPress={() => inc(item)}>
                          <Text style={s.counterBtn}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity onPress={() => remove(item)}>
                        <Text style={{ color:'#e33', fontWeight:'700' }}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
            contentContainerStyle={{ paddingBottom: 120 }}
          />

          <View style={s.footer}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalValue}>{format(total)}</Text>
            <TouchableOpacity
              style={[s.btn, { marginLeft:'auto' }]}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={s.btnText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff', padding:16 },
  center:{ flex:1, justifyContent:'center', alignItems:'center', padding:24 },
  title:{ fontSize:20, fontWeight:'800' },
  btn:{ backgroundColor:'#7B61FF', paddingHorizontal:18, paddingVertical:12, borderRadius:24, marginTop:10 },
  btnText:{ color:'#fff', fontWeight:'700' },
  rowItem:{ flexDirection:'row', marginBottom:14 },
  img:{ width:84, height:84, borderRadius:10, backgroundColor:'#eee' },
  itemTitle:{ fontWeight:'700' },
  price:{ marginTop:4, fontWeight:'800', color:'#5A41DD' },
  actions:{ marginTop:8, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  counter:{ flexDirection:'row', alignItems:'center', gap:12 },
  counterBtn:{ fontSize:18, width:28, height:28, textAlign:'center', textAlignVertical:'center', backgroundColor:'#F1F2F4', borderRadius:6 },
  count:{ minWidth:20, textAlign:'center', fontWeight:'700' },
  footer:{ position:'absolute', left:0, right:0, bottom:0, borderTopWidth:1, borderTopColor:'#eee', padding:16, flexDirection:'row', alignItems:'center', backgroundColor:'#fff', gap:12 },
  totalLabel:{ fontSize:16, fontWeight:'600' },
  totalValue:{ fontSize:18, fontWeight:'900' },
});
