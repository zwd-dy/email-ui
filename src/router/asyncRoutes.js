import Layout from '../components/Layout/Layout'

/**
 * 需要授权访问的路由
 */
const asyncRoutesChildren = [
  {
    path: '/',
    name: 'home',
    meta: {
      roles: ['user', 'admin'],
      title: '主页',
      icon: 'home',
      keepAlive: true
    },
    component: () => import('../pages/home/home.vue')
  },
  // {
  //   path: '/send',
  //   name: 'send',
  //   meta: {
  //     roles: ['user', 'admin'],
  //     title: '写信',
  //     icon: 'send',
  //     keepAlive: true
  //   },
  //   component: () => import('../pages/email/send.vue')
  // },
  {
    path: '/address',
    name: 'address',
    meta: {
      roles: ['user', 'admin'],
      title: '通讯录',
      icon: 'contact_mail',
      keepAlive: true
    },
    component: () => import('../pages/email/address.vue')
  },
  {
    path: '/receive',
    name: 'receive',
    meta: {
      roles: ['user', 'admin'],
      title: '收件箱',
      icon: 'markunread_mailbox',
      keepAlive: true
    },
    component: () => import('../pages/email/receive.vue')
  },
  {
    path: 'async-router',
    name: 'asyncRouter',
    meta: {
      roles: ['admin', 'editor'],
      title: '动态路由',
      icon: 'all_inclusive',
      itemLabel: 'ROUTER',
      keepAlive: true
    },
    component: () => import('pages/router/asyncRouter')
  },
  {
    path: 'async-router-impl',
    name: 'asyncRouterImpl',
    meta: {
      roles: ['admin', 'editor'],
      title: '动态路由实现思路',
      keepAlive: true
    },
    component: () => import('pages/router/asyncRouterImpl')
  },
  {
    path: '/menu-1',
    name: 'menu-1',
    meta: {
      roles: ['admin', 'editor'],
      title: '模块 - 1',
      itemLabel: 'SOME LABEL',
      icon: 'library_music',
      isOpen: true
    },
    component: Layout,
    children: [
      {
        path: 'menu-1-1',
        name: 'menu-1-1',
        meta: {
          roles: ['admin', 'editor'],
          title: '模块 1 - 1',
          icon: 'filter_1'
        },
        component: Layout,
        children: [
          {
            path: 'menu-1-1-1',
            name: 'menu-1-1-1',
            meta: {
              roles: ['admin', 'editor'],
              title: '模块 1 - 1 - 1',
              icon: 'flaky',
              keepAlive: true
            },
            component: () => import('../pages/menu1/menu1')
          }
        ]
      },
      {
        path: 'menu-1-2',
        name: 'menu-1-2',
        meta: {
          roles: ['admin', 'editor'],
          title: '模块 1 - 2',
          icon: 'filter_2',
          keepAlive: true
        },
        component: () => import('../pages/menu1/menu1-2')
      }
    ]
  },
  {
    path: '/menu-2',
    name: 'menu-2',
    meta: {
      roles: ['admin', 'editor'],
      title: '模块 2',
      icon: 'extension'
    },
    component: () => import('../pages/menu2/menu-2-1')
  },
  {
    path: '/menu-3',
    name: 'menu-3',
    meta: {
      roles: ['admin', 'editor'],
      title: '模块 - 3',
      icon: 'filter_3',
      isOpen: true
    },
    component: Layout,
    children: [
      {
        path: 'menu3-1',
        name: 'getting-started',
        meta: {
          roles: ['admin', 'editor'],
          title: '模块 3 - 1',
          icon: 'filter_2',
          isOpen: true
        },
        component: Layout,
        children: [
          {
            path: 'menu3-1-1',
            name: 'menu3-1-1',
            meta: {
              roles: ['admin', 'editor'],
              title: '模块 3 - 1 - 1',
              icon: 'filter_1',
              keepAlive: true
            },
            component: () => import('../pages/menu3/menu3')
          }
        ]
      }
    ]
  },
  {
    path: 'http://www.quasarchs.com/vue-components/button',
    name: 'external-link',
    meta: {
      roles: ['admin', 'editor'],
      title: '外部链接/更多组件',
      icon: 'send'
    }
  },
  {
    path: '/tableDetail',
    name: 'tableDetail',
    meta: {
      roles: ['admin', 'editor'],
      title: 'Treats 详情',
      icon: 'blur_linear',
      isHidden: true
    },
    component: () => import('../pages/home/tableDetail')
  },
  {
    path: '*', // 此处需置于最底部
    redirect: '/NoFound404',
    meta: {
      roles: ['admin', 'test'],
      isHidden: true
    }
  }
]

const asyncRoutes = [
  {
    path: '/',
    name: 'index',
    redirect: '/',
    component: () => import('../layouts/MainLayout'),
    children: asyncRoutesChildren
  }
]

export default asyncRoutes

export { asyncRoutesChildren }
