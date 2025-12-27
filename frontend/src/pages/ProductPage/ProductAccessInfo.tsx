import { CheckCircle2, Download, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProductAccessInfoProps {
  isOwner: boolean;
}

export function ProductAccessInfo({ isOwner }: ProductAccessInfoProps) {
  return (
    <Card className="p-4 bg-success/5 border-success/20">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
          <CheckCircle2 className="size-5 text-success" />
        </div>
        <div className="flex-1">
          <p className="font-semibold mb-1">
            {isOwner ? 'Это ваш товар' : 'У вас есть доступ'}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isOwner ? (
              <span className="flex items-center gap-1.5">
                <Share2 className="size-4" />
                Поделитесь товаром с покупателями
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Download className="size-4" />
                Нажмите кнопку ниже, чтобы получить файл
              </span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}
