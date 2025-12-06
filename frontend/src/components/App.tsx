import { useEffect } from 'react';
import { Navigate, Route, Routes, HashRouter, useNavigate, useLocation } from 'react-router-dom';
import { useLaunchParams, useSignal, miniApp } from '@tma.js/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import { routes } from '@/navigation/routes.tsx';

function StartParamRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const lp = useLaunchParams();

  console.log(location.pathname)

  useEffect(() => {
    //   console.log(location.pathname, location.hash);
    //
    // // Only process on initial load (root path)
    // if (location.pathname !== '/' || location.hash !== '#/') {
    //     console.log(1);
    //   return;
    // }

    const startParam = lp.tgWebAppStartParam;

    if (startParam?.startsWith('p_')) {
      console.log(2);
      const productId = startParam.slice(2);
      navigate(`/p/${productId}`, { replace: true });
    }
  }, []);

  return null;
}

export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <HashRouter>
        <StartParamRouter />
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AppRoot>
  );
}
