export type ContentType = 'file' | 'link' | 'text';

export interface Product {
  id: number;
  title: string;
  content_type: ContentType;
  price_stars: number;
  sales_count: number;
  is_active: boolean;
  is_archived: boolean;
  created_at: string;
  content_text?: string;
  file_attached?: boolean;
  file_name?: string;
  cover_url?: string;
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
  cover?: File;
}

export interface UpdateProductData {
  title?: string;
  content_text?: string;
  price_stars?: number;
  file?: File;
  cover?: File;
  remove_cover?: boolean;
}
