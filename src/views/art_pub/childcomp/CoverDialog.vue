<template>
  <div class="cover-dialog">
    <el-dialog 
      title="上传封面" 
      :visible.sync="DialogVisible"
      @opened="dialogOpen"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="素材库">素材库</el-tab-pane>
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
import SelectImage from './SelectImage.vue';
export default {
  name: "CoverDialog",
  components: {
    SelectImage 
  },
  data(){
    return {
      DialogVisible: false,
      // 当前选择图片url
      url: "",
      // 是否编辑查看图片
      ifEdit: false,
      // 之前的文件对象
      fileObj: null
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
      this.url = window.URL.createObjectURL(getFile)
    },
    // 确认选择时，将当前选择图片url传递给父组件
    confirm() {
      this.$refs.file.value = ""
      this.DialogVisible = false
      // 只有在非编辑模式下才会传递url
      if(!this.ifEdit) {
        this.$emit('getUrl',this.url)
      }
    },
    // 默认情况下，打开对话框不可编辑
    dialogOpen() {
      this.ifEdit = true
    }
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
#preview{
  font-size: 16px;
}
</style>