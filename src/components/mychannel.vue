<template>
<!-- 2、子组件数据改变，提交数据给父组件 -->
  <el-select :value="value" @change="fn" placeholder="请选择" clearable>
    <el-option
        v-for="item in channelLoptions"
        :key="item.id"
        :label="item.name"
        :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
export default {
  // 1、子组件接收传过来的value值，value值为v-model自己绑定的
  props: ['value'],
  data () {
    return {
    //   value: null,
      channelLoptions: []
    }
  },
  created () {
    // 获取频道数据函数
    this.getChannelOptions()
  },
  methods: {
    // 获取频道选项数据
    async getChannelOptions () {
      const { data: { data } } = await this.$http.get('channels')
      // 赋值给频道下拉选项依赖数据
      this.channelLoptions = data.channels
    },
    // 子组件值改变，触发的函数
    fn (channelId) {
      // 把数据提交给父组件
      if (channelId === '') channelId = null
      this.$emit('input', channelId)
      // 注：父组件收到数据后，会自动把数据赋值给v-model绑定的reqParams.channel_id
    }
  }
}
</script>

<style>

</style>
