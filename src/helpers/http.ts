export function getAxiosMessage(e: any): string {
  const msg =
    e?.response?.data?.message ??
    e?.response?.data?.error ??
    e?.response?.data?.errors?.[0]?.message ??
    e?.message ??
    'Unexpected error';
  return typeof msg === 'string' ? msg : JSON.stringify(msg);
}
