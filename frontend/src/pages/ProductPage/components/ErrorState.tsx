import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = 'Product not found' }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gradient-subtle">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="size-8 text-destructive" />
      </div>
      <p className="text-destructive">{message}</p>
    </div>
  );
}
