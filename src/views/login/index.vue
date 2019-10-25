<template>
  <div class="container">
    <!-- 登录卡片 -->
    <el-card class="box-card">
      <!-- logo图片 -->
      <img src="../../assets/logo_index.png" alt />
      <!-- 表单容器 -->
      <el-form ref="form" :model="formData">
        <el-form-item label>
          <el-input v-model="formData.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label>
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
          <el-button type="primary" style="width:100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        mobile: '',
        code: ''
      },
      checked: true
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
