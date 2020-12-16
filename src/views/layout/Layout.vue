<template>
  <el-container class="wrap">
    <!-- 侧边栏 -->
    <el-aside width="auto">
      <aside-menu
       :asideShow="asideShow"/>
    </el-aside>
    <el-container>
      <!-- 顶部栏 -->
      <el-header>
        <head-menu
          :photo="user && user.photo"
          :name="user && user.name"
          @showChange="asideShow = !asideShow"/>
      </el-header>
      <el-main>
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AsideMenu from './childcomp/AsideMenu.vue';
import HeadMenu from './childcomp/HeadMenu.vue';

import { getUserInfo } from '@/network/layout.js'

export default {
  components: { AsideMenu, HeadMenu },
  name: "Layout",
  // 在页面被创建时根据token请求用户个人资料数据
  created () {
    this.getInfo()
  },
  data () {
    return {
      // 用户个人信息对象
      user: null,
      // 侧边栏是否折叠
      asideShow: false
    }
  },
  methods: {
    // 获取用户个人资料信息
    async getInfo() {
      try{
        const { data } = await getUserInfo()
        const getData = data.data
        this.user = getData
      }
      catch(e){}
    }
  }
};
</script>

<style scoped>
.el-aside,.el-header{
  position: relative;
  top: 0;
  left: 0;
}

.wrap .el-main{
  height: calc(100vh - 62px);
  overflow-y: scroll;
}
</style>