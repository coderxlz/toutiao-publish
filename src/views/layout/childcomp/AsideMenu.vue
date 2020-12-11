<template>
  <div class="aside">
  <el-col :span="12">
    <el-menu
      :default-active="currentIndex"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      text-color="#fff"
      active-text-color="#ffd04b"
      router>
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/art_con">
        <i class="el-icon-menu"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
      <el-menu-item index="/img_con">
        <i class="el-icon-document"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/art_pub">
        <i class="el-icon-setting"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/com_con">
        <i class="el-icon-menu"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="/fan_con">
        <i class="el-icon-document"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <i class="el-icon-setting"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
    </el-menu>
  </el-col>
  </div>
</template>

<script>
import "@/assets/css/index.css";
export default {
  name: "AsideMenu",
  data () {
    return {
      // 当前选中页面索引index
      currentIndex: "/"
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style scoped>
.aside .el-menu{
  width: 200px;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: rgb(0,32,57)
}
</style>