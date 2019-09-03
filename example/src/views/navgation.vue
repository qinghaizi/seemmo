<template>
  <el-container>
    <el-header>Example</el-header>
    <el-main>
      <el-row>
        <router-link to="/gate">
          <el-button>卡口</el-button>
        </router-link>
        <router-link to="/map">
          <el-button>地图</el-button>
        </router-link>
        <router-link to="/seeLayer">
          <el-button>要素</el-button>
        </router-link>
        <router-link to="/draw">
          <el-button>交互</el-button>
        </router-link>
        <router-link to="/pop">
          <el-button>弹出框</el-button>
        </router-link>
        <router-link to="/short">
          <el-button>最短路径分析</el-button>
        </router-link>
      </el-row>
    </el-main>
  </el-container>
</template>
