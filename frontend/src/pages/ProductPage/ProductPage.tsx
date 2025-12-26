import { OwnerProductPage } from '@/pages/OwnerProductPage';
import { useProduct } from './useProduct';
import { ProductHeader } from './ProductHeader';
import { ProductCard } from './ProductCard';
import { ProductAccessInfo } from './ProductAccessInfo';
import { ProductActionButton } from './ProductActionButton';
import { ProductLoading, ProductError } from './ProductStates';

export function ProductPage() {
  const {
    product,
    isLoading,
    error,
    isDelivering,
    delivered,
    isPurchasing,
    hasAccess,
    isOwner,
    handleBuy,
    handleDownload,
  } = useProduct();

  if (isLoading) {
    return <ProductLoading />;
  }

  if (error || !product) {
    return <ProductError error={error} />;
  }

  if (isOwner) {
    return <OwnerProductPage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ProductHeader />

      <div className="flex-1 p-4 pb-28">
        <ProductCard
          product={product}
          hasAccess={hasAccess}
          isOwner={isOwner}
        />

        {hasAccess && <ProductAccessInfo isOwner={isOwner} />}
      </div>

      <ProductActionButton
        hasAccess={hasAccess}
        priceStars={product.price_stars}
        isPurchasing={isPurchasing}
        isDelivering={isDelivering}
        delivered={delivered}
        onBuy={handleBuy}
        onDownload={handleDownload}
      />
    </div>
  );
}
