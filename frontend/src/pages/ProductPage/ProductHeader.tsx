import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductHeader() {
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
        <h1 className="text-lg font-semibold truncate">Товар</h1>
      </div>
    </header>
  );
}
