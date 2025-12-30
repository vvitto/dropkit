import {api} from './client';

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

export interface CreateProductRequest {
  title: string;
  description?: string;
  price_stars: number;
  tg_message_id: string;
  cover?: File;
}

export async function getProducts(): Promise<Product[]> {
  return api.get<Product[]>(`/products`);
}

export async function getProduct(productId: string): Promise<Product> {
  return api.get<Product>(`/products/${productId}`);
}

export interface UpdateProductRequest {
  title: string;
  description?: string;
  price_stars: number;
  cover?: File;
}

export async function updateProduct(productId: string, data: UpdateProductRequest): Promise<Product> {
  const formData = new FormData();
  formData.append('product[title]', data.title);
  formData.append('product[price_stars]', data.price_stars.toString());

  if (data.description) {
    formData.append('product[description]', data.description);
  }

  if (data.cover) {
    formData.append('product[cover]', data.cover);
  }

  return api.patch<Product>(`/products/${productId}`, formData);
}

export async function deleteProduct(productId: string): Promise<void> {
  return api.delete(`/products/${productId}`);
}

export async function createProduct(data: CreateProductRequest): Promise<Product> {
  const formData = new FormData();
  formData.append('product[title]', data.title);
  formData.append('product[price_stars]', data.price_stars.toString());
  formData.append('product[tg_message_id]', data.tg_message_id);

  if (data.description) {
    formData.append('product[description]', data.description);
  }

  if (data.cover) {
    formData.append('product[cover]', data.cover);
  }

  return api.post<Product>('/products', formData);
}

export async function createProductShareMessage(productId: string): Promise<{ message_id: string }> {
  return api.post<{ message_id: string }>(`/products/${productId}/create_share_message`);
}

export async function createInvoice(productId: string): Promise<{ invoice_url: string }> {
  return api.post<{ invoice_url: string }>(`/products/${productId}/create_invoice`);
}

export async function deliverContent(productId: string): Promise<{ success: boolean }> {
  return api.post<{ success: boolean }>(`/products/${productId}/deliver_content`);
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
