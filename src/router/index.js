// 引入vue-router
import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '../views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import NotFound from '@/views/404'
// 使用VueRouter
Vue.use(VueRouter)

// 导出Vue实例
export default new VueRouter({
  routes: [{
    path: '/',
    component: Home,
    children: [{
      path: '/',
      component: Welcome
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
