<template>
  <div class="upload">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @close="$emit('update:ifShow',dialogVisible)"
    >
    <!-- upload组件本身就支持请求提交操作，默认请求方法不能修改，就是post
    通过action配置请求路径，content-type不需要配置，默认就是上传文件，但用户token
    需要单独配置,name	指定上传的文件字段名，即body中名称-->
      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers= headers
        name="image"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UploadDialog",
  data () {
    return {
      // 对话框是否可见
      dialogVisible: this.ifShow,
      // 请求头
      headers:{
        // 有效token
        Authorization: "Bearer "+"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzkxMjc3NzYsInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.3-31SHtuuJtJUJpMFn8AowN3LDUKOMi2H1-D_lXsz00"
      }
    }
  },
  props: {
    ifShow: false
  },
  watch: {
    ifShow() {
      this.dialogVisible = this.ifShow
    }
  }
};
</script>

<style scoped>
.el-dialog__wrapper /deep/ .el-dialog{
  width: 400px!important;
}
</style>