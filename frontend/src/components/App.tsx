import {type ComponentType, type JSX, useEffect} from 'react';
import {HashRouter, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import {useLaunchParams} from '@tma.js/sdk-react';

import {routes} from '@/navigation/routes.tsx';
import {IndexPage} from "@/pages/IndexPage";
import {CreatePage} from "@/pages/CreatePage";
import {ProductPage} from "@/pages/ProductPage";
import {IncomePage} from "@/pages/IncomePage";

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
  }, [lp.tgWebAppStartParam]);

  return null;
}

interface RoutePath {
    path: string;
    Component: ComponentType;
    title?: string;
    icon?: JSX.Element;
    index?: boolean;
}

export const pageRoutesConfig: RoutePath[] = [
    { path: routes.root, Component: IndexPage, title: 'My Products'},
    { path: routes.income, Component: IncomePage, title: 'Income' },
    { path: routes.createProduct, Component: CreatePage, title: 'Create product' },
    { path: routes.product, Component: ProductPage, title: 'Product' },
];

export function App() {
  return (
      <HashRouter>
          <Routes>
              {pageRoutesConfig.map((route) => <Route key={route.path} {...route} />)}
              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <StartParamRouter />
      </HashRouter>
  );
}
