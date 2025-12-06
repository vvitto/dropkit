import { api } from './client';
import type { Product, PublicProduct, ProductContent, CreateProductData } from '@/types/product';

export async function getProducts(): Promise<Product[]> {
  return api.get<Product[]>('/products');
}

export async function getProduct(id: number): Promise<Product> {
  return api.get<Product>(`/products/${id}`);
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  const formData = new FormData();
  formData.append('product[title]', data.title);
  formData.append('product[content_type]', data.content_type);
  formData.append('product[price_stars]', String(data.price_stars));

  if (data.content_type === 'file' && data.file) {
    formData.append('product[file]', data.file);
  } else if (data.content_text) {
    formData.append('product[content_text]', data.content_text);
  }

  return api.post<Product>('/products', formData);
}

export async function deleteProduct(id: number): Promise<void> {
  return api.delete(`/products/${id}`);
}

export async function getPublicProduct(id: number): Promise<PublicProduct> {
  return api.get<PublicProduct>(`/public_products/${id}`);
}

export async function checkAccess(productId: number): Promise<{ has_access: boolean }> {
  return api.get<{ has_access: boolean }>(`/public_products/${productId}/check_access`);
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

export async function getProductContent(productId: number): Promise<ProductContent> {
  return api.get<ProductContent>(`/public_products/${productId}/content`);
}
