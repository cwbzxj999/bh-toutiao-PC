<template>
  <div class="container-publish">
      <el-card>
          <!-- 头部 -->
          <div slot="header">
              <my-bread>{{$route.query.id?'修改':'发布'}}文章</my-bread>
          </div>
          <!-- 表单 -->
          <el-form label-width="120px">
              <el-form-item label="标题：">
                  <el-input v-model="articleForm.title" style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="内容：">
                  <quill-editor v-model="articleForm.content"
                    :options="editorOption">
                </quill-editor>
              </el-form-item>
               <el-form-item label="封面：">
                  <el-radio-group v-model="articleForm.cover.type" @change="articleForm.cover.images=[]">
                    <el-radio :label="1">单图</el-radio>
                    <el-radio :label="3">三图</el-radio>
                    <el-radio :label="0">无图</el-radio>
                    <el-radio :label="-1">自动</el-radio>
                </el-radio-group>
                <!-- 封装的封面图组件 -->
                <div v-if="articleForm.cover.type===1">
                  <!-- 组件绑定v-model指令 -->
                    <my-image v-model="articleForm.cover.images[0]"></my-image>
                </div>
                <div v-if="articleForm.cover.type===3">
                    <my-image v-for="index in 3" :key="index" v-model="articleForm.cover.images[index-1]"></my-image>
                </div>
              </el-form-item>
               <el-form-item label="频道：">
                  <my-channel v-model="articleForm.channel_id"></my-channel>
              </el-form-item>
              <!-- 如果id存在就为修改 -->
              <el-form-item v-if="$route.query.id">
                  <el-button type="success" @click="update(false)">修改</el-button>
                  <el-button @click="update(true)">存入草稿</el-button>
              </el-form-item>
              <!-- 否则就是发表 -->
              <el-form-item v-else>
                  <el-button type="primary" @click="create(false)">发表</el-button>
                  <el-button @click="create(true)">存入草稿</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: null,
        cover: {
          type: 1,
          images: []
        },
        channel_id: null,
        content: null
      },
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  methods: {
    // 点击发表和存入草稿函数
    async create (draft) {
      await this.$http.post(`articles?draft=${draft}`, this.articleForm)
      // 提示信息
      this.$message.success(draft ? '存入草稿成功' : '发表成功')
      // 跳转到内容管理页面
      this.$router.push('/article')
    },
    // 获取指定id文章信息
    async getArticle (id) {
      const { data: { data } } = await this.$http.get('articles/' + id)
      // 表单填充，面包屑文字，按钮文字
      this.articleForm = data
    },
    // 修改编辑文章
    async update (draft) {
      await this.$http.put(`articles/${this.articleForm.id}?draft=${draft}`, this.articleForm)
      // 提示信息
      this.$message.success(draft ? '存入草稿成功' : '修改成功')
      // 跳转到内容管理页面
      this.$router.push('/article')
    },
    // 切换发布页面与修改页面
    toggleArticleStatus () {
      // 判断当前是否是编辑
      const articleId = this.$route.query.id
      if (articleId) {
        // 获取当前文章信息
        this.getArticle(articleId)
      } else {
        // 重置数据不能为空对象,要设为null
        this.articleForm = {
          title: null,
          content: null,
          cover: {
            type: 1,
            images: []
          },
          channel_id: null
        }
      }
    }
  },
  // 当路由规则没有发生改变的时候，组件不会重新初始化
  // 只有组件初始化的时候才会只会执行一次
  // 监听地址栏参数的变化，执行下面代码
  watch: {
    '$route.query.id': function () {
      this.toggleArticleStatus()
    }
  },
  created () {
    // 判断当前是否是编辑
    const articleId = this.$route.query.id
    // 如果地址栏存在有id
    if (articleId) {
      // 获取当前id文章信息
      this.getArticle(articleId)
    }
  }
}
</script>

<style scoped lang="less">

</style>
