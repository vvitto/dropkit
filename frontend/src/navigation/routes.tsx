import type { ComponentType, JSX } from 'react';
import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { CreateProductPage } from '@/pages/CreateProductPage/CreateProductPage';
import { ProductSuccessPage } from '@/pages/ProductSuccessPage/ProductSuccessPage';
import { PaywallPage } from '@/pages/PaywallPage/PaywallPage';
import { ContentPage } from '@/pages/ContentPage/ContentPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  // Seller routes
  { path: '/', Component: IndexPage },
  { path: '/products/new', Component: CreateProductPage },
  { path: '/products/:id/success', Component: ProductSuccessPage },

  // Buyer routes
  { path: '/p/:id', Component: PaywallPage },
  { path: '/p/:id/content', Component: ContentPage },
];
