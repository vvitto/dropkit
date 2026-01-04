import { useProductOverview } from './useProductOverview';
import { ProductOverviewHeader } from './ProductOverviewHeader';
import { ProductOverviewCard } from './ProductOverviewCard';
import { ProductAccessInfo } from './ProductAccessInfo';
import { ProductActionButton } from './ProductActionButton';
import { ProductLoading, ProductError } from './ProductStates';

export function ProductOverviewPage() {
  const {
    product,
    isLoading,
    error,
    isDelivering,
    delivered,
    isPurchasing,
    hasAccess,
    handleBuy,
    handleDownload,
  } = useProductOverview();

  if (isLoading) {
    return <ProductLoading />;
  }

  if (error || !product) {
    return <ProductError error={error} />;
  }

  return (
    <div className="flex flex-col min-h-screen gradient-subtle">
      <ProductOverviewHeader product={product} />

      <div className="flex-1 p-4 pb-24">
        <ProductOverviewCard product={product} hasAccess={hasAccess} />
        {hasAccess && <ProductAccessInfo />}
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
