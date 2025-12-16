import {Star} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import type {FieldErrors} from './useCreateProduct';

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
    <div className="space-y-5">
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
          className={`h-12 ${errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}`}
        />
        {errors.title ? (
          <p className="text-xs text-destructive">{errors.title}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {title.length}/100 символов
          </p>
        )}
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
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price" className="text-sm font-medium">
          Цена <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
          <Input
            id="price"
            type="number"
            inputMode="numeric"
            placeholder="100"
            value={priceStars}
            onChange={(e) => onPriceChange(e.target.value)}
            min={1}
            className={`h-12 pl-10 pr-20 ${errors.priceStars ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          />
          {priceStars && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ≈ ${(parseInt(priceStars, 10) * 0.013).toFixed(2)}
            </span>
          )}
        </div>
        {errors.priceStars ? (
          <p className="text-xs text-destructive">{errors.priceStars}</p>
        ) : (
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>1 звезда ≈ $0.013</p>
            <p>Комиссия сервиса — 5% с каждой продажи</p>
          </div>
        )}
      </div>

      {errors.general && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{errors.general}</p>
        </div>
      )}
    </div>
  );
}
