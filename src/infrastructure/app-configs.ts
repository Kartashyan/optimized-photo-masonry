
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const API_URL = "https://api.unsplash.com/search/photos";

export const appConfigs = {
  ACCESS_KEY,
  API_URL,
  search: {
    defaultQuery: 'sky',
    perPage: 30,
    orderBy: 'latest',
    debounceDelay: 300,
  },
  imageGrid: {
    columnWidth: 236,
    gap: 8,
    lazyLoadOffset: 1000,
    loadOffset: 1200,
    img: {
      loading: "lazy",
    } as Pick<HTMLImageElement, "loading">,
  },
};

export type AppConfigs = typeof appConfigs;
export type ImageGridConfigs = AppConfigs['imageGrid'];

if (!ACCESS_KEY) {
  throw new Error('Unsplash access key is missing');
}
