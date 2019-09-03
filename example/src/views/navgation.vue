<template>
  <el-container>
    <el-header>Example</el-header>
    <el-main>
      <el-row>
         <router-link to="/mapXYZ">
          <el-button>xyz离线底图</el-button>
        </router-link>
        <router-link to="/mapXYZStyle">
          <el-button>切换xyz离线底图</el-button>
        </router-link>
         <router-link to="/mapStyle">
          <el-button>切换矢量底图样式</el-button>
        </router-link>
         <router-link to="/changelayer">
          <el-button>baselayer切换</el-button>
        </router-link>
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
         <router-link to="/marker">
          <el-button>图标</el-button>
        </router-link>
        <router-link to="/short">
          <el-button>最短路径分析</el-button>
        </router-link>
      </el-row>
    </el-main>
  </el-container>
</template>
