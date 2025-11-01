import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ProductDto} from '../api/products';
import ProductLike from './ProductLike';
import {useFavorites} from '../favorites/FavoritesContext';
import { useCurrency } from '../currency/CurrencyContext';




export default function ProductRow({
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
    <View style={s.rowItem}>
      <Image source={{uri: img}} style={s.rowImg}/>
      <Pressable onPress={() => onOpen(item.id)} style={{flex:1, marginLeft:10}}>
        <Text numberOfLines={1} style={s.title}>{item.name || item.title}</Text>
        <Text style={s.price}>{format(item.price ?? 0)}</Text>
      </Pressable>
      <ProductLike liked={liked} onPress={() => toggle(item)} />
    </View>
  );
}

const s = StyleSheet.create({
  rowItem:{ flexDirection:'row', alignItems:'center', paddingHorizontal:12, paddingVertical:10 },
  rowImg:{ width:44, height:44, borderRadius:8, backgroundColor:'#eee' },
  title:{ fontWeight:'600' },
  price:{ color:'#5A41DD', fontWeight:'800', marginTop:2 },
});
