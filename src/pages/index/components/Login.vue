<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/img/NationalFlag.jpg" alt />
      </div>
      <!-- 登录表单 -->
      <el-form :ref="loginForm" :model="loginForm" :rules="rules">
        <el-form-item prefix-icon="el-icon-search" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="success" @click="submitForm(loginForm)">登录</el-button>
          <el-button type="info" @click="reset(loginForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
  </div>
</template>
<script>
export default {
  name:'Login',
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(loginForm) {
      //登录按钮
      this.$refs[loginForm].validate(async (valid) => {
        if (valid) {
          let { data: res } = await this.axios.post("login", this.loginForm);
          if (res.meta.status !== 200) {//判断状态码
            this.$message({
              message: "抱歉，登录失败哦！！！",
              type: "error",
            });
          } else {
            //将返回的token值储存在sessionStorage中
            window.sessionStorage.setItem('token',res.data.token)
            this.$router.push('/home')//跳转路由
            this.$message({
              message: "恭喜你，登录成功！！！",
              type: "success",
            });
          }
        }
      });
    },
    reset(loginForm) {
      //重置按钮
      this.$refs[loginForm].resetFields();
    },
  },
};
</script>
<style lang="less" scoped>
.login {
  background: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background: white;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      height: 100px;
      width: 170px;
      border: 1px solid #eee;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: 20px;
      img {
        width: 100%;
        height: 100%;
        background: #eee;
      }
    }
  }
}
.el-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>