import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeft, CheckCircle2, Download, FileImage, Loader2, ShoppingCart, Star, User} from 'lucide-react';
import {openTelegramLink} from '@tma.js/sdk-react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {deliverContent, getPublicProduct, type PublicProduct} from '@/api/products';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDelivering, setIsDelivering] = useState(false);
  const [delivered, setDelivered] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await getPublicProduct(parseInt(id, 10));
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Product not found');
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleBuy = () => {
    // Payment logic will be implemented later
    console.log('Buy product:', product?.id);
  };

  const handleDownload = async () => {
    if (!product || isDelivering) return;

    try {
      setIsDelivering(true);
      await deliverContent(product.id);
      openTelegramLink('https://t.me/dropkit_bot');

      setDelivered(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить файл');
    } finally {
      setIsDelivering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileImage className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Товар не найден</h3>
        <p className="text-sm text-muted-foreground mb-6">
          {error || 'Возможно, он был удалён или ссылка неверна'}
        </p>
        <Button variant="outline" onClick={() => navigate('/')}>
          На главную
        </Button>
      </div>
    );
  }

  const isPurchased = product.is_purchased;
  const isOwner = product.is_owner;
  const hasAccess = isPurchased || isOwner;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold truncate">Товар</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 pb-28">
        {/* Product Card */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            {/* Product Image/Preview */}
            {product.cover_url ? (
              <img
                src={product.cover_url}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center">
                <FileImage className="w-16 h-16 text-primary/50" />
              </div>
            )}

            {/* Product Info */}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>

              {product.description && (
                <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                  {product.description}
                </p>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-amber-600">
                    {product.price_stars}
                  </span>
                </div>
                {hasAccess && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {isOwner ? 'Ваш товар' : 'Куплено'}
                    </span>
                  </div>
                )}
              </div>

              {/* Seller */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>
                  Продавец: {product.seller.first_name}
                  {product.seller.username && (
                    <span className="text-primary ml-1">
                      @{product.seller.username}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card for purchased */}
        {hasAccess && (
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">
                    {isOwner ? 'Это ваш товар' : 'У вас есть доступ'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isOwner
                      ? 'Вы можете скачать файл или поделиться им с покупателями'
                      : 'Вы можете скачать купленный файл'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        {hasAccess ? (
          <Button
            onClick={handleDownload}
            disabled={isDelivering || delivered}
            className="w-full h-12 text-base"
            size="lg"
          >
            {isDelivering ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Отправка...
              </>
            ) : delivered ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Файл отправлен в чат
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Получить файл
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleBuy}
            className="w-full h-12 text-base"
            size="lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Купить за {product.price_stars}
            <Star className="w-4 h-4 ml-1 text-amber-300" />
          </Button>
        )}
      </div>
    </div>
  );
}
