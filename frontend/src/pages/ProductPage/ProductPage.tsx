import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLaunchParams } from '@tma.js/sdk-react';
import { ProductCreateView, ProductShowView, ProductUpdateView } from './views';

type Mode = 'show' | 'edit';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const launchParams = useLaunchParams();
  const [mode, setMode] = useState<Mode>('show');

  const startParam = launchParams.tgWebAppStartParam;
  const hasFileId = startParam?.startsWith('r_');
  const isCreateMode = !id && hasFileId;

  if (isCreateMode) {
    return <ProductCreateView />;
  }

  if (mode === 'edit') {
    return (
      <ProductUpdateView
        onCancel={() => setMode('show')}
        onSuccess={() => setMode('show')}
      />
    );
  }

  return <ProductShowView onEdit={() => setMode('edit')} />;
}
