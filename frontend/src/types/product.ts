export type ContentType = 'file' | 'link' | 'text';

export interface Product {
  id: string;
  title: string;
  description?: string;
  price_stars: number;
  tg_message_id?: string;
  cover_url?: string;
  created_at?: string;
  is_owner?: boolean;
  is_purchased?: boolean;
  seller?: {
    first_name: string;
    username?: string;
  };
}
