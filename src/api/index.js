// 导入axios
import axios from 'axios'
import local from '@/utils/local'
import router from '../router'
import JSONBIG from 'json-bigint'

// 对axios进行配置
// 基准地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 把大的id转换成json时，防止有误差，可以使用json-bigInt插件
axios.defaults.transformResponse = [(data) => {
  // 对data进行格式转换，data就是后台响应的json字符串
  // 若没有数据 data === null  使用JSONBIG.parse(null)会报错
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]
// 设置axios默认的请求头
// if (local.getUser()) {
//   axios.defaults.headers.Authorization = `Bearer ${local.getUser().token}`
// }

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 拦截成功，往headers中加token
  const user = local.getUser() || {}
  config.headers.Authorization = `Bearer ${user.token}`
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(res => res, error => {
  // 对响应错误做点什么
//   获取响应状态码 err.response 响应对象  err.response.status 状态码
  if (error.response.status === 401) {
    // 如果是401跳转登录
    // 麻烦 window.location.href = 'http://localhost:8080/#/login'
    // 不推荐 window.location.hash = '#/login'
    // 使用vue-router进行跳转
    return router.push('/login')
  }
  return Promise.reject(error)
})

// 导出
export default axios
