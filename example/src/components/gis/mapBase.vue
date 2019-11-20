<!--
 * @LastEditors: tande
 * @Author: lyuwei
 * @Date: 2019-02-21 11:44:42
 * @LastEditTime: 2019-11-20 16:14:04
 -->
<template>
	<div :id="mapdivname"></div>
</template>

<script>
import { Map } from '#/index'
export default {
  name: 'mapBase',

  data () {
    return {
      mapdivname: new Date().getTime() + '-map',
      thismap: null
    }
  },

  mounted () {
    this.thismap = new Map(this.mapdivname, {
      serviceUrl: 'http://localhost:8080',
      resourceUrl: process.env.BASE_URL + 'map_resource',
      zoomSlide: true
    })
    this.thismap.on('load', () => {
      this.$emit('mapInited')
      console.log(this.thismap)
    })
  },

  methods: {}
}
</script>

<style scoped>
</style>
