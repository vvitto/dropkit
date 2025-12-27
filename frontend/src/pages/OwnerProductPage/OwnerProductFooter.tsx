import { Loader2, Save, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OwnerProductFooterProps {
  isEditing: boolean;
  isSaving: boolean;
  onShare: () => void;
  onSave: () => void;
}

export function OwnerProductFooter({
  isEditing,
  isSaving,
  onShare,
  onSave,
}: OwnerProductFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/50 safe-area-bottom">
      {isEditing ? (
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="w-full shadow-lg"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="size-5" />
              Сохранить изменения
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={onShare}
          className="w-full shadow-lg"
          size="lg"
        >
          <Share2 className="size-5" />
          Поделиться товаром
        </Button>
      )}
    </div>
  );
}
