<template>
  <div class="not-found">
    <p>
      404 Not Found
    </p>

    <el-alert title="history模式需要后台配置" type="warning" center show-icon>
      <a href="https://router.vuejs.org/zh/guide/essentials/history-mode.html" target="_blank">点击查看详情 </a> (配置好了删除此段)
    </el-alert>

  </div>
</template>

<style lang="less">
  .not-found {
    width: 100%;
    height: 100%;
    > p {
      line-height: 300px;
      font-size: 30px;
      font-family: "微软雅黑";
      text-align: center;
    }
  }
</style>
