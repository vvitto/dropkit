import {useTranslation} from 'react-i18next';
import {miniApp} from '@tma.js/sdk-react';
import {Archive, Package, Plus, ShoppingBag, Sparkles} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {createProductIntent} from '@/api/product_intents';

interface EmptyStateProps {
  isArchive?: boolean;
  isPurchases?: boolean;
}

export function EmptyState({ isArchive = false, isPurchases = false }: EmptyStateProps) {
  const { t } = useTranslation();

  const handleProductCreate = async () => {
    await createProductIntent();
    miniApp.close();
  };

  const getIcon = () => {
    if (isArchive) return <Archive className="size-10 text-muted-foreground" />;
    if (isPurchases) return <ShoppingBag className="size-10 text-muted-foreground" />;
    return <Package className="size-10 text-primary" />;
  };

  const getTitle = () => {
    if (isArchive) return t('emptyState.archive.title');
    if (isPurchases) return t('emptyState.purchases.title');
    return t('emptyState.products.title');
  };

  const getDescription = () => {
    if (isArchive) return t('emptyState.archive.description');
    if (isPurchases) return t('emptyState.purchases.description');
    return t('emptyState.products.description');
  };

  return (
    <div className="flex flex-col items-center justify-center grow text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          {getIcon()}
        </div>
        {!isArchive && !isPurchases && (
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-warning flex items-center justify-center shadow-lg">
            <Sparkles className="size-4 text-white" />
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold mb-2">{getTitle()}</h3>
      <p className="text-muted-foreground mb-6 max-w-[280px] leading-relaxed">
        {getDescription()}
      </p>

      {!isArchive && !isPurchases && (
        <Button size="lg" onClick={handleProductCreate} className="shadow-lg">
          <Plus className="size-5" />
          {t('emptyState.createProduct')}
        </Button>
      )}
    </div>
  );
}
