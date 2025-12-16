export type ContentType = 'file' | 'link' | 'text';

export interface Product {
  id: number;
  title: string;
  description: string;
  price_stars: number;
  cover_url?: string;
}
