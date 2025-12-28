import {CheckCircle2, Home, Share2, Sparkles, Star} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import type {Product} from '@/types/product';

interface SuccessScreenProps {
  product: Product;
  onShare: () => void;
  onGoHome: () => void;
}

export function SuccessScreen({ product, onShare, onGoHome }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gradient-subtle">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center animate-fade-in-up">
          <CheckCircle2 className="size-12 text-success" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-warning flex items-center justify-center shadow-lg animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <Sparkles className="size-5 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        Товар создан!
      </h2>

      <Card className="w-full max-w-sm p-4 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        {product.cover_url && (
          <img
            src={product.cover_url}
            alt={product.title}
            className="w-full aspect-video rounded-xl object-cover mb-4"
          />
        )}
        <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
        <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 w-fit mx-auto">
          <Star className="size-5 text-warning fill-warning" />
          <span className="font-semibold text-warning">{product.price_stars} звёзд</span>
        </div>
      </Card>

      <div className="w-full max-w-sm space-y-3 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
        <Button
          onClick={onShare}
          className="w-full shadow-lg"
          size="lg"
        >
          <Share2 className="size-5" />
          Поделиться товаром
        </Button>

        <Button
          variant="outline"
          onClick={onGoHome}
          className="w-full"
          size="lg"
        >
          <Home className="size-5" />
          На главную
        </Button>
      </div>
    </div>
  );
}
