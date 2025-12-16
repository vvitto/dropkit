import {Star} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';

interface ProductFormFieldsProps {
  title: string;
  description: string;
  priceStars: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  error: string | null;
}

export function ProductFormFields({
  title,
  description,
  priceStars,
  onTitleChange,
  onDescriptionChange,
  onPriceChange,
  error,
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
          className="h-12"
        />
        <p className="text-xs text-muted-foreground">
          {title.length}/100 символов
        </p>
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
            className="h-12 pl-10"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Укажите цену в Telegram Stars (1 звезда ≈ $0.013)
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
