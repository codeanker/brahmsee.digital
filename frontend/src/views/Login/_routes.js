export default [
  {
    name: 'Login',
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ './Login.vue'),
  },
]
