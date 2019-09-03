<template>
  <el-container>
    <el-aside width="auto" style="background:#545c64">

    </el-aside>
    <el-container>
      <el-header>
        <el-col :span="2" style="color:#fff;font-size:20px;">
          测试
        </el-col>
        <el-col :span="20" style="text-align:right;">
        </el-col>

        <el-col :span="2" style="text-align:right;">
          <el-button type="danger" @click="logOut">退出登录</el-button>
        </el-col>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>

  export default {
    components: {},
    data () {
      return {}
    },
    methods: {
      logOut () {
      },
      isLogin () {
      }
    },
    mounted () {
      this.isLogin()
    }
  }
</script>

<style lang="less">
  .el-header {
    line-height: 60px;
  }

  .el-main {
    height: 100%;
  }
</style>
