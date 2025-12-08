import { api } from './client';
import type { Product } from '@/types/product';

export async function getProducts(archived?: boolean): Promise<Product[]> {
  const params = archived !== undefined ? `?archived=${archived}` : '';
  return api.get<Product[]>(`/products${params}`);
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
