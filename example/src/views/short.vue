<!--
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2019-01-04 16:21:29
 * @LastEditTime: 2019-05-08 15:48:03
 -->

<template>
  <el-container>
    <el-col :span="20">
      <map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
    </el-col>
    <el-col :span="4" v-loading="isAnalysis">
      <el-row>
        <el-button @click="clickDraw" :type="isDrawing ? 'danger' : 'primary'">
          {{isDrawing ? '销毁当前交互' : '激活交互'}}
        </el-button>
      </el-row>
      <el-row>
        <el-button @click="startAnalysis">
          连接成线并分析
        </el-button>
      </el-row>
    </el-col>
  </el-container>
</template>

<script>
  import MapBase from '../components/gis/mapBase'
  import { SeeLayer, Draw } from '#/index'

  const lineFeatureId = 'LINEFEATUREID'

  export default {
    name: 'short',
    components: {
      MapBase
    },
    data () {
      return {
        BASE_URL: process.env.BASE_URL,

        seeLayer: null,
        draw: null,
        isDrawing: false,
        isAnalysis: false,

        showResult: []
      }
    },
    watch: {
      isDrawing: function () {
        this.$refs.map.thismap.setMouseTips(this.isDrawing ? '单击添加中间节点！' : null)
      }
    },
    methods: {
      mapInited: function () {
        this.seeLayer = new SeeLayer().addTo(this.$refs.map.thismap)

        // 初始化地图交互，只添加点
        this.draw = new Draw()
        // 监听 绘制完成的事件
        this.draw.on('drawEnd', this.drawEnd)
      },
      clickDraw () {
        if (this.isDrawing) {
          this.draw.clear()
          this.draw.destory()
          this.isDrawing = false
        } else {
          this.draw.addTo(this.$refs.map.thismap)
          this.draw.changeMode('Point')
          this.isDrawing = true
        }
      },
      drawEnd (evt) {
        let evtData = evt.data.features[0]
        // 正常结束，取消绘制状态
        this.isDrawing = false
        let saveObj = {
          id: evtData.id,
          coordinates: evtData.geometry
        }
        this.showResult.push(saveObj)
        // this.seeLayer.addFeature(evtData.id, evtData.geometry, {inde: this.showResult.length.toString()})

        // 再次激活点击绘制功能
        this.$nextTick(() => { this.draw.changeMode('Point') })
        this.isDrawing = true
      },
      startAnalysis () {
        if (this.showResult.length > 1) {
          this.draw.destory()
          this.isDrawing = false
          // 将点连成线
          let lineCoors = []
          this.showResult.map((eachPoint) => {
            lineCoors.push(eachPoint.coordinates.coordinates)
          })
          this.seeLayer.addFeature(lineFeatureId, { type: 'LineString', coordinates: lineCoors })
          // 调用方法，直接分析并重新渲染线要素
          this.seeLayer.analysisOneLine(lineFeatureId)
        } else {
          this.$message.error('中间点少于两个，请至少添加两个点！')
        }
      }
    },
    destroyed () {}
  }
</script>

<style scoped>

</style>
