import {useEffect, useState, useCallback, useRef} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Lock, LockOpen, Loader2, Search, Star} from 'lucide-react';
import {getSales, type Sale} from '@/api/income';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function SaleCard({sale}: {sale: Sale}) {
  const buyerName = sale.buyer.username
    ? `@${sale.buyer.username}`
    : sale.buyer.first_name;

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{sale.product_title}</p>
            <p className="text-sm text-muted-foreground truncate">{buyerName}</p>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">{sale.amount_stars}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {sale.is_available ? (
                <LockOpen className="w-3 h-3 text-green-500" />
              ) : (
                <Lock className="w-3 h-3 text-orange-500" />
              )}
              <span>{formatDate(sale.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SalesList() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  const loadSales = useCallback(async (pageNum: number, searchQuery: string, append: boolean = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const response = await getSales(pageNum, searchQuery || undefined);

      if (append) {
        setSales(prev => [...prev, ...response.sales]);
      } else {
        setSales(response.sales);
      }
      setHasMore(response.has_more);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadSales(1, query, false);
    setPage(1);
  }, [query, loadSales]);

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
    if (!hasMore || isLoadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadSales(nextPage, query, true);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по username или ID"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : sales.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {query ? 'Ничего не найдено' : 'Пока нет продаж'}
        </div>
      ) : (
        <div className="space-y-2">
          {sales.map((sale) => (
            <SaleCard key={sale.id} sale={sale} />
          ))}

          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full py-3 text-sm text-primary hover:underline disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                'Загрузить ещё'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
