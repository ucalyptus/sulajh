import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  // router-plugin@1.168.18 generates generics that drift from
  // react-router@1.170.15's RouterConstructorOptions; runtime is fine.
  // @ts-expect-error generator/consumer version skew
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
