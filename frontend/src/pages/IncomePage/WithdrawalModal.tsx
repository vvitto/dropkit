import { Button } from '@/components/ui/button';
import { CardGlass } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Clock, Loader2, Star, Wallet } from 'lucide-react';
import { useWalletConnect } from '@/hooks/useWalletConnect';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
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

  const commission = Math.floor(amount * (commissionRate / 100));
  const netAmount = amount - commission;

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Заявка на вывод</DrawerTitle>
          <DrawerDescription>
            Подтвердите вывод средств на ваш TON кошелёк
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 space-y-5">
          {/* Amount Breakdown */}
          <CardGlass className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Сумма</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Star className="size-4 text-warning fill-warning" />
                {amount.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-border/50" />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Комиссия ({commissionRate}%)
              </span>
              <span className="text-muted-foreground">
                -{commission.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-border/50" />
            <div className="flex justify-between items-center">
              <span className="font-semibold">Вы получите</span>
              <span className="flex items-center gap-1.5 text-lg font-bold text-primary">
                <Star className="size-5 text-warning fill-warning" />
                {netAmount.toLocaleString()}
              </span>
            </div>
          </CardGlass>

          {/* Wallet Connection */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Кошелёк для вывода</p>
            {isConnected ? (
              <CardGlass className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Wallet className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{shortAddress}</p>
                      <p className="text-xs text-muted-foreground">TON Wallet</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={disconnect}>
                    Отключить
                  </Button>
                </div>
              </CardGlass>
            ) : (
              <Button variant="outline" className="w-full" size="lg" onClick={connect}>
                <Wallet className="size-5" />
                Подключить кошелёк
              </Button>
            )}
          </div>

          {/* Processing time notice */}
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
            <Clock className="size-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Перевод средств может занять до 24 часов после подтверждения
            </p>
          </div>
        </div>

        <DrawerFooter>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              size="lg"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              className="flex-1"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting || amount <= 0 || !isConnected}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Отправка...
                </>
              ) : (
                'Подтвердить'
              )}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
