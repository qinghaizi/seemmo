<!--
 * @Descripttion: 
 * @Date: 2019-09-05 10:19:34
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 10:19:34
 -->

<template>
  <el-container>
    <el-col :span="20">
      <map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
    </el-col>
    <el-col :span="4">
      <el-row v-show="level===0">
        <el-button type="primary" @click="showPopView">展示弹窗</el-button>
      </el-row>
      <el-row v-show="level===1">
        <el-row> <span>设置卡口相对于弹窗的位置</span></el-row>
        <el-row>
          <el-col :span="8">
            <el-button @click="showPopView({positioning:'top-left'},offset = [0, 0])">左上</el-button>
          </el-col>
          <el-col :span="8">
            <el-button @click="showPopView({positioning:'top-center'},offset = [0, 0])">正上</el-button>
          </el-col>
          <el-col :span="8">
            <el-button @click="showPopView({positioning:'top-right'},offset = [0, 0])">右上</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-button @click="showPopView({positioning:'center-left'},offset = [0, 0])">正左</el-button>
          </el-col>
          <el-col :span="8">
            <el-button @click="showPopView({positioning:'center-center'},offset = [0, 0])">中间</el-button>
          </el-col>
          <el-col :span="8">
            <el-button @click="showPopView({positioning:'center-right'},offset = [0, 0])">正右</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-button @click="showPopView({positioning:'bottom-left'},offset = [0, 0])">左下</el-button>
          </el-col>
          <el-col :span="8">
            <el-button @click="showPopView({positioning:'bottom-center'},offset = [0, 0])">正下</el-button>
          </el-col>
          <el-col :span="8">
            <el-button @click="showPopView({positioning:'bottom-right'},offset = [0, 0])">右下</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">X偏移量</el-col>
          <el-col :span="20">
            <el-slider v-model="offsetX" @change="setOffest" :min="-50" :max="50"></el-slider>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">Y偏移量</el-col>
          <el-col :span="20">
            <el-slider v-model="offsetY" @change="setOffest" :min="-50" :max="50"></el-slider>
          </el-col>
        </el-row>
      </el-row>
    </el-col>
  </el-container>
</template>

<script>
import MapBase from '../components/gis/mapBase'
import SeeGate from '#/SeeGate/SeeGate'
import SeePop from '#/SeeMapPop/SeeMapPop'
import popView from './popView'
import SeeGateEventType from '#/SeeGate/SeeGateEventType'
export default {
  name: 'feature',
  components: {
    MapBase
  },
  data() {
    return {
      BASE_URL: process.env.BASE_URL,
      gateDatas: [
        {
          'nodeId': '5',
          'parentId': '4',
          'nodeCode': '11',
          'nodeName': 'k1',
          'nodeType': '2',
          'lastDataTime': '1543816824294',
          'lng': '114.39277724975',
          'lat': '30.595631349259',
          'nodeStatus': '1'
        },
        {
          'nodeId': '7',
          'parentId': '4',
          'nodeCode': '22',
          'nodeName': 'k2',
          'nodeType': '2',
          'lastDataTime': '1542779175368',
          'lng': '114.34119310648',
          'lat': '30.553915136205',
          'nodeStatus': '1'
        },
        {
          'nodeId': '8',
          'parentId': '4',
          'nodeCode': '33',
          'nodeName': 'k3',
          'nodeType': '2',
          'lastDataTime': '1543909001405',
          'lng': '114.43154315717',
          'lat': '30.505834228355',
          'nodeStatus': '1'
        },
        {
          'nodeId': '9',
          'parentId': '4',
          'nodeCode': '44',
          'nodeName': 'k4',
          'nodeType': '2',
          'lastDataTime': '1541061740247',
          'lng': '114.39918369097',
          'lat': '30.505305100361',
          'nodeStatus': '1'
        },
        {
          'nodeId': '21',
          'parentId': '4',
          'nodeCode': 'fewfew',
          'nodeName': 'fw',
          'nodeType': '3',
          'lastDataTime': '1544435827211',
          'lng': '114.3436391806',
          'lat': '30.556891279945',
          'nodeStatus': '0'
        },
        {
          'nodeId': '35',
          'parentId': '4',
          'nodeCode': 'qwe',
          'nodeName': '35qwe',
          'nodeType': '3',
          'lastDataTime': '1544435827211',
          'lng': '114.3496391806',
          'lat': '30.556891279945',
          'nodeStatus': '0'
        },
        {
          'nodeId': '23',
          'parentId': '22',
          'nodeCode': 'ces001',
          'nodeName': 'ces001',
          'nodeType': '2',
          'lastDataTime': '1541401392235',
          'lng': '114.39646796935',
          'lat': '30.491384109216',
          'nodeStatus': '1'
        }
      ],
      seeGate: null,
      seePop: null,
      level: 0,
      offsetX: 0,
      offsetY: 0,
      positioning: 'bottom-center'
    }
  },
  computed: {
  },
  methods: {
    mapInited() {
      this.seeGate = new SeeGate()
        .addTo(this.$refs.map.thismap)
        .setStyle(this.styleJsonFunction)
        .createGateFeatures(this.gateDatas)
        .on(SeeGateEventType.GATEMOVEON, this.setView)
    },
    styleJsonFunction(feature, mapZoom) {
      let json = {
        image: {
          type: 'icon',
          value: {
            src: this.BASE_URL + 'gate/normal.png',
            scale: 0.8,
          }
        }
      }
      if (feature.get('selected')) {
        json.image.value.src = this.BASE_URL + 'gate/warm.png'
      }
      return json
    },
    showPopView({ positioning = this.positioning, offset = [0, 0] } = {}) {
      this.positioning = positioning
      this.offsetX = offset[0]
      this.offsetY = offset[1]
      if (!this.seePop) {
        this.seePop = new SeePop({ positioning, offset }, popView).addTo(this.$refs.map.thismap)
      } else {
        this.seePop.setOptions({ positioning, offset })
      }
      this.level = 1
    },
    setView(evt) {
      if (!this.seePop) {
        return
      }
      let gate = evt.gates
      if (gate) {
        const gateInfo = gate.getProperties()
        const params = {
          propsData: {
            popData: gateInfo
          }
        }
        this.seePop.createVuePop(params)
          .setPopPosition([gateInfo.lng, gateInfo.lat])
          .setVisible(true)
      } else {
        this.seePop.setVisible(false)
      }
    },
    setOffest() {
      this.showPopView({ offset: [this.offsetX, this.offsetY] })
    },

  },
  destroyed() {
  }
}
</script>

<style scoped>
</style>
