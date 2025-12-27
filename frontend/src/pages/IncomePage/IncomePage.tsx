import {useEffect, useState} from 'react';
import {HeaderTabs} from '@/components/layout/HeaderTabs';
import {CardGlass} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {AlertTriangle, ChevronRight, RefreshCw, Star, TrendingUp, Wallet,} from 'lucide-react';
import type {IncomeData} from '@/api/income';
import {createWithdrawal, getIncome} from '@/api/income';
import {WithdrawalModal} from './WithdrawalModal';
import {SalesList} from './SalesList';

function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen gradient-subtle">
      <HeaderTabs />
      <div className="flex-1 p-4 space-y-4">
        {/* Stats Card Skeleton */}
        <CardGlass className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 skeleton rounded-lg w-40" />
            <div className="h-6 skeleton rounded-lg w-24" />
          </div>
          <div className="border-t border-border/50" />
          <div className="flex items-center justify-between">
            <div className="h-5 skeleton rounded-lg w-36" />
            <div className="h-6 skeleton rounded-lg w-28" />
          </div>
        </CardGlass>

        {/* Info Skeleton */}
        <div className="flex justify-center">
          <div className="h-4 skeleton rounded-lg w-64" />
        </div>

        {/* Sales Header Skeleton */}
        <div className="h-6 skeleton rounded-lg w-32 mt-4" />

        {/* Search Skeleton */}
        <div className="h-12 skeleton rounded-xl w-full" />

        {/* Sale Cards Skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 skeleton rounded-2xl w-full" />
        ))}
      </div>
    </div>
  );
}

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
    return <LoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col min-h-screen gradient-subtle">
        <HeaderTabs />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="size-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Ошибка загрузки</h3>
          <p className="text-muted-foreground mb-6 max-w-[280px]">
            {error || 'Не удалось загрузить данные о доходах'}
          </p>
          <Button onClick={loadData} size="lg">
            <RefreshCw className="size-5" />
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  const { summary, has_pending_withdrawal } = data;
  const canWithdraw = summary.available_stars > 0 && !has_pending_withdrawal;

  return (
    <div className="flex flex-col min-h-screen gradient-subtle">
      <HeaderTabs />

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Stats Card */}
        <CardGlass className="p-5 space-y-4">
          {/* Total Earnings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="size-5 text-success" />
              </div>
              <span className="font-medium">Всего заработано</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="size-5 text-warning fill-warning" />
              <span className="text-lg font-bold">{summary.total_earned_stars.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground ml-1">
                ≈${summary.total_earned_usd.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="border-t border-border/50" />

          {/* Available for Withdrawal - Clickable */}
          <button
            onClick={handleWithdrawalClick}
            disabled={!canWithdraw}
            className={`w-full flex items-center justify-between -mx-1 px-1 py-1 rounded-xl transition-all duration-200 ${
              canWithdraw
                ? 'hover:bg-primary/5 active:scale-[0.99] cursor-pointer'
                : 'cursor-default opacity-70'
            }`}
          >
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="size-5 text-primary" />
              </div>
              <span className="font-medium">
                {has_pending_withdrawal
                  ? 'Заявка обрабатывается'
                  : 'Доступно к выводу'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="size-5 text-warning fill-warning" />
              <span className="text-lg font-bold text-primary">
                {summary.available_stars.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                ≈${summary.available_usd.toFixed(2)}
              </span>
              {canWithdraw && (
                <ChevronRight className="size-5 text-primary ml-1" />
              )}
            </div>
          </button>
        </CardGlass>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center px-4">
          Комиссия сервиса: {summary.commission_rate}% • Звёзды разблокируются через {summary.lockup_days} дней после продажи
        </p>

        {/* Sales History */}
        <div className="pt-2">
          <h2 className="text-lg font-semibold mb-4">История продаж</h2>
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
