import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, Image, StyleSheet, ActivityIndicator,
  ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/useAuth';

import { getProductDetails, getSimilar, type ProductDto } from '../api/products';
import { addToBasket, getBasket } from '../api/basket';

import ProductLike from '../components/ProductLike';
import { useFavorites } from '../favorites/FavoritesContext';
import { useCurrency } from '../currency/CurrencyContext';

type Nav = ReturnType<typeof useNavigation<any>>;

export default function ProductDetailsScreen({ route }: any) {
  const navigation = useNavigation<any>() as Nav;
  const { id } = route.params;
  const { isSignedIn } = useAuth();
  const { format } = useCurrency();

  const [data, setData] = useState<ProductDto | undefined>();
  const [similar, setSimilar] = useState<ProductDto[]>([]);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  const { isFav, toggle } = useFavorites();

  const pid = (p: ProductDto | any) => String(p?.id ?? p?._id ?? '');

  useEffect(() => {
    (async () => {
      try {
        const d = await getProductDetails(id);
        setData(d);
      } finally {
      }
      const sim = await getSimilar(id).catch(() => []);
      setSimilar(sim);
    })();
  }, [id]);

  const price = Number(data?.price ?? 0);
  const total = useMemo(() => price * qty, [price, qty]);

  const onAdd = async () => {
    if (!isSignedIn) {
      Alert.alert('Login required', 'Log in to add items to cart');
      return;
    }
    if (!data) return;

    const productId = (data as any)._id ?? data.id;
    try {
      setBusy(true);
      await addToBasket(productId, qty); 

      const after = await getBasket();
      if (!after.length) {
        Alert.alert('The cart is empty', 'The server accepted the request, but the cart returned empty. Make sure to use _id.');
        return;
      }

      Alert.alert('Added', 'Item added to cart');
      navigation.navigate('Cart');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to add to cart');
    } finally {
      setBusy(false);
    }
  };

  if (!data) return <View style={s.center}><ActivityIndicator/></View>;

  const likedMain = isFav(pid(data));
  const img = data.image || data.images?.[0] || 'https://via.placeholder.com/600?text=%20';

  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <ScrollView contentContainerStyle={{ padding:16, paddingBottom:140 }}>

        <View style={{ position:'relative' }}>
          <Image source={{ uri: img }} style={s.img}/>
          <ProductLike liked={likedMain} onPress={() => toggle(data)} />
        </View>

        <Text style={s.title}>{data.name || data.title}</Text>
        <Text style={s.price}>{format(price)}</Text>

        <Text style={s.label}>Quantity</Text>
        <View style={s.qtyRow}>
          <TouchableOpacity style={s.qtyBtn} onPress={()=>setQty(Math.max(1, qty-1))}>
            <Text style={s.qtyBtnTxt}>−</Text>
          </TouchableOpacity>
          <Text style={s.qtyValue}>{qty}</Text>
          <TouchableOpacity style={s.qtyBtn} onPress={()=>setQty(qty+1)}>
            <Text style={s.qtyBtnTxt}>+</Text>
          </TouchableOpacity>
        </View>

        {!!data.description && <Text style={s.desc}>{data.description}</Text>}

        <View style={{marginTop:16}}>
          <Text style={s.sectionTitle}>Shipping & Returns</Text>
          <Text style={s.subtle}>Free standard shipping and free 60-day returns.</Text>
        </View>

        <View style={{marginTop:16}}>
          <View style={s.rowBetween}>
            <Text style={s.sectionTitle}>Similar Items</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={s.link}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{gap:12, paddingVertical:8}}
          >
            {similar.slice(0,10).map(x=>{
              const xImg = x.image || x.images?.[0] || 'https://via.placeholder.com/200?text=%20';
              const liked = isFav(pid(x));
              return (
                <View key={x.id} style={s.card}>
                  <View style={{ position:'relative' }}>
                    <Image source={{ uri: xImg }} style={s.cardImg}/>
                    <ProductLike liked={liked} onPress={() => toggle(x)} />
                  </View>

                  <TouchableOpacity onPress={()=>navigation.push('ProductDetails', { id: x.id })}>
                    <Text numberOfLines={1} style={s.cardTitle}>{x.name || x.title}</Text>
                    <Text style={s.cardPrice}>{format(x.price ?? 0)}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={s.sticky}>
        <Text style={s.total}>{format(total)}</Text>
        <TouchableOpacity style={[s.addBtn, busy && {opacity:0.6}]} onPress={onAdd} disabled={busy}>
          <Text style={s.addTxt}>{busy ? '...' : 'Add to Bag'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  center:{ flex:1, alignItems:'center', justifyContent:'center' },
  img:{ width:'100%', aspectRatio:1, borderRadius:12, backgroundColor:'#eee', marginBottom:12 },
  title:{ fontSize:20, fontWeight:'800' },
  price:{ marginTop:6, fontWeight:'800', color:'#7B61FF' },
  label:{ marginTop:14, color:'#6b7280' },
  qtyRow:{ flexDirection:'row', alignItems:'center', gap:12, marginTop:8 },
  qtyBtn:{ width:40, height:40, borderRadius:20, backgroundColor:'#F1F2F4', alignItems:'center', justifyContent:'center' },
  qtyBtnTxt:{ fontSize:22, fontWeight:'800' },
  qtyValue:{ minWidth:24, textAlign:'center', fontSize:16 },
  desc:{ marginTop:12, color:'#444' },

  sectionTitle:{ fontSize:16, fontWeight:'700' },
  subtle:{ color:'#6b7280', marginTop:4 },
  rowBetween:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  link:{ textDecorationLine:'underline' },

  card:{ width:150 },
  cardImg:{ width:'100%', height:110, borderRadius:12, backgroundColor:'#eee' },
  cardTitle:{ marginTop:6, fontSize:13 },
  cardPrice:{ fontWeight:'700', fontSize:13 },

  sticky:{ position:'absolute', left:0, right:0, bottom:0, padding:16, borderTopWidth:1, borderTopColor:'#eee', backgroundColor:'#fff', flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  total:{ fontSize:16, fontWeight:'900' },
  addBtn:{ backgroundColor:'#7B61FF', paddingVertical:12, paddingHorizontal:20, borderRadius:24 },
  addTxt:{ color:'#fff', fontWeight:'800' }
});
