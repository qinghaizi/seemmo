import Vue from 'vue'
import Router from 'vue-router'

// import Main from './views/main.vue'

Vue.use(Router)

// 不添加mode为history的话，路由方式是加#，导致不能立刻跳转，后面切成多页面的形式的时候会报错的
let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/navgation',
    },
    {
      path: '/navgation',
      name: '导航',
      component: () => import('./views/navgation.vue'),
    },
    {
      path: '/map',
      name: '地图',
      component: () => import('./views/map.vue')
    },
    {
      path: '/gate',
      name: '卡口',
      component: () => import('./views/gate.vue')
    },
    {
      path: '/seeLayer',
      name: '要素',
      component: () => import('./views/seeLayer.vue')
    },
    {
      path: '/draw',
      name: '绘制交互',
      component: () => import('./views/draw.vue')
    },
    {
      path: '/pop',
      name: '弹出框',
      component: () => import('./views/pop.vue')
    },
    {
      path: '/short',
      name: '最短路径分析',
      component: () => import('./views/short.vue')
    },
    {
      path: '*',
      name: '404notFound',
      component: () => import('./components/404.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.name) {
    document.title = to.name
  }
  next()
})

export default router
