<template>
  <div class="art_pub">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ edit_id?'编辑文章':'发布文章' }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        :model="pubForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        hide-required-asterisk
        :rules="rules"
      >
        <el-form-item
          label="标题"
          prop="title"
          placeholder="请输入文章标题"
          max_len="30"
        >
          <el-input v-model.trim="pubForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" class="content">
          <!-- Or manually control the data synchronization -->
          <quill-editor
            v-model="pubForm.content"
            :content="pubForm.content"
            :options="editorOption"
            @change="onEditorChange($event)"
          />
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-radio-group v-model="pubForm.cover">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="-1">自动</el-radio>
            <el-radio :label="0">无图</el-radio>
          </el-radio-group>
          <!-- 上传图片预览模块 -->
          <div class="uploadImage" v-if="pubForm.cover > 0">
            <select-image
              v-for="(item,index) in pubForm.cover"
              :key="index"
              @click.native="uploadClick(index)"
              :url="urlList !== [] && urlList[index]"
            />
          </div>
        </el-form-item>
        <el-form-item label="频道" prop="channel">
          <el-select placeholder="请选择频道" v-model="pubForm.channel">
            <el-option
              v-for="(item, index) in channels"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm(false)"
            :loading="pub_loading"
            >立即发布</el-button
          >
          <el-button @click="submitForm(true)">保存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 上传封面弹出层 -->
    <cover-dialog
      :ifShow.sync="ifShow"
      @getUrl="urlList = $event"
      :nowUrl="nowUrl"
      :currentIndex="currentIndex"
    />
    <!-- 使用imageCount将当前选择的图片个数传递过去，限制用户选择 -->
  </div>
</template>

<script>
import { getChannels, publishArt, getArtById } from "@/network/art_con.js";
import JSONbig from "json-bigint";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import CoverDialog from './childcomp/CoverDialog.vue';
import SelectImage from './childcomp/SelectImage.vue';

export default {
  name: "ArticlePublish",
  components: {
    quillEditor,
    CoverDialog,
    SelectImage
  },
  created() {
    // 请求频道列表数据
    this.getAllChannels();
    // 获取编辑文章数据
    if (this.edit_id) {
      this.getArticle();
    }
  },
  data() {
    // 自定义表单校验规则
    const validateContent = (rule,value,callback) => {
      if(value === ""){
        callback(new Error('文章内容不能为空'))
      }else{
        callback()
      }
    }
    return {
      pubForm: {
        title: "",
        content: "",
        cover: 0,
        channel: "",
      },
      // 富文本编辑器quill配置
      editorOption: {
        placeholder: "请输入文章内容",
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],
            [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
            [{ 'list': "ordered" }, { 'list': "bullet" }], // 值ordered，bullet
            [{ 'direction': "rtl" }],
            [{ 'color': [] }, { 'background': [] }],
            ['image']    //上传图片、上传视频
          ],
          // handlers: handlers
        },
      },
      // 表单验证规则
      rules: {
        title: [
          {required: true,message: '文章标题不能为空',trigger: 'change'},
          {min: 5,max: 30,message: '文章标题不得少于三个字符',trigger: 'change'}
        ],
        content: [
          {validator: validateContent,trigger: 'change'},
          {required: true,message: '文章内容不能为空',trigger: 'change'}
        ],
        channel: [
          {required: true,message: '请选择文章发布频道'}
        ]
      },
      // 频道列表数据
      channels: null,
      // 发布按钮加载状态
      pub_loading: false,
      // 所要编辑的文章id
      edit_id: this.$route.query && this.$route.query.art_id,
      // 上传封面弹出层是否显示
      ifShow: false,
      // 图片url数组
      urlList: [],
      // 当前点击的图片url
      nowUrl: null,
      // 当前选择图片的索引
      currentIndex: null
    };
  },
  methods: {
    // 发布文章
    submitForm(draft) {
      this.pub_art(draft);
    },

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 获得所有频道数据
    async getAllChannels() {
      const { data } = await getChannels();
      const getData = data.data;
      this.channels = getData.channels;
    },

    // 发布文章
    pub_art(draft) {
      this.$refs.ruleForm.validate (async (pass,obj) => {
        // 只有校验通过，才会进行表单提交
        if( pass ) {
          try {
            this.pub_loading = true
            const data = await publishArt(
              {
                title: this.pubForm.title,
                content: this.pubForm.content,
                cover: {
                  type: this.pubForm.cover,
                  images: this.urlList,
                },
                channel_id: this.pubForm.channel,
              },
              draft
            );
            console.log(data);
            this.$message({
              message: "发布成功！",
              type: "success",
            });
            this.$router.push('/art_con')
          } catch (e) {} 
          finally {
            this.pub_loading = false;
          }
        }else{
          return
        }
      }) 
      
    },
    // 请求编辑文章数据
    async getArticle() {
      const data = await getArtById(JSONbig.stringify(this.edit_id));
    },

    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text);
      this.content = html;
    },

    // 点击上传图片按钮
    uploadClick (index) {
      this.currentIndex = index
      this.ifShow = true
      if( this.urlList !== []) {
        this.nowUrl = this.urlList[index]
      }
    }
  },

  
};

// // 重写图片上传
// const handlers = {
//   image() 
// }
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

.quill-editor {
  height: 300px;
}

.content /deep/ .el-form-item__content{
  height: 100%;
}

.content {
  height: 400px;
}

.uploadImage{
  display: flex;
}
</style>