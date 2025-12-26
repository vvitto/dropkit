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
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      {isEditing ? (
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="w-full h-12 text-base"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Сохранить
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={onShare}
          className="w-full h-12 text-base"
          size="lg"
        >
          <Share2 className="w-5 h-5" />
          Поделиться
        </Button>
      )}
    </div>
  );
}
