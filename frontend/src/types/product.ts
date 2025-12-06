export type ContentType = 'file' | 'link' | 'text';

export interface Product {
  id: number;
  title: string;
  content_type: ContentType;
  price_stars: number;
  sales_count: number;
  is_active: boolean;
  created_at: string;
  content_text?: string;
  file_attached?: boolean;
  file_name?: string;
}

export interface PublicProduct {
  id: number;
  title: string;
  content_type: ContentType;
  price_stars: number;
  seller: {
    first_name: string;
    username: string | null;
  };
}

export interface ProductContent {
  type: ContentType;
  filename?: string;
  url?: string;
  text?: string;
}

export interface CreateProductData {
  title: string;
  content_type: ContentType;
  content_text?: string;
  price_stars: number;
  file?: File;
}
