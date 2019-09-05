<!--
 * @Descripttion: 
 * @Date: 2019-09-05 10:19:34
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 13:19:01
 -->

<template>
  <div :id="mapdivname"></div>
</template>

<script>
import { toLonLat } from 'ol/proj'

export default {
  name: 'mapBase',

  data () {
    return {
      mapdivname: new Date().getTime() + '-map',
      thismap: null
    }
  },

  created: function () {
    import('./olBase.js').then(
      (olbase) => {
        this.thismap = olbase.initMap(this.mapdivname)

        this.$emit('mapInited')

        console.log(this.thismap)
      }
    )
  },

  methods: {
    pointerMoveHandler (evt) {
      if (evt.dragging) {
        return
      }
      this.thismap.setMouseTips(toLonLat(evt.coordinate).toString())
    }
  }
}
</script>

<style scoped>
</style>
