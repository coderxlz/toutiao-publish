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
      <div class="image-box">
        <el-image
          :src="item.url"
          fit="cover"
          :preview-src-list="urlList"
        ></el-image>
        <!-- 选中状态模态框 -->
        <div class="module" v-show="selectItem === item">
          <i class="el-icon-success"></i>
        </div>
      </div>
        <!-- 操作栏 -->
        <div id="bottomBar">
          <el-button
            type="primary"
            icon="el-icon-star-on"
            :class="{'star':item.is_collected}"
            circle
            title="收藏"
            size="small"
            @click="starImage(item)"
            :loading="isLoading"
          ></el-button>
          <!-- 当组件没有被复用时，展示删除按钮，复用时展示选择按钮 -->
          <!-- 没有复用，删除按钮 -->
          <el-button
            v-if="!useAgain"
            type="danger"
            icon="el-icon-delete-solid"
            circle=""
            title="删除"
            size="small"
            @click="deleteImage(item)"
            :loading="isLoading"
          ></el-button>
          <!-- 组件复用，提交按钮 -->
          <el-button
            v-else
            type="success"
            icon="el-icon-check"
            circle=""
            title="选择"
            size="small"
            @click="selectImage(item)"
            :loading="isLoading"
          ></el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { starImage, deleteImage } from "@/network/image.js";

export default {
  name: "ImageItem",
  mounted(){
    this.$bus.$on('clearSelected',() => {
      // 封面选择对话框完全打开，清空选中图片列表从而初始化
      this.selectList = []
    })
  },
  data(){
    return {
      // 按钮是否处于加载状态
    isLoading: false,
    // 文章是否处于收藏状态
    isStar: false,
    // 当前选中图片
    selectItem: null
    }
  },
  props: {
    // 图片列表
    imageList: {
      required: true,
      default() {
        return [];
      },
    },
    // 图片url列表
    urlList: {
      required: true,
      default() {
        return [];
      },
    },
    // 父组件图片管理是否复用
    useAgain: {
      required: true,
      default() {
        return false
      }
    },
    
    // 当前图片是否被选中
    ifSelected: false
  },
  methods: {
    // 收藏图片
    async starImage(item) {

      try {
        this.isLoading = true
        const data = await starImage(item.id, !item.is_collected);
        let message = null
        item.is_collected?message = "取消收藏":message = "收藏成功"
        this.$message({
          message,
          type: 'success'
        })
        // 修改完成后向父组件提交refresh事件要求刷新image列表
        this.$emit('refresh')
      } catch (e) {}
      finally{
        this.isLoading = false
      }
    },
    // 删除图片
    async deleteImage(item) {
      try {
        const data = await deleteImage(item.id)
        this.$message({
          message: "删除成功",
          type: "danger"
        })
        // 修改完成后向父组件提交refresh事件要求刷新image列表
        location.reload()
      } catch (e) {}
      finally{
        this.isLoading = false
      }
    },
    // 提交图片
    selectImage(item) {
      this.selectItem = item
      this.$bus.$emit('selectImage',item)
    }
  },
  
};
</script>

<style scoped>
.el-row div {
  height: 170px;
  margin-top: 10px;
  position: relative;
}

.el-row div .el-image {
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
}

.star{
  color: rgb(11, 240, 11)
}

#bottomBar {
  width: calc(100% - 10px);
  height: 0;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
  bottom: -10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  transition: all 0.3s;
}

#bottomBar .el-button {
  height: 0;
  transition: all .3s;
  visibility: hidden;
}

.el-col:hover #bottomBar {
  height: 50px;
}

.el-col:hover #bottomBar .el-button {
  height: 32px;
  visibility: visible;
}

.image-box{
  position: relative;
}

.image-box .module {
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .4);
  font-size: 50px;
  text-align: center;
  line-height: 170px;
  color: green;
}
</style>