import {api} from './client';

export interface IncomeSummary {
  total_earned_stars: number;
  available_stars: number;
  total_earned_usd: number;
  available_usd: number;
  commission_rate: number;
  lockup_days: number;
}

export interface IncomeData {
  summary: IncomeSummary;
  has_pending_withdrawal: boolean;
}

export interface Sale {
  id: number;
  product_title: string;
  amount_stars: number;
  buyer: {
    username: string | null;
    first_name: string;
  };
  payment_method: string;
  available_at: string | null;
  is_available: boolean;
  created_at: string;
}

export interface SalesResponse {
  sales: Sale[];
  has_more: boolean;
}

export async function getIncome(): Promise<IncomeData> {
  return api.get<IncomeData>('/income');
}

export async function getSales(page: number = 1, query?: string): Promise<SalesResponse> {
  const params = new URLSearchParams({ page: String(page) });
  if (query) params.set('q', query);
  return api.get<SalesResponse>(`/sales?${params}`);
}

export async function createWithdrawal(): Promise<void> {
  return api.post<void>('/withdrawals');
}
