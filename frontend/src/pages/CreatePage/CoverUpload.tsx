import {ImageIcon, Upload} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';

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
      <Label className="text-sm font-medium">Обложка</Label>
      <div
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
        onClick={handleClick}
      >
        {coverPreview ? (
          <img
            src={coverPreview}
            alt="Cover preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <ImageIcon className="w-12 h-12 text-primary/40" />
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
        <Upload className="w-4 h-4" />
        Загрузить обложку
      </Button>
    </div>
  );
}
