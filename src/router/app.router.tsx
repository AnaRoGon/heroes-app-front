import { createHashRouter, Navigate } from "react-router";
import { AdminLayout } from "@/admin/layouts/AdminLayout";
import { HeroesLayout } from "@/heroes/layouts/HeroesLayout";
import { HeroPage } from "@/heroes/pages/hero/HeroPage";
import { HomePage } from "@/heroes/pages/hero/home/HomePage";
import { lazy } from "react";

const AdminPage = lazy(() => import('@/admin/pages/AdminPage')); //lazy load
const SearchPage = lazy(() => import('@/heroes/pages/search/SearchPage'));

export const appRouter = createHashRouter([
    {
        path: '/',
        element: <HeroesLayout />,
        children: [
            // Rutas hijas
            {
                index: true,
                element: <HomePage />
            },

            {
                path: 'heroes/:idSlug',
                element: <HeroPage />
            },

            {
                path: 'search',
                element: <SearchPage />
            },

            {
                path: '*',
                element: <Navigate to='/' />
            },

        ],

    },

    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <AdminPage />
            }
        ],
    },

]); 