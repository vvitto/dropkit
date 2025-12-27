import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <header className="sticky top-0 z-10 glass-subtle border-b border-border/50 safe-area-top">
      <div className="flex items-center gap-3 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft className="size-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold truncate">{title}</h1>
            {isEditing && (
              <Badge variant="warning" size="sm">
                Редактирование
              </Badge>
            )}
          </div>
          {!isEditing && (
            <p className="text-sm text-muted-foreground">Ваш товар</p>
          )}
        </div>

        {isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancelEditing}
            className="shrink-0"
          >
            <X className="size-5" />
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onDeleteClick}
              className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onStartEditing}
              className="shrink-0"
            >
              <Pencil className="size-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
