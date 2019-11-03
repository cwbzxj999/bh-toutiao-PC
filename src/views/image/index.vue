<template>
  <div class="container-image">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 按钮 -->
      <div class="btn_box">
        <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 绿色按钮 -->
        <el-button @click="open" style="float:right" type="success" size="small">添加素材</el-button>
      </div>
      <!-- 素材列表 -->
      <div class="img_list">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="footer" v-if="!reqParams.collect">
            <span
              @click="toggleStatus(item)"
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
            ></span>
            <span @click="deleteImage(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
      <!-- 对话框 -->
      <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
        <el-upload
  class="avatar-uploader"
  action="http://ttapi.research.itcast.cn/mp/v1_0/user/images" :headers="headers" :show-file-list="false" :on-success="handleSuccess" name="image">
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local.js'
export default {
  // 依赖数据
  data () {
    return {
      reqParams: {
        // false全部 true 收藏
        collect: false,
        page: 1,
        per_page: 10
      },
      total: 0,
      // 素材列表
      images: [],
      // 对话框隐藏
      dialogVisible: false,
      // 上传成功后的图片地址
      imageUrl: null,
      // 上传的头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      }
    }
  },
  //   初始化发请求
  created () {
    this.getImages()
  },
  methods: {
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      // 赋值总条数
      this.total = data.total_count
    },
    // 分页功能
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换列表
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 添加收藏与取消收藏
    async toggleStatus (item) {
      // 修改请求
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 成功后 修改样式
      item.is_collected = data.collect
      // 提示
      this.$message.success((data.collect ? '添加收藏' : '取消收藏') + '成功')
    },
    deleteImage (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击了确认
          await this.$http.delete(`user/images/${id}`)
          // 删除成功
          this.$message.success('删除成功')
          // 更新列表
          this.getImages()
        })
        .catch(() => {
          // 点击了取消
        })
    },
    // 图片上传成功后执行的函数
    handleSuccess (res) {
      // res是响应主体，获取图片地址：res.data.url
      // 给imageUrl赋值
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
      window.setTimeout(() => {
        // 关闭对话框，更新列表
        this.dialogVisible = false
        this.getImages()
      }, 2000)
    },
    // 打开对话框,重置上传组件预览图为null
    open () {
      this.dialogVisible = true
      this.imageUrl = null
    }
  }
}
</script>

<style scope lang="less">
.img_list {
  padding-top: 20px;
  .img_item {
    width: 170px;
    height: 150px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.5);
      width: 100%;
      text-align: center;
      color: #fff;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
