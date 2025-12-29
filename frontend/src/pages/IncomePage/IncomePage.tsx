import {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {HeaderTabs} from '@/components/layout/HeaderTabs';
import {CardGlass} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {AlertTriangle, ChevronRight, Lock, RefreshCw, Star, TrendingUp, Wallet,} from 'lucide-react';
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
            <div className="h-9 skeleton rounded-lg w-full" />
          </div>
          <div className="border-t border-border/50" />
          <div className="flex items-center justify-between">
              <div className="h-9 skeleton rounded-lg w-full" />
          </div>
        </CardGlass>

        {/* Info Skeleton */}
        <div className="flex justify-center">
          <div className="h-4 skeleton rounded-lg w-64" />
        </div>

        {/* Sales Header Skeleton */}
        <div className="h-8 skeleton rounded-lg w-32 mt-4" />

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
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['income'],
    queryFn: getIncome,
  });

  const withdrawalMutation = useMutation({
    mutationFn: createWithdrawal,
    onSuccess: () => {
      setIsWithdrawalModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['income'] });
    },
  });

  const handleWithdraw = () => {
    withdrawalMutation.mutate();
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
    const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить данные о доходах';
    return (
      <div className="flex flex-col min-h-screen gradient-subtle">
        <HeaderTabs />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="size-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Ошибка загрузки</h3>
          <p className="text-muted-foreground mb-6 max-w-[280px]">
            {errorMessage}
          </p>
          <Button onClick={() => refetch()} size="lg">
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
        <CardGlass className="p-4 divide-y divide-border/50">
          {/* Total Earnings */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="size-4 text-success" />
              </div>
              <span className="text-sm font-medium">Всего заработано</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="size-4 text-warning fill-warning" />
              <span className="font-bold">{summary.total_earned_stars.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">
                ≈${summary.total_earned_usd.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Pending Stars */}
          {summary.pending_stars > 0 && (
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Lock className="size-4 text-warning" />
                </div>
                <span className="text-sm font-medium">Заморожено</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="size-4 text-warning fill-warning" />
                <span className="font-bold text-warning">{summary.pending_stars.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">
                  ≈${summary.pending_usd.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Available for Withdrawal - Clickable */}
          <button
            onClick={handleWithdrawalClick}
            disabled={!canWithdraw}
            className={`w-full flex items-center justify-between pt-3 transition-all duration-200 ${
              canWithdraw
                ? 'active:scale-[0.99] cursor-pointer'
                : 'cursor-default opacity-70'
            }`}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Wallet className="size-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-left">
                {has_pending_withdrawal
                  ? 'Заявка обрабатывается'
                  : 'Доступно к выводу'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="size-4 text-warning fill-warning" />
              <span className="font-bold text-primary">
                {summary.available_stars.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">
                ≈${summary.available_usd.toFixed(2)}
              </span>
              {canWithdraw && (
                <ChevronRight className="size-4 text-primary" />
              )}
            </div>
          </button>
        </CardGlass>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center px-4">
          Звёзды разблокируются через {summary.lockup_days} дней после продажи
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
        amountTon={summary.available_ton}
        isSubmitting={withdrawalMutation.isPending}
      />
    </div>
  );
}
