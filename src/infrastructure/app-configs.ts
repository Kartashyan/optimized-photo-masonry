const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const API_URL = import.meta.env.VITE_UNSPLASH_API_URL;

export const appConfigs = {
  ACCESS_KEY,
  API_URL,
  search: {
    perPage: 10,
    orderBy: 'latest',
    debounceDelay: 300,
  },
};

export type AppConfigs = typeof appConfigs;

if (!ACCESS_KEY) {
  throw new Error('Unsplash access key is missing');
}

if (!API_URL) {
  throw new Error('Unsplash API URL is missing');
}