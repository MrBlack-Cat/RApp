// import React, { useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { getAllProducts, getCategoriesFromProducts, getNewProducts, searchProducts, type CategoryDto, type ProductDto } from '../api/products';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { AppStackParamList } from '../navigation/types';
// import SectionHeader from '../components/SectionHeader';
// import ProductCardSmall from '../components/ProductCardSmall';
// import ProductCard from '../components/ProductCard';
// import ProductRow from '../components/ProductRow';
// import SearchBar from '../components/SearchBar';
// import ShopIcon from '../../assets/icons/Shop.svg';
// import CartIcon from '../../assets/icons/cart.svg';

// type Nav = NativeStackNavigationProp<AppStackParamList>;

// export default function HomeScreen() {
//   const navigation = useNavigation<Nav>();

//   const [products, setProducts] = useState<ProductDto[]>([]);
//   const [newIn, setNewIn] = useState<ProductDto[]>([]);
//   const [categories, setCategories] = useState<CategoryDto[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [q, setQ] = useState('');
//   const [searching, setSearching] = useState(false);
//   const [results, setResults] = useState<ProductDto[]>([]);
//   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [all, fresh, cats] = await Promise.all([
//           getAllProducts().catch(() => []),
//           getNewProducts().catch(() => []),
//           getCategoriesFromProducts().catch(() => []),
//         ]);
//         setProducts(all);
//         setNewIn(fresh.length ? fresh : all.slice(0, 6));
//         setCategories(cats);
//       } finally { setLoading(false); }
//     })();
//   }, []);

//   const localFilter = (query: string) => {
//     const s = query.trim().toLowerCase();
//     if (!s) return [];
//     return products.filter(p => (p.name||p.title||'').toLowerCase().includes(s));
//   };

//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     const qv = q.trim();
//     if (!qv) { setResults([]); setSearching(false); return; }
//     if (qv.length < 2) { setResults(localFilter(qv)); setSearching(false); return; }
//     setSearching(true);
//     debounceRef.current = setTimeout(async () => {
//       try {
//         const server = await searchProducts(qv);
//         setResults(server.length ? server : localFilter(qv));
//       } catch { setResults(localFilter(qv)); }
//       finally { setSearching(false); }
//     }, 300);
//   }, [q, products]);

//   const showSearch = q.trim().length > 0;
//   if (loading) return <View style={s.center}><ActivityIndicator /></View>;

//   const HeaderBar = () => (
//     <View style={[s.header, { paddingHorizontal: 16 }]}>
//       <ShopIcon width={92} height={28} fill="none" stroke="#8E6CEF" />
//       <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
//         <CartIcon width={28} height={28} fill="none" stroke="#8E6CEF" />
//       </TouchableOpacity>
//     </View>
//   );

//   if (showSearch) {
//     return (
//       <View style={s.container}>
//         <HeaderBar />
//         <SearchBar value={q} onChange={setQ} />
//         <View style={[s.searchPanel, { marginHorizontal: 16 }]}>
//           {searching ? (
//             <View style={s.searchCenter}><ActivityIndicator/></View>
//           ) : results.length ? (
//             <FlatList
//               data={results}
//               keyExtractor={(it)=>it.id}
//               renderItem={({item})=>(
//                 <ProductRow item={item} onOpen={(id)=>navigation.navigate('ProductDetails',{id})}/>
//               )}
//               ItemSeparatorComponent={()=> <View style={s.sep}/> }
//               contentContainerStyle={{paddingBottom:12}}
//             />
//           ) : (
//             <View style={s.searchCenter}><Text style={{color:'#666'}}>No results</Text></View>
//           )}
//         </View>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 90 }}>
//       <HeaderBar />
//       <SearchBar value={q} onChange={setQ} />

//       <View style={{paddingHorizontal:16}}>
//         <SectionHeader title="Categories" action={
//           <TouchableOpacity onPress={()=>navigation.navigate('Categories')}>
//             <Text style={{color:'#777', fontWeight:'600'}}>See All</Text>
//           </TouchableOpacity>
//         } />
//       </View>

//       {categories.length ? (
//         <FlatList
//           data={categories}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           keyExtractor={(it)=>it.slug}
//           contentContainerStyle={{ gap: 14, paddingVertical: 10, paddingLeft: 16, paddingRight: 8 }}
//           renderItem={({item})=>(
//             <TouchableOpacity
//               style={{alignItems:'center'}}
//               onPress={() => navigation.navigate('CategoryProducts', { categoryId: item.slug, name: item.name })}
//             >
//               <Image source={{ uri: item.image || 'https://via.placeholder.com/120?text=%20' }} style={{width:60, height:60, borderRadius:30, backgroundColor:'#eee'}} />
//               <Text style={{ marginTop: 6, fontSize: 12 }}>{item.name}</Text>
//             </TouchableOpacity>
//           )}
//         />
//       ) : <Text style={{ color:'#888', marginTop:8, paddingHorizontal:16 }}>No categories</Text> }

//       <View style={{paddingHorizontal:16}}>
//         <SectionHeader
//           title="New In"
//           action={
//             <TouchableOpacity onPress={() => navigation.navigate('ProductsList', { mode: 'new', title: 'New In' })}>
//               <Text style={{color:'#777', fontWeight:'600'}}>See All</Text>
//             </TouchableOpacity>
//           }
//         />
//       </View>
//       {newIn.length ? (
//         <FlatList
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           data={newIn}
//           keyExtractor={(it)=>it.id}
//           contentContainerStyle={{ gap: 12, paddingVertical: 10, paddingLeft: 16, paddingRight: 8 }}
//           renderItem={({item})=>(
//             <ProductCardSmall item={item} onOpen={(id)=>navigation.navigate('ProductDetails',{id})}/>
//           )}
//         />
//       ) : <Text style={{ color:'#888', marginTop:8, paddingHorizontal:16 }}>No new items</Text> }

//       <View style={{paddingHorizontal:16}}>
//         <SectionHeader
//           title="All Products"
//           action={
//             <TouchableOpacity onPress={() => navigation.navigate('ProductsList', { mode: 'all', title: 'All Products' })}>
//               <Text style={{color:'#777', fontWeight:'600'}}>See All</Text>
//             </TouchableOpacity>
//           }
//         />
//         <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginTop:10}}>
//           {products.slice(0,8).map(p => (
//             <ProductCard key={p.id} item={p} onOpen={(id)=>navigation.navigate('ProductDetails',{id})}/>
//           ))}
//         </View>
//       </View>

//     </ScrollView>
//   );
// }

// const s = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#fff' },
//   center:{ flex:1, alignItems:'center', justifyContent:'center' },
//   header:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:12 },
//   logo:{ fontSize:28, fontWeight:'800', color:'#5A41DD' },
//   cartEmoji:{ fontSize:22 },

//   searchPanel:{
//     flex:1, backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#eee', overflow:'hidden'
//   },
//   searchCenter:{ padding:16, alignItems:'center', justifyContent:'center' },
//   sep:{ height:1, backgroundColor:'#F0F1F3', marginHorizontal:12 },
// });


import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllProducts, getCategoriesFromProducts, getNewProducts, searchProducts, type CategoryDto, type ProductDto } from '../api/products';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import SectionHeader from '../components/SectionHeader';
import ProductCardSmall from '../components/ProductCardSmall';
import ProductCard from '../components/ProductCard';
import ProductRow from '../components/ProductRow';
import SearchBar from '../components/SearchBar';
import ShopIcon from '../../assets/icons/Shop.svg';
import CartIcon from '../../assets/icons/cart.svg';
import { ThemedView, ThemedText, useColors } from '../ui/Themed';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const c = useColors();

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [newIn, setNewIn] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<ProductDto[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [all, fresh, cats] = await Promise.all([
          getAllProducts().catch(() => []),
          getNewProducts().catch(() => []),
          getCategoriesFromProducts().catch(() => []),
        ]);
        setProducts(all);
        setNewIn(fresh.length ? fresh : all.slice(0, 6));
        setCategories(cats);
      } finally { setLoading(false); }
    })();
  }, []);

  const localFilter = (query: string) => {
    const s = query.trim().toLowerCase();
    if (!s) return [];
    return products.filter(p => (p.name||p.title||'').toLowerCase().includes(s));
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const qv = q.trim();
    if (!qv) { setResults([]); setSearching(false); return; }
    if (qv.length < 2) { setResults(localFilter(qv)); setSearching(false); return; }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const server = await searchProducts(qv);
        setResults(server.length ? server : localFilter(qv));
      } catch { setResults(localFilter(qv)); }
      finally { setSearching(false); }
    }, 300);
  }, [q, products]);

  const showSearch = q.trim().length > 0;
  if (loading) return <View style={s.center}><ActivityIndicator /></View>;

  const HeaderBar = () => (
    <View style={[s.header, { paddingHorizontal: 16 }]}>
      <ShopIcon width={92} height={28} fill="none" stroke={c.accent} />
      <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
        <CartIcon width={28} height={28} fill="none" stroke={c.accent} />
      </TouchableOpacity>
    </View>
  );

  if (showSearch) {
    return (
      <ThemedView style={s.container}>
        <HeaderBar />
        <SearchBar value={q} onChange={setQ} />
        <View style={[s.searchPanel, { backgroundColor: c.card, borderColor: c.border, marginHorizontal: 16 }]}>
          {searching ? (
            <View style={s.searchCenter}><ActivityIndicator/></View>
          ) : results.length ? (
            <FlatList
              data={results}
              keyExtractor={(it)=>it.id}
              renderItem={({item})=>(
                <ProductRow item={item} onOpen={(id)=>navigation.navigate('ProductDetails',{id})}/>
              )}
              ItemSeparatorComponent={()=> <View style={[s.sep, { backgroundColor: c.border }]} /> }
              contentContainerStyle={{paddingBottom:12}}
            />
          ) : (
            <View style={s.searchCenter}><ThemedText style={{opacity:0.7}}>No results</ThemedText></View>
          )}
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={s.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        <HeaderBar />
        <SearchBar value={q} onChange={setQ} />

        <View style={{paddingHorizontal:16}}>
          <SectionHeader title="Categories" action={
            <TouchableOpacity onPress={()=>navigation.navigate('Categories')}>
              <ThemedText style={{opacity:0.7, fontWeight:'600'}}>See All</ThemedText>
            </TouchableOpacity>
          } />
        </View>

        {categories.length ? (
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(it)=>it.slug}
            contentContainerStyle={{ gap: 14, paddingVertical: 10, paddingLeft: 16, paddingRight: 8 }}
            renderItem={({item})=>(
              <TouchableOpacity
                style={{alignItems:'center'}}
                onPress={() => navigation.navigate('CategoryProducts', { categoryId: item.slug, name: item.name })}
              >
                <Image source={{ uri: item.image || 'https://via.placeholder.com/120?text=%20' }} style={{width:60, height:60, borderRadius:30, backgroundColor:'#eee'}} />
                <ThemedText style={{ marginTop: 6, fontSize: 12 }}>{item.name}</ThemedText>
              </TouchableOpacity>
            )}
          />
        ) : <ThemedText style={{ opacity:0.7, marginTop:8, paddingHorizontal:16 }}>No categories</ThemedText> }

        <View style={{paddingHorizontal:16}}>
          <SectionHeader
            title="New In"
            action={
              <TouchableOpacity onPress={() => navigation.navigate('ProductsList', { mode: 'new', title: 'New In' })}>
                <ThemedText style={{opacity:0.7, fontWeight:'600'}}>See All</ThemedText>
              </TouchableOpacity>
            }
          />
        </View>
        {newIn.length ? (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={newIn}
            keyExtractor={(it)=>it.id}
            contentContainerStyle={{ gap: 12, paddingVertical: 10, paddingLeft: 16, paddingRight: 8 }}
            renderItem={({item})=>(
              <ProductCardSmall item={item} onOpen={(id)=>navigation.navigate('ProductDetails',{id})}/>
            )}
          />
        ) : <ThemedText style={{ opacity:0.7, marginTop:8, paddingHorizontal:16 }}>No new items</ThemedText> }

        <View style={{paddingHorizontal:16}}>
          <SectionHeader
            title="All Products"
            action={
              <TouchableOpacity onPress={() => navigation.navigate('ProductsList', { mode: 'all', title: 'All Products' })}>
                <ThemedText style={{opacity:0.7, fontWeight:'600'}}>See All</ThemedText>
              </TouchableOpacity>
            }
          />
          <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginTop:10}}>
            {products.slice(0,8).map(p => (
              <ProductCard key={p.id} item={p} onOpen={(id)=>navigation.navigate('ProductDetails',{id})}/>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const s = StyleSheet.create({
  container:{ flex:1 },
  center:{ flex:1, alignItems:'center', justifyContent:'center' },
  header:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:12 },
  searchPanel:{ flex:1, borderRadius:12, borderWidth:1, overflow:'hidden' },
  searchCenter:{ padding:16, alignItems:'center', justifyContent:'center' },
  sep:{ height:1, marginHorizontal:12 },
});
