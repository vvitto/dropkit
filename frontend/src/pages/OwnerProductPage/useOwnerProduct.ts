import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priceStars: '',
    cover: null,
    coverPreview: null,
  });

  const { data: product, isLoading, error: queryError } = useQuery({
    queryKey: ['ownerProduct', id],
    queryFn: () => getProduct(parseInt(id!, 10)),
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description || '',
        priceStars: product.price_stars.toString(),
        cover: null,
        coverPreview: product.cover_url || null,
      });
    }
  }, [product]);

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

  const updateMutation = useMutation({
    mutationFn: () =>
      updateProduct(product!.id, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        price_stars: parseInt(formData.priceStars, 10),
        cover: formData.cover || undefined,
      }),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(['ownerProduct', id], updatedProduct);
      setFormData((prev) => ({
        ...prev,
        cover: null,
        coverPreview: updatedProduct.cover_url || null,
      }));
      setIsEditing(false);
    },
    onError: (err) => {
      setErrors({
        general: err instanceof Error ? err.message : 'Не удалось сохранить изменения',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(product!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/', { replace: true });
    },
    onError: (err) => {
      setErrors({
        general: err instanceof Error ? err.message : 'Не удалось удалить товар',
      });
    },
  });

  const handleSave = async () => {
    if (!product || updateMutation.isPending) return;
    if (!validate()) return;
    setErrors({});
    updateMutation.mutate();
  };

  const handleDelete = async () => {
    if (!product || deleteMutation.isPending) return;
    deleteMutation.mutate();
  };

  const error = queryError instanceof Error ? queryError.message : queryError ? 'Product not found' : null;

  return {
    product: product ?? null,
    isLoading,
    error,
    isEditing,
    isSaving: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
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
