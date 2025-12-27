import {useRef, useState} from 'react';
import {useLaunchParams} from '@tma.js/sdk-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createProduct} from '@/api/products';
import type {Product} from '@/types/product';

export interface ProductFormData {
  title: string;
  description: string;
  priceStars: string;
  cover: File | null;
  coverPreview: string | null;
}

export interface FieldErrors {
  title?: string;
  priceStars?: string;
  general?: string;
}

export interface UseCreateProductReturn {
  formData: ProductFormData;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setPriceStars: (value: string) => void;
  coverInputRef: React.RefObject<HTMLInputElement>;
  handleCoverSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  errors: FieldErrors;
  createdProduct: Product | null;
  fileId: string | null;
}

export function useCreateProduct(): UseCreateProductReturn {
  const launchParams = useLaunchParams();
  const queryClient = useQueryClient();

  const [title, setTitleState] = useState('');
  const [description, setDescription] = useState('');
  const [priceStars, setPriceStarsState] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const coverInputRef = useRef<HTMLInputElement>(null);

  const startParam = launchParams.tgWebAppStartParam;
  const fileId = startParam?.startsWith('r_') ? startParam.slice(2) : null;

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

  const setTitle = (value: string) => {
    setTitleState(value);
    if (errors.title && value.trim()) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const setPriceStars = (value: string) => {
    setPriceStarsState(value);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setErrors({});
    createMutation.mutate();
  };

  return {
    formData: {
      title,
      description,
      priceStars,
      cover,
      coverPreview,
    },
    setTitle,
    setDescription,
    setPriceStars,
    coverInputRef,
    handleCoverSelect,
    handleSubmit,
    isSubmitting: createMutation.isPending,
    errors,
    createdProduct: createMutation.data ?? null,
    fileId,
  };
}
