<template>
  <div class="avatar-dialog">
    <el-dialog title="提示" :visible.sync="dialogVisible" @opened="dialogOpen">
      <div class="avatar">
        <img id="image" ref="image" :src="url" alt="" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

import { updateAvatar } from '@/network/user.js'

export default {
  name: "AvatarDialog",
  data() {
    return {
      dialogVisible: false,
      // 图片裁切器
      cropper: null,
      // 裁剪完图片的bolb数据
      blob: null,
      // 头像url地址
      url: null
    };
  },
  props: {
    // 弹出层是否显示
    ifShow: {
      required: true,
      default() {
        return false;
      },
    },
    // 头像url地址
    avatar_url: {
      required: true,
      default() {
        return "";
      },
    },
  },
  methods: {
    // 对话框属于settings的子组件，在setting初始化时就会被初始化，就会被挂载到页面之中，
    // 即mounted已近被执行，而img图片的url是异步获取的，只有在用户选择了图片之后，img才会被渲染
    // 所以在mounted中是无法拿到image组件的，只有在dialog的打开动画执行结束钩子函数中才能确保拿到img组件
    dialogOpen() {
      const image = document.getElementById('image');
      if(this.cropper){
        this.cropper.replace(this.avatar_url)
        return
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        movable: false,
        cropBoxResizable: false,
        dragMode: 'none' // 在裁切区域拖动时的行为
      });
    },

    // 裁切图片完毕，将图片上传至服务器
    confirm() {
      this.dialogVisible = false
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        const file = new FormData()
        this.blob = blob
        file.append('photo',blob)
        this.uploadAvatar(file)
      })
    },

    // 上传用户头像
    async uploadAvatar(file) {
      const data = await updateAvatar(file)
      // 将当前页面头像更新为裁剪头像
      this.url = window.URL.createObjectURL(this.blob)
      console.log(this.url)
      this.$message({
        message: '上传成功',
        type: 'success'
      })
    }
      

  },
  watch: {
    avatar_url() {
      this.url = this.avatar_url
    },
    // 当props中的数据发生变化，及时同步dialogVisible
    ifShow() {
      this.dialogVisible = this.ifShow;
    },
    // 当dialobVisible发生变化，及时同步父组件中的数据
    dialogVisible() {
      this.$emit("update:ifShow", this.dialogVisible);
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 400px;
  height: 300px;
}

.avatar img {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>