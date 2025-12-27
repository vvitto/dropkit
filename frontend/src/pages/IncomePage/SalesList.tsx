import { useState, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CardGlass } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Loader2,
  LockOpen,
  Lock,
  Search,
  ShoppingBag,
  Star,
  User,
} from 'lucide-react';
import { getSales, type Sale } from '@/api/income';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function SaleCard({ sale }: { sale: Sale }) {
  const buyerName = sale.buyer.username
    ? `@${sale.buyer.username}`
    : sale.buyer.first_name;

  return (
    <CardGlass className="p-4">
      <div className="flex items-start gap-3">
        {/* Product Icon */}
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <ShoppingBag className="size-5 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{sale.product_title}</p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
            <User className="size-3.5" />
            <span className="truncate">{buyerName}</span>
          </div>
        </div>

        {/* Price and Status */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-1">
            <Star className="size-4 text-warning fill-warning" />
            <span className="font-bold">{sale.amount_stars}</span>
          </div>
          <Badge
            variant={sale.is_available ? 'success' : 'warning'}
            size="sm"
            className="flex items-center gap-1"
          >
            {sale.is_available ? (
              <>
                <LockOpen className="size-3" />
                Доступны
              </>
            ) : (
              <>
                <Lock className="size-3" />
                Заблокированы
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
        <Clock className="size-3.5" />
        <span>{formatDate(sale.created_at)}</span>
      </div>
    </CardGlass>
  );
}

function SalesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <CardGlass key={i} className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl skeleton shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 skeleton rounded-lg w-3/4" />
              <div className="h-4 skeleton rounded-lg w-1/2" />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="h-5 skeleton rounded-lg w-16" />
              <div className="h-5 skeleton rounded-full w-20" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="h-4 skeleton rounded-lg w-32" />
          </div>
        </CardGlass>
      ))}
    </div>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <ShoppingBag className="size-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-1">
        {hasSearch ? 'Ничего не найдено' : 'Пока нет продаж'}
      </h3>
      <p className="text-sm text-muted-foreground max-w-[200px]">
        {hasSearch
          ? 'Попробуйте изменить поисковый запрос'
          : 'Ваши продажи появятся здесь'}
      </p>
    </div>
  );
}

export function SalesList() {
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['sales', query],
    queryFn: ({ pageParam }) => getSales(pageParam, query || undefined),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.has_more ? lastPageParam + 1 : undefined,
  });

  const sales = data?.pages.flatMap((page) => page.sales) ?? [];

  const handleSearchChange = (value: string) => {
    setSearchInput(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setQuery(value);
    }, 300);
  };

  const handleLoadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Поиск по username или ID"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-11"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <SalesSkeleton />
      ) : sales.length === 0 ? (
        <EmptyState hasSearch={!!query} />
      ) : (
        <div className="space-y-3">
          {sales.map((sale) => (
            <SaleCard key={sale.id} sale={sale} />
          ))}

          {hasNextPage && (
            <Button
              variant="ghost"
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              className="w-full"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                'Загрузить ещё'
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
