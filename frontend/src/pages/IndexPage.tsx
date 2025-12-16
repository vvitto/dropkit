import { useEffect, useState } from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import {miniApp, useLaunchParams} from '@tma.js/sdk-react';
import { Plus, FileText, Star, Archive } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getProducts } from '@/api/products';
import type { Product } from '@/types/product';
import {createProductIntent} from "@/api/product_intents.ts";
import {routes} from "@/navigation/routes.tsx";

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => navigate(`/edit/${product.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {product.cover_url ? (
            <img
              src={product.cover_url}
              alt={product.title}
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{product.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                {product.price_stars}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">
                {/*Продано: {product.sales_count}*/}
              </span>
            </div>
          </div>
          {/*{product.is_archived ? (*/}
          {/*  <Badge variant="secondary" className="shrink-0">Архив</Badge>*/}
          {/*) : product.is_active ? (*/}
          {/*  <Badge variant="success" className="shrink-0">Активен</Badge>*/}
          {/*) : (*/}
          {/*  <Badge variant="secondary" className="shrink-0">Черновик</Badge>*/}
          {/*)}*/}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ isArchive = false }: { isArchive?: boolean }) {


    const handleProductCreate = async () => {
        await createProductIntent();
        miniApp.close();
    }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {isArchive ? (
          <Archive className="w-8 h-8 text-muted-foreground" />
        ) : (
          <FileText className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-medium mb-2">
        {isArchive ? 'Архив пуст' : 'Нет товаров'}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
        {isArchive
          ? 'Здесь будут отображаться архивные товары'
          : 'Создайте свой первый цифровой товар и начните продавать прямо в Telegram'}
      </p>
      {!isArchive && (
        <Button onClick={handleProductCreate}>
          <Plus className="w-4 h-4" />
          Создать товар
        </Button>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function IndexPage() {

  const [activeProducts, setActiveProducts] = useState<Product[]>([]);
  const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('active');

  const launchParams = useLaunchParams();

  const handleProductCreate = async () => {
      await createProductIntent();
      miniApp.close();
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const active = await getProducts();
        setActiveProducts(active);
        // setArchivedProducts(archived);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

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

  const hasAnyProducts = activeProducts.length > 0 || archivedProducts.length > 0;

  if (!isLoading && !hasAnyProducts) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="p-4 border-b">
          <h1 className="text-xl font-semibold">Мои товары</h1>
        </header>
        <EmptyState />
      </div>
    );
  }

  if (launchParams.tgWebAppStartParam) {
      return <Navigate to={routes.createProduct} />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <h1 className="text-xl font-semibold">Мои товары</h1>
      </header>

      <div className="flex-1 overflow-auto p-4 pb-24">
        {archivedProducts.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">
                Активные
                {activeProducts.length > 0 && (
                  <span className="ml-1.5 text-xs bg-primary/10 px-1.5 py-0.5 rounded">
                    {activeProducts.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="archived">
                <Archive className="w-4 h-4 mr-1.5" />
                Архив
                <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded">
                  {archivedProducts.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
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

            <TabsContent value="archived">
              {isLoading ? (
                <LoadingState />
              ) : archivedProducts.length === 0 ? (
                <EmptyState isArchive />
              ) : (
                <div className="space-y-3">
                  {archivedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : isLoading ? (
          <LoadingState />
        ) : (
          <div className="space-y-3">
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
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
