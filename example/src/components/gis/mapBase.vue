/**
* Created by lyuwei
* User: lvwei@seemmo.com
* Date: 2018/09/12
* Describe:
* Log:
*  ---- 2018/09/12 09:55 [lyuwei] 初次添加
*/
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
