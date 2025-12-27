export const getAssetUrl = (path: string) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // In development, use the path as is. In production, prepend the base URL
  return import.meta.env.BASE_URL ? `${import.meta.env.BASE_URL}${cleanPath}`.replace(/\/+/g, '/') : `/${cleanPath}`;
};
