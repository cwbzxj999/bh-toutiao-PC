import Vue from 'vue'
import App from './App.vue'
// 引入ElementUI和css文件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router'
import axios from './api'

// 使用封装好的vue插件
import plugin from '@/components'
Vue.use(plugin)
Vue.prototype.$http = axios

// 使用ElementUI
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  // 挂载路由
  router,
  render: h => h(App)
}).$mount('#app')

// main.js入口文件
// 职责：1、创建根实例
// 2、依赖项目需要的全局资源
