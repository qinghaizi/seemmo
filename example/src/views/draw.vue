<!--
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2019-04-08 15:59:13
 * @LastEditTime: 2019-05-08 15:29:49
 -->
<template>
  <el-container>
    <el-col :span="20">
      <map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="space-around" style="padding-top: 20px">
        <el-radio-group size="small" v-model="drawType" @change="selectDrawType">
          <el-radio-button label="点"></el-radio-button>
          <el-radio-button label="线"></el-radio-button>
          <el-radio-button label="面"></el-radio-button>
          <el-radio-button label="圆"></el-radio-button>
          <el-radio-button label="矩形"></el-radio-button>
        </el-radio-group>
      </el-row>
    </el-col>
  </el-container>
</template>

<script>
import MapBase from '../components/gis/mapBase'
import Draw from '#/Draw/Draw'

export default {
  name: 'seemmoDraw',
  components: { MapBase },
  data () {
    return {
      BASE_URL: process.env.BASE_URL,
      draw: null,

      drawType: null,
      isDrawing: false
    }
  },
  computed: {},

  methods: {
    mapInited () {
      this.draw = new Draw().addTo(this.$refs.map.thismap)
      // 监听 绘制完成的事件
      this.draw.on('drawEnd', this.drawEnd)
    },

    selectDrawType (e) {
      this.draw.clear()
      switch (e) {
        case '点':
          this.draw.changeMode('Point')
          break
        case '线':
          this.draw.changeMode('LineString')
          break
        case '面':
          this.draw.changeMode('Polygon')
          break
        case '圆':
          this.draw.changeMode('Circle')
          break
        case '矩形':
          this.draw.changeMode('Box')
          break
        default:
          break
      }
    },

    drawEnd (evt) {
      this.drawType = null
      console.log(evt)
    }
  },

  destroyed () {}
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0
  }
}
</style>
