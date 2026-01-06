import {useTranslation} from 'react-i18next';
import {miniApp, openTelegramLink, requestWriteAccess} from '@tma.js/sdk-react';
import {Archive, Box, Plus, ShoppingBag} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {toast} from '@/components/ui/sonner';
import {createProductIntent} from '@/api/product_intents';
import {useMutation} from "@tanstack/react-query";

interface EmptyStateProps {
  isArchive?: boolean;
  isPurchases?: boolean;
}

export function EmptyState({ isArchive = false, isPurchases = false }: EmptyStateProps) {
  const { t } = useTranslation();

    const handleProductCreate = useMutation({
        mutationFn: createProductIntent,
        onSuccess: () => {
            openTelegramLink(`https://t.me/${import.meta.env.VITE_BOT_NAME}`);
            miniApp.close()
        },
        onError: async (error) => {
            if (error.message === 'Bot is blocked') {
                const status = await requestWriteAccess();
                if (status === 'allowed') {
                    openTelegramLink(`https://t.me/${import.meta.env.VITE_BOT_NAME}`);
                    miniApp.close()
                } else {
                    toast.error(t('botBlocked'));
                }
            }
        }
    });

  const getIcon = () => {
    if (isArchive) return <Archive className="size-10 text-muted-foreground" />;
    if (isPurchases) return <ShoppingBag className="size-10 text-muted-foreground" />;
    return <Box className="size-10 text-muted-foreground" />;
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
      </div>

      <h3 className="text-xl font-semibold mb-2">{getTitle()}</h3>
      <p className="text-muted-foreground mb-6 max-w-[280px] leading-relaxed">
        {getDescription()}
      </p>

      {!isArchive && !isPurchases && (
        <Button size="lg" onClick={() => handleProductCreate.mutate()} className="shadow-lg">
          <Plus className="size-5" />
          {t('emptyState.createProduct')}
        </Button>
      )}
    </div>
  );
}
