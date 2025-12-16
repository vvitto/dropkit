import { FileImage } from 'lucide-react';
import { miniApp } from '@tma.js/sdk-react';
import { Button } from '@/components/ui/button';

export function NoFileScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileImage className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Файл не найден</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-[280px]">
        Чтобы создать товар, отправьте файл или фото боту @dropkit_bot
      </p>
      <Button variant="outline" onClick={() => miniApp.close()}>
        Закрыть
      </Button>
    </div>
  );
}
