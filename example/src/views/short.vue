/**
* Created by lyuwei
* User: lvwei@seemmo.com
* Date: 2019/01/03
* Describe:
* Log:
*  ---- 2019/01/03 10:39 [lyuwei] 初次添加
*/
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
  import { SeeLayer, Draw, DrawEventType } from '#/index'

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
        this.seeLayer = new SeeLayer().addTo(this.$refs.map.thismap).setStyle(this._styleJsonFunction)

        // 初始化地图交互，只添加点
        this.draw = new Draw(this.seeLayer, { type: 'Point' }).setMap(this.$refs.map.thismap)
        // 监听 绘制完成的事件
        this.draw.on(DrawEventType.DRAWEND, this.drawEnd)

        // 激活绘制
        if (this.draw.active()) {
          this.isDrawing = true
        }
      },
      clickDraw () {
        if (this.isDrawing) {
          this.draw.remove()
          this.isDrawing = false
        } else if (this.draw.active()) {
          this.isDrawing = true
        }
      },
      drawEnd (evt) {
        // 正常结束，取消绘制状态
        this.isDrawing = false
        let saveObj = {
          id: evt.id,
          coordinates: evt.geometry.clone().transform('EPSG:3857', 'EPSG:4326').getCoordinates()
        }
        this.showResult.push(saveObj)

        this.seeLayer.getFeatureById(saveObj.id).set('index', this.showResult.length.toString())

        // 再次激活点击绘制功能
        if (this.draw.active()) {
          this.isDrawing = true
        }
      },
      startAnalysis () {
        if (this.showResult.length > 1) {
          this.draw.remove()
          this.isDrawing = false
          // 将点连成线
          let lineCoors = []
          this.showResult.map((eachPoint) => {
            lineCoors.push(eachPoint.coordinates)
          })
          this.seeLayer.addFeature('line', lineFeatureId, lineCoors)
          // 调用方法，直接分析并重新渲染线要素
          this.seeLayer.analysisOneLine(lineFeatureId)
        } else {
          this.$message.error('中间点少于两个，请至少添加两个点！')
        }
      },
      _styleJsonFunction (feature, mapZoom) {
        let styleJsons = []

        if (feature.getGeometry().getType().toString().toLowerCase() === 'point') {
          let indexNumber = feature.get('index')

          styleJsons.push({
            image: {
              type: 'icon',
              value: {
                src: this.BASE_URL + 'point.png',
                anchor: [0.5, 1],
                scale: 0.8
              }
            },
            text: {
              fillColor: '#fff',
              offsetY: -35,
              stroke: {
                color: '#fff',
                width: 1
              },
              font: '14px calibri,sans-serif',
              text: indexNumber || null
            },
            zIndex: indexNumber ? Number(indexNumber) : null
          })
        } else {
          // 线面对象
          styleJsons.push({
            stroke: {
              color: 'rgba(255, 0, 0, 0.8)',
              width: 2
            }
          })
        }

        return styleJsons
      }
    },
    destroyed () {
    }
  }
</script>

<style scoped>

</style>
