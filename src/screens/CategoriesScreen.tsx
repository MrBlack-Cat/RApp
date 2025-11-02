import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getCategoriesFromProducts, type CategoryDto } from '../api/products';
import { ThemedView, ThemedText, ThemedCard } from '../ui/Themed';

export default function CategoriesScreen() {
  const navigation = useNavigation<any>();
  const [cats, setCats] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCategoriesFromProducts();
        setCats(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator /></View>;

  return (
    <ThemedView style={s.container}>
      <FlatList
        data={cats}
        keyExtractor={(it) => it.slug}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('CategoryProducts', { categoryId: item.slug, name: item.name })}
          >
            <ThemedCard style={s.card}>
              <Image source={{ uri: item.image || 'https://via.placeholder.com/120?text=%20' }} style={s.icon}/>
              <ThemedText style={s.text}>{item.name}</ThemedText>
            </ThemedCard>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 16, padding:16 }}
      />
    </ThemedView>
  );
}

const s = StyleSheet.create({
  container:{ flex:1 },
  center:{ flex:1, justifyContent:'center', alignItems:'center' },
  card:{ flexDirection:'row', alignItems:'center', padding:14, borderRadius:12, marginBottom:10 },
  icon:{ width:50, height:50, borderRadius:10, backgroundColor:'#eee', marginRight:12 },
  text:{ fontSize:16, fontWeight:'700' },
});
