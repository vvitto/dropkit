import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, AlertCircle, Loader2, Clock } from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentDetails: string) => Promise<void>;
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
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const commission = Math.floor(amount * (commissionRate / 100));
  const netAmount = amount - commission;

  const handleSubmit = async () => {
    if (!walletAddress.trim()) {
      setError('Введите адрес кошелька');
      return;
    }

    try {
      setError(null);
      await onSubmit(walletAddress);
      setWalletAddress('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать заявку');
    }
  };

  const handleClose = () => {
    setWalletAddress('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={handleClose}>
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

        <div className="space-y-2">
          <Label htmlFor="wallet">TON кошелёк</Label>
          <Input
            id="wallet"
            placeholder="UQ..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>

        {/* Processing time notice */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Перевод средств может занять до 24 часов</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Отмена
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting || amount <= 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Отправка...
              </>
            ) : (
              'Отправить заявку'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
