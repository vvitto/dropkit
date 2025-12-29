import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileImage, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function ProductLoading() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen gradient-subtle">
      <div className="p-4 space-y-4">
        <Card className="overflow-hidden">
          <div className="aspect-video skeleton" />
          <div className="p-4 space-y-3">
            <div className="h-6 skeleton rounded-lg w-3/4" />
            <div className="h-4 skeleton rounded-lg w-full" />
            <div className="h-4 skeleton rounded-lg w-2/3" />
            <div className="flex gap-2 mt-4">
              <div className="h-8 skeleton rounded-full w-20" />
              <div className="h-8 skeleton rounded-full w-24" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t('productOverview.loading')}</p>
        </div>
      </div>
    </div>
  );
}

interface ProductErrorProps {
  error?: string | null;
}

export function ProductError({ error }: ProductErrorProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gradient-subtle">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-6">
        <FileImage className="size-10 text-muted-foreground" />
      </div>

      <h3 className="text-xl font-semibold mb-2">{t('productOverview.error.title')}</h3>
      <p className="text-muted-foreground mb-8 max-w-[280px] leading-relaxed">
        {error || t('productOverview.error.description')}
      </p>

      <Button onClick={() => navigate('/')} size="lg">
        <Home className="size-5" />
        {t('productOverview.goHome')}
      </Button>
    </div>
  );
}
