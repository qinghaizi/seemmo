<!--
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2019-03-22 19:15:52
 * @LastEditTime: 2019-05-08 16:15:14
 -->

<template>
  <el-container>
    <el-main>
      <map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
    </el-main>
  </el-container>
</template>

<script>
import MapBase from '../components/gis/mapBase'
import MapboxInspect from 'mapbox-gl-inspect'
import 'mapbox-gl-inspect/dist/mapbox-gl-inspect.css'
import mapboxgl from 'mapbox-gl'
export default {
  name: 'debug',
  components: {
    MapBase
  },
  data () {
    return {
    }
  },
  methods: {
    mapInited: function () {
        this.$refs.map.thismap.addControl(new MapboxInspect({
          showInspectMap: true,
          popup: new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
          })
        }))
    }
  },
  mounted () { },
  destroyed () {
  }
}
</script>

<style scoped>
</style>
