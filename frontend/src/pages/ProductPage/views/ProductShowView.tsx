import {useParams} from 'react-router-dom';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {shareMessage} from '@tma.js/sdk-react';
import {useQuery} from '@tanstack/react-query';
import {Pencil, Share2, Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {createProductShareMessage, getProduct} from '@/api/products';
import {
    CoverUpload,
    DeleteProductDialog,
    DescriptionField,
    ErrorState,
    FixedFooter,
    LoadingState,
    PageHeader,
    PriceField,
    TitleField,
} from '../components';

interface ProductShowViewProps {
  onEdit: () => void;
}

export function ProductShowView({ onEdit }: ProductShowViewProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: product, isLoading, error: queryError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  const handleShare = async () => {
    if (!product) return;
    const { message_id } = await createProductShareMessage(product.id);
    await shareMessage(message_id);
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
        subtitle={t('productPage.yourProduct')}
        actions={
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="shrink-0"
            >
              <Pencil className="size-5" />
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-4 pb-24 space-y-4">
        <CoverUpload
          coverPreview={product.cover_url || null}
          inputRef={{ current: null } as React.RefObject<HTMLInputElement>}
          onSelect={() => {}}
          disabled
        />

        <TitleField
          value={product.title}
          onChange={() => {}}
          disabled
          showHints={false}
        />

        <DescriptionField
          value={product.description || ''}
          onChange={() => {}}
          disabled
          showHints={false}
        />

        <PriceField
          value={product.price_stars.toString()}
          onChange={() => {}}
          disabled
          showHints={false}
        />
      </div>

      <FixedFooter>
        <Button
          onClick={handleShare}
          className="w-full shadow-lg"
          size="lg"
        >
          <Share2 className="size-5" />
          {t('productPage.share')}
        </Button>
      </FixedFooter>

      <DeleteProductDialog
        productId={product.id}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={() => setShowDeleteDialog(false)}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
