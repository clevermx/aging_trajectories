export const assetUrl = (rel: string) => {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/+$/, ""); // trim trailing /
  const path = rel.replace(/^\/+/, "");                               // trim leading /
  return `${base}/${path}`;
}
