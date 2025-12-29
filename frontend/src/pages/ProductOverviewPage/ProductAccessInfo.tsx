import { useTranslation } from 'react-i18next';
import { CheckCircle2, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ProductAccessInfo() {
  const { t } = useTranslation();

  return (
    <Card className="p-4 bg-success/5 border-success/20">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
          <CheckCircle2 className="size-5 text-success" />
        </div>
        <div className="flex-1">
          <p className="font-semibold mb-1">{t('productOverview.access.title')}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="flex items-center gap-1.5">
              <Download className="size-4" />
              {t('productOverview.access.hint')}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
