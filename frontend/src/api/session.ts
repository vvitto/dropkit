import { api } from './client';
import type { User } from '@/types/user';

export async function getSession(): Promise<User> {
  return api.get<User>('/session');
}
