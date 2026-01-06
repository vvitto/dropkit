import { api } from './client';
import type { User } from '@/types/user';

export async function getSession(): Promise<User> {
  return api.get<User>('/session');
}

export async function updateSession(data: { language_code: string }): Promise<User> {
  return api.patch<User>('/session', data);
}
