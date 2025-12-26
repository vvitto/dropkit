import {Button} from '@/components/ui/button';
import {Clock, Loader2, Star, Wallet} from 'lucide-react';
import {useWalletConnect} from '@/hooks/useWalletConnect';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  amount: number;
  commissionRate: number;
  isSubmitting: boolean;
}

export function WithdrawalModal({
  isOpen,
  onClose,
  onSubmit,
  amount,
  commissionRate,
  isSubmitting,
}: WithdrawalModalProps) {
  const { isConnected, shortAddress, connect, disconnect } = useWalletConnect();

  if (!isOpen) return null;

  const commission = Math.floor(amount * (commissionRate / 100));
  const netAmount = amount - commission;

  const handleSubmit = async () => {
    try {
      await onSubmit();
    } catch (err) {
      console.error('Withdrawal error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-background rounded-t-2xl p-6 space-y-4 animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">Заявка на вывод</h2>

        <div className="space-y-3">
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Сумма</span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500" />
              {amount}
            </span>
          </div>
          <div className="flex justify-between py-2 border-t">
            <span className="text-muted-foreground">Комиссия ({commissionRate}%)</span>
            <span className="text-muted-foreground">-{commission}</span>
          </div>
          <div className="flex justify-between py-2 border-t font-medium">
            <span>Вы получите</span>
            <span className="flex items-center gap-1 text-primary">
              <Star className="w-4 h-4 text-amber-500" />
              {netAmount}
            </span>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Кошелёк для вывода</p>
          {isConnected ? (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="font-medium">{shortAddress}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={disconnect}>
                Отключить
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="w-full" onClick={connect}>
              <Wallet className="w-4 h-4 mr-2" />
              Подключить кошелёк
            </Button>
          )}
        </div>

        {/* Processing time notice */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Перевод средств может занять до 24 часов</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Отмена
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting || amount <= 0 || !isConnected}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Отправка...
              </>
            ) : (
              'Подтвердить вывод'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
