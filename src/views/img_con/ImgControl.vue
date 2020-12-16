<template>
  <div class="img_con">
    <el-card class="box-card" :loading="imageLoading">
      <div slot="header" class="clearfix" v-if="!useAgain">
          <el-breadcrumb  separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>素材管理</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="operate">
        <el-radio-group 
          v-model="select"
          @change="radioChange"
        >
          <!-- 不推荐监听单选框的click事件，因为点击一次会触发两次click
          监听radio-group的change事件可解决这个问题 -->
          <el-radio-button label="0"
            :loading="imageLoading"
          >全部</el-radio-button>
          <el-radio-button label="1"
            :loading="imageLoading"
          >收藏</el-radio-button>
        </el-radio-group>
          <el-button
            v-if="!useAgain"
            type="success"
            size="small"
            @click="ifDialogShow = !ifDialogShow"
            >上传素材</el-button
          >
      </div>
      <!-- 图片展示区域，使用layout布局适配不同屏幕 -->
      <!-- 将当前组件是否复用布尔值传递给子组件从而实现按钮定制 -->
      <image-item
        :imageList="imageList"
        :urlList="urlList"
        @refresh="loadImages()"
        :useAgain=useAgain
      />
      <el-pagination 
        background 
        layout="prev, pager, next" 
        :total="total_count"
        @current-change="pageChange"
        :disabled="imageLoading"
        :page-size="12"
      ></el-pagination>
    </el-card>
    <!-- 上传图片部分 -->
    <upload-dialog 
      :ifShow.sync="ifDialogShow"
      @refresh="loadImages()"
    />
  </div>
</template>

<script>
import { getImages } from "@/network/image.js";
import UploadDialog from "./childcomp/UploadDialog.vue";
import ImageItem from "./childcomp/ImageItem"

export default {
  components: { UploadDialog,ImageItem },
  name: "ImgControl",
  created() {
    // 在页面初始化时请求图片素材数据
    this.loadImages();
  },
  data() {
    return {
      // 默认收藏按钮被选中
      select: 0,
      // 图片列表是否处于加载状态
      imageLoading: true,
      // 请求到的图片列表
      imageList: [],
      // 上传文件对话框是否显示
      ifDialogShow: false,
      // 是否是收藏的图片
      collect: false,
      // 页数
      page: 1,
      // 每页图片数量
      per_page: 12,
      // 图片总数量
      total_count: 0
    };
  },
  props: {
    useAgain: false
  },
  methods: {
    // 点击页码时，数据改变
    pageChange(current_page) {
      // 将当前页码更新为新的页码
      this.page = current_page
      this.loadImages()
    },
    // 请求图片数据
    async loadImages() {
      try {
        this.imageLoading = true;
        const { data } = await getImages({
          collect: this.collect,
          page: this.page,
          per_page: this.per_page
        });
        this.total_count = data.data.total_count
        this.imageList = data.data.results;
      } catch (e) {}
      finally{
        this.imageLoading = false
      }
    },
    radioChange (val) {
      // 修改页码为1，防止出现全部与收藏页码相同问题
      this.page = 1
      // 选中单选框值为0时，表示全部，draft为false
      val == 0?this.collect = false : this.collect = true
      this.loadImages()
    }
  },
  computed: {
    urlList() {
      // 将图片数据中所有url取出来以遍提供预览
      const srcList = [];
      this.imageList.forEach((val) => {
        if (val.url !== null) {
          srcList.push(val.url);
        }
      });
      return srcList;
    },
  }
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.operate {
  display: flex;
  justify-content: space-between;
}

.el-pagination{
  margin-top: 30px;
}
</style>