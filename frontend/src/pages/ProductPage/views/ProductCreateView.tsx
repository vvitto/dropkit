import {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {shareMessage, useLaunchParams} from '@tma.js/sdk-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Loader2, Sparkles} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {createProduct, createProductShareMessage} from '@/api/products';
import {routes} from '@/navigation/routes';
import {
    BuyButtonTextField,
    CoverUpload,
    DescriptionField,
    type FieldErrors,
    FixedFooter,
    GeneralError,
    PageHeader,
    PriceField,
    TermsCheckboxField,
    TitleField,
} from '../components';
import {SuccessScreen} from './SuccessScreen';
import {NoFileScreen} from './NoFileScreen';

export function ProductCreateView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const launchParams = useLaunchParams();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const startParam = launchParams.tgWebAppStartParam;
  const fileId = startParam?.startsWith('r_') ? startParam.slice(2) : null;

  const [errors, setErrors] = useState<FieldErrors>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buyButtonText, setBuyButtonText] = useState('');
  const [priceStars, setPriceStars] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

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
      if (price && price >= 20) {
        setErrors((prev) => ({ ...prev, priceStars: undefined }));
      }
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
      if (errors.cover) {
        setErrors((prev) => ({ ...prev, cover: undefined }));
      }
    }
  };

  const handleCoverError = (message: string) => {
    setErrors((prev) => ({ ...prev, cover: message }));
  };

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
    if (errors.termsAccepted && checked) {
      setErrors((prev) => ({ ...prev, termsAccepted: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!title.trim()) {
      newErrors.title = t('productPage.validation.titleRequired');
    }

    const price = parseInt(priceStars, 10);
    if (!priceStars) {
      newErrors.priceStars = t('productPage.validation.priceRequired');
    } else if (!price || price < 20) {
      newErrors.priceStars = t('productPage.validation.priceMinimum');
    }

    if (!fileId) {
      newErrors.general = t('productPage.validation.fileNotFound');
    }

    if (!termsAccepted) {
      newErrors.termsAccepted = t('formFields.termsCheckbox.error');
    }

    setErrors(newErrors);

    // Scroll to first error field
    const errorFieldIds: Record<keyof FieldErrors, string> = {
      cover: 'cover',
      title: 'title',
      priceStars: 'price',
      termsAccepted: 'termsAccepted',
      general: 'general-error',
    };

    for (const key of Object.keys(newErrors) as (keyof FieldErrors)[]) {
      const elementId = errorFieldIds[key];
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: () =>
      createProduct({
        title: title.trim(),
        description: description.trim() || undefined,
        price_stars: parseInt(priceStars, 10),
        tg_message_id: fileId!,
        cover: cover || undefined,
        buy_button_text: buyButtonText.trim() || undefined,
        terms_accepted: termsAccepted,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => {
      setErrors({
        general: err instanceof Error ? err.message : t('productPage.validation.createError'),
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
        title={t('productPage.newProduct')}
        subtitle={t('productPage.newProductSubtitle')}
        onBack={handleGoHome}
      />

      <form onSubmit={handleSubmit} className="flex-1 p-4 pb-24 space-y-4">
        <CoverUpload
          coverPreview={coverPreview}
          inputRef={coverInputRef}
          onSelect={handleCoverSelect}
          onError={handleCoverError}
          error={errors.cover}
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

        <BuyButtonTextField
          value={buyButtonText}
          onChange={setBuyButtonText}
        />

        <PriceField
          value={priceStars}
          onChange={handlePriceChange}
          error={errors.priceStars}
        />

        <TermsCheckboxField
          checked={termsAccepted}
          onChange={handleTermsChange}
          error={errors.termsAccepted}
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
              {t('productPage.create.creating')}
            </>
          ) : (
            <>
              <Sparkles className="size-5" />
              {t('productPage.create.createProduct')}
            </>
          )}
        </Button>
      </FixedFooter>
    </div>
  );
}
