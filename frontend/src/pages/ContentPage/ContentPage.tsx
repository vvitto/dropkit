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
import { openLink } from '@tma.js/sdk-react';

import { Page } from '@/components/Page.tsx';
import { getPublicProduct, getProductContent, checkAccess } from '@/api/products';
import type { PublicProduct, ProductContent } from '@/types/product';

export const ContentPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [content, setContent] = useState<ProductContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      loadContent();
    }
  }, [id]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check access first
      const accessData = await checkAccess(Number(id));
      if (!accessData.has_access) {
        navigate(`/p/${id}`, { replace: true });
        return;
      }

      const [productData, contentData] = await Promise.all([
        getPublicProduct(Number(id)),
        getProductContent(Number(id)),
      ]);

      setProduct(productData);
      setContent(contentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenLink = (url: string) => {
    try {
      openLink(url);
    } catch {
      window.open(url, '_blank');
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  if (error || !product || !content) {
    return (
      <Page back={false}>
        <Placeholder
          header="Error"
          description={error || 'Content not found'}
          action={<Button onClick={() => navigate('/')}>Go Home</Button>}
        />
      </Page>
    );
  }

  return (
    <Page back={false}>
      <List>
        <Placeholder
          header={<Title level="2">Unlocked!</Title>}
          description={product.title}
        />

        <Section header="Your Content">
          {content.type === 'text' && content.text && (
            <>
              <Cell
                style={{
                  background: 'var(--tg-theme-secondary-bg-color)',
                  borderRadius: '12px',
                  padding: '16px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                <Text>{content.text}</Text>
              </Cell>
              <Button
                size="l"
                stretched
                mode="outline"
                onClick={() => handleCopy(content.text!)}
                style={{ marginTop: '12px' }}
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
            </>
          )}

          {content.type === 'link' && content.url && (
            <>
              <Cell
                style={{
                  background: 'var(--tg-theme-secondary-bg-color)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <Text
                  style={{
                    color: 'var(--tg-theme-link-color)',
                    wordBreak: 'break-all',
                  }}
                >
                  {content.url}
                </Text>
              </Cell>
              <Button
                size="l"
                stretched
                onClick={() => handleOpenLink(content.url!)}
                style={{ marginTop: '12px' }}
              >
                Open Link
              </Button>
              <Button
                size="l"
                stretched
                mode="outline"
                onClick={() => handleCopy(content.url!)}
                style={{ marginTop: '8px' }}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </>
          )}

          {content.type === 'file' && content.url && (
            <>
              <Cell subtitle="File ready for download">
                <Text weight="2">{content.filename || 'Download'}</Text>
              </Cell>
              <Button
                size="l"
                stretched
                onClick={() => handleDownload(content.url!, content.filename || 'download')}
                style={{ marginTop: '12px' }}
              >
                Download File
              </Button>
            </>
          )}
        </Section>

        <Section>
          <Button
            size="l"
            stretched
            mode="plain"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Section>
      </List>
    </Page>
  );
};
