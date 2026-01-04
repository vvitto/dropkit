import {api} from './client';

export interface CreateReportRequest {
  description: string;
}

export async function createReport(productId: string, data: CreateReportRequest): Promise<{ success: boolean }> {
  return api.post<{ success: boolean }>(`/products/${productId}/reports`, { report: data });
}
