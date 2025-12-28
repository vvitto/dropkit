import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLaunchParams, shareMessage } from '@tma.js/sdk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createProduct, createProductShareMessage } from '@/api/products';
import { routes } from '@/navigation/routes';
import {
  PageHeader,
  FixedFooter,
  CoverUpload,
  TitleField,
  DescriptionField,
  PriceField,
  GeneralError,
  type FieldErrors,
} from '../components';
import { SuccessScreen } from './SuccessScreen';
import { NoFileScreen } from './NoFileScreen';

export function ProductCreateView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const launchParams = useLaunchParams();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const startParam = launchParams.tgWebAppStartParam;
  const fileId = startParam?.startsWith('r_') ? startParam.slice(2) : null;

  const [errors, setErrors] = useState<FieldErrors>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceStars, setPriceStars] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

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
      newErrors.title = 'Введите название товара';
    }

    const price = parseInt(priceStars, 10);
    if (!priceStars) {
      newErrors.priceStars = 'Укажите цену';
    } else if (!price || price < 1) {
      newErrors.priceStars = 'Минимальная цена — 1 звезда';
    }

    if (!fileId) {
      newErrors.general = 'Файл не найден. Попробуйте отправить файл боту заново';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: () =>
      createProduct({
        title: title.trim(),
        description: description.trim() || undefined,
        price_stars: parseInt(priceStars, 10),
        tg_file_id: fileId!,
        cover: cover || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => {
      setErrors({
        general: err instanceof Error ? err.message : 'Ошибка при создании товара',
      });
    },
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;
    setErrors({});
    createMutation.mutate();
  };

  const handleShare = async () => {
    if (!createMutation.data) return;
    const { message_id } = await createProductShareMessage(createMutation.data.id);
    await shareMessage(message_id);
  };

  const handleGoHome = () => {
    navigate(routes.root);
  };

  if (createMutation.data) {
    return (
      <SuccessScreen
        product={createMutation.data}
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
        onBack={handleGoHome}
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
          disabled={createMutation.isPending}
          className="w-full shadow-lg"
          size="lg"
        >
          {createMutation.isPending ? (
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
      </FixedFooter>
    </div>
  );
}
