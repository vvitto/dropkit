import { FileImage, X, MessageCircle } from 'lucide-react';
import { miniApp } from '@tma.js/sdk-react';
import { Button } from '@/components/ui/button';

export function NoFileScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gradient-subtle">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
        <FileImage className="size-10 text-primary" />
      </div>

      <h3 className="text-xl font-semibold mb-2">Файл не найден</h3>
      <p className="text-muted-foreground mb-8 max-w-[280px] leading-relaxed">
        Чтобы создать товар, отправьте файл или фото боту
      </p>

      <div className="w-full max-w-xs space-y-3">
        <Button
          className="w-full"
          size="lg"
          onClick={() => {
            window.open('https://t.me/dropkit_bot', '_blank');
          }}
        >
          <MessageCircle className="size-5" />
          Открыть @dropkit_bot
        </Button>

        <Button
          variant="outline"
          className="w-full"
          size="lg"
          onClick={() => miniApp.close()}
        >
          <X className="size-5" />
          Закрыть
        </Button>
      </div>
    </div>
  );
}
