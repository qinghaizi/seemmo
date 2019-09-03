<!--
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2019-01-03 10:57:45
 * @LastEditTime: 2019-05-08 11:54:40
 -->

<template>
  <el-container>
    <el-main>
      <map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
    </el-main>
    <el-aside width="300px">
      <div>
        <el-button type="primary" @click="addPoint">添加一个点</el-button>
        <el-button type="primary" @click="addLine">添加一条线</el-button>
        <el-button type="primary" @click="addPolylon">添加一个面</el-button>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import MapBase from '../components/gis/mapBase'
import { SeeLayer } from '#/index'
export default {
  name: 'gate',
  components: {
    MapBase
  },
  data () {
    return {
      BASE_URL: process.env.BASE_URL,
      // 以上为静态数据
      seeLayer: null,

    }
  },
  methods: {
    mapInited: function () {
      this.seeLayer = new SeeLayer().addTo(this.$refs.map.thismap)
    },
    addPoint () {
      this.seeLayer.addFeature(100, {
        type: 'Point',
        coordinates: [114.39277724975, 30.595631349259]
      })
    },
    addLine () {
      this.seeLayer.addFeature(102, {
        type: 'LineString',
        coordinates: [[114.39277724975, 30.595631349259], [112.39277724975, 35.595631349259]]
      })
    },
    addPolylon () {
      this.seeLayer.addFeature(103, {
        type: 'Polygon',
        coordinates: [[[114.19277724975, 30.695631349259], [114.09277724975, 30.095631349259], [114.99277724975, 30.795631349259], [114.39277724975, 30.595631349259]]]
      })
    },
  },
  mounted () { },
  destroyed () {
    this.seeGate.destroy()
  }
}
</script>

<style scoped>
.tree-area {
  height: 50%;
}
</style>
