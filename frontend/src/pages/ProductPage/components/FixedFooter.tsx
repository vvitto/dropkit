import { ReactNode } from 'react';

interface FixedFooterProps {
  children: ReactNode;
}

export function FixedFooter({ children }: FixedFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/50 safe-area-bottom">
      {children}
    </div>
  );
}
