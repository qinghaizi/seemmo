<!--
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2018-12-24 14:04:31
 * @LastEditTime: 2019-04-29 14:21:37
 -->

<template>
  <el-container>
    <el-main>
      <map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
    </el-main>
    <el-aside width="300px">
      <div>
        <el-button @click="isShowMouseTips = true" type="primary">设置鼠标提示</el-button>
        <el-button @click="isShowMouseTips = false" type="primary">去掉鼠标提示</el-button>
        <el-alert title="单击地图可创建卡口" type="success" style="margin-top:20px;">
        </el-alert>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import MapBase from '../components/gis/mapBase'
import { SeeGate } from '#/index'
export default {
  name: 'gate',
  components: {
    MapBase
  },
  data () {
    return {
      BASE_URL: process.env.BASE_URL,
      defaultProps: {
        children: 'children',
        label: 'nodeName'
      },
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
          'nodeId': '23',
          'parentId': '22',
          'nodeCode': 'ces001',
          'nodeName': 'ces001',
          'nodeType': '2',
          'lastDataTime': '1541401392235',
          'lng': '114.39646796935',
          'lat': '30.491384109216',
          'nodeStatus': '1'
        },
        {
          'nodeId': '24',
          'parentId': '22',
          'nodeCode': 'ces002',
          'nodeName': 'ces002',
          'nodeType': '3',
          'lastDataTime': '1541401406507',
          'lng': '114.36674508222',
          'lat': '30.507623935258',
          'nodeStatus': '1'
        },
        {
          'nodeId': '27',
          'parentId': '22',
          'nodeCode': 'ccews005',
          'nodeName': 'ces005',
          'nodeType': '2',
          'lastDataTime': '1543637477059',
          'lng': '114.34174660305',
          'lat': '30.51142603747',
          'nodeStatus': '1'
        },
        {
          'nodeId': '28',
          'parentId': '4',
          'nodeCode': 'ces006',
          'nodeName': 'ces006',
          'nodeType': '2',
          'lastDataTime': '1542158715626',
          'lng': '114.39833478683',
          'lat': '30.498058840102',
          'nodeStatus': '1'
        },
        {
          'nodeId': '29',
          'parentId': '4',
          'nodeCode': 'ces007',
          'nodeName': 'ces007',
          'nodeType': '3',
          'lastDataTime': '1542015743112',
          'lng': '114.40521197074',
          'lat': '30.497809239294',
          'nodeStatus': '1'
        },
        {
          'nodeId': '32',
          'parentId': '30',
          'nodeCode': 'few',
          'nodeName': 'dfs',
          'nodeType': '2',
          'lastDataTime': '1541402140770',
          'lng': '114.38043908828',
          'lat': '30.505139840613',
          'nodeStatus': '1'
        },
        {
          'nodeId': '34',
          'parentId': '33',
          'nodeCode': 'f3232',
          'nodeName': 'f32f',
          'nodeType': '3',
          'lastDataTime': '1541402161628',
          'lng': '114.36684899496',
          'lat': '30.507812747935',
          'nodeStatus': '1'
        }
      ],
      // 以上为静态数据
      seeGate: null,
      isShowTree: false,
      currentGate: ''
    }
  },
  methods: {
    mapInited: function () {
      this.seeGate = new SeeGate({}).addTo(this.$refs.map.thismap).createGateFeatures(this.gateDatas)
      this.$refs.map.thismap.on('mousemove', this.pointerMoveHandler)
      this.$refs.map.thismap.on('click', this.addGateFeatures)
    },
    pointerMoveHandler (evt) {
      let innerHtml = null
      if (this.isShowMouseTips) {
        innerHtml = evt.lngLat.toString()
      }
      this.$refs.map.thismap.setMouseTips(innerHtml)
      // this.$refs.map.thismap.mouseTips.setLngLat(evt.lngLat).setHTML(`<div>${evt.lngLat.toString()}</div>`).addTo(this.$refs.map.thismap)
    },
    addGateFeatures (evt) {
      const position = evt.lngLat
      const nodeId = new Date().getTime()
      let gate = [{
        nodeId,
        'parentId': '4',
        'nodeCode': '11',
        'nodeName': String(nodeId).slice(10, 13),
        'nodeType': '2',
        'lastDataTime': '1543816824294',
        'lng': position.lng,
        'lat': position.lat,
        'nodeStatus': '1'
      }]
      this.seeGate.addGateFeatures(gate)
    },
    // styleJsonFunction (feature, mapZoom) {
    //   let json = {
    //     image: {
    //       type: 'icon',
    //       value: {
    //         src: this.BASE_URL + 'gate/normal.png',
    //         scale: 0.8,
    //       }
    //     }
    //   }
    //   if (feature.get('selected')) {
    //     json.image.value.src = this.BASE_URL + 'gate/warm.png'
    //   }
    //   return json
    // }
  },
  mounted () { },
  destroyed () {
    this.seeGate.destroy()
  }
}
</script>

<style scoped>
.tree-area {
  height: 50%;
}
</style>
