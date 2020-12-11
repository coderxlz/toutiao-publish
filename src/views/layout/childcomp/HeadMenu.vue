<template>
  <div class="headmenu">
    <div>
    <el-button type="default" icon="el-icon-s-fold"></el-button>
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
        </template>
        <el-menu-item index="1-1">个人</el-menu-item>
        <el-menu-item index="1-2">设置</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "HeadMenu",
  data() {
    return {

    };
  },
  props: {
    // 用户头像
    photo: ""
  },
  methods: {
    
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
}

.headmenu .el-button--default{
  font-size: 20px;
  border: none;
  padding-left: 0;
}
</style>