import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { invoice, openTelegramLink } from '@tma.js/sdk-react';
import { createInvoice, deliverContent, getPublicProduct, type PublicProduct } from '@/api/products';

interface UseProductResult {
  product: PublicProduct | null;
  isLoading: boolean;
  error: string | null;
  isDelivering: boolean;
  delivered: boolean;
  isPurchasing: boolean;
  hasAccess: boolean;
  isOwner: boolean;
  handleBuy: () => Promise<void>;
  handleDownload: () => Promise<void>;
}

export function useProduct(): UseProductResult {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDelivering, setIsDelivering] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

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

  const handleBuy = async () => {
    if (!product || isPurchasing) return;

    try {
      setIsPurchasing(true);
      setError(null);

      const { invoice_url } = await createInvoice(product.id);
      const status = await invoice.openUrl(invoice_url);

      if (status === 'paid') {
        setProduct({ ...product, is_purchased: true });
      } else if (status === 'failed') {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the payment');
    } finally {
      setIsPurchasing(false);
    }
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

  const isOwner = product?.is_owner ?? false;
  const isPurchased = product?.is_purchased ?? false;
  const hasAccess = isPurchased || isOwner;

  return {
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
  };
}
