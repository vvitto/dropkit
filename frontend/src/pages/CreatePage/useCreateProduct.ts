import {useRef, useState} from 'react';
import {useLaunchParams} from '@tma.js/sdk-react';
import {createProduct} from '@/api/products';
import type {Product} from '@/types/product';

export interface ProductFormData {
  title: string;
  description: string;
  priceStars: string;
  cover: File | null;
  coverPreview: string | null;
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
  error: string | null;
  createdProduct: Product | null;
  fileId: string | null;
  isFormValid: boolean;
}

export function useCreateProduct(): UseCreateProductReturn {
  const launchParams = useLaunchParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceStars, setPriceStars] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);

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

  const isFormValid = Boolean(title.trim() && priceStars);

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
    isSubmitting,
    error,
    createdProduct,
    fileId,
    isFormValid,
  };
}
