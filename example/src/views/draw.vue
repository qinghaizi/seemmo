<!--
 * @Descripttion:
 * @Date: 2019-09-05 10:19:34
 * @LastEditors: tande
 * @LastEditTime: 2019-11-26 18:28:08
 -->

<template>
	<el-container>
		<el-col :span="20">
			<map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
		</el-col>
		<el-col :span="4">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-select v-model="drawType" :disabled="isDrawing" placeholder="请选择" @change="clickDraw">
						<el-option label="点" value="Point"></el-option>
						<el-option label="线" value="LineString"></el-option>
						<el-option label="面" value="Polygon"></el-option>
						<el-option label="圆" value="Circle"></el-option>
						<el-option label="矩形框" value="Box"></el-option>
					</el-select>
				</el-col>
				<el-col :span="12">
					<el-checkbox v-model="drawFree" :disabled="isCanDrawFree || isDrawing">自由绘制</el-checkbox>
				</el-col>
			</el-row>
			<el-row>
				<el-button @click="clickDraw" :type="isDrawing ? 'danger' : 'primary'">
					{{ isDrawing ? "销毁当前交互" : "激活交互" }}
				</el-button>
			</el-row>
			<!--展示结果部分-->
			<el-row>
				<el-select placeholder="请选择" v-model="selectResult" @change="selectResultChange">
					<el-option v-for="eachitem in showResult" :key="eachitem.id" :label="eachitem.id" :value="eachitem">
					</el-option>
				</el-select>
				<el-button @click="deleteDrawFeature">删除选中的对象</el-button>
			</el-row>
		</el-col>
	</el-container>
</template>

<script>
import MapBase from '../components/gis/mapBase'
import SeeGate from '#/SeeGate/SeeGate'
import SeeLayer from '#/SeeLayer/SeeLayer'
import Draw from '#/Draw/Draw'
import DrawEventType from '#/Draw/DrawEventType'

export default {
  name: 'feature',
  components: { MapBase },
  data () {
    return {
      BASE_URL: process.env.BASE_URL,
      gateDatas: [
        {
          nodeId: '5',
          parentId: '4',
          nodeCode: '11',
          nodeName: 'k1',
          nodeType: '2',
          lastDataTime: '1543816824294',
          lng: '114.39277724975',
          lat: '30.595631349259',
          nodeStatus: '1'
        },
        {
          nodeId: '7',
          parentId: '4',
          nodeCode: '22',
          nodeName: 'k2',
          nodeType: '2',
          lastDataTime: '1542779175368',
          lng: '114.34119310648',
          lat: '30.553915136205',
          nodeStatus: '1'
        },
        {
          nodeId: '8',
          parentId: '4',
          nodeCode: '33',
          nodeName: 'k3',
          nodeType: '2',
          lastDataTime: '1543909001405',
          lng: '114.43154315717',
          lat: '30.505834228355',
          nodeStatus: '1'
        },
        {
          nodeId: '9',
          parentId: '4',
          nodeCode: '44',
          nodeName: 'k4',
          nodeType: '2',
          lastDataTime: '1541061740247',
          lng: '114.39918369097',
          lat: '30.505305100361',
          nodeStatus: '1'
        },
        {
          nodeId: '21',
          parentId: '4',
          nodeCode: 'fewfew',
          nodeName: 'fw',
          nodeType: '3',
          lastDataTime: '1544435827211',
          lng: '114.3436391806',
          lat: '30.556891279945',
          nodeStatus: '0'
        },
        {
          nodeId: '35',
          parentId: '4',
          nodeCode: 'qwe',
          nodeName: '35qwe',
          nodeType: '3',
          lastDataTime: '1544435827211',
          lng: '114.3496391806',
          lat: '30.556891279945',
          nodeStatus: '0'
        },
        {
          nodeId: '23',
          parentId: '22',
          nodeCode: 'ces001',
          nodeName: 'ces001',
          nodeType: '2',
          lastDataTime: '1541401392235',
          lng: '114.39646796935',
          lat: '30.491384109216',
          nodeStatus: '1'
        }
      ],

      drawType: 'LineString',
      drawFree: true,
      isDrawing: false,

      seelayer: null,
      draw: null,

      showResult: [],
      selectResult: null
    }
  },
  computed: {
    isCanDrawFree () {
      return this.drawType !== 'LineString' && this.drawType !== 'Polygon'
    }
  },

  methods: {
    mapInited () {
      // 设置一个卡口对象，用来和后面的绘制
      this.seeGate = new SeeGate()
        .addTo(this.$refs.map.thismap)
        .setStyle(this.styleJsonFunction)
        .createGateFeatures(this.gateDatas)
      // 设置一个图层，后面的绘制结果存放的地方
      this.seelayer = new SeeLayer({ layerType: 10, layerIndex: 10 }).addTo(
        this.$refs.map.thismap
      )
      this.seelayer.setStyle({
        stroke: {
          color: '#02c6bc',
          width: 1.5,
          lineDash: [1, 2, 3, 4, 5, 6]
        },
        fillColor: 'rgba(2, 198, 188, 0.15)'
      })

      this.draw = new Draw(this.seelayer).setMap(this.$refs.map.thismap)
      // 监听 绘制完成的事件
      this.draw.on(DrawEventType.DRAWEND, this.drawEnd)
    },

    styleJsonFunction (feature, mapZoom) {
      let json = {
        image: {
          type: 'icon',
          value: {
            src: this.BASE_URL + 'gate/normal_gray.png',
            scale: 0.8
          }
        }
      }
      if (feature.get('selected')) {
        json.image.value.src = this.BASE_URL + 'gate/warm.png'
      }
      return json
    },

    clickDraw () {
      if (!this.drawType) {
        this.$message.error('请选择需要绘制的对象类型！')
        return
      }
      if (this.isDrawing) {
        // 销毁
        this.removeDraw()
      } else {
        this.draw.setOption({
          type: this.drawType,
          free: this.drawFree
        })
        this.activeDraw()
      }
    },

    // 激活绘制
    activeDraw () {
      if (this.draw.active()) {
        this.isDrawing = true
      } else {
        this.$message.error('未能激活绘制成功，请检查配置！')
      }
    },
    // 手动销毁
    removeDraw () {
      this.draw.remove()
      this.isDrawing = false
    },

    drawEnd (evt) {
      // 正常结束，取消绘制状态
      this.isDrawing = false
      let saveObj = {
        id: evt.id,
        selectedIds: this.seeGate.calcGateInPolygon(evt.geometry)
      }
      this.showResult.push(saveObj)
    },

    selectResultChange () {
      this.seeGate.setSelectedGates(this.selectResult.selectedIds)
    },

    deleteDrawFeature () {
      if (this.selectResult) {
        this.seelayer.removeFeatures([this.selectResult.id])
        this.showResult = this.showResult.filter(v => {
          return v !== this.selectResult
        })
        this.seeGate.setSelectedGates([])
        this.selectResult = null
      }
    }
  },

  destroyed () {
    if (this.draw) {
      // 销毁该页面就移出当前监听的事件，防止部分错误
      this.draw.un(DrawEventType.DRAWEND, this.drawEnd)
    }
  }
}
</script>

<style scoped></style>
