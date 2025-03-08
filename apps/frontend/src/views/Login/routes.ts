import type { Route } from '../../router'

const routesAuth: Route[] = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    redirect: { name: 'Login' },
    children: [
      {
        name: 'Login',
        path: 'login',
        component: () => import('./Login.vue'),
        meta: {
          public: true,
        },
      },
      {
        name: 'PasswortReset',
        path: 'password-reset',
        component: () => import('./RequestPasswordReset.vue'),
        meta: {
          public: true,
        },
      },
      {
        name: 'PasswortResetToken',
        path: 'password-reset/:token',
        component: () => import('./ResetPassword.vue'),
        meta: {
          public: true,
        },
      },
    ],
  },
]

export default routesAuth
