import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../auth/useAuth';
import { useFavorites } from '../favorites/FavoritesContext';
import { useCurrency } from '../currency/CurrencyContext';

import { getProductDetails, getSimilar, type ProductDto } from '../api/products';
import { addToBasket, getBasket } from '../api/basket';

import ProductLike from '../components/ProductLike';
import { ThemedView, ThemedText, useColors } from '../ui/Themed';

type Nav = ReturnType<typeof useNavigation<any>>;

export default function ProductDetailsScreen({ route }: any) {
  const navigation = useNavigation<any>() as Nav;
  const { id } = route.params;

  const { isSignedIn } = useAuth();
  const { isFav, toggle } = useFavorites();
  const { format } = useCurrency();
  const c = useColors();

  const [data, setData] = useState<ProductDto | undefined>();
  const [similar, setSimilar] = useState<ProductDto[]>([]);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  const pid = (p: ProductDto | any) => String(p?.id ?? p?._id ?? '');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const d = await getProductDetails(id);
        if (alive) setData(d);
      } finally {}
      const sim = await getSimilar(id).catch(() => []);
      if (alive) setSimilar(sim);
    })();
    return () => { alive = false; };
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
        Alert.alert(
          'The cart is empty',
          'The server accepted the request, but the cart returned empty. Make sure to use _id.'
        );
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

  if (!data) {
    return (
      <View style={s.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const likedMain = isFav(pid(data));
  const img = data.image || data.images?.[0] || 'https://via.placeholder.com/900x900?text=%20';

  return (
    <ThemedView style={s.page}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[s.heroCard, shadowCard(c)]}>
          <ThemedText style={s.badgeText}>CLASSIC PURPLE</ThemedText>

          <View style={s.heroImgWrap}>
            <Image source={{ uri: img }} style={s.heroImg} />
            <View style={s.like}>
              <ProductLike liked={likedMain} onPress={() => { void toggle(data); }} />
            </View>
          </View>

        </View>

        <View style={s.block}>
          <ThemedText style={s.title}>{data.name || data.title || 'Product'}</ThemedText>
          <ThemedText style={[s.price, { color: c.accent }]}>{format(price)}</ThemedText>
        </View>

        <View style={s.block}>
          <ThemedText style={s.sectionTitle}>Quantity</ThemedText>
          <View style={[s.qtyPill, { backgroundColor: c.card, borderColor: c.border }]}>
            <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))} style={[s.qtyBtn, s.qtyBtnLeft]}>
              <ThemedText style={s.qtyBtnTxt}>−</ThemedText>
            </TouchableOpacity>
            <ThemedText style={s.qtyValue}>{qty}</ThemedText>
            <TouchableOpacity onPress={() => setQty(qty + 1)} style={[s.qtyBtn, s.qtyBtnRight]}>
              <ThemedText style={s.qtyBtnTxt}>+</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {!!data.description && (
          <View style={s.block}>
            <ThemedText style={s.desc}>
              {data.description}
            </ThemedText>
          </View>
        )}

        <View style={s.block}>
          <ThemedText style={s.sectionTitle}>Shipping & Returns</ThemedText>
          <ThemedText style={s.subtle}>
            Free standard shipping and free 60-day returns.
          </ThemedText>
        </View>

        <View style={s.block}>
          <View style={s.rowBetween}>
            <ThemedText style={s.sectionTitle}>Similar Items</ThemedText>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <ThemedText style={[s.link, { color: c.text }]}>See All</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 14, paddingVertical: 10 }}
          >
            {similar.slice(0, 10).map((x) => {
              const xImg = x.image || x.images?.[0] || 'https://via.placeholder.com/300?text=%20';
              const liked = isFav(pid(x));
              return (
                <View key={x.id} style={[s.card, shadowSmall()]}>
                  <View style={{ position: 'relative' }}>
                    <Image source={{ uri: xImg }} style={s.cardImg} />
                    <ProductLike liked={liked} onPress={() => toggle(x)} />
                  </View>

                  <TouchableOpacity onPress={() => navigation.push('ProductDetails', { id: x.id })}>
                    <ThemedText numberOfLines={1} style={s.cardTitle}>
                      {x.name || x.title}
                    </ThemedText>
                    <ThemedText style={s.cardPrice}>{format(x.price ?? 0)}</ThemedText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={s.block}>
          <ThemedText style={s.totalLabel}>{format(total)}</ThemedText>
        </View>
      </ScrollView>

      <View style={[s.sticky, { backgroundColor: c.bg, borderTopColor: c.border }]}>
        <ThemedText style={s.totalFab}>{format(total)}</ThemedText>
        <TouchableOpacity
          style={[s.addBtn, { backgroundColor: c.accent }, busy && { opacity: 0.6 }]}
          onPress={onAdd}
          disabled={busy}
        >
          <ThemedText style={s.addTxt}>{busy ? '...' : 'Add to Bag'}</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, padding: 16 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  block: { marginTop: 16 },

  heroCard: {
    borderRadius: 16,
    padding: 12,
    overflow: 'hidden',
  },
  badgeText: {
    fontWeight: '800',
    letterSpacing: 0.6,
    opacity: 0.7,
    marginBottom: 8,
  },
  heroImgWrap: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroImg: {
    width: '100%',
    aspectRatio: 1.4,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  like: { position: 'absolute', top: 10, right: 10 },

  title: { fontSize: 22, fontWeight: '900', marginTop: 8 },
  price: { marginTop: 6, fontWeight: '900' },

  qtyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnLeft: { marginRight: 6 },
  qtyBtnRight: { marginLeft: 6 },
  qtyBtnTxt: { fontSize: 22, fontWeight: '900' },
  qtyValue: { minWidth: 26, textAlign: 'center', fontSize: 16, fontWeight: '700' },

  desc: { lineHeight: 20, opacity: 0.9 },
  subtle: { marginTop: 6, opacity: 0.7 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  link: { textDecorationLine: 'underline', fontWeight: '700' },

  card: {
    width: 160,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 10,
  },
  cardImg: { width: '100%', height: 110, borderRadius: 10, backgroundColor: '#eee' },
  cardTitle: { marginTop: 6, fontSize: 13, fontWeight: '600' },
  cardPrice: { fontWeight: '800', fontSize: 13 },

  totalLabel: { fontSize: 16, fontWeight: '900' },

  sticky: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
  },
  totalFab: { fontSize: 16, fontWeight: '900' },
  addBtn: { paddingVertical: 14, paddingHorizontal: 22, borderRadius: 26, marginLeft: 'auto' },
  addTxt: { color: '#fff', fontWeight: '900' },
});

function shadowCard(c: { card: string }) {
  return Platform.select({
    ios: {
      backgroundColor: c.card,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
    },
    android: {
      backgroundColor: c.card,
      elevation: 6,
    },
    default: { backgroundColor: c.card },
  });
}
function shadowSmall() {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 6 },
      backgroundColor: '#fff',
    },
    android: {
      elevation: 3,
      backgroundColor: '#fff',
    },
    default: { backgroundColor: '#fff' },
  });
}
