/**
 * constantRoutes : Users do not need to log in to access
 */
const constantRoutes = [
  {
    path: '/login',
    name: 'logon',
    meta: {
      title: '登录'
    },
    component: () => import('../pages/logon/login.vue')
  },
  {
    path: '/NoFound404',
    name: 'NoFound404',
    meta: {
      roles: ['admin', 'editor'],
      title: '404',
      icon: 'sentiment_dissatisfied',
      isHidden: true
    },
    component: () => import('../components/404/NoFound404')
  }
]

export default constantRoutes
