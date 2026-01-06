import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      position="top-center"
      toastOptions={{
        classNames: {
          toast: 'bg-background text-foreground border-border shadow-lg',
          error: 'bg-destructive text-destructive-foreground border-destructive',
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
