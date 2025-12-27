import { useNavigate } from 'react-router-dom';
import { shareMessage } from '@tma.js/sdk-react';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createProductShareMessage } from '@/api/products';
import { useCreateProduct } from './useCreateProduct';
import { SuccessScreen } from './SuccessScreen';
import { NoFileScreen } from './NoFileScreen';
import { CoverUpload } from './CoverUpload';
import { ProductFormFields } from './ProductFormFields';
import { PageHeader } from './PageHeader';

export function CreatePage() {
  const navigate = useNavigate();

  const {
    formData,
    setTitle,
    setDescription,
    setPriceStars,
    coverInputRef,
    handleCoverSelect,
    handleSubmit,
    isSubmitting,
    errors,
    createdProduct,
    fileId,
  } = useCreateProduct();

  const handleShare = async () => {
    if (!createdProduct) return;
    const { message_id } = await createProductShareMessage(createdProduct.id);
    await shareMessage(message_id);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (createdProduct) {
    return (
      <SuccessScreen
        product={createdProduct}
        onShare={handleShare}
        onGoHome={handleGoHome}
      />
    );
  }

  if (!fileId) {
    return <NoFileScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen gradient-subtle">
      <PageHeader
        title="Новый товар"
        subtitle="Заполните информацию о товаре"
      />

      <form onSubmit={handleSubmit} className="flex-1 p-4 pb-24">
        <CoverUpload
          coverPreview={formData.coverPreview}
          inputRef={coverInputRef}
          onSelect={handleCoverSelect}
        />

        <ProductFormFields
          title={formData.title}
          description={formData.description}
          priceStars={formData.priceStars}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onPriceChange={setPriceStars}
          errors={errors}
        />
      </form>

      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/50 safe-area-bottom">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full shadow-lg"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Создание...
            </>
          ) : (
            <>
              <Sparkles className="size-5" />
              Создать товар
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
