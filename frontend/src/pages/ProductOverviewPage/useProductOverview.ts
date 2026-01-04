import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {invoice, openTelegramLink} from '@tma.js/sdk-react';
import {createInvoice, deliverContent, getProduct, type Product} from '@/api/products';

interface UseProductOverviewResult {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  isDelivering: boolean;
  delivered: boolean;
  isPurchasing: boolean;
  hasAccess: boolean;
  handleBuy: () => Promise<void>;
  handleDownload: () => Promise<void>;
}

export function useProductOverview(): UseProductOverviewResult {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [delivered, setDelivered] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const { data: product, isLoading, error: queryError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const { invoice_url } = await createInvoice(id!);
      const status = await invoice.openUrl(invoice_url);
      return status;
    },
    onSuccess: (status) => {
      if (status === 'paid') {
        queryClient.setQueryData<Product>(['product', id], (old) =>
          old ? { ...old, is_purchased: true } : old
        );
      } else if (status === 'failed') {
        setPurchaseError('Payment failed. Please try again.');
      }
    },
    onError: (err) => {
      setPurchaseError(err instanceof Error ? err.message : 'Could not create the payment');
    },
  });

  const deliverMutation = useMutation({
    mutationFn: () => deliverContent(id!),
    onSuccess: () => {
      openTelegramLink(`https://t.me/${import.meta.env.VITE_BOT_NAME}`);
      setDelivered(true);
    },
  });

  const handleBuy = async () => {
    if (!product || purchaseMutation.isPending) return;
    setPurchaseError(null);
    purchaseMutation.mutate();
  };

  const handleDownload = async () => {
    if (!product || deliverMutation.isPending) return;
    deliverMutation.mutate();
  };

  const isPurchased = product?.is_purchased ?? false;
  const hasAccess = isPurchased;

  const error = queryError
    ? (queryError instanceof Error ? queryError.message : 'Product not found')
    : purchaseError
    ?? (deliverMutation.error instanceof Error ? deliverMutation.error.message : null);

  return {
    product: product ?? null,
    isLoading,
    error,
    isDelivering: deliverMutation.isPending,
    delivered,
    isPurchasing: purchaseMutation.isPending,
    hasAccess,
    handleBuy,
    handleDownload,
  };
}
