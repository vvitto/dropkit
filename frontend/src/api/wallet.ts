import { api } from './client';

export interface PayloadResponse {
  ton_proof: string;
  ton_proof_hash: string;
}

export interface ValidateWalletRequest {
  address: string;
  network: string;
  public_key: string;
  proof: {
    timestamp: number;
    domain: {
      lengthBytes: number;
      value: string;
    };
    signature: string;
    payload: string;
    state_init: string;
  };
}

export interface ValidateWalletResponse {
  message: string;
}

export async function getWalletPayload(): Promise<PayloadResponse> {
  return api.get<PayloadResponse>('/wallet/payload');
}

export async function validateWallet(data: ValidateWalletRequest): Promise<ValidateWalletResponse> {
  return api.post<ValidateWalletResponse>('/wallet/validate', { payload: data });
}
