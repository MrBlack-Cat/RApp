import api from './client';
import { getRate } from '../currency/rates';

export type BasketItem = {
  id: string;
  product?: {
    id?: string;
    name?: string;
    title?: string;
    price?: number;
    image?: string;
    images?: string[];
  };
  price?: number;
  count: number;
};


function pickArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.basket?.items)) return data.basket.items;
  if (Array.isArray(data?.basket?.products)) return data.basket.products;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

function toNumber(v: any): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return Number(v.replace(',', '.')) || 0;
  return 0;
}

function mapOne(raw: any): BasketItem {
  const product = {
    id: raw?.productId ?? raw?.product_id ?? raw?._id ?? raw?.id,
    name: raw?.title ?? raw?.name,
    title: raw?.title,
    price: toNumber(raw?.pricePerItem ?? raw?.price),
    image: raw?.image,
    images: raw?.images,
  };

  const count = toNumber(raw?.count ?? raw?.quantity ?? raw?.qty ?? 1);
  const price = toNumber(raw?.pricePerItem ?? product.price ?? raw?.price);

  const id = String(
    raw?.id ??
    raw?._id ??
    raw?.basketItemId ??
    raw?.basket_item_id ??
    raw?.itemId ??
    raw?.productId ??
    product?.id ??
    Math.random().toString(36).slice(2)
  );

  return { id, product, price, count };
}


export async function getBasket(): Promise<BasketItem[]> {
  try {
    const { data } = await api.get('/basket/products');
    const arr = pickArray(data);
    const items = Array.isArray(arr) ? arr.map(mapOne) : [];
    const rate = await getRate();
    return items.map(it => ({
      ...it,
      price: Number(it.price ?? it.product?.price ?? 0) * rate,
      product: it.product
        ? { ...it.product, price: Number(it.product.price ?? 0) * rate }
        : it.product,
    }));
  } catch (e) {
    console.log('GET BASKET ERROR (safe fallback)');
    return [];
  }
}

export async function addToBasket(productId: string, count = 1) {
  const { data } = await api.post('/basket/add', { productId, count });
  console.log('ADD RES:', JSON.stringify(data));
  return data;
}

export async function updateBasket(basketItemId: string, newCount: number) {
  const { data } = await api.patch(`/basket/update/${basketItemId}`, { basketItemId, newCount });
  return data;
}

export async function removeFromBasket(id: string) {
  const { data } = await api.delete(`/basket/delete/${id}`);
  return data;
}

export async function clearBasket(): Promise<void> {
  try {
    const items = await getBasket();
    await Promise.all(items.map(it => removeFromBasket(it.id).catch(() => {})));
  } catch {}
}

export async function checkoutBasket(): Promise<{ orderId: string; total: number; count: number }> {
  try {
    const { data } = await api.post('/basket/checkout', {});
    await clearBasket().catch(()=>{});
    const total = Number(data?.total ?? data?.basketTotal ?? 0) || 0;
    const orderId = String(data?.orderId ?? data?.id ?? Math.random().toString(36).slice(2));
    const count = Number(data?.count ?? data?.itemsCount ?? data?.content?.length ?? 0) || 0;
    return { orderId, total, count };
  } catch {}

  try {
    const { data } = await api.post('/orders/checkout', {});
    await clearBasket().catch(()=>{});
    const total = Number(data?.total ?? 0) || 0;
    const orderId = String(data?.orderId ?? data?.id ?? Math.random().toString(36).slice(2));
    const count = Number(data?.count ?? (Array.isArray(data?.items) ? data.items.length : 0)) || 0;
    return { orderId, total, count };
  } catch {}

  const items = await getBasket();
  const total = items.reduce((s, it) => s + (Number(it.price ?? it.product?.price ?? 0) * Number(it.count ?? 1)), 0);
  await clearBasket().catch(()=>{});
  return { orderId: Date.now().toString(36), total, count: items.length };
}
