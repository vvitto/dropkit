import { api } from './client';

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

export interface CreateWithdrawalRequest {
  amount_stars: number;
  payment_method?: string;
  payment_details?: string;
}

export interface Withdrawal {
  id: number;
  amount_stars: number;
  net_amount_stars: number;
  usd_equivalent: number;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
}

export async function getIncome(): Promise<IncomeData> {
  return api.get<IncomeData>('/income');
}

export async function createWithdrawal(data: CreateWithdrawalRequest): Promise<Withdrawal> {
  return api.post<Withdrawal>('/withdrawals', data);
}
