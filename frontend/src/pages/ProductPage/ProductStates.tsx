import { useNavigate } from 'react-router-dom';
import { FileImage, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Загрузка...</p>
    </div>
  );
}

interface ProductErrorProps {
  error?: string | null;
}

export function ProductError({ error }: ProductErrorProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileImage className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Товар не найден</h3>
      <p className="text-sm text-muted-foreground mb-6">
        {error || 'Возможно, он был удалён или ссылка неверна'}
      </p>
      <Button variant="outline" onClick={() => navigate('/')}>
        На главную
      </Button>
    </div>
  );
}
