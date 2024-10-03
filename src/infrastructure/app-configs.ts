const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const API_URL = import.meta.env.VITE_UNSPLASH_API_URL;

export const appConfigs = {
  ACCESS_KEY,
  API_URL,
};

export type AppConfigs = typeof appConfigs;