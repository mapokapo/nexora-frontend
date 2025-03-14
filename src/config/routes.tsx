import AppLayout from "@/layouts/app-layout";
import AuthLayout from "@/layouts/auth-layout";
import RootLayout from "@/layouts/root-layout";
import NotFoundPage from "@/pages/not-found-page";
import { Navigate, RouteObject } from "react-router";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/app",
        element: <AppLayout />,
        children: [
          {
            path: "/app/home",
            element: <HomePage />,
          },
        ],
      },
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          {
            path: "/auth/login",
            element: <LoginPage />,
          },
          {
            path: "/auth/register",
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/404",
    element: <NotFoundPage />,
  },
  {
    path: "*",
    element: (
      <Navigate
        to="/404"
        replace
      />
    ),
  },
];
