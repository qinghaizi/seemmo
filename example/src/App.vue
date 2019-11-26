<template>
  <router-view></router-view>
</template>

<script>
import '@/common/basic.less';

export default {
  name: 'app'
}
</script>

<style lang="less">
html,
body {
  height: 100%;
  width: 100%;
}

/*滚动条*/
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  /* background-color: #f1f1f1; */
  background-color: transparent;
  border-radius: 10px;
}
.el-container {
  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: #333;
    font-size: 35px;
    font-family: "微软雅黑";
    font-weight: bold;
  }

  .el-aside {
    color: #333;
    text-align: center;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    padding: 0;
  }
}
</style>
