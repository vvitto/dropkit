import {
  Section,
  List,
  Cell,
  Button,
  Placeholder,
  Spinner,
  Title,
  Text,
} from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { getPublicProduct, checkAccess } from '@/api/products';
import { usePayment } from '@/hooks/usePayment';
import type { PublicProduct } from '@/types/product';

export const PaywallPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { processPayment, isProcessing, error: paymentError } = usePayment();

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [productData, accessData] = await Promise.all([
        getPublicProduct(Number(id)),
        checkAccess(Number(id)),
      ]);

      setProduct(productData);
      setHasAccess(accessData.has_access);

      // If user already has access, redirect to content
      if (accessData.has_access) {
        navigate(`/p/${id}/content`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!product) return;

    const result = await processPayment(product.id);

    if (result.success) {
      navigate(`/p/${product.id}/content`);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'file': return '📄';
      case 'link': return '🔗';
      case 'text': return '📝';
      default: return '🔒';
    }
  };

  if (isLoading) {
    return (
      <Page back={false}>
        <Placeholder>
          <Spinner size="l" />
        </Placeholder>
      </Page>
    );
  }

  if (error || !product) {
    return (
      <Page back={false}>
        <Placeholder
          header="Error"
          description={error || 'Product not found'}
        />
      </Page>
    );
  }

  if (hasAccess) {
    return null; // Will redirect
  }

  return (
    <Page back={false}>
      <List>
        <Placeholder
          header={<Title level="1">{getContentTypeIcon(product.content_type)}</Title>}
          description={
            <div style={{ textAlign: 'center' }}>
              <Text weight="1" style={{ display: 'block', marginBottom: '8px' }}>
                {product.title}
              </Text>
              <Text style={{ color: 'var(--tg-theme-hint-color)' }}>
                by {product.seller.username ? `@${product.seller.username}` : product.seller.first_name}
              </Text>
            </div>
          }
        />

        <Section>
          <Cell
            style={{
              textAlign: 'center',
              padding: '24px',
              background: 'var(--tg-theme-secondary-bg-color)',
              borderRadius: '12px',
            }}
          >
            <Text style={{ color: 'var(--tg-theme-hint-color)', display: 'block' }}>
              Unlock access for
            </Text>
            <Title level="1" style={{ marginTop: '8px' }}>
              {product.price_stars} Stars
            </Title>
          </Cell>
        </Section>

        {(paymentError || error) && (
          <Section>
            <Cell style={{ color: 'var(--tg-theme-destructive-text-color)' }}>
              {paymentError || error}
            </Cell>
          </Section>
        )}

        <Section>
          <Button
            size="l"
            stretched
            loading={isProcessing}
            onClick={handlePurchase}
          >
            Pay {product.price_stars} Stars
          </Button>
        </Section>

        <Section>
          <Text
            style={{
              textAlign: 'center',
              color: 'var(--tg-theme-hint-color)',
              fontSize: '12px',
              display: 'block',
            }}
          >
            Secure payment via Telegram
          </Text>
        </Section>
      </List>
    </Page>
  );
};
