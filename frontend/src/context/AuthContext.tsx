import {createContext, type ReactNode, useContext, useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Loader2} from 'lucide-react';
import {getSession} from '@/api/session';
import type {User} from '@/types/user';
import {useTranslation} from "react-i18next";
import i18n from '@/i18n';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

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

  useEffect(() => {
    if (user?.language_code && i18n.language !== user.language_code) {
      i18n.changeLanguage(user.language_code);
    }
  }, [user?.language_code]);

  const errorMessage = error instanceof Error ? error.message : error ? 'Failed to load user' : null;

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, error: errorMessage, refetch }}>
      {isLoading ? <AuthLoading /> : children}
    </AuthContext.Provider>
  );
}
