import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery} from '@tanstack/react-query';
import {miniApp} from '@tma.js/sdk-react';
import {Package, Plus, RefreshCw, ShoppingBag} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {HeaderTabs} from '@/components/layout/HeaderTabs';
import {Badge} from '@/components/ui/badge';
import {getProducts, getPurchases} from '@/api/products';
import {createProductIntent} from '@/api/product_intents';
import {ProductCard} from './ProductCard';
import {PurchasedProductCard} from './PurchasedProductCard';
import {EmptyState} from './EmptyState';
import {LoadingState} from './LoadingState';

export function IndexPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('products');

  const { data: activeProducts = [], isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: purchases = [], isLoading: isLoadingPurchases, error: purchasesError } = useQuery({
    queryKey: ['purchases'],
    queryFn: getPurchases,
  });

  const createIntentMutation = useMutation({
    mutationFn: createProductIntent,
    onSuccess: () => miniApp.close(),
  });

  const handleProductCreate = () => {
    createIntentMutation.mutate();
  };

  const isLoading = isLoadingProducts || isLoadingPurchases;
  const error = productsError || purchasesError;

  if (error) {
    const errorMessage = error instanceof Error ? error.message : t('indexPage.error.defaultMessage');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gradient-subtle">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <RefreshCw className="size-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{t('indexPage.error.title')}</h3>
        <p className="text-muted-foreground mb-6 max-w-[280px]">{errorMessage}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="size-5" />
          {t('indexPage.error.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen gradient-subtle">
      <HeaderTabs />

      <div className="flex-1 overflow-auto p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="products" className="gap-2">
              <Package className="size-4" />
              {t('indexPage.tabs.myProducts')}
                <Badge variant="secondary" size="sm">
                    {activeProducts.length}
                </Badge>
            </TabsTrigger>
            <TabsTrigger value="purchases" className="gap-2">
              <ShoppingBag className="size-4" />
              {t('indexPage.tabs.purchases')}
                <Badge variant="secondary" size="sm">
                    {purchases.length}
                </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {isLoading ? (
              <LoadingState />
            ) : activeProducts.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">
                {activeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="purchases">
            {isLoading ? (
              <LoadingState />
            ) : purchases.length === 0 ? (
              <EmptyState isPurchases />
            ) : (
              <div className="space-y-3">
                {purchases.map((purchase) => (
                  <PurchasedProductCard key={purchase.id} purchase={purchase} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

        {activeProducts.length > 0 ? <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/50 safe-area-bottom">
            <Button
              className="w-full shadow-lg animate-pulse-glow"
              size="lg"
              onClick={handleProductCreate}
            >
              <Plus className="size-5" />
              {t('indexPage.createProduct')}
            </Button>
      </div> : null}
    </div>
  );
}
