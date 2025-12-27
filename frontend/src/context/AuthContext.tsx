import { createContext, type ReactNode, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getSession } from '@/api/session';
import type { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gradient-subtle">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
        <p className="text-muted-foreground font-medium">Загрузка...</p>
      </div>
    </div>
  );
}

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
      {isLoading ? <AuthLoading /> : children}
    </AuthContext.Provider>
  );
}
