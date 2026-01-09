export interface User {
  telegram_id: number;
  first_name: string;
  last_name: string | null;
  username: string | null;
  language_code: string;
  commission_rate: number;
}
