import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/toaster'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'
import { storage } from "@/lib/storage";

interface AuthContext {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCashier: boolean;
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
} & AuthContext>()({
  component: RootComponent,
  beforeLoad: ({ location }) => {
    const isAuth = storage.isAuthenticated();
    const isLoginPage = location.pathname === "/sign-in";

    if (!isAuth && !isLoginPage) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})

function RootComponent() {
  return (
    <div>
      <Outlet />
      <Toaster />
      {import.meta.env.MODE === 'development' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </div>
  )
}
