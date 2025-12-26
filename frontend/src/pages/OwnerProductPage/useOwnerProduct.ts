import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteProduct, getProduct, updateProduct } from '@/api/products';
import type { Product } from '@/types/product';

export interface FormData {
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

interface UseOwnerProductResult {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  formData: FormData;
  errors: FieldErrors;
  coverInputRef: React.RefObject<HTMLInputElement>;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setPriceStars: (value: string) => void;
  handleCoverSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startEditing: () => void;
  cancelEditing: () => void;
  handleSave: () => Promise<void>;
  handleDelete: () => Promise<void>;
}

export function useOwnerProduct(): UseOwnerProductResult {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priceStars: '',
    cover: null,
    coverPreview: null,
  });

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await getProduct(parseInt(id, 10));
        setProduct(data);
        setFormData({
          title: data.title,
          description: data.description || '',
          priceStars: data.price_stars.toString(),
          cover: null,
          coverPreview: data.cover_url || null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Product not found');
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const setTitle = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value }));
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const setDescription = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const setPriceStars = (value: string) => {
    setFormData((prev) => ({ ...prev, priceStars: value }));
    if (errors.priceStars) {
      setErrors((prev) => ({ ...prev, priceStars: undefined }));
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        cover: file,
        coverPreview: URL.createObjectURL(file),
      }));
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setErrors({});
  };

  const cancelEditing = () => {
    if (!product) return;

    setIsEditing(false);
    setErrors({});
    setFormData({
      title: product.title,
      description: product.description || '',
      priceStars: product.price_stars.toString(),
      cover: null,
      coverPreview: product.cover_url || null,
    });
  };

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Введите название товара';
    }

    const price = parseInt(formData.priceStars, 10);
    if (!formData.priceStars || isNaN(price) || price < 1) {
      newErrors.priceStars = 'Минимальная цена — 1 звезда';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!product || isSaving) return;
    if (!validate()) return;

    try {
      setIsSaving(true);
      setErrors({});

      const updatedProduct = await updateProduct(product.id, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        price_stars: parseInt(formData.priceStars, 10),
        cover: formData.cover || undefined,
      });

      setProduct(updatedProduct);
      setFormData((prev) => ({
        ...prev,
        cover: null,
        coverPreview: updatedProduct.cover_url || null,
      }));
      setIsEditing(false);
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Не удалось сохранить изменения',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product || isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteProduct(product.id);
      navigate('/', { replace: true });
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Не удалось удалить товар',
      });
      setIsDeleting(false);
    }
  };

  return {
    product,
    isLoading,
    error,
    isEditing,
    isSaving,
    isDeleting,
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
    handleDelete,
  };
}
