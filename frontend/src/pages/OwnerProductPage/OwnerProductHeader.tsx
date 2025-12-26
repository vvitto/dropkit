import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OwnerProductHeaderProps {
  title: string;
  isEditing: boolean;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onDeleteClick: () => void;
}

export function OwnerProductHeader({
  title,
  isEditing,
  onStartEditing,
  onCancelEditing,
  onDeleteClick,
}: OwnerProductHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center gap-3 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold truncate">{title}</h1>
          <p className="text-xs text-muted-foreground">
            {isEditing ? 'Редактирование' : 'Ваш товар'}
          </p>
        </div>
        {isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancelEditing}
            className="shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onDeleteClick}
              className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onStartEditing}
              className="shrink-0"
            >
              <Pencil className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
