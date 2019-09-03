<!--
 * @LastEditors: zhangliquan
 * @Author: zhangliquan
 * @Date: 2019年8月7日11:16:20
 * @LastEditTime: 2019年8月7日11:16:20
 -->

<template>
  <el-container>
    <el-main>
      <map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
    </el-main>
    <el-aside width="300px">
      <div>
        <el-button @click="changeMapStyle('white')" type="primary">白色离线底图</el-button>
        <el-button @click="changeMapStyle('black')" type="primary">黑色离线底图</el-button>
        <el-button @click="changeMapStyle('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png')" type="primary">osm在线底图</el-button>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import MapBase from '../components/gis/mapXYZBase'
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
