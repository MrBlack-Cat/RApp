import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getProductsByCategory, type ProductDto } from '../api/products';

import ProductCard from '../components/ProductCard';


export default function CategoryProductsScreen({ route, navigation }: any) {
  const { categoryId, name } = route.params; 
  const [items, setItems] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: name });
    (async () => {
      try {
        const d = await getProductsByCategory(categoryId); 
        setItems(Array.isArray(d) ? d : []);      
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryId, name, navigation]);

  if (loading) return <View style={s.center}><ActivityIndicator/></View>;

  return (
    <View style={s.container}>
      <FlatList
        numColumns={2}
        columnWrapperStyle={{ justifyContent:'space-between' }}
        data={items}
        keyExtractor={(it)=>it.id}
        renderItem={({item})=>(
          <ProductCard item={item} onOpen={(id)=>navigation.navigate('ProductDetails',{id})}/>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={<Text style={{ color:'#888' }}>No products</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff', padding:16 },
  center:{ flex:1, justifyContent:'center', alignItems:'center' },
  card:{ width:'48%', backgroundColor:'#F6F7F9', borderRadius:12, padding:10, marginBottom:12 },
  img:{ width:'100%', aspectRatio:1, borderRadius:10, backgroundColor:'#eee' },
  title:{ marginTop:6, fontWeight:'600' },
  price:{ fontWeight:'800', color:'#5A41DD', marginTop:4 }
});
