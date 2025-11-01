import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {getFavorites, addFavorite, removeFavorite} from '../api/favorites';
import type {ProductDto} from '../api/products';

type FavMap = Record<string, string>; 

type Ctx = {
  loading: boolean;
  isFav: (productId: string) => boolean;
  toggle: (product: ProductDto) => Promise<void>;
  refresh: () => Promise<void>;
};

const FavoritesContext = createContext<Ctx>({
  loading: false,
  isFav: () => false,
  toggle: async () => {},
  refresh: async () => {},
});

export const FavoritesProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<FavMap>({});

  const pid = (p: ProductDto | any) => String(p?.id ?? p?._id ?? '');

  const normalize = (arr: any[]): FavMap => {
    const m: FavMap = {};
    for (const raw of arr || []) {
      const productId = String(raw?.product?.id ?? raw?.productId ?? raw?.product_id ?? raw?.id ?? raw?._id ?? '');
      const favId = String(raw?.id ?? raw?._id ?? '');
      if (productId && favId) m[productId] = favId;
    }
    return m;
  };

  const refresh = async () => {
    try {
      const data = await getFavorites().catch(() => []);
      setMap(normalize(Array.isArray(data) ? data : []));
    } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const isFav = (productId: string) => !!map[productId];

  const toggle = async (product: ProductDto) => {
    const productId = pid(product);
    if (!productId) return;

    const has = !!map[productId];
    setMap(m => {
      const copy = {...m};
      if (has) delete copy[productId];
      else copy[productId] = '__optimistic__';
      return copy;
    });

    try {
      if (has) {
        const favId = map[productId];
        if (favId) await removeFavorite(favId);
      } else {
        const res = await addFavorite(productId);
        const newFavId = String(res?.id ?? res?._id ?? '__optimistic__');
        setMap(m => ({...m, [productId]: newFavId}));
      }
    } catch {
      setMap(m => {
        const copy = {...m};
        if (has) copy[productId] = map[productId];
        else delete copy[productId];
        return copy;
      });
    }
  };

  const value = useMemo<Ctx>(() => ({loading, isFav, toggle, refresh}), [loading, map]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => useContext(FavoritesContext);
