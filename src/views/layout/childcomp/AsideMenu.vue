<template>
  <div class="aside clearfix">
  <el-col :span="12">
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      :collapse="asideShow"
      >
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/art_con">
        <i class="el-icon-s-grid"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
      <el-menu-item index="/img_con">
        <i class="el-icon-picture-outline"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/art_pub">
        <i class="el-icon-s-promotion"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/com_con">
        <i class="el-icon-info"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="/fan_con">
        <i class="el-icon-data-analysis"></i>
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
  props: {
    // 侧边栏是否折叠
    asideShow: false
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
.aside .el-col-12 {
  width: 100%;
}

.el-menu{
  height: 100vh;
}

.aside .el-menu{
  background-color: rgb(0,32,57)
}

</style>