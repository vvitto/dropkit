import {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {miniApp, useLaunchParams} from '@tma.js/sdk-react';
import {Plus, ShoppingBag} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {HeaderTabs} from '@/components/layout/HeaderTabs';
import {getProducts, getPurchases, type PurchasedProduct} from '@/api/products';
import {createProductIntent} from '@/api/product_intents';
import {routes} from '@/navigation/routes';
import type {Product} from '@/types/product';
import {ProductCard} from './ProductCard';
import {PurchasedProductCard} from './PurchasedProductCard';
import {EmptyState} from './EmptyState';
import {LoadingState} from './LoadingState';

export function IndexPage() {
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<PurchasedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('products');

  const launchParams = useLaunchParams();

  const handleProductCreate = async () => {
    await createProductIntent();
    miniApp.close();
  };

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [products, purchasedItems] = await Promise.all([
          getProducts(),
          getPurchases()
        ]);
        setActiveProducts(products);
        setPurchases(purchasedItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (launchParams.tgWebAppStartParam) {
    return <Navigate to={routes.createProduct} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Повторить
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderTabs />

      <div className="flex-1 overflow-auto p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="products" className="flex-1">
              Мои товары
              {activeProducts.length > 0 && (
                <span className="ml-1.5 text-xs bg-primary/10 px-1.5 py-0.5 rounded">
                  {activeProducts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex-1">
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              Мои покупки
              {purchases.length > 0 && (
                <span className="ml-1.5 text-xs bg-primary/10 px-1.5 py-0.5 rounded">
                  {purchases.length}
                </span>
              )}
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

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button
          className="w-full h-12 text-base"
          size="lg"
          onClick={handleProductCreate}
        >
          <Plus className="w-5 h-5" />
          Создать новый товар
        </Button>
      </div>
    </div>
  );
}
