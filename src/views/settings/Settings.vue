<template>
  <div class="settings">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="card-body">
        <!-- 表单部分 -->
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="70px"
          class="demo-ruleForm"
          hide-required-asterisk
        >
          <el-form-item label="编号" prop="id">
            {{ ruleForm.id }}
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            {{ ruleForm.mobile }}
          </el-form-item>

          <el-form-item label="媒体名称" prop="name">
            <el-input
              type="text"
              v-model.trim="ruleForm.name"
              placeholder="媒体名称"
              :maxlength="8"
            ></el-input>
          </el-form-item>

          <el-form-item label="媒体介绍" prop="intro">
            <el-input
              type="textarea"
              v-model="ruleForm.intro"
              placeholder="媒体介绍"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="email"
              v-model="ruleForm.email"
              placeholder="邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              :loading="isLoading"
              >完成</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 头像部分 -->
        <div class="avatar">
          <div class="block" @click="$refs.file.click()">
            <el-avatar shape="square" :size="200" :src="ruleForm.photo">
            </el-avatar>
            <div>
              <el-tag type="success" effect="dark">点击修改头像</el-tag>
            </div>
            <input 
              type="file" 
              ref="file"
              @change="fileChange"
              hidden
            >
          </div>
        </div>
      </div>
    </el-card>
    <!-- 头像弹出框部分 -->
    <avatar-dialog
      :ifShow.sync="ifShow"
      :avatar_url="avatar_url"/>
  </div>
</template>

<script>
import { getProfile,editProfile } from '@/network/user.js'
import AvatarDialog from './childcomp/AvatarDialog.vue';

export default {
  name: "Settings",
  components: {
    AvatarDialog
  },
  created() {
    AvatarDialog
    this.getUserDetail()
  },
  data() {
    // 自定义email校验规则
    const validateEmail = (rule,value,callback) => {
      let res = value.replace(/\s*/g,'')
      const reg = new RegExp(/^[a-zA-Z0-9]{6,11}@[a-z]{2,4}\.com$/,'g')
      if(reg.test(value)) {
        callback()
      }else {
        callback(new Error('邮箱格式错误'))
      }
    }
    return {
      ruleForm: {
        id: '',
        mobile: '',
        name: '',
        intro: '',
        email: '',
        photo: ''
      },
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'},
          {min: 2, max: 8, message: '名称长度不能少于2个字符', trigger: 'change'}
        ],
        intro: [
          {min: 5, max: 100, message: '媒体介绍不得少于5个字符'}
        ],
        email: [
          {required: true, message: '邮箱不能为空'},
          {validator: validateEmail, trigger: 'change'}
        ]
      },
      // 完成按钮是否处于加载状态
      isLoading: false,
      // 头像弹出框是否显示
      ifShow: false,
      // 头像转换后的url
      avatar_url: ""
    } 
  },
  methods: {
    // 获取用户个人资料
    async getUserDetail () {
      try {
        const { data } = await getProfile()
        console.log('用户个人资料',data)
        // 将请求到的数据保存到data之中
        this.ruleForm = data.data
      } catch (e) {}
    },

    // 提交表单
    submitForm() {
      // 手动调用一次表单验证，验证通过，才发送提交请求
      this.$refs.ruleForm.validate(async (pass,obj) => {
        if (pass) {
          try {
            this.isLoading = true
            const data = await editProfile({
            name: this.ruleForm.name,
            intro: this.ruleForm.intro,
            email: this.ruleForm.email
          })
          this.$message({
            message: '提交成功',
            type: 'info'
          })
          this.getUserDetail()
          } catch (e) {}
          finally{
            this.isLoading = false
          }
        }else{
          return
        }
      })
    },

    // 重置表单
    resetForm() {
      this.$refs[formName].resetFields();
    },

    // 当file类型的input中change事件被触发时，表明用户选择了头像，此时显现头像编辑对话框
    // 但file类型的input事件有一个小bug，两次选择同一张图片时，change事件只会触发一次，需要手动清空数据
    fileChange() {
      let file = this.$refs.file.files[0]
      // URL.createObjectURL() 静态方法会创建一个 DOMString，
      // 其中包含一个表示参数中给出的对象的URL。
      // 这个 URL 的生命周期和创建它的窗口中的 document 绑定。
      // 这个新的URL 对象表示指定的 File 对象或 Blob 对象。
      const url = window.URL.createObjectURL(file)

      this.avatar_url = url
      // 弹出提示框
      this.ifShow = true

      // 手动清空file
      this.$refs.file.value = ""
    }
  }
};
</script>

<style scoped>
.card-body {
  display: flex;
  justify-content: space-between;
}

.card-body .el-form {
  flex-grow: 4;
}

.card-body .avatar {
  flex-grow: 3;
  position: relative;
}

.avatar .block {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.avatar .block img {
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
}
</style>