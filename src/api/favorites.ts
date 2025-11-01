import api from './client';
export const getFavorites = async () => (await api.get('/favorites/products')).data;
export const addFavorite = async (productId: string) =>
  (await api.post('/favorites/add', { productId })).data;
export const removeFavorite = async (id: string) =>
  (await api.delete(`/favorites/delete/${id}`)).data;