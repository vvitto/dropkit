import { api } from './client';
import type { Product } from '@/types/product';

export interface CreateProductRequest {
  title: string;
  description?: string;
  price_stars: number;
  tg_file_id: string;
  cover?: File;
}

export async function getProducts(): Promise<Product[]> {
  return api.get<Product[]>(`/products`);
}

export async function createProduct(data: CreateProductRequest): Promise<Product> {
  const formData = new FormData();
  formData.append('product[title]', data.title);
  formData.append('product[price_stars]', data.price_stars.toString());
  formData.append('product[tg_file_id]', data.tg_file_id);

  if (data.description) {
    formData.append('product[description]', data.description);
  }

  if (data.cover) {
    formData.append('product[cover]', data.cover);
  }

  return api.post<Product>('/products', formData);
}

export async function createProductShareMessage(productId: number): Promise<{ message_id: string }> {
  return api.post<{ message_id: string }>(`/products/${productId}/create_share_message`);
}

export interface PublicProduct {
  id: number;
  title: string;
  description?: string;
  price_stars: number;
  cover_url?: string;
  is_purchased: boolean;
  is_owner: boolean;
  seller: {
    first_name: string;
    username?: string;
  };
}

export async function getPublicProduct(productId: number): Promise<PublicProduct> {
  return api.get<PublicProduct>(`/public_products/${productId}`);
}

export async function createInvoice(productId: number): Promise<{ invoice_url: string }> {
  return api.post<{ invoice_url: string }>(`/public_products/${productId}/create_invoice`);
}

export async function confirmPayment(
  productId: number,
  chargeId: string
): Promise<{ success: boolean; purchase_id: number }> {
  return api.post(`/public_products/${productId}/confirm_payment`, {
    telegram_payment_charge_id: chargeId,
  });
}

export async function deliverContent(productId: number): Promise<{ success: boolean }> {
  return api.post<{ success: boolean }>(`/public_products/${productId}/deliver_content`);
}

export interface PurchasedProduct {
  id: number;
  purchased_at: string;
  product: {
    id: number;
    title: string;
    description?: string;
    price_stars: number;
    cover_url?: string;
  };
  seller: {
    first_name: string;
    username?: string;
  };
}

export async function getPurchases(): Promise<PurchasedProduct[]> {
  return api.get<PurchasedProduct[]>('/purchases');
}
