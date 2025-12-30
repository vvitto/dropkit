import {useTranslation} from 'react-i18next';
import {Camera, Upload} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';

interface CoverUploadProps {
  coverPreview: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function CoverUpload({ coverPreview, inputRef, onSelect, disabled = false }: CoverUploadProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const isEditable = !disabled;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{t('formFields.cover.label')}</Label>
      <div
        className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed transition-all duration-200 group ${
          isEditable
            ? 'cursor-pointer border-primary/30 hover:border-primary/50 active:scale-[0.99]'
            : 'border-border/30'
        }`}
        onClick={handleClick}
      >
        {coverPreview ? (
          <>
            <img
              src={coverPreview}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
            {isEditable && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="size-8 text-white drop-shadow-lg" />
                </div>
              </div>
            )}
          </>
        ) : (
          <img src='/img-placeholder.webp' />
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onSelect}
        className="hidden"
        disabled={disabled}
      />
      {isEditable && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleClick}
        >
          <Upload className="size-5" />
          {coverPreview ? t('formFields.cover.changeCover') : t('formFields.cover.uploadCover')}
        </Button>
      )}
    </div>
  );
}
