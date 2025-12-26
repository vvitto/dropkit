import {createContext, type ReactNode, useEffect, useState} from 'react';
import {getSession} from '@/api/session';
import type {User} from '@/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await getSession();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, refetch: fetchUser }}>
      {isLoading ? 'Loading' : children}
    </AuthContext.Provider>
  );
}
