<!--
 * @LastEditors: tande
 * @Author: zhangliquan
 * @Date: 2019年8月7日17:56:05
 * @LastEditTime: 2019-11-21 13:46:36
 -->

<template>
	<el-container>
		<el-main>
			<map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
		</el-main>
		<el-aside width="300px">
			<div>
				<!-- <el-button @click="changeMapStyle('vector')" type="primary">离线矢量</el-button> -->
				<el-button @click="changeMapStyle('xyz_black')" type="primary">离线黑色栅格</el-button>
				<el-button @click="changeMapStyle('xyz_white')" type="primary">离线白色栅格</el-button>
				<el-button @click="changeMapStyle('xyz_ol')" type="primary">在线栅格瓦片</el-button>
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
      baselayerObj: {
        'vector': {
          type: 'vector',
          layerTypeOrUrl: 'baseLayer_white'
        },
        'xyz_black': {
          type: 'xyz',
          layerTypeOrUrl: 'black'
        },
        'xyz_white': {
          type: 'xyz',
          layerTypeOrUrl: 'white'
        },
        'xyz_ol': {
          type: 'xyz',
          layerTypeOrUrl: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
        },
      }
    }
  },
  methods: {
    mapInited: function () {

    },
    changeMapStyle: function (id) {
      let baseLayer = this.baselayerObj[id]
      let seemap = this.$refs.map.thismap
      seemap.changeBaseLayer(baseLayer)
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
