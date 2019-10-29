<template>
  <div class="container">
    <!-- 登录卡片 -->
    <el-card class="box-card">
      <!-- logo图片 -->
      <img src="../../assets/logo_index.png" alt />
      <!-- 表单容器 -->
      <!-- 给el-form组件添加属性:rules，是一系列校验规则，为数组对象 -->
      <el-form ref="loginForm" :model="formData" :rules="loginRules">
        <!-- 给el-form-item组件添加属性prop，是需要校验的字段名称 -->
        <el-form-item label prop="mobile">
          <el-input v-model="formData.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <!-- 给el-form-item组件添加属性prop，是需要校验的字段名称 -->
        <el-form-item label prop="code">
          <el-input
            v-model="formData.code"
            placeholder="请输入验证码"
            style="width:290px;margin-right:10px"
          ></el-input>
          <el-button style="width:110px">发送验证码</el-button>
        </el-form-item>
        <el-form-item label>
          <el-checkbox v-model="checked">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    const checkMobile = (rule, value, callback) => {
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('手机号格式不正确！'))
      }
    }
    return {
      formData: {
        mobile: '15688136790',
        code: '246810'
      },
      checked: true,
      // loginRules为：rules定义的校验规则
      loginRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 登录，整体校验
    login () {
      // 获取表单组件实例---->调用校验函数validate
      this.$refs['loginForm'].validate(async valid => {
        if (valid) {
          // // 发送请求，校验手机号和验证码，后台操作
          // this.$http({
          //   url: 'authorizations',
          //   method: 'post',
          //   data: this.formData
          // })
          //   .then(res => {
          //     // 成功
          //     // 保存用户信息（token）
          //     local.setUser(res.data.data)
          //     this.$router.push('/')
          //   })
          //   .catch(() => {
          //     this.$message.error('手机号或验证码错误')
          //   })

          // 使用async和await改造登录的请求
          // 当一段代码不能保证一定没有报错try{} catch(e){} 捕获异常处理异常
          try {
            const { data: { data } } = await this.$http.post('authorizations', this.formData)
            local.setUser(data)
            this.$router.push('/')
          } catch (e) {
            this.$message.error('手机号或验证码错误')
          }
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: url("../../assets/login_bg.jpg") no-repeat center/cover;
}
.box-card {
  width: 450px;
  height: 350px;
  // text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 200px;
    display: block;
    margin: 0 auto 30px;
  }
}
</style>
