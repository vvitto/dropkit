import { ImageIcon, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CoverUploadProps {
  coverPreview: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CoverUpload({ coverPreview, inputRef, onSelect }: CoverUploadProps) {
  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="mb-6 space-y-3">
      <Label className="text-sm font-medium">Обложка товара</Label>
      <div
        className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/30 cursor-pointer hover:border-primary/50 transition-all duration-200 active:scale-[0.99] touch-manipulation group"
        onClick={handleClick}
      >
        {coverPreview ? (
          <>
            <img
              src={coverPreview}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="size-8 text-white drop-shadow-lg" />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ImageIcon className="size-8 text-primary/60" />
            </div>
            <p className="text-sm text-muted-foreground">Нажмите, чтобы загрузить</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClick}
      >
        <Upload className="size-5" />
        {coverPreview ? 'Изменить обложку' : 'Загрузить обложку'}
      </Button>
    </div>
  );
}
