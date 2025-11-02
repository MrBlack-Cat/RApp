import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { ThemedView, ThemedText } from '../ui/Themed';
import { getAllProducts, getNewProducts, type ProductDto } from '../api/products';
import ProductCard from '../components/ProductCard';

type Mode = 'all' | 'new';

export default function ProductsListScreen({ route, navigation }: any) {
  const { mode, title } = route.params as { mode: Mode; title?: string };
  const [items, setItems] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: title ?? (mode === 'new' ? 'New In' : 'All Products') });
    (async () => {
      try {
        const data = mode === 'new' ? await getNewProducts() : await getAllProducts();
        setItems(Array.isArray(data) ? data : []);
      } finally { setLoading(false); }
    })();
  }, [mode, title, navigation]);

  if (loading) return <View style={s.center}><ActivityIndicator /></View>;

  return (
    <ThemedView style={s.container}>
      <FlatList
        data={items}
        keyExtractor={(it)=>it.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent:'space-between' }}
        renderItem={({ item }) => (
          <ProductCard item={item} onOpen={(id)=>navigation.navigate('ProductDetails', { id })}/>
        )}
        contentContainerStyle={{ paddingBottom: 16, padding:16 }}
        ListEmptyComponent={<ThemedText style={{ opacity:0.7 }}>No products</ThemedText>}
      />
    </ThemedView>
  );
}

const s = StyleSheet.create({
  container:{ flex:1 },
  center:{ flex:1, alignItems:'center', justifyContent:'center' },
});
