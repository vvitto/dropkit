import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProductAccessInfoProps {
  isOwner: boolean;
}

export function ProductAccessInfo({ isOwner }: ProductAccessInfoProps) {
  return (
    <Card className="bg-green-500/5 border-green-500/20">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm mb-1">
              {isOwner ? 'Это ваш товар' : 'У вас есть доступ'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isOwner
                ? 'Вы можете скачать файл или поделиться им с покупателями'
                : 'Вы можете скачать купленный файл'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
