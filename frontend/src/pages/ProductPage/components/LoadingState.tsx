import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gradient-subtle">
      <Loader2 className="size-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{message ?? t('loading')}</p>
    </div>
  );
}
