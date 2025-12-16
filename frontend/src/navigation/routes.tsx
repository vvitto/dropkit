import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/IndexPage';
import { CreatePage } from '@/pages/CreatePage';
import { ProductPage } from '@/pages/ProductPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes = {
  root: '/',
  createProduct: '/products/new',
  product: '/p/:id',
};

export const pageRoutesConfig: Route[] = [
  { path: routes.root, Component: IndexPage, title: 'My Products' },
  { path: routes.createProduct, Component: CreatePage, title: 'Create product' },
  { path: routes.product, Component: ProductPage, title: 'Product' },
];
