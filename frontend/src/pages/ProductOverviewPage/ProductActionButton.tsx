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
    <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/50 safe-area-bottom">
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
  if (delivered) {
    return (
      <Button
        disabled
        className="w-full bg-success hover:bg-success shadow-lg"
        size="lg"
      >
        <CheckCircle2 className="size-5" />
        Отправлено в чат
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={isDelivering}
      className="w-full shadow-lg"
      size="lg"
    >
      {isDelivering ? (
        <>
          <Loader2 className="size-5 animate-spin" />
          Отправка...
        </>
      ) : (
        <>
          <Download className="size-5" />
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
      className="w-full shadow-lg animate-pulse-glow"
      size="lg"
    >
      {isPurchasing ? (
        <>
          <Loader2 className="size-5 animate-spin" />
          Оплата...
        </>
      ) : (
        <>
          <ShoppingCart className="size-5" />
          Купить за {priceStars}
          <Star className="size-4 text-warning fill-warning" />
        </>
      )}
    </Button>
  );
}
