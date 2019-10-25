// 引入vue-router
import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '../views/login'
// 使用VueRouter
Vue.use(VueRouter)

// 导出Vue实例
export default new VueRouter({
  routes: [{
    path: '/login',
    component: Login
  }]
})
