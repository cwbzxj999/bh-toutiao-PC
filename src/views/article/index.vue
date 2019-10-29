<template>
<!-- 筛选条件布局 -->
  <el-card>
  <div slot="header">
    <!-- 面包屑导航 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>内容管理</el-breadcrumb-item>
</el-breadcrumb> -->
  <!-- 使用封装好的面包屑组件 -->
  <my-bread>内容管理</my-bread>
  </div>
   <el-form label-width="80px" size="small">
     <el-form-item label="状态">
        <el-radio-group v-model="reqParams.status">
        <el-radio :label="null">全部</el-radio>
        <el-radio :label="0">草稿</el-radio>
        <el-radio :label="1">待审核</el-radio>
        <el-radio :label="2">审核通过</el-radio>
        <el-radio :label="3">审核失败</el-radio>
        <el-radio :label="4">已删除</el-radio>
        </el-radio-group>
     </el-form-item>
     <el-form-item label="频道">
       <el-select v-model="reqParams.channel_id" placeholder="请选择">
    <el-option
      v-for="item in channelLoptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
     </el-form-item>
     <el-form-item label="日期">
       <!-- v-model绑定的数组[起始时间，结束时间] -->
    <el-date-picker
      v-model="dateArr"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
     </el-form-item>
     <el-form-item>
       <el-button type="primary">筛选</el-button>
     </el-form-item>
   </el-form>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      // 筛选参数
      // 使用axios提交数据时候，如果数据的值为null时不会提交该字段
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdata: null
      },
      // 频道选项数据
      channelLoptions: [{ value: 1, label: 'java' }, { value: 2, label: '前端' }],
      // 日期数组
      dateArr: []
    }
  }
}
</script>

<style scoped lang="less">

</style>
