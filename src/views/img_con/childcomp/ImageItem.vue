<template>
  <div class="imageItem">
    <!-- 图片展示区域，使用layout布局适配不同屏幕 -->
    <el-row :gutter="10">
      <el-col
        :xs="8"
        :sm="6"
        :md="4"
        v-for="(item, index) in imageList"
        :key="index"
      >
        <el-image
          :src="item.url"
          fit="cover"
          :preview-src-list="urlList"
        ></el-image>
        <!-- 操作栏 -->
        <div id="bottomBar">
          <el-button 
            type="primary" 
            icon="el-icon-star-on" 
            circle
            title="收藏"
            size="small"
          ></el-button>
          <el-button 
            type="danger" 
            icon="el-icon-delete-solid" 
            circle=""
            title="删除"
            size="small"
          ></el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "ImageItem",
  props: {
    imageList: {
      required: true,
      default() {
        return [];
      },
    },
    urlList: {
      required: true,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
.el-row  div {
  height: 170px;
  margin-top: 10px;
  position: relative;
}

.el-row  div .el-image {
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
}

#bottomBar {
  width: 171px;
  height: 0;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
  bottom: -10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  transition: all .3s;
}

#bottomBar .el-button{
  visibility: hidden;
}

.el-col:hover #bottomBar{
  height: 50px;
}

.el-col:hover #bottomBar .el-button{
  visibility: visible;
}
</style>