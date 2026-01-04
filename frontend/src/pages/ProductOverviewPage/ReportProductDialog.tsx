import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation} from '@tanstack/react-query';
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
import {Textarea} from '@/components/ui/textarea';
import {createReport} from '@/api/reports';

interface ReportProductDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportProductDialog({
  productId,
  open,
  onOpenChange,
}: ReportProductDialogProps) {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reportMutation = useMutation({
    mutationFn: () => createReport(productId, { description: description.trim() }),
    onSuccess: () => {
      setDescription('');
      setError(null);
      onOpenChange(false);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : t('productOverview.report.error'));
    },
  });

  const handleSubmit = () => {
    if (reportMutation.isPending) return;

    if (!description.trim()) {
      setError(t('productOverview.report.descriptionRequired'));
      return;
    }

    setError(null);
    reportMutation.mutate();
  };

  const handleCancel = () => {
    if (reportMutation.isPending) return;
    setDescription('');
    setError(null);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('productOverview.report.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('productOverview.report.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2">
          <Textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError(null);
            }}
            placeholder={t('productOverview.report.placeholder')}
            disabled={reportMutation.isPending}
            error={!!error}
            rows={4}
          />
          {error && (
            <p className="text-xs text-destructive mt-2">{error}</p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={reportMutation.isPending} onClick={handleCancel}>
            {t('productOverview.report.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleSubmit}
            disabled={reportMutation.isPending || !description.trim()}
          >
            {reportMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t('productOverview.report.submitting')}
              </>
            ) : (
              t('productOverview.report.submit')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
