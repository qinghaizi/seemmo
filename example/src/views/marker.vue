<!--
 * @LastEditors: tande
 * @Author: zhangliquan
 * @Date: 2019-6-13 09:15:17
 * @LastEditTime: 2019-11-25 18:16:35
 -->

<template>
	<el-container>
		<el-main>
			<map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
		</el-main>
		<el-aside width="300px">
			<div>
				<el-button @click="addmarker" type="primary">添加marker</el-button>
				<el-button @click="removemarker" type="primary">移除marker</el-button>
			</div>
		</el-aside>
	</el-container>
</template>

<script>
import MapBase from '../components/gis/mapBase'
import { SeeMapMarker } from '#/index'
export default {
  name: 'mapStyle',
  components: {
    MapBase
  },
  data () {
    return {
      BASE_URL: process.env.BASE_URL,
      marker: null
    }
  },
  methods: {
    mapInited: function () {

    },
    addmarker: function () {
      let seemap = this.$refs.map.thismap
      let markeroption = {

      }
      this.marker = new SeeMapMarker(markeroption)
      .setLngLat([114.41719120, 30.46677258])
      .addTo(seemap)
      console.log(this.marker)
    },
    removemarker: function () {
      if (this.marker) {
        this.marker.remove()
      }
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
