import { useEffect, useState } from 'react';
import { HeaderTabs } from '@/components/layout/HeaderTabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2, Star, TrendingUp } from 'lucide-react';
import { getIncome, createWithdrawal } from '@/api/income';
import type { IncomeData } from '@/api/income';
import { WithdrawalModal } from './WithdrawalModal';

export function IncomePage() {
  const [data, setData] = useState<IncomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const income = await getIncome();
      setData(income);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить данные');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWithdraw = async () => {
    if (!data) return;

    try {
      setIsSubmitting(true);
      await createWithdrawal({
        amount_stars: data.summary.available_stars,
        payment_method: 'ton_wallet',
      });
      setIsWithdrawalModalOpen(false);
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <HeaderTabs />
        <div className="flex-1 flex items-center justify-center p-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col min-h-screen">
        <HeaderTabs />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <p className="text-destructive mb-4">{error || 'Не удалось загрузить данные'}</p>
          <Button variant="outline" onClick={loadData}>
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  const { summary, has_pending_withdrawal } = data;

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderTabs />

      <div className="flex-1 overflow-auto p-4 pb-24">
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Total Earnings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>Прибыль за всё время</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="font-semibold">{summary.total_earned_stars.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">
                  (~${summary.total_earned_usd.toFixed(2)})
                </span>
              </div>
            </div>

            <div className="border-t" />

            {/* Available for Withdrawal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wallet className="w-4 h-4" />
                <span>Доступно для вывода</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-primary">{summary.available_stars.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">
                  (~${summary.available_usd.toFixed(2)})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Комиссия: {summary.commission_rate}% • Звёзды разблокируются через {summary.lockup_days} дней
        </p>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button
          className="w-full h-12 text-base"
          size="lg"
          disabled={summary.available_stars <= 0 || has_pending_withdrawal}
          onClick={() => setIsWithdrawalModalOpen(true)}
        >
          <Wallet className="w-5 h-5 mr-2" />
          {has_pending_withdrawal
            ? 'Заявка в обработке'
            : summary.available_stars > 0
              ? `Вывести ${summary.available_stars} звёзд`
              : 'Нет доступных средств'}
        </Button>
      </div>

      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        onSubmit={handleWithdraw}
        amount={summary.available_stars}
        commissionRate={summary.commission_rate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
