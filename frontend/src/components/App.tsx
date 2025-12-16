import { useEffect } from 'react';
import { Navigate, Route, Routes, HashRouter, useNavigate } from 'react-router-dom';
import { useLaunchParams } from '@tma.js/sdk-react';

import { pageRoutesConfig } from '@/navigation/routes.tsx';

function StartParamRouter() {
  const navigate = useNavigate();
  const lp = useLaunchParams();

  useEffect(() => {
    const startParam = lp.tgWebAppStartParam;

    if (startParam?.startsWith('p_')) {
      const productId = startParam.slice(2);
      navigate(`/p/${productId}`, { replace: true });
    } else if (startParam?.startsWith('r_')) {
      // r_ prefix means user wants to create a product with uploaded file
      navigate('/products/new', { replace: true });
    }
  }, [lp.tgWebAppStartParam, navigate]);

  return null;
}

export function App() {

  return (
      <HashRouter>
          <StartParamRouter />
          <Routes>
              {pageRoutesConfig.map((route) => <Route key={route.path} {...route} />)}
              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </HashRouter>
  );
}
