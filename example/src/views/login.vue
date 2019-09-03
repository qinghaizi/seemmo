<template>
  <div class="login">
    <div class="banner"></div>
    <div class="login-box">
      <el-form :model="accountForm" status-icon :rules="rules" ref="accountForm" class="demo-ruleForm"
               v-show="!isLogin">
        <el-form-item prop="userAccount">
          <el-input type="text" v-model="accountForm.userAccount" auto-complete="off"
                    placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input type="password" v-model="accountForm.userPassword" auto-complete="off"
                    @keyup.enter.native='checkpwd' placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="checkpwd" style="width:100%;">登录</el-button>
        </el-form-item>
      </el-form>
      <el-row v-show="isLogin">
        <el-row style="line-height:150px;text-align:center;">你已经登录!</el-row>
        <el-button type="success" icon="el-icon-edit" @click="toIndex"> 直接进入</el-button>
        <el-button type="primary" icon="el-icon-sort" @click="logOut">切换账号</el-button>
      </el-row>
    </div>
    <div class='glass'></div>
  </div>

</template>

<script>

  export default {
    data () {
      return {
        accountForm: {
          userAccount: '',
          userPassword: ''
        },
        isLogin: false,
        rules: {
          userAccount: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 5,
              max: 12,
              message: '长度为 5 到 12 位'
            },
            {
              pattern: /^[a-zA-Z0-9]+$/,
              message: '用户名只能数字和字母'
            }
          ],
          userPassword: [
            {
              required: true,
              message: '请输密码',
              trigger: 'blur'
            },
            {
              min: 5,
              max: 15,
              message: '长度为 5 到 15 位'
            },
            {
              pattern: /^[0-9a-zA-Z]+$/,
              message: '只能包含数字和字母'
            }
          ]
        }
      }
    },
    methods: {

      checkpwd () {
        let _this = this
        // let { userAccount, userPassword } = this.accountForm

        _this.$refs.accountForm.validate(valid => {
          if (valid) {
            _this.tools.message('登录成功!', 'success')
            _this.$router.push('/main')
          }
        })
      },
      logOut () {
      },
      toIndex () {
        this.$router.push('/main')
      }

    },
    mounted () {
      this.isLogin = true
    }
  }
</script>

<style scoped lang='less'>
  .login {
    width: 100%;
    height: 100%;
    background: url("http://h1.ioliu.cn/bing/SpainSurfer_EN-AU11271138486_1920x1080.jpg");
    background-size: cover;
    .banner {
      width: 620px;
      height: 600px;
      // background-image: url("../assets/images/u54.png");
      background-size: 100% 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-90%, -50%);
    }
    .glass {
      padding: 50px;
      position: absolute;
      width: 250px;
      height: 250px;
      background: #fff;
      background-size: contain contain;
      filter: blur(90px);
      z-index: 5;
      left: 80%;
      top: 50%;
      margin-left: -250px;
      margin-top: -150px;
    }
    .login-box {
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
      z-index: 10;
      width: 250px;
      height: 230px;
      border-radius: 5px;
      position: absolute;
      left: 80%;
      top: 50%;
      margin-left: -250px;
      margin-top: -150px;
      padding: 50px;

      .logo {
        width: 200px;
        margin-left: 30px;
      }
      form {
        margin-top: 10px;
        .el-input {
          margin-bottom: 20px;
        }
      }
      .enter {
        color: inherit;
        text-decoration: none;
      }
    }
  }
</style>
