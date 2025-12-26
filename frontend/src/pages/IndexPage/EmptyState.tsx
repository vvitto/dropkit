import {miniApp} from '@tma.js/sdk-react';
import {Archive, FileText, Plus, ShoppingBag} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {createProductIntent} from '@/api/product_intents';

interface EmptyStateProps {
  isArchive?: boolean;
  isPurchases?: boolean;
}

export function EmptyState({isArchive = false, isPurchases = false}: EmptyStateProps) {
  const handleProductCreate = async () => {
    await createProductIntent();
    miniApp.close();
  };

  const getIcon = () => {
    if (isArchive) return <Archive className="w-8 h-8 text-muted-foreground" />;
    if (isPurchases) return <ShoppingBag className="w-8 h-8 text-muted-foreground" />;
    return <FileText className="w-8 h-8 text-muted-foreground" />;
  };

  const getTitle = () => {
    if (isArchive) return 'Архив пуст';
    if (isPurchases) return 'Нет покупок';
    return 'Нет товаров';
  };

  const getDescription = () => {
    if (isArchive) return 'Здесь будут отображаться архивные товары';
    if (isPurchases) return 'Здесь будут отображаться товары, которые вы купили у других продавцов';
    return 'Создайте свой первый цифровой товар и начните продавать прямо в Telegram';
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-medium mb-2">{getTitle()}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
        {getDescription()}
      </p>
      {!isArchive && !isPurchases && (
        <Button onClick={handleProductCreate}>
          <Plus className="w-4 h-4" />
          Создать товар
        </Button>
      )}
    </div>
  );
}
