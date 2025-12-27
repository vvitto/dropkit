import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {TonConnectUIProvider} from '@tonconnect/ui-react';
import {App} from '@/components/App.tsx';
import {ErrorBoundary} from '@/components/ErrorBoundary.tsx';
import {AuthProvider} from '@/context/AuthContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
    },
  },
});

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <QueryClientProvider client={queryClient}>
        <TonConnectUIProvider manifestUrl={`${window.location.origin}/latest/tonconnect-manifest.json`}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </TonConnectUIProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
