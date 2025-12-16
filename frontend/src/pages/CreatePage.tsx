import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLaunchParams, shareMessage, miniApp } from '@tma.js/sdk-react';
import {
  ArrowLeft,
  Star,
  FileImage,
  Sparkles,
  Loader2,
  CheckCircle2,
  Share2,
  Home,
  Upload,
  ImageIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {createProduct, createProductShareMessage} from '@/api/products';
import type { Product } from '@/types/product';

export function CreatePage() {
  const navigate = useNavigate();
  const launchParams = useLaunchParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceStars, setPriceStars] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Extract file_id from startapp param (format: r_<file_id>)
  const startParam = launchParams.tgWebAppStartParam;
  const fileId = startParam?.startsWith('r_') ? startParam.slice(2) : null;

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCover(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Введите название товара');
      return;
    }

    const price = parseInt(priceStars, 10);
    if (!price || price < 1) {
      setError('Укажите цену (минимум 1 звезда)');
      return;
    }

    if (!fileId) {
      setError('Файл не найден. Попробуйте отправить файл боту заново');
      return;
    }

    try {
      setIsSubmitting(true);
      const product = await createProduct({
        title: title.trim(),
        description: description.trim() || undefined,
        price_stars: price,
        tg_file_id: fileId,
        cover: cover || undefined,
      });

      setCreatedProduct(product);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при создании товара');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (!createdProduct) return;

    const { message_id } = await createProductShareMessage(createdProduct.id);

    await shareMessage(message_id);

    // const productUrl = `https://t.me/${BOT_USERNAME}?startapp=p_${createdProduct.id}`;
    // const text = createdProduct.description
    //   ? `${createdProduct.title}\n\n${createdProduct.description}`
    //   : createdProduct.title;

    // shareURL(productUrl, text);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Success state
  if (createdProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-xl font-semibold mb-2">Товар создан!</h2>
        <p className="text-muted-foreground mb-2">{createdProduct.title}</p>
        <p className="text-sm text-muted-foreground mb-8 flex items-center gap-1">
          <Star className="w-4 h-4 text-amber-500" />
          {createdProduct.price_stars} звёзд
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Button
            onClick={handleShare}
            className="w-full h-12 text-base"
            size="lg"
          >
            <Share2 className="w-5 h-5" />
            Поделиться товаром
          </Button>

          <Button
            variant="outline"
            onClick={handleGoHome}
            className="w-full h-12 text-base"
            size="lg"
          >
            <Home className="w-5 h-5" />
            На главную
          </Button>
        </div>
      </div>
    );
  }

  // No file ID - show error
  if (!fileId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileImage className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Файл не найден</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-[280px]">
          Чтобы создать товар, отправьте файл или фото боту @dropkit_bot
        </p>
        <Button variant="outline" onClick={() => miniApp.close()}>
          Закрыть
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Новый товар</h1>
            <p className="text-xs text-muted-foreground">Заполните информацию о товаре</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 p-4 pb-28">
        {/* Cover Upload Section */}
        <div className="mb-6 space-y-3">
          <Label className="text-sm font-medium">Обложка</Label>
          <div
            className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-primary/40 mb-2" />
                <p className="text-sm text-muted-foreground">Обложка по умолчанию</p>
              </div>
            )}
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => coverInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Загрузить обложку
          </Button>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Название <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Например: Гайд по заработку"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="h-12"
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/100 символов
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Описание
            </Label>
            <Textarea
              id="description"
              placeholder="Расскажите покупателям, что они получат..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Price */}
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
                onChange={(e) => setPriceStars(e.target.value)}
                min={1}
                max={10000}
                className="h-12 pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Укажите цену в Telegram Stars (1 звезда ≈ $0.02)
            </p>
          </div>

          {/* Tips Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Совет</p>
                  <p className="text-xs text-muted-foreground">
                    Популярные цены: 50-200 звезд для гайдов, 200-500 для курсов,
                    10-50 для шаблонов и пресетов
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
      </form>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !priceStars}
          className="w-full h-12 text-base"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Создание...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Создать товар
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
