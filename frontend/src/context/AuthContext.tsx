import {createContext, type ReactNode} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Loader2} from 'lucide-react';
import {getSession} from '@/api/session';
import type {User} from '@/types/user';
import {useTranslation} from "react-i18next";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthLoading() {
    const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gradient-subtle">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
        <p className="text-muted-foreground font-medium">{t('loading')}</p>
      </div>
    </div>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    retry: false,
  });

  const errorMessage = error instanceof Error ? error.message : error ? 'Failed to load user' : null;

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, error: errorMessage, refetch }}>
      {isLoading ? <AuthLoading /> : children}
    </AuthContext.Provider>
  );
}
