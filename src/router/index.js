import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  {
    // 我们通常会把根路径'/'作为网站的首页，
    // 因为在我们手动输入网址访问网站的时候，浏览器会自动在后面帮我们加上'/'
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/',
    component: () => import('@/views/layout/Layout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () =>  import('@/views/home/Home.vue')
      },
      {
        path: '/art_con',
        name: 'art_con',
        component: () => import('@/views/art_con/ArticleControl.vue')
      },
      {
        path: '/img_con',
        name: 'img_con',
        component: () => import('@/views/img_con/ImgControl.vue')
      },
      {
        path: '/art_pub',
        name: 'art_pub',
        component: () => import('@/views/art_pub/ArticlePublish.vue')
      },
      {
        path: '/com_con',
        name: 'com_con',
        component: () => import('@/views/com_con/CommentControl.vue')
      },
      {
        path: '/fan_con',
        name: 'fan_con',
        component: () => import('@/views/fan_con/FansControl.vue')
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/settings/Settings.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 添加路由导航守卫
// 注意，在路由导航守卫中，不能通过修改路由属性path或者fullPath的方式来改变页面跳转路径
// 因为这两个属性都是只读的，不可以修改，只能使用next('目标路径')的方式来修改或者使用router.push或replace方法进行修改
router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    // 访问除登录页面的其他页面时，进行判断
    if (store.state.token) {
      next()
    }else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
