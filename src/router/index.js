import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/',
    name: 'layout',
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

export default router
