<!--
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2019-01-02 18:08:49
 * @LastEditTime: 2019-05-09 17:35:17
 -->
<template>
	<el-container>
		<el-main>
			<map-base ref='map' style='height: 100%; width: 100%' @mapInited='mapInited'></map-base>
		</el-main>
		<el-aside width='300px'>
			<el-row v-show='level===0'>
				<el-button type='primary' @click='showPopView'>展示弹窗</el-button>
			</el-row>
			<el-row v-show='level===1'>
				<el-row>
					<span>设置卡口相对于弹窗的位置</span>
				</el-row>
				<el-row>
					<el-col :span='8'>
						<el-button @click="showPopView({positioning:'top-left'},offset = [0, 0])">左上</el-button>
					</el-col>
					<el-col :span='8'>
						<el-button @click="showPopView({positioning:'top'},offset = [0, 0])">正上</el-button>
					</el-col>
					<el-col :span='8'>
						<el-button @click="showPopView({positioning:'top-right'},offset = [0, 0])">右上</el-button>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='8'>
						<el-button @click="showPopView({positioning:'left'},offset = [0, 0])">正左</el-button>
					</el-col>
					<el-col :span='8'>
						<el-button @click="showPopView({positioning:'center'},offset = [0, 0])">中间</el-button>
					</el-col>
					<el-col :span='8'>
						<el-button @click="showPopView({positioning:'right'},offset = [0, 0])">正右</el-button>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='8'>
						<el-button @click="showPopView({positioning:'bottom-left'},offset = [0, 0])">左下</el-button>
					</el-col>
					<el-col :span='8'>
						<el-button @click="showPopView({positioning:'bottom'},offset = [0, 0])">正下</el-button>
					</el-col>
					<el-col :span='8'>
						<el-button @click="showPopView({positioning:'bottom-right'},offset = [0, 0])">右下</el-button>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='6'>X偏移量</el-col>
					<el-col :span='20'>
						<el-slider v-model='offsetX' @change='setOffest' :min='-50' :max='50'></el-slider>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='6'>Y偏移量</el-col>
					<el-col :span='20'>
						<el-slider v-model='offsetY' @change='setOffest' :min='-50' :max='50'></el-slider>
					</el-col>
				</el-row>
			</el-row>
		</el-aside>
	</el-container>
</template>

<script>
import MapBase from '../components/gis/mapBase'
import SeeGate from '#/Layers/SeeGate'
import { SeeMapPop } from '#/SeeMapPop'
export default {
  name: 'pop',
  components: {
    MapBase
  },
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
      seeGate: null,
      seePop: null,
      level: 0,
      offsetX: 0,
      offsetY: 0,
      positioning: 'bottom'
    }
  },
  computed: {},
  methods: {
    mapInited () {
      this.seeGate = new SeeGate({ enableShowLabel: false })
        .addTo(this.$refs.map.thismap.getBusinessLayerGroup())
        .createGateFeatures(this.gateDatas)
        .on('gateMoveOn', this.setView)
      this.seePop = new SeeMapPop({ positioning: 'top' })
        .addTo(this.$refs.map.thismap)
    },
    showPopView ({ positioning = this.positioning, offset = [0, 0] } = {}) {
      this.positioning = positioning
      this.offsetX = offset[0]
      this.offsetY = offset[1]
      if (!this.seePop) {
        this.seePop = new SeeMapPop({ positioning, offset }).addTo(
          this.$refs.map.thismap
        )
      } else {
        this.seePop.setOptions({ positioning, offset })
      }
      this.level = 1
    },
    setView (evt) {
      if (!this.seePop) {
        return
      }
      let gate = evt.gates
      if (gate) {
        const gateInfo = gate[0]
        this.seePop.content = `
        <table>
          <tr><td>名字:</td><td>${gateInfo.nodeName}</td></tr>
          <tr><td>经度:</td><td>${gateInfo.lng}</td></tr>
          <tr><td>纬度:</td><td>${gateInfo.lat}</td></tr>
        </table>
        `
        this.seePop.setLngLat([gateInfo.lng, gateInfo.lat])
      } else {
        // this.seePop.setVisible(false)
      }
    },
    setOffest () {
      this.showPopView({ offset: [this.offsetX, this.offsetY] })
    }
  },
  destroyed () {}
}
</script>

<style scoped>
</style>
