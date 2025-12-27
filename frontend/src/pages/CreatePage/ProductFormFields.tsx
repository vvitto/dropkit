import { Star, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import type { FieldErrors } from './useCreateProduct';

interface ProductFormFieldsProps {
  title: string;
  description: string;
  priceStars: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  errors: FieldErrors;
}

export function ProductFormFields({
  title,
  description,
  priceStars,
  onTitleChange,
  onDescriptionChange,
  onPriceChange,
  errors,
}: ProductFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Название <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Например: Гайд по заработку"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={100}
          error={!!errors.title}
        />
        <div className="flex justify-between text-xs">
          {errors.title ? (
            <p className="text-destructive">{errors.title}</p>
          ) : (
            <p className="text-muted-foreground">Придумайте привлекательное название</p>
          )}
          <span className="text-muted-foreground">{title.length}/100</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Описание
        </Label>
        <Textarea
          id="description"
          placeholder="Расскажите покупателям, что они получат..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Опишите преимущества и содержимое товара
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price" className="text-sm font-medium">
          Цена <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Star className="size-5 text-warning fill-warning" />
          </div>
          <Input
            id="price"
            type="number"
            inputMode="numeric"
            placeholder="100"
            value={priceStars}
            onChange={(e) => onPriceChange(e.target.value)}
            min={1}
            className="pl-12 pr-24"
            error={!!errors.priceStars}
          />
          {priceStars && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              ≈ ${(parseInt(priceStars, 10) * 0.013).toFixed(2)}
            </span>
          )}
        </div>
        {errors.priceStars ? (
          <p className="text-xs text-destructive">{errors.priceStars}</p>
        ) : (
          <Card className="p-3 bg-muted/50 border-0">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="flex items-center gap-1.5">
                <Star className="size-3.5 text-warning fill-warning" />
                1 звезда ≈ $0.013
              </p>
              <p>Комиссия сервиса — 5% с каждой продажи</p>
            </div>
          </Card>
        )}
      </div>

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
