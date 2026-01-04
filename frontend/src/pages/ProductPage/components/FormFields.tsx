import {useTranslation} from 'react-i18next';
import {AlertCircle, Star} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Card} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';

export interface FieldErrors {
  title?: string;
  priceStars?: string;
  termsAccepted?: string;
  general?: string;
}

interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  showHints?: boolean;
}

export function TitleField({ value, onChange, error, disabled = false, showHints = true }: TitleFieldProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label htmlFor="title" className="text-sm font-medium">
        {t('formFields.title.label')} {!disabled && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id="title"
        placeholder={t('formFields.title.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={100}
        disabled={disabled}
        error={!!error}
      />
      {showHints && (
        <div className="flex justify-between text-xs">
          {error ? (
            <p className="text-destructive">{error}</p>
          ) : (
            <p className="text-muted-foreground">{t('formFields.title.hint')}</p>
          )}
          <span className="text-muted-foreground">{value.length}/100</span>
        </div>
      )}
    </div>
  );
}

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showHints?: boolean;
}

export function DescriptionField({ value, onChange, disabled = false, showHints = true }: DescriptionFieldProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label htmlFor="description" className="text-sm font-medium">
        {t('formFields.description.label')}
      </Label>
      <Textarea
        id="description"
        placeholder={t('formFields.description.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        disabled={disabled}
      />
      {showHints && (
        <p className="text-xs text-muted-foreground">
          {t('formFields.description.hint')}
        </p>
      )}
    </div>
  );
}

interface BuyButtonTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showHints?: boolean;
}

export function BuyButtonTextField({ value, onChange, disabled = false, showHints = true }: BuyButtonTextFieldProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label htmlFor="buyButtonText" className="text-sm font-medium">
        {t('formFields.buyButtonText.label')}
      </Label>
      <Input
        id="buyButtonText"
        placeholder={t('formFields.buyButtonText.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={30}
        disabled={disabled}
      />
      {showHints && (
        <div className="flex justify-between text-xs">
          <p className="text-muted-foreground">{t('formFields.buyButtonText.hint')}</p>
          <span className="text-muted-foreground">{value.length}/30</span>
        </div>
      )}
    </div>
  );
}

interface PriceFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  showHints?: boolean;
}

export function PriceField({ value, onChange, error, disabled = false, showHints = true }: PriceFieldProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label htmlFor="price" className="text-sm font-medium">
        {t('formFields.price.label')} {!disabled && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Star className="size-5 text-warning fill-warning" />
        </div>
        <Input
          id="price"
          type="number"
          inputMode="numeric"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={1}
          disabled={disabled}
          className="pl-12 pr-24"
          error={!!error}
        />
        {value && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            ≈ ${(parseInt(value, 10) * 0.013).toFixed(2)}
          </span>
        )}
      </div>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : showHints ? (
        <Card className="p-3 bg-muted/50 border-0">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="flex items-center gap-1.5">
              <Star className="size-3.5 text-warning fill-warning" />
              {t('formFields.price.starRate')}
            </p>
            <p>{t('formFields.price.commission')}</p>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

interface GeneralErrorProps {
  error?: string;
}

export function GeneralError({ error }: GeneralErrorProps) {
  if (!error) return null;

  return (
    <Card className="p-4 bg-destructive/5 border-destructive/20">
      <div className="flex gap-3">
        <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    </Card>
  );
}

interface TermsCheckboxFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function TermsCheckboxField({ checked, onChange, error }: TermsCheckboxFieldProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 mb-5">
      <label className="flex items-center gap-3 cursor-pointer">
        <Checkbox
          id="termsAccepted"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          error={!!error}
          className="mt-0.5"
        />
        <span className="text-sm">
          {t('formFields.termsCheckbox.text')}{' '}
          <a
            href={t('formFields.termsCheckbox.linkUrl')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
            onClick={(e) => e.stopPropagation()}
          >
            {t('formFields.termsCheckbox.linkText')}
          </a>
        </span>
      </label>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
