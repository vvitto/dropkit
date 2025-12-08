import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/IndexPage';
import {CreatePage} from "@/pages/CreatePage";

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes = {
    root: '/',
    createProduct: '/products/new',
}

export const pageRoutesConfig: Route[] = [
  { path: routes.root, Component: IndexPage, title: 'My Products' },
    {
        path: routes.createProduct,
        Component: CreatePage,
        title: 'Create product',
    }
];
