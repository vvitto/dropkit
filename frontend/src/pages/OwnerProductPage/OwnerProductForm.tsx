import { ImageIcon, Star, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { FormData, FieldErrors } from './useOwnerProduct';

interface OwnerProductFormProps {
  formData: FormData;
  errors: FieldErrors;
  isEditing: boolean;
  coverInputRef: React.RefObject<HTMLInputElement>;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onCoverSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function OwnerProductForm({
  formData,
  errors,
  isEditing,
  coverInputRef,
  onTitleChange,
  onDescriptionChange,
  onPriceChange,
  onCoverSelect,
}: OwnerProductFormProps) {
  const handleCoverClick = () => {
    if (isEditing) {
      coverInputRef.current?.click();
    }
  };

  return (
    <div className="p-4 pb-28 space-y-6">
      {/* Cover */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Обложка</Label>
        <div
          className={`relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/20 transition-colors ${
            isEditing ? 'cursor-pointer hover:border-primary/40' : ''
          }`}
          onClick={handleCoverClick}
        >
          {formData.coverPreview ? (
            <img
              src={formData.coverPreview}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <ImageIcon className="w-12 h-12 text-primary/40" />
            </div>
          )}
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={onCoverSelect}
          className="hidden"
          disabled={!isEditing}
        />
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleCoverClick}
          >
            <Upload className="w-4 h-4" />
            Загрузить обложку
          </Button>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Название {isEditing && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id="title"
          placeholder="Например: Гайд по заработку"
          value={formData.title}
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={100}
          disabled={!isEditing}
          className={`h-12 ${errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}`}
        />
        {errors.title ? (
          <p className="text-xs text-destructive">{errors.title}</p>
        ) : isEditing ? (
          <p className="text-xs text-muted-foreground">
            {formData.title.length}/100 символов
          </p>
        ) : null}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Описание
        </Label>
        <Textarea
          id="description"
          placeholder="Расскажите покупателям, что они получат..."
          value={formData.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          disabled={!isEditing}
          className="resize-none"
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price" className="text-sm font-medium">
          Цена {isEditing && <span className="text-destructive">*</span>}
        </Label>
        <div className="relative">
          <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
          <Input
            id="price"
            type="number"
            inputMode="numeric"
            placeholder="100"
            value={formData.priceStars}
            onChange={(e) => onPriceChange(e.target.value)}
            min={1}
            disabled={!isEditing}
            className={`h-12 pl-10 pr-20 ${errors.priceStars ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          />
          {formData.priceStars && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ≈ ${(parseInt(formData.priceStars, 10) * 0.013).toFixed(2)}
            </span>
          )}
        </div>
        {errors.priceStars ? (
          <p className="text-xs text-destructive">{errors.priceStars}</p>
        ) : isEditing ? (
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>1 звезда ≈ $0.013</p>
            <p>Комиссия сервиса — 5% с каждой продажи</p>
          </div>
        ) : null}
      </div>

      {/* General error */}
      {errors.general && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{errors.general}</p>
        </div>
      )}
    </div>
  );
}
