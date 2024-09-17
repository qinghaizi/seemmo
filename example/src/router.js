/*
 * @Descripttion:
 * @Date: 2019-11-20 10:33:20
 * @LastEditors: tande
 * @LastEditTime: 2019-11-22 09:35:18
 */
import Vue from 'vue'
import Router from 'vue-router'

// import Main from './views/main.vue'

Vue.use(Router)

// 不添加mode为history的话，路由方式是加#，导致不能立刻跳转，后面切成多页面的形式的时候会报错的
let router = new Router({
    mode: 'history',
    routes: [{
            path: '/',
            redirect: '/navgation',
        },
        {
            path: '/navgation',
            name: '导航',
            component: () => import('./views/navgation.vue'),
        },
        {
            path: '/mapXYZ',
            name: 'xyz离线底图',
            component: () => import('./views/mapXYZ.vue')
        },
        {
            path: '/mapXYZstyle',
            name: '切换xyz离线底图',
            component: () => import('./views/mapXYZStyle.vue')
        },
        {
            path: '/mapStyle',
            name: '矢量底图切换样式',
            component: () => import('./views/mapStyle.vue')
        },
        {
            path: '/changelayer',
            name: 'baselayer切换',
            component: () => import('./views/changeBaselayer.vue')
        },
        {
            path: '/map',
            name: '地图',
            component: () => import('./views/map.vue')
        },
        {
            path: '/debug',
            name: '调试',
            component: () => import('./views/debug.vue')
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
            path: '/marker',
            name: '图标',
            component: () => import('./views/marker.vue')
        },
        {
            path: '/short',
            name: '最短路径分析',
            component: () => import('./views/short.vue')
        },
        {
            path: '*',
            name: '404',
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
