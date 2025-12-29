import {useTranslation} from 'react-i18next';
import {Button} from '@/components/ui/button';
import {CardGlass} from '@/components/ui/card';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import {Clock, Loader2, Star, Wallet} from 'lucide-react';
import {useWalletConnect} from '@/hooks/useWalletConnect';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  amount: number;
  amountTon: number | null;
  isSubmitting: boolean;
}

export function WithdrawalModal({
  isOpen,
  onClose,
  onSubmit,
  amount,
  amountTon,
  isSubmitting,
}: WithdrawalModalProps) {
  const { t } = useTranslation();
  const { isConnected, shortAddress, connect, disconnect } = useWalletConnect();

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t('withdrawalModal.title')}</DrawerTitle>
          <DrawerDescription>
            {t('withdrawalModal.description')}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 space-y-5">
          {/* Amount */}
          <CardGlass className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{t('withdrawalModal.youWillReceive')}</span>
              <div className="flex flex-col items-end gap-0.5">
                <span className="flex items-center gap-1.5 text-lg font-bold text-primary">
                  <Star className="size-5 text-warning fill-warning" />
                  {amount.toLocaleString()}
                </span>
                {amountTon !== null && (
                  <span className="text-sm text-muted-foreground">
                    ≈ {amountTon} TON
                  </span>
                )}
              </div>
            </div>
          </CardGlass>

          {/* Wallet Connection */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('withdrawalModal.walletLabel')}</p>
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
                    {t('withdrawalModal.disconnect')}
                  </Button>
                </div>
              </CardGlass>
            ) : (
              <Button variant="outline" className="w-full" size="lg" onClick={connect}>
                <Wallet className="size-5" />
                {t('withdrawalModal.connectWallet')}
              </Button>
            )}
          </div>

          {/* Processing time notice */}
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
            <Clock className="size-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t('withdrawalModal.processingNotice')}
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
              {t('withdrawalModal.cancel')}
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
                  {t('withdrawalModal.sending')}
                </>
              ) : (
                t('withdrawalModal.confirm')
              )}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
