// 进行vue-cli配置
// vue-cli配置实现部分webpack的配置
module.exports = {
  // 覆盖webpack的配置选项
  configureWebpack: {
    externals: {
      // key包名 value暴露全局的变量名
      echarts: 'echarts'
    }
  }
}
