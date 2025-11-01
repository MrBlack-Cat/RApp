import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { getFavorites } from '../api/favorites';
import type { ProductDto } from '../api/products';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../favorites/FavoritesContext';

type FavRaw = any;

function pickIds(raw: FavRaw) {
  const favId = String(raw?.id ?? raw?._id ?? '');
  const product = raw?.product ?? raw;
  const productId = String(
    product?.id ?? product?._id ?? raw?.productId ?? raw?.product_id ?? ''
  );
  return { favId, productId };
}

function mapToProduct(raw: FavRaw): ProductDto & { _stableKey: string } {
  const { favId, productId } = pickIds(raw);
  const src = raw?.product ?? raw ?? {};

  const stableKey =
    productId || favId || JSON.stringify({ t: src?.title ?? src?.name ?? '' });

  const id = productId || favId || stableKey;
  const name = src?.name ?? src?.title ?? 'Product';
  const price = Number(src?.price ?? 0) || 0;
  const image =
    src?.image ??
    src?.thumbnail ??
    (Array.isArray(src?.images) ? src.images[0] : undefined) ??
    '';
  const images = Array.isArray(src?.images) ? src.images : (image ? [image] : []);
  const category = src?.category ?? src?.type ?? src?.group ?? undefined;
  const description = src?.description ?? '';

  return {
    id,
    _id: src?._id,
    name,
    title: src?.title,
    price,
    image,
    images,
    thumbnail: src?.thumbnail,
    category,
    description,
    _stableKey: stableKey,
  };
}

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const { loading: favLoading } = useFavorites();

  const [items, setItems] = useState<Array<ProductDto & { _stableKey: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFavorites().catch(() => []);
      const mapped = (Array.isArray(data) ? data : []).map(mapToProduct);
      const uniq = Array.from(new Map(mapped.map(x => [x._stableKey, x])).values());
      setItems(uniq);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      await load();
      if (!alive) return;
    })();
    return () => { alive = false; };
  }, [load]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => { load(); });
    return unsub;
  }, [navigation, load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const empty = items.length === 0;

  return (
    <View style={s.container}>
      {empty ? (
        <View style={s.center}>
          <Text style={s.title}>No favorites yet</Text>
          <Text style={s.muted}>Tap the heart on a product to add it here.</Text>
          <TouchableOpacity
            style={s.btn}
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          >
            <Text style={s.btnTxt}>Browse products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          numColumns={2}
          keyExtractor={(it) => it._stableKey}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }: { item: ProductDto & { _stableKey: string } }) => (
            <ProductCard
              item={item}
              onOpen={(id: string) => navigation.navigate('ProductDetails', { id })}
            />
          )}
          removeClippedSubviews
          initialNumToRender={8}
          windowSize={7}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={60}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || favLoading}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  muted: { color: '#6b7280', textAlign: 'center', marginTop: 4 },
  btn: {
    backgroundColor: '#7B61FF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 12,
  },
  btnTxt: { color: '#fff', fontWeight: '800' },
});
