<template>
  <div class="wrap">
    <div class="login">
      <div class="image">
        <img src="./img/logoko.png" alt="" />
      </div>
      <!-- el-from为element-ui中的表单组件，其中from表单会双向绑定一个数据对象，例如user
    里面的属性分别对应form-item中双向绑定的数据 -->
      <el-form 
        ref="form" 
        :model="user" 
        label-width="80px" 
        :rules="rules"
        hide-required-asterisk
      >
        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="user.mobile"
            placeholder="请输入手机号码"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <!-- 使用表单验证时，需要给每个item组件的prop属性设置为需要校验的字段名称
        并通过表单组件的rules属性配置验证规则 -->
        <el-form-item label="验证码" prop="code">
          <el-input
            v-model="user.code"
            placeholder="请输入验证码"
            maxlength="6"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checked">
          <el-checkbox 
            v-model="user.checked"
          >我已阅读并同意用户协议</el-checkbox>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" @click="onSubmit" :loading="loading"
            >登录</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "@/network/login.js";
import "@/assets/css/index.css";
import store from '@/store/index.js'

export default {
  name: "Login",
  data() {
    // 自定义用户协议认证规则
    const validateRead = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请勾选用户许可协议"));
      } else {
        callback();
      }
    };
    return {
      user: {
        mobile: "13911111111",
        code: "246811",
        // 是否阅读用户协议
        checked: false,
      },
      // 登录按钮是否可以被点击
      ifClick: false,
      // 按钮是否处于加载状态
      loading: false,
      // 表单校验规则
      rules: {
        // 号码验证规则，required是否必填项，message验证失败时显示提示信息，trigger表示什么时候触发验证，
        // 为blur时表示输入框失去焦点时，为change表示输入框内容改变时，pattern指定正则表达式验证，min指定
        // 最小字符个数，max指定最大字符个数
        mobile: [
          {
            max: 11,
            required: true,
            message: "号码格式错误",
            trigger: "change",
            pattern: /^1[3|5|7|8|9]\d{9}$/,
          },
        ],
        // 验证码验证规则
        code: [
          {
            max: 6,
            required: true,
            message: "验证码格式错误",
            trigger: "change",
            pattern: /^\d{6}$/,
          },
        ],
        checked: [{ validator: validateRead, trigger: "change" }],
      },
    };
  },
  methods: {
    onSubmit() {
      // 当点击登录按钮时，手动再次进行表单校验，只有表单验证通过才发送登录请求
      //对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，
      // 并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，
      // 则会返回一个 promise

      // 注意：此处最好使用箭头函数，因为在该回调函数中的this并不是指向当前组件对象，
      // 而箭头函数永远指向的是外层的它定时时候的对象
      this.$refs.form.validate((pass, obj) => {
        if (pass) {
          // 通过验证，发送登录请求
          this.log();
        } else {
          return;
        }
      });
    },

    // 登录认证
    async log() {
      try {
        this.loading = true;
        const { data } = await login({
          mobile: this.user.mobile,
          code: this.user.code,
        });
        this.loading = false;
        this.$message("登录成功");
        // 登录成功，保存token信息
        store.commit('saveAllToken',{
          token: data.data.token,
          refresh_token: data.data.refresh_token
        })
        // 持久化token数据
        store.commit('localToken',{
          token: data.data.token,
          refresh_token: data.data.refresh_token
        })
        // 跳转到主页
        this.$router.replace('/')
      } catch (e) {
        if (e && e.response && e.response.status) {
          switch (e.response.status) {
            case 400:
              this.$message.closeAll();
              this.$message("号码或验证码错误");
              this.loading = false;
              break;
            case 403:
              this.$message.closeAll();
              this.$message("权限不足");
              this.loading = false;
              break;
            case 507:
              this.$message.closeAll();
              this.$message("服务器异常");
              this.loading = false;
              break;
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.wrap {
  width: 100vw;
  height: 100vh;
  background-image: url("./img/login_bg.jpg");
  background-size: cover;
}

.login {
  width: 400px;
  height: 425px;
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 20px;
  border-radius: 20px;
}

.login .el-input {
  width: 278px;
}

.login img {
  height: 50%;
  width: 50%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.el-form {
  margin-top: 200px;
}

.el-form .el-button {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
}
</style>