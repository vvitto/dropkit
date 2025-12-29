import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Loader2} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {deleteProduct} from '@/api/products';

interface DeleteProductDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DeleteProductDialog({
  productId,
  open,
  onOpenChange,
  onSuccess,
  onCancel,
}: DeleteProductDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess();
      navigate('/', { replace: true });
    },
  });

  const handleConfirm = () => {
    if (deleteMutation.isPending) return;
    deleteMutation.mutate();
  };

  const handleCancel = () => {
    if (deleteMutation.isPending) return;
    onCancel();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('productPage.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('productPage.delete.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending} onClick={handleCancel}>
            {t('productPage.delete.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t('productPage.delete.deleting')}
              </>
            ) : (
              t('productPage.delete.delete')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
