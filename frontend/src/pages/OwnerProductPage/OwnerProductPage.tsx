import { shareMessage } from '@tma.js/sdk-react';
import { Loader2 } from 'lucide-react';
import { createProductShareMessage } from '@/api/products';
import { useOwnerProduct } from './useOwnerProduct';
import { OwnerProductHeader } from './OwnerProductHeader';
import { OwnerProductForm } from './OwnerProductForm';
import { OwnerProductFooter } from './OwnerProductFooter';

export function OwnerProductPage() {
  const {
    product,
    isLoading,
    error,
    isEditing,
    isSaving,
    formData,
    errors,
    coverInputRef,
    setTitle,
    setDescription,
    setPriceStars,
    handleCoverSelect,
    startEditing,
    cancelEditing,
    handleSave,
  } = useOwnerProduct();

  const handleShare = async () => {
    if (!product) return;
    const { message_id } = await createProductShareMessage(product.id);
    await shareMessage(message_id);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <p className="text-destructive mb-4">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <OwnerProductHeader
        title={product.title}
        isEditing={isEditing}
        onStartEditing={startEditing}
        onCancelEditing={cancelEditing}
      />

      <OwnerProductForm
        formData={formData}
        errors={errors}
        isEditing={isEditing}
        coverInputRef={coverInputRef}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onPriceChange={setPriceStars}
        onCoverSelect={handleCoverSelect}
      />

      <OwnerProductFooter
        isEditing={isEditing}
        isSaving={isSaving}
        onShare={handleShare}
        onSave={handleSave}
      />
    </div>
  );
}
