import { ImageIcon, Star, Upload, Camera, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    <div className="flex-1 p-4 pb-24 space-y-4">
      {/* Cover */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Обложка товара</Label>
        <div
          className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed transition-all duration-200 group ${
            isEditing
              ? 'cursor-pointer border-primary/30 hover:border-primary/50 active:scale-[0.99]'
              : 'border-border/30'
          }`}
          onClick={handleCoverClick}
        >
          {formData.coverPreview ? (
            <>
              <img
                src={formData.coverPreview}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="size-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ImageIcon className="size-8 text-primary/60" />
              </div>
              {isEditing && (
                <p className="text-sm text-muted-foreground">Нажмите, чтобы загрузить</p>
              )}
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
            <Upload className="size-5" />
            {formData.coverPreview ? 'Изменить обложку' : 'Загрузить обложку'}
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
          error={!!errors.title}
        />
        {isEditing && (
          <div className="flex justify-between text-xs">
            {errors.title ? (
              <p className="text-destructive">{errors.title}</p>
            ) : (
              <p className="text-muted-foreground">Придумайте привлекательное название</p>
            )}
            <span className="text-muted-foreground">{formData.title.length}/100</span>
          </div>
        )}
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
        />
        {isEditing && (
          <p className="text-xs text-muted-foreground">
            Опишите преимущества и содержимое товара
          </p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price" className="text-sm font-medium">
          Цена {isEditing && <span className="text-destructive">*</span>}
        </Label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Star className="size-5 text-warning fill-warning" />
          </div>
          <Input
            id="price"
            type="number"
            inputMode="numeric"
            placeholder="100"
            value={formData.priceStars}
            onChange={(e) => onPriceChange(e.target.value)}
            min={1}
            disabled={!isEditing}
            className="pl-12 pr-24"
            error={!!errors.priceStars}
          />
          {formData.priceStars && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              ≈ ${(parseInt(formData.priceStars, 10) * 0.013).toFixed(2)}
            </span>
          )}
        </div>
        {errors.priceStars ? (
          <p className="text-xs text-destructive">{errors.priceStars}</p>
        ) : isEditing ? (
          <Card className="p-3 bg-muted/50 border-0">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="flex items-center gap-1.5">
                <Star className="size-3.5 text-warning fill-warning" />
                1 звезда ≈ $0.013
              </p>
              <p>Комиссия сервиса — 5% с каждой продажи</p>
            </div>
          </Card>
        ) : null}
      </div>

      {/* General error */}
      {errors.general && (
        <Card className="p-4 bg-destructive/5 border-destructive/20">
          <div className="flex gap-3">
            <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{errors.general}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
