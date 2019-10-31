<template>
  <div class="container-article">
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
       <el-select v-model="reqParams.channel_id" placeholder="请选择" clearable>
    <el-option
      v-for="item in channelLoptions"
      :key="item.id"
      :label="item.name"
      :value="item.id">
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
      end-placeholder="结束日期"
      @change="changeDate"
      value-format="yyyy-MM-dd">
    </el-date-picker>
     </el-form-item>
     <el-form-item>
       <el-button type="primary" @click="search">筛选</el-button>
     </el-form-item>
   </el-form>
</el-card>
  <!-- 筛选结果表格 -->
  <el-card style="margin-top:20px">
     <div slot="header">
       <!-- 总条数显示 -->
    <span>根据筛选条件共查询到 {{total}} 条结果</span>
    </div>
    <!-- 列表渲染 :data   prop -->
    <el-table :data="articles">
      <el-table-column label="封面" prop="cover.images[0]">
        <template slot-scope="scope">
          <el-image style="width: 150px; height: 100px" :src="scope.row.cover.images[0]" fit="fill">
          <div slot="error">
            <img src="../../assets/error.gif" alt="" width="150" height="100">
          </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status===0">草稿</el-tag>
          <el-tag type="primary" v-if="scope.row.status===1">待审核</el-tag>
          <el-tag type="success" v-if="scope.row.status===2">审核通过</el-tag>
          <el-tag type="warning" v-if="scope.row.status===3">审核失败</el-tag>
          <el-tag type="danger" v-if="scope.row.status===4">已删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布" prop="pubdate"></el-table-column>
      <el-table-column label="操作" width='120px'>
        <template slot-scope="scope">
            <el-button @click="toEdit(scope.row.id)" type="primary" icon="el-icon-edit" circle plain>
            </el-button>
           <el-button type="danger" icon="el-icon-delete" circle plain @click="del(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- total是总条数 -->
    <!-- page-size 默认显示10条每页 -->
    <!-- current-page 动态激活当前页码对应的按钮 -->
    <!-- current-change 事件：当页码改变（点击页码按钮，上一页，下一页）就执行参数当前改变后的页码 -->
    <el-pagination style="margin-top:20px" background layout="prev, pager, next" :total="total" :page-size="reqParams.per_page" :current-page="reqParams.page" @current-change="pager">
    </el-pagination>
  </el-card>
 </div>
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
        end_pubdata: null,
        page: 1,
        per_page: 20
      },
      // 频道选项数据
      channelLoptions: [{ value: 1, label: 'java' }, { value: 2, label: '前端' }],
      // 日期数组
      dateArr: [],
      articles: [],
      total: 0
    }
  },
  created () {
    // 获取频道数据函数
    this.getChannelOptions()
    // 获取文章列表数据
    this.getArticles()
  },
  methods: {
    // 获取频道选项数据
    async getChannelOptions () {
      const { data: { data } } = await this.$http.get('channels')
      // 赋值给频道下拉选项依赖数据
      this.channelLoptions = data.channels
    },
    // 获取文章列表数据
    async getArticles () {
      // 第一种：axios.get(url?key=value&key1=value1&...)
      // 第二种：axios.get(url,{params:参数对象})
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      // 赋值给文章列表依赖数据
      this.articles = data.results
      // 赋值文章总条数依赖数据
      this.total = data.total_count
    },
    // 分页功能
    pager (newPage) {
      // 根据新的页码和当前筛选条件 重新查询数据
      this.reqParams.page = newPage
      this.getArticles()
    },
    // 筛选查询
    search () {
      // 准备日期数据
      // 进行数据获取
      // 如果频道的值''时候，修改为null
      if (this.reqParams.channel_id === '') this.reqParams.channel_id = null
      // 回到第一页
      this.reqParams.page = 1
      this.getArticles()
    },
    // 日期改变触发的事件函数
    changeDate (dateArr) {
      // dateArr的数据格式：[date,date]
      // 后端需要的是字符串 dateArr的数据格式为：[string,string]
      // 注意：清除选择的日期后，dateArr的值应为null
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    // 编辑
    toEdit (id) {
      // this.$router.push('publish?id='+id)
      this.$router.push({ path: '/publish', query: { id } })
    },
    // 删除
    async del (id) {
      // 发送请求
      await this.$http.delete(`articles/${id}`)
      // 提示信息
      this.$message.success('删除文章成功！')
      // 更新列表
      this.getArticles()
    }
  }
}
</script>

<style scoped lang="less">

</style>
