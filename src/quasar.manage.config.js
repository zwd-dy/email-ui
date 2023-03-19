import Vue from 'vue'

Vue.config.productionTip = false

Vue.prototype.$PUBLIC_PATH = process.env.VUE_ROUTER_BASE

// 浏览器 title
Vue.prototype.$title = ' | Vue Quasar'

// 侧边栏风格
Vue.prototype.$SildeBar = 'hHh lpR fFf' // 风格二：lHh lpR fFf

// axios 中请求基地址，如果需要请在 axios/axios-config.js 中打开，下面是跨域代理示例
// Vue.prototype.$baseURL = process.env.NODE_ENV === 'development' ? '/api/' : '生产环境 API'
Vue.prototype.$baseURL = 'http://127.0.0.1:8080/'

// 请求超时时间
Vue.prototype.$timeOut = 8000

// 组件最大缓存数
Vue.prototype.$Max_KeepAlive = 10


// 侧边栏底部文字
Vue.prototype.$buttonList = [
  // { text: 'Quasar', URL: 'http://www.quasarchs.com/' },
  // { text: 'Github', URL: 'https://github.com/972784674t/quasar-manage' },
  // { text: 'Gitee', URL: 'https://gitee.com/incimo/quasar-manage' },
  // { text: 'GreaterWMS', URL: 'https://github.com/Singosgu/GreaterWMS' },
  // { text: '关于作者', URL: '/cimo' }
]
