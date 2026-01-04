import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {ArrowLeft, Flag} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Product} from '@/api/products';
import {ReportProductDialog} from './ReportProductDialog';

interface ProductOverviewHeaderProps {
  product?: Product;
}

export function ProductOverviewHeader({ product }: ProductOverviewHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const showReportButton = product && !product.is_owner;

  return (
    <>
      <header className="sticky top-0 z-10 glass-subtle border-b border-border/50 safe-area-top">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-lg font-semibold truncate flex-1">{t('productOverview.header')}</h1>
          {showReportButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setReportDialogOpen(true)}
              className="shrink-0 text-muted-foreground"
            >
              <Flag className="size-5" />
            </Button>
          )}
        </div>
      </header>

      {product && (
        <ReportProductDialog
          productId={product.id}
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
        />
      )}
    </>
  );
}
