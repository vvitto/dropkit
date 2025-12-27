import { miniApp } from '@tma.js/sdk-react';
import { Archive, Package, Plus, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createProductIntent } from '@/api/product_intents';

interface EmptyStateProps {
  isArchive?: boolean;
  isPurchases?: boolean;
}

export function EmptyState({ isArchive = false, isPurchases = false }: EmptyStateProps) {
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
    if (isArchive) return 'Архив пуст';
    if (isPurchases) return 'Нет покупок';
    return 'Создайте первый товар';
  };

  const getDescription = () => {
    if (isArchive) return 'Здесь будут отображаться архивные товары';
    if (isPurchases) return 'Здесь будут отображаться товары, которые вы купили у других продавцов';
    return 'Загрузите цифровой контент и начните продавать прямо в Telegram';
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
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
      <p className="text-muted-foreground mb-8 max-w-[280px] leading-relaxed">
        {getDescription()}
      </p>

      {!isArchive && !isPurchases && (
        <Button size="lg" onClick={handleProductCreate} className="shadow-lg">
          <Plus className="size-5" />
          Создать товар
        </Button>
      )}
    </div>
  );
}
