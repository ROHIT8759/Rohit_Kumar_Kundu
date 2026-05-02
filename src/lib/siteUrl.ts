const normalizeUrl = (value: string) => (value.endsWith("/") ? value.slice(0, -1) : value);

export const getSiteUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return normalizeUrl(envUrl.trim());
  }

  if (process.env.VERCEL_URL) {
    return normalizeUrl(`https://${process.env.VERCEL_URL}`);
  }

  return "http://localhost:3000";
};