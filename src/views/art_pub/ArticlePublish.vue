<template>
  <div class="art_pub">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>发布文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        :model="pubForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        hide-required-asterisk
      >
        <el-form-item label="标题" prop="name" placeholder="请输入文章标题">
          <el-input v-model="pubForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="desc">
          <el-input type="textarea" v-model="pubForm.content"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-radio-group v-model="pubForm.cover">
            <el-radio label="-1">自动</el-radio>
            <el-radio label="0">无图</el-radio>
            <el-radio label="1">单图</el-radio>
            <el-radio label="3">三图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel">
          <el-select placeholder="请选择频道" v-model="pubForm.channel">
            <el-option label="频道一" value="shanghai"></el-option>
            <el-option label="频道二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ArticlePublish",
  data() {
    return {
      pubForm: {
        title: "",
        content: "",
        cover: "",
        channel: ""
      },
      rules: {},
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
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
</style>