<!--
 * @LastEditors: zhangliquan
 * @Author: zhangliquan
 * @Date: 2019年8月7日11:16:20
 * @LastEditTime: 2019年8月7日11:16:20
 -->
<template>
  <div :id="mapdivname"></div>
</template>

<script>
import { Map } from '#/index';
export default {
  name: 'mapBase',

  data () {
    return {
      mapdivname: new Date().getTime() + '-map',
      thismap: null
    }
  },

  mounted: function () {
    this.thismap = new Map(this.mapdivname, {
      serviceUrl: 'http://localhost:8080',
      resourceUrl: process.env.BASE_URL + 'map_resource',
      zoomSlide: true,
      baseLayer: {
        type: 'xyz',
        layerTypeOrUrl: 'white'
      }
    })
    this.thismap.on('load', () => {
      this.$emit('mapInited')
      console.log(this.thismap)
    })
  },

  methods: {}
}
</script>

<style scoped></style>
