import { useState, useCallback } from 'react';
import { invoice } from '@tma.js/sdk-react';
import { createInvoice, confirmPayment } from '@/api/products';

interface PaymentResult {
  success: boolean;
  error?: string;
}

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = useCallback(async (productId: number): Promise<PaymentResult> => {
    try {
      setIsProcessing(true);
      setError(null);

      // 1. Get invoice URL from backend
      const { invoice_url } = await createInvoice(productId);

      // 2. Open Telegram invoice
      const status = await invoice.openUrl(invoice_url);

      // 3. Handle result
      if (status === 'paid') {
        // For now, we'll use a placeholder charge ID
        // In production, this would come from the invoice result or webhook
        const chargeId = `charge_${Date.now()}_${productId}`;

        // 4. Confirm payment on backend
        await confirmPayment(productId, chargeId);

        return { success: true };
      }

      if (status === 'cancelled') {
        return { success: false, error: 'Payment cancelled' };
      }

      if (status === 'failed') {
        return { success: false, error: 'Payment failed' };
      }

      return { success: false, error: `Payment status: ${status}` };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    processPayment,
    isProcessing,
    error,
  };
}
