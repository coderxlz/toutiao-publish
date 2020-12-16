<template>
  <div class="cover-dialog">
    <el-dialog 
      title="上传封面" 
      :visible.sync="DialogVisible"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="素材库">
          <!-- 传入useAgain为true表示复用该组件 -->
          <img-control
            :useAgain="true"/>
        </el-tab-pane>
        <el-tab-pane label="上传图片">
          <input type="file" ref="file" @change="fileChange">
          <select-image :url="url" id="preview" v-if="DialogVisible">
            <template>预览区域</template>
          </select-image>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ImgControl from '../../img_con/ImgControl.vue';
import SelectImage from './SelectImage.vue';
export default {
  name: "CoverDialog",
  components: {
    SelectImage,
    ImgControl 
  },
  mounted() {
    // 接受ImageItem发送过来用户所选择的图片对象
    this.$bus.$on('selectImage',item => {
      console.log('接收到的图片对象',item)
      if(this.urlList.length < this.imageCount) {
        this.urlList.push(item.url)
        this.$message({
          message: '图片添加成功',
          type: 'success'
        })
        return
      }
      this.$message({
        message: '所选图片达到最大张数，无法继续选择',
        type: 'warning'
      })
    })
  },
  data(){
    return {
      DialogVisible: false,
      // 当前选择图片url
      url: "",
      // 是否编辑查看图片
      ifEdit: false,
      // 之前的文件对象
      fileObj: null,
      // 当前选择图片的url列表
      urlList: []
    };
  },
  props: {
    // 对话框是否显示
    ifShow: {
      required: true,
      default() {
        return false;
      },
    },
    // 当前预览图url
    nowUrl: {
      required: true,
      default() {
        return ''
      }
    },
    // 用户选择的封面种类，即图片个数
    imageCount: {
      required: true,
      default() {
        return 0
      }
    }
  },
  methods: {
    // 当选择图片时
    fileChange() {
      const fileInput = this.$refs.file
      const getFile = fileInput.files[0]
      // 当当前选择图片name与原图name相同时，表明当前处于编辑状态
      if(this.fileObj && this.fileObj.name === getFile.name) {
        this.ifEdit = true
      }else{
        // 非编辑状态，更新旧的文件对象
        this.ifEdit = false
        this.fileObj = getFile
      }
      const url = window.URL.createObjectURL(getFile)
      if(this.urlList.length !== this.imageCount) {
        // 将url存进url列表
        this.urlList.push(url)
      }
    },
    // 确认选择时，将当前选择图片列表urlList传递给父组件
    confirm() {
      this.$refs.file.value = ""
      this.DialogVisible = false
      // 只有在非编辑模式下才会传递urlList
      if(!this.ifEdit && this.urlList.length <= this.imageCount) {
        this.$emit('getUrl',this.urlList)
        return
      }
      
    },
    // // 默认情况下，打开对话框不可编辑
    // dialogOpen() {
    //   this.ifEdit = true
    // }
  },
  watch: {
    ifShow() {
      this.DialogVisible = this.ifShow;
    },
    DialogVisible() {
      this.$emit("update:ifShow", this.DialogVisible);
    },
    nowUrl() {
      this.url = this.nowUrl
    }
  },
};
</script>

<style scoped>
.cover-dialog /deep/ .el-dialog{
  width:80%;
}

#preview{
  font-size: 16px;
}
</style>