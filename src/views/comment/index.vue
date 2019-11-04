<template>
  <div class="container-comment">
    <el-card>
      <!-- 头部面包屑 -->
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="标题" prop="title" width="400"></el-table-column>
        <el-table-column label="总评论" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
             <el-button @click="toggleStatus(scope.row.id,false)" v-if="scope.row.comment_status" type="danger" size="small">关闭评论</el-button>
            <el-button @click="toggleStatus(scope.row.id,true)" v-else type="success" size="small">打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articles: [],
      reqParams: {
        response_type: 'comment',
        page: 1,
        per_page: 20
      },
      total: 0
    }
  },
  created () {
    this.getArticles()
  },
  methods: {
    async getArticles () {
      // api文档里文章列表包含评论相关信息
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      // 渲染
      this.articles = data.results
      // 总条数
      this.total = data.total_count
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getArticles()
    },
    // 切换打开和关闭
    toggleStatus (id, status) {
      const text = status ? '您确定要打开评论嘛？' : '您确定要关闭评论嘛，如果关闭用户无法对该文章进行评论哟~'
      this.$confirm(text, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 确认时候
        const { data: { data } } = await this.$http.put(`comments/status?article_id=${id}`, {
          allow_comment: status
        })
        // 提示
        this.$message.success(data.allow_comment ? '打开评论成功' : '关闭评论成功')
        // 更新当前列表
        this.getArticles()
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="less">

</style>
