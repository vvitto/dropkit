import { CheckCircle2, Download, Loader2, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductActionButtonProps {
  hasAccess: boolean;
  priceStars: number;
  isPurchasing: boolean;
  isDelivering: boolean;
  delivered: boolean;
  onBuy: () => void;
  onDownload: () => void;
}

export function ProductActionButton({
  hasAccess,
  priceStars,
  isPurchasing,
  isDelivering,
  delivered,
  onBuy,
  onDownload,
}: ProductActionButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      {hasAccess ? (
        <DownloadButton
          isDelivering={isDelivering}
          delivered={delivered}
          onClick={onDownload}
        />
      ) : (
        <BuyButton
          priceStars={priceStars}
          isPurchasing={isPurchasing}
          onClick={onBuy}
        />
      )}
    </div>
  );
}

interface DownloadButtonProps {
  isDelivering: boolean;
  delivered: boolean;
  onClick: () => void;
}

function DownloadButton({ isDelivering, delivered, onClick }: DownloadButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isDelivering || delivered}
      className="w-full h-12 text-base"
      size="lg"
    >
      {isDelivering ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Отправка...
        </>
      ) : delivered ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          Сообщение отправлено в чат
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Получить товар
        </>
      )}
    </Button>
  );
}

interface BuyButtonProps {
  priceStars: number;
  isPurchasing: boolean;
  onClick: () => void;
}

function BuyButton({ priceStars, isPurchasing, onClick }: BuyButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isPurchasing}
      className="w-full h-12 text-base"
      size="lg"
    >
      {isPurchasing ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Оплата...
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Купить за {priceStars}
          <Star className="w-4 h-4 ml-1 text-amber-300" />
        </>
      )}
    </Button>
  );
}
