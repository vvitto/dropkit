import {useEffect, useState} from 'react';
import {HeaderTabs} from '@/components/layout/HeaderTabs';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {ChevronRight, Loader2, Star, TrendingUp, Wallet} from 'lucide-react';
import type {IncomeData} from '@/api/income';
import {createWithdrawal, getIncome} from '@/api/income';
import {WithdrawalModal} from './WithdrawalModal';
import {SalesList} from './SalesList';

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
      await createWithdrawal();
      setIsWithdrawalModalOpen(false);
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdrawalClick = () => {
    if (!data) return;
    if (data.summary.available_stars <= 0 || data.has_pending_withdrawal) return;
    setIsWithdrawalModalOpen(true);
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
  const canWithdraw = summary.available_stars > 0 && !has_pending_withdrawal;

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderTabs />

      <div className="flex-1 overflow-auto p-4">
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

            {/* Available for Withdrawal - Clickable */}
            <button
              onClick={handleWithdrawalClick}
              disabled={!canWithdraw}
              className={`w-full flex items-center justify-between -mx-4 px-4 py-2 transition-colors ${
                canWithdraw
                  ? 'hover:bg-muted/50 active:bg-muted cursor-pointer'
                  : 'cursor-default opacity-70'
              }`}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wallet className="w-4 h-4" />
                <span>
                  {has_pending_withdrawal
                    ? 'Заявка в обработке'
                    : 'Доступно для вывода'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-primary">{summary.available_stars.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">
                  (~${summary.available_usd.toFixed(2)})
                </span>
                {canWithdraw && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-1" />
                )}
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center mt-4 mb-6">
          Комиссия: {summary.commission_rate}% • Звёзды разблокируются через {summary.lockup_days} дней
        </p>

        {/* Sales History */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3">История продаж</h2>
          <SalesList />
        </div>
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
