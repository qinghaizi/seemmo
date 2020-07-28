
<template>
	<el-container>
		<el-main>
			<map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
		</el-main>
	</el-container>
</template>

<script>
import MapBase from '../components/gis/mapXYZBase'
export default {
  name: 'mapXYZ',
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
