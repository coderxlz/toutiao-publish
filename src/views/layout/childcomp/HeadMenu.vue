<template>
  <div class="headmenu">
    <div>
    <el-button 
      type="default" 
      :icon="asideShow? 'el-icon-s-unfold':'el-icon-s-fold'"
      @click="onClick"></el-button>
    <span>头条新闻后台管理系统</span>
    </div>
    
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
    >
    <div class="block"></div>
      <el-submenu index="1">
        <template slot="title">
          <el-avatar :size="40" :src="photo"/>
          <span> {{ name }}</span>
        </template>
        <el-menu-item index="1-1">个人设置</el-menu-item>
        <el-menu-item 
          index="1-2"
          @click.native="logOut">退出登录</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "HeadMenu",
  data() {
    return {
      // 是否显示侧边栏
      asideShow: false
    };
  },
  props: {
    // 用户头像
    photo: "",
    // 用户名称
    name: "",
    
  },
  methods: {
    // 收起展开侧边栏
    onClick() {
      this.$emit('showChange')
      this.asideShow = !this.asideShow
    },
    
    // 用户退出登录
    logOut () {
      // 清空本地以及内存中localStorage
      this.$store.commit('clearToken')
      // 跳转到登录页面
      this.$router.replace('/login')
    }
  },
};
</script>

<style scoped>
.headmenu{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #aaa;
  padding-left: 0;
  padding-right: 0;
  position: relative;
  z-index: 9;
}

.headmenu .el-button--default{
  font-size: 20px;
  border: none;
  padding-left: 0;
}

</style>