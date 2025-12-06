import {
  Section,
  List,
  Cell,
  Button,
  Placeholder,
  Spinner,
} from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shareURL } from '@tma.js/sdk-react';

import { Page } from '@/components/Page.tsx';
import { getProduct, deleteProduct } from '@/api/products';
import type { Product } from '@/types/product';

export const ProductSuccessPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const data = await getProduct(Number(id));
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (!product) return;

    const botUsername = import.meta.env.VITE_BOT_USERNAME || 'dropkit_bot';
    const productUrl = `https://t.me/${botUsername}?startapp=p_${product.id}`;
    const text = `${product.title}\n\nGet access for ${product.price_stars} Stars`;

    try {
      shareURL(productUrl, text);
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(productUrl);
    }
  };

  const handleDelete = async () => {
    if (!product || !confirm('Are you sure you want to delete this product?')) return;

    try {
      setIsDeleting(true);
      await deleteProduct(product.id);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      setIsDeleting(false);
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'file': return 'File';
      case 'link': return 'Link';
      case 'text': return 'Text';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <Page back={true}>
        <Placeholder>
          <Spinner size="l" />
        </Placeholder>
      </Page>
    );
  }

  if (error || !product) {
    return (
      <Page back={true}>
        <Placeholder
          header="Error"
          description={error || 'Product not found'}
          action={<Button onClick={() => navigate('/')}>Back to Products</Button>}
        />
      </Page>
    );
  }

  return (
    <Page back={true}>
      <List>
        <Placeholder
          header="Product Ready!"
          description="Share your product to start selling"
        />

        <Section header="Product Info">
          <Cell subtitle="Title">{product.title}</Cell>
          <Cell subtitle="Type">{getContentTypeLabel(product.content_type)}</Cell>
          <Cell subtitle="Price">{product.price_stars} Stars</Cell>
          <Cell subtitle="Sales">{product.sales_count}</Cell>
        </Section>

        <Section>
          <Button
            size="l"
            stretched
            onClick={handleShare}
          >
            Share to Channel
          </Button>
        </Section>

        <Section>
          <Button
            size="l"
            stretched
            mode="outline"
            onClick={() => navigate('/')}
          >
            Back to Products
          </Button>
        </Section>

        <Section>
          <Button
            size="l"
            stretched
            mode="plain"
            loading={isDeleting}
            onClick={handleDelete}
            style={{ color: 'var(--tg-theme-destructive-text-color)' }}
          >
            Delete Product
          </Button>
        </Section>
      </List>
    </Page>
  );
};
