import {
  Section,
  List,
  Input,
  Select,
  Textarea,
  FileInput,
  Button,
  Cell,
} from '@telegram-apps/telegram-ui';
import { type FC, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { createProduct } from '@/api/products';
import type { ContentType } from '@/types/product';

export const CreateProductPage: FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<ContentType>('text');
  const [contentText, setContentText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [priceStars, setPriceStars] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (contentType === 'file' && !file) {
      setError('Please select a file');
      return;
    }

    if ((contentType === 'link' || contentType === 'text') && !contentText.trim()) {
      setError(`Please enter ${contentType === 'link' ? 'a link' : 'text content'}`);
      return;
    }

    const price = parseInt(priceStars, 10);
    if (isNaN(price) || price < 1) {
      setError('Please enter a valid price (minimum 1 Star)');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const product = await createProduct({
        title: title.trim(),
        content_type: contentType,
        content_text: contentType !== 'file' ? contentText.trim() : undefined,
        price_stars: price,
        file: contentType === 'file' ? file || undefined : undefined,
      });

      navigate(`/products/${product.id}/success`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page back={true}>
      <List>
        <Section header="Product Details">
          <Input
            header="Title"
            placeholder="Enter product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Select
            header="Content Type"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
          >
            <option value="text">Text / Secret</option>
            <option value="link">Link / URL</option>
            <option value="file">File</option>
          </Select>

          {contentType === 'file' ? (
            <Cell subtitle={file ? file.name : 'No file selected'}>
              <FileInput
                label="Select File"
                onChange={handleFileChange}
              />
            </Cell>
          ) : (
            <Textarea
              header={contentType === 'link' ? 'Link URL' : 'Secret Content'}
              placeholder={
                contentType === 'link'
                  ? 'https://example.com/your-content'
                  : 'Enter your secret text or promo code'
              }
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
            />
          )}
        </Section>

        <Section header="Pricing">
          <Input
            header="Price in Stars"
            type="number"
            placeholder="50"
            value={priceStars}
            onChange={(e) => setPriceStars(e.target.value)}
          />
        </Section>

        {error && (
          <Section>
            <Cell style={{ color: 'var(--tg-theme-destructive-text-color)' }}>
              {error}
            </Cell>
          </Section>
        )}

        <Section>
          <Button
            size="l"
            stretched
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Create Product
          </Button>
        </Section>
      </List>
    </Page>
  );
};
