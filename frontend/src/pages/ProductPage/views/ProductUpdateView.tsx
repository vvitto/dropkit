import {useParams} from 'react-router-dom';
import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Loader2, Save, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {getProduct, updateProduct} from '@/api/products';
import {
    CoverUpload,
    DescriptionField,
    ErrorState,
    type FieldErrors,
    FixedFooter,
    GeneralError,
    LoadingState,
    PageHeader,
    PriceField,
    TitleField,
} from '../components';

interface ProductUpdateViewProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export function ProductUpdateView({ onCancel, onSuccess }: ProductUpdateViewProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceStars, setPriceStars] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const { data: product, isLoading, error: queryError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description || '');
      setPriceStars(product.price_stars.toString());
      setCoverPreview(product.cover_url || null);
    }
  }, [product]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (errors.title && value.trim()) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handlePriceChange = (value: string) => {
    setPriceStars(value);
    if (errors.priceStars) {
      const price = parseInt(value, 10);
      if (price && price >= 1) {
        setErrors((prev) => ({ ...prev, priceStars: undefined }));
      }
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!title.trim()) {
      newErrors.title = t('productPage.validation.titleRequired');
    }

    const price = parseInt(priceStars, 10);
    if (!priceStars) {
      newErrors.priceStars = t('productPage.validation.priceRequired');
    } else if (!price || price < 1) {
      newErrors.priceStars = t('productPage.validation.priceMinimum');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      updateProduct(product!.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        price_stars: parseInt(priceStars, 10),
        cover: cover || undefined,
      }),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(['product', id], updatedProduct);
      onSuccess();
    },
    onError: (err) => {
      setErrors({
        general: err instanceof Error ? err.message : t('productPage.update.saveError'),
      });
    },
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!product || updateMutation.isPending) return;
    if (!validate()) return;
    setErrors({});
    updateMutation.mutate();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  const error = queryError instanceof Error ? queryError.message : queryError ? t('productPage.productNotFound') : null;

  if (error || !product) {
    return <ErrorState message={error || undefined} />;
  }

  return (
    <div className="flex flex-col min-h-screen gradient-subtle">
      <PageHeader
        title={product.title}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm">
              {t('productPage.editing')}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="shrink-0"
            >
              <X className="size-5" />
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="flex-1 p-4 pb-24 space-y-4">
        <CoverUpload
          coverPreview={coverPreview}
          inputRef={coverInputRef}
          onSelect={handleCoverSelect}
        />

        <TitleField
          value={title}
          onChange={handleTitleChange}
          error={errors.title}
        />

        <DescriptionField
          value={description}
          onChange={setDescription}
        />

        <PriceField
          value={priceStars}
          onChange={handlePriceChange}
          error={errors.priceStars}
        />

        <GeneralError error={errors.general} />
      </form>

      <FixedFooter>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="w-full shadow-lg"
          size="lg"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              {t('productPage.update.saving')}
            </>
          ) : (
            <>
              <Save className="size-5" />
              {t('productPage.update.saveChanges')}
            </>
          )}
        </Button>
      </FixedFooter>
    </div>
  );
}
