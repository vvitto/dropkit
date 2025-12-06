export interface Purchase {
  id: number;
  product_id: number;
  amount_stars: number;
  status: 'pending' | 'completed' | 'refunded';
  created_at: string;
}

export interface PaymentResult {
  success: boolean;
  purchase_id?: number;
  error?: string;
}
