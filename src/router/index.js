// 引入vue-router
import VueRouter from 'vue-router'
import Vue from 'vue'
import local from '../utils/local'

import Login from '../views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import NotFound from '@/views/404'
import Article from '@/views/article'
import Image from '@/views/image'
import Publish from '@/views/publish'
import Comment from '@/views/comment'
import Setting from '@/views/setting'

// 使用VueRouter
Vue.use(VueRouter)

// 导出Vue实例
const router = new VueRouter({
  routes: [{
    path: '/',
    component: Home,
    children: [{
      path: '/',
      component: Welcome
    },
    {
      path: '/article',
      component: Article
    },
    {
      path: '/image',
      component: Image
    },
    {
      path: '/publish',
      component: Publish
    },
    {
      path: '/comment',
      component: Comment
    },
    {
      path: '/setting',
      component: Setting
    }]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '*',
    component: NotFound
  }
  ]
})
// 添加路由的导航守卫（前置导航守卫）
router.beforeEach((to, from, next) => {
  // 当每次跳转路由前触发
  // to 跳转到目标  路由对象
  // from 从哪里跳转过来  路由对象
  // next 下一步方法  next()放行 next('/login')拦截
  const user = local.getUser()
  if (user && user.token) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
