<!--
 * @LastEditors: zhangliquan
 * @Author: zhangliquan
 * @Date: 2019-6-13 09:15:17
 * @LastEditTime: 2019-6-13 09:15:17
 -->

<template>
  <el-container>
    <el-main>
      <map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
    </el-main>
    <el-aside width="300px">
      <div>
        <el-button @click="changeMapStyle('baseLayer_white')" type="primary">白色底图</el-button>
        <el-button @click="changeMapStyle('baseLayer_black')" type="primary">黑色底图</el-button>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import MapBase from '../components/gis/mapBase'
export default {
  name: 'mapStyle',
  components: {
    MapBase
  },
  data () {
    return {
      BASE_URL: process.env.BASE_URL,
    }
  },
  methods: {
    mapInited: function () {

    },
    changeMapStyle: function (mapStyleType) {
      let seemap = this.$refs.map.thismap
      seemap.changeMapStyle(mapStyleType)
    }

  },
  mounted () { },
  destroyed () {

  }
}
</script>

<style scoped>
.tree-area {
  height: 50%;
}
</style>
