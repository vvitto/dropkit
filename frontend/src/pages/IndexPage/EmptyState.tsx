import {miniApp} from '@tma.js/sdk-react';
import {Archive, FileText, Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {createProductIntent} from '@/api/product_intents';

interface EmptyStateProps {
  isArchive?: boolean;
}

export function EmptyState({isArchive = false}: EmptyStateProps) {
  const handleProductCreate = async () => {
    await createProductIntent();
    miniApp.close();
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {isArchive ? (
          <Archive className="w-8 h-8 text-muted-foreground" />
        ) : (
          <FileText className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-medium mb-2">
        {isArchive ? 'Архив пуст' : 'Нет товаров'}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
        {isArchive
          ? 'Здесь будут отображаться архивные товары'
          : 'Создайте свой первый цифровой товар и начните продавать прямо в Telegram'}
      </p>
      {!isArchive && (
        <Button onClick={handleProductCreate}>
          <Plus className="w-4 h-4" />
          Создать товар
        </Button>
      )}
    </div>
  );
}
