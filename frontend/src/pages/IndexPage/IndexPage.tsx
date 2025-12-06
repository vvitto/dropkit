import { Section, Cell, List, Button, Placeholder, Spinner } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { getProducts } from '@/api/products';
import type { Product } from '@/types/product';

export const IndexPage: FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
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
      <Page back={false}>
        <Placeholder>
          <Spinner size="l" />
        </Placeholder>
      </Page>
    );
  }

  if (error) {
    return (
      <Page back={false}>
        <Placeholder
          header="Error"
          description={error}
          action={<Button onClick={loadProducts}>Retry</Button>}
        />
      </Page>
    );
  }

  return (
    <Page back={false}>
      <List>
        {products.length === 0 ? (
          <Placeholder
            header="No products yet"
            description="Create your first product to start selling"
            action={
              <Button size="l" onClick={() => navigate('/products/new')}>
                Create Product
              </Button>
            }
          />
        ) : (
          <>
            <Section header="Your Products">
              {products.map((product) => (
                <Cell
                  key={product.id}
                  subtitle={`${getContentTypeLabel(product.content_type)} · ${product.price_stars} Stars · Sold: ${product.sales_count}`}
                  onClick={() => navigate(`/products/${product.id}/success`)}
                >
                  {product.title}
                </Cell>
              ))}
            </Section>
            <Section>
              <Button
                size="l"
                stretched
                onClick={() => navigate('/products/new')}
              >
                Create New Product
              </Button>
            </Section>
          </>
        )}
      </List>
    </Page>
  );
};
