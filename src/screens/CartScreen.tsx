import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getBasket, updateBasket, removeFromBasket, type BasketItem } from '../api/basket';
import { useAuth } from '../auth/useAuth';
import { useCurrency } from '../currency/CurrencyContext';
import { ThemedView, ThemedText, useColors } from '../ui/Themed';
import BagIcon from '../../assets/icons/bag.svg';

export default function CartScreen(): React.ReactElement {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { format } = useCurrency();
  const [items, setItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const c = useColors();

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
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = useCallback(async () => { setRefreshing(true); await load(); setRefreshing(false); }, [load]);

  const total = items.reduce((sum, it) =>
    sum + (Number(it.price ?? it.product?.price ?? 0) * Number(it.count ?? 1)), 0);

  const inc = async (it: BasketItem) => { await updateBasket(it.id, Number(it.count ?? 1) + 1).catch(() => {}); await load(); };
  const dec = async (it: BasketItem) => { await updateBasket(it.id, Math.max(1, Number(it.count ?? 1) - 1)).catch(() => {}); await load(); };
  const remove = async (it: BasketItem) => { await removeFromBasket(it.id).catch(() => {}); await load(); };

  if (!user) {
    return (
      <ThemedView style={s.center}>
        <ThemedText style={s.title}>Your cart is empty</ThemedText>
        <ThemedText style={{ opacity:0.7, marginTop:6 }}>Sign in to see items you’ve added</ThemedText>
        <TouchableOpacity style={[s.btn, { backgroundColor: c.accent }]} onPress={() => navigation.navigate('SignIn')}>
          <ThemedText style={s.btnText}>Sign in</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (loading) return <View style={s.center}><ActivityIndicator/></View>;

  return (
    <ThemedView style={{ flex:1 }}>
      {items.length === 0 ? (
        <View style={s.center}>
          <BagIcon width={96} height={96} stroke="#9CA3AF" fill="none" opacity={0.9} />
          <ThemedText style={[s.title, { marginTop: 12 }]}>Your cart is empty</ThemedText>
          <TouchableOpacity
            style={[s.btn, { marginTop: 12, backgroundColor: c.accent }]}
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          >
            <ThemedText style={s.btnText}>Go shopping</ThemedText>
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
                    <ThemedText numberOfLines={1} style={s.itemTitle}>
                      {item.product?.name || item.product?.title || 'Product'}
                    </ThemedText>
                    <ThemedText style={s.price}>{format(unit)}</ThemedText>
                    <View style={s.actions}>
                      <View style={s.counter}>
                        <TouchableOpacity onPress={() => dec(item)}><ThemedText style={s.counterBtn}>-</ThemedText></TouchableOpacity>
                        <ThemedText style={s.count}>{item.count ?? 1}</ThemedText>
                        <TouchableOpacity onPress={() => inc(item)}><ThemedText style={s.counterBtn}>+</ThemedText></TouchableOpacity>
                      </View>
                      <TouchableOpacity onPress={() => remove(item)}>
                        <Text style={{ color:'#e33', fontWeight:'700' }}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
            contentContainerStyle={{ paddingBottom: 120, padding:16 }}
          />

          <View style={[s.footer, { borderTopColor: c.border }]}>
            <ThemedText style={s.totalLabel}>Total</ThemedText>
            <ThemedText style={s.totalValue}>{format(total)}</ThemedText>
            <TouchableOpacity
              style={[s.btn, { marginLeft:'auto', backgroundColor: c.accent }]}
              onPress={() => navigation.navigate('Checkout')}
            >
              <ThemedText style={s.btnText}>Checkout</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ThemedView>
  );
}

const s = StyleSheet.create({
  center:{ flex:1, justifyContent:'center', alignItems:'center', padding:24 },
  title:{ fontSize:20, fontWeight:'800' },
  btn:{ paddingHorizontal:18, paddingVertical:12, borderRadius:24 },
  btnText:{ color:'#fff', fontWeight:'700' },
  rowItem:{ flexDirection:'row', marginBottom:14, paddingHorizontal:16 },
  img:{ width:84, height:84, borderRadius:10, backgroundColor:'#eee' },
  itemTitle:{ fontWeight:'700' },
  price:{ marginTop:4, fontWeight:'800' },
  actions:{ marginTop:8, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  counter:{ flexDirection:'row', alignItems:'center', gap:12 },
  counterBtn:{ fontSize:18, width:28, height:28, textAlign:'center', textAlignVertical:'center', backgroundColor:'#F1F2F4', borderRadius:6 },
  count:{ minWidth:20, textAlign:'center', fontWeight:'700' },
  footer:{ position:'absolute', left:0, right:0, bottom:0, borderTopWidth:1, padding:16, flexDirection:'row', alignItems:'center', backgroundColor:'transparent', gap:12 },
  totalLabel:{ fontSize:16, fontWeight:'600' },
  totalValue:{ fontSize:18, fontWeight:'900' },
});
