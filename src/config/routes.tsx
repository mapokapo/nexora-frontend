import AuthLayout from "@/layouts/auth-layout";
import NoProfileGuardLayout from "@/layouts/no-profile-guard-layout";
import ProfileGuardLayout from "@/layouts/profile-guard-layout";
import RootLayout from "@/layouts/root-layout";
import UserGuardLayout from "@/layouts/user-guard-layout";
import HomePage from "@/pages/app/home-page";
import LoginPage from "@/pages/auth/login-page";
import RegisterPage from "@/pages/auth/register-page";
import CreateProfilePage from "@/pages/create-profile-page";
import NotFoundPage from "@/pages/not-found-page";
import { Navigate, RouteObject } from "react-router";

/**
 * Explanation of routing configuration:
 *
 * - `RootLayout` - The root layout of the application. Contains global components like the toaster, or for example a theme and settings provider.
 * - `UserGuardLayout` - A layout that checks if the user is authenticated. If not, it redirects them to the login page, otherwise it renders the children.
 * - `NoProfileGuardLayout` - A layout that checks if the user DOESN'T have a profile. If they do, it redirects them to the home page, otherwise it renders the children. This is used for onboarding flows immediately after a user registers themselves (eg. "user unauthenticated" -> <SHOW LOGIN/REGISTER PAGE> -> "user logged in, but doesn't have a profile" -> <SHOW CREATE PROFILE SCREEN> -> "user is both logged in and has a profile" -> <SHOW HOME PAGE>).
 * - `ProfileGuardLayout` - A layout that checks if the user has a profile. If they don't, it redirects to the "create profile" page, otherwise it renders the children.
 *
 * Additionally, the hooks provided in `@/lib/context` (`useUser`, `useProfile`) depend on these guards, which also function as fetchers:
 * - `useUser` - returns a potentially null user. This hook can be used anywhere within the `UserProvider`, no matter if the user is actually logged in. The `UserProvider` is a top-level provider defined in `RootLayout`, so this means `useUser` will be available everywhere.
 * - `useAppUser` - returns a non-null user, provided the user is authenticated. If not, it will throw an error. This is a convenience hook for when you're sure the user is authenticated.
 * - `useProfile` - returns a potentially null profile. Similar to `useUser`, but it depends on the `ProfileGuardLayout` to be available, which isn't a top-level provider. If used outside the `ProfileGuardLayout` (eg. in a top-level page like the 404 page or a landing page), it will throw an error. This is useful for when you're sure the user is authenticated, but you're not sure if they have a profile, like in onboarding flows.
 * - `useAppProfile` - returns a non-null profile, provided the user has a profile, otherwise throws an error. Similarly to `useAppUser`, this is a convenience hook for when you're sure the user has a profile.
 *
 * There are also some miscellaneous routes:
 * - `/404` - The top-level 404 page.
 * - `*` - A catch-all route that redirects to the 404 page. This prevents the default `react-router` 404 error page displaying.
 * - multiple "" routes - These are used to redirect the user to a "default" page in a route group. For example, if the user goes to `/`, they will be redirected to `/app/home`, or if the user goes to `/auth`, they will be redirected to `/auth/login`. This is to prevent users from being stuck in intermediary routes like `/auth` or `/app`.
 */
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <UserGuardLayout />,
        children: [
          {
            path: "/create-profile",
            element: <NoProfileGuardLayout />,
            children: [
              {
                path: "",
                element: <CreateProfilePage />,
              },
            ],
          },
          {
            path: "/app",
            element: <ProfileGuardLayout />,
            children: [
              {
                path: "/app/home",
                element: <HomePage />,
              },
              {
                path: "",
                element: (
                  <Navigate
                    to="/app/home"
                    replace
                  />
                ),
              },
            ],
          },
          {
            path: "",
            element: (
              <Navigate
                to="/app"
                replace
              />
            ),
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
          {
            path: "",
            element: (
              <Navigate
                to="/auth/login"
                replace
              />
            ),
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
