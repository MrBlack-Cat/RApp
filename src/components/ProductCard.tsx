import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ProductDto} from '../api/products';
import ProductLike from './ProductLike';
import {useFavorites} from '../favorites/FavoritesContext';
import { useCurrency } from '../currency/CurrencyContext';






export default function ProductCard({
  item, onOpen,
}:{
  item: ProductDto;
  onOpen: (id:string)=>void;
}) {
  const {isFav, toggle} = useFavorites();
  const liked = isFav(String(item.id || (item as any)._id));
  const img = item.image || item.thumbnail || 'https://via.placeholder.com/300?text=%20';
  const { format } = useCurrency();
  

  return (
    <Pressable style={s.card} onPress={() => onOpen(item.id)}>
      <View style={s.imgWrap}>
        <Image source={{uri: img}} style={s.img}/>
        <ProductLike liked={liked} onPress={() => toggle(item)} />
      </View>
      <Text numberOfLines={2} style={s.title}>{item.name || item.title}</Text>
      <View style={s.row}>
        <Text style={s.price}>{format(item.price ?? 0)}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { width:'48%', backgroundColor:'#F6F7F9', borderRadius:14, padding:10, marginBottom:10 },
  imgWrap:{ position:'relative' },
  img:{ width:'100%', aspectRatio:1, borderRadius:10, backgroundColor:'#eee' },
  title:{ fontWeight:'600', marginTop:6 },
  price:{ fontWeight:'800', color:'#5A41DD', fontSize:14 },
  row:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:4 },
});
