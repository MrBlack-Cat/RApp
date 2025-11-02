import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { getProductsByCategory, type ProductDto } from '../api/products';
import ProductCard from '../components/ProductCard';
import { ThemedView, ThemedText } from '../ui/Themed';

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
    <ThemedView style={s.container}>
      <FlatList
        numColumns={2}
        columnWrapperStyle={{ justifyContent:'space-between' }}
        data={items}
        keyExtractor={(it)=>it.id}
        renderItem={({item})=>(
          <ProductCard item={item} onOpen={(id)=>navigation.navigate('ProductDetails',{id})}/>
        )}
        contentContainerStyle={{ paddingBottom: 16, padding:16 }}
        ListEmptyComponent={<ThemedText style={{ opacity:0.7 }}>No products</ThemedText>}
      />
    </ThemedView>
  );
}

const s = StyleSheet.create({
  container:{ flex:1 },
  center:{ flex:1, justifyContent:'center', alignItems:'center' },
});
