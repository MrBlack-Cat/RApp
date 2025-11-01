import api from './client';
import { getRate } from '../currency/rates';

export type ProductDto = {
  id: string;
  _id?: string;
  name?: string;
  title?: string;
  price?: number;
  image?: string;
  images?: string[];
  thumbnail?: string;
  category?: string;
  description?: string;
};

export type CategoryDto = {
  id: string;          
  slug: string;
  name: string;        
  image: string;       
};


function pickArrayDeep(input: any): any[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;

  if (typeof input === 'object') {
    const PREFERRED_KEYS = [
      'content','items','products','data','result','payload','rows','list','records',
      'docs','edges','nodes','response','basket'
    ];

    for (const key of PREFERRED_KEYS) {
      const v = (input as any)[key];
      if (Array.isArray(v)) return v;
      if (key === 'basket' && v && typeof v === 'object') {
        if (Array.isArray(v.items)) return v.items;
        if (Array.isArray(v.products)) return v.products;
      }
      if (v && typeof v === 'object') {
        const inner = pickArrayDeep(v);
        if (inner.length) return inner;
      }
    }

    for (const k of Object.keys(input)) {
      const v = (input as any)[k];
      if (Array.isArray(v)) return v;
      if (v && typeof v === 'object') {
        const inner = pickArrayDeep(v);
        if (inner.length) return inner;
      }
    }
  }
  return [];
}

function mapProduct(raw: any): ProductDto {
  const id = String(
    raw?.id ?? raw?._id ?? raw?.productId ?? raw?.product_id ?? Math.random().toString(36).slice(2)
  );

  const name = raw?.name ?? raw?.title ?? 'Product';
  const price = Number(raw?.price ?? raw?.pricePerItem ?? raw?.price_per_item ?? 0) || 0;

  const image =
    raw?.image ??
    raw?.thumbnail ??
    (Array.isArray(raw?.images) ? raw.images[0] : undefined) ??
    '';

  const images = Array.isArray(raw?.images) ? raw.images : (image ? [image] : []);
  const category = raw?.category ?? raw?.type ?? raw?.group ?? undefined;
  const description = raw?.description ?? '';

  return { id, _id: raw?._id, name, title: raw?.title, price, image, images, thumbnail: raw?.thumbnail, category, description };
}

export function normalizeProducts(anyData: any): ProductDto[] {
  const arr = pickArrayDeep(anyData);
  return (arr || []).map(mapProduct);
}


async function applyRate(list: ProductDto[]): Promise<ProductDto[]> {
  const rate = await getRate();
  return list.map(p => ({ ...p, price: Number(p.price ?? 0) * rate }));
}

export async function getAllProducts(): Promise<ProductDto[]> {
  const { data } = await api.get('/products');
  return applyRate(normalizeProducts(data));
}

export async function getNewProducts(): Promise<ProductDto[]> {
  const { data } = await api.get('/products/new');
  return applyRate(normalizeProducts(data));
}

export async function getProductDetails(id: string): Promise<ProductDto> {
  const { data } = await api.get(`/products/${id}/details`);
  const list = normalizeProducts([data]);
  const rate = await getRate();
  const one = list[0];
  return { ...one, price: Number(one?.price ?? 0) * rate };
}

export async function getSimilar(id: string): Promise<ProductDto[]> {
  const { data } = await api.get(`/products/${id}/similar`);
  return applyRate(normalizeProducts(data));
}

export async function searchProducts(q: string): Promise<ProductDto[]> {
  try {
    const { data } = await api.get('/search', { params: { searchterm: q } });
    return applyRate(normalizeProducts(data));
  } catch (e1) {
    try {
      const { data } = await api.get('/search', { params: { searchTerm: q } });
      return applyRate(normalizeProducts(data));
    } catch (e2) {
      const { data } = await api.get('/search', { params: { q } });
      return applyRate(normalizeProducts(data));
    }
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<ProductDto[]> {
  const { data } = await api.get(`/products/category/${categorySlug}`);
  return applyRate(normalizeProducts(data));
}

export async function getCategoriesFromProducts(): Promise<CategoryDto[]> {
  const products = await getAllProducts();
  const bySlug = new Map<string, CategoryDto>();

  for (const p of products) {
    const raw = String(p.category ?? '').trim();
    if (!raw) continue;

    const slug = raw.toLowerCase().replace(/\s+/g, '-');
    if (!bySlug.has(slug)) {
      bySlug.set(slug, {
        id: slug,
        slug,
        name: raw,
        image: p.image || p.images?.[0] || '',
      });
    }
  }
  return Array.from(bySlug.values());
}
