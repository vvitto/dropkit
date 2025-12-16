import { CheckCircle2, Star, Share2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product';

interface SuccessScreenProps {
  product: Product;
  onShare: () => void;
  onGoHome: () => void;
}

export function SuccessScreen({ product, onShare, onGoHome }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>

      <h2 className="text-xl font-semibold mb-2">Товар создан!</h2>
      <p className="text-muted-foreground mb-2">{product.title}</p>
      <p className="text-sm text-muted-foreground mb-8 flex items-center gap-1">
        <Star className="w-4 h-4 text-amber-500" />
        {product.price_stars} звёзд
      </p>

      <div className="w-full max-w-xs space-y-3">
        <Button
          onClick={onShare}
          className="w-full h-12 text-base"
          size="lg"
        >
          <Share2 className="w-5 h-5" />
          Поделиться товаром
        </Button>

        <Button
          variant="outline"
          onClick={onGoHome}
          className="w-full h-12 text-base"
          size="lg"
        >
          <Home className="w-5 h-5" />
          На главную
        </Button>
      </div>
    </div>
  );
}
