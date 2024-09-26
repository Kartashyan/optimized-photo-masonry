export interface Photo {
  id: string;
  urls: {
    small: string;
    full: string;
  };
  user: {
    name: string;
  };
  description: string;
  alt_description: string;
  created_at: string;
};