<!--
 * @Descripttion:
 * @Date: 2019-09-05 10:19:34
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 10:19:34
 -->

<template>
  <el-container>
    <el-main>
      <map-base
        ref="map"
        style="height: 100%; width: 100%"
        @mapInited="mapInited"
      ></map-base>
    </el-main>
    <el-aside width="300px">
      <div>
        <el-button type="primary" @click="addPoint">添加一个点</el-button>
        <el-button type="primary" @click="addLine">添加一条红线</el-button>
        <el-button type="primary" @click="addPolylon">添加一个黑色面</el-button>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import MapBase from '../components/gis/mapBase';
import { SeeLayer } from '#/index';
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
          nodeId: '23',
          parentId: '22',
          nodeCode: 'ces001',
          nodeName: 'ces001',
          nodeType: '2',
          lastDataTime: '1541401392235',
          lng: '114.39646796935',
          lat: '30.491384109216',
          nodeStatus: '1'
        },
        {
          nodeId: '24',
          parentId: '22',
          nodeCode: 'ces002',
          nodeName: 'ces002',
          nodeType: '3',
          lastDataTime: '1541401406507',
          lng: '114.36674508222',
          lat: '30.507623935258',
          nodeStatus: '1'
        },
        {
          nodeId: '27',
          parentId: '22',
          nodeCode: 'ccews005',
          nodeName: 'ces005',
          nodeType: '2',
          lastDataTime: '1543637477059',
          lng: '114.34174660305',
          lat: '30.51142603747',
          nodeStatus: '1'
        },
        {
          nodeId: '28',
          parentId: '4',
          nodeCode: 'ces006',
          nodeName: 'ces006',
          nodeType: '2',
          lastDataTime: '1542158715626',
          lng: '114.39833478683',
          lat: '30.498058840102',
          nodeStatus: '1'
        },
        {
          nodeId: '29',
          parentId: '4',
          nodeCode: 'ces007',
          nodeName: 'ces007',
          nodeType: '3',
          lastDataTime: '1542015743112',
          lng: '114.40521197074',
          lat: '30.497809239294',
          nodeStatus: '1'
        },
        {
          nodeId: '32',
          parentId: '30',
          nodeCode: 'few',
          nodeName: 'dfs',
          nodeType: '2',
          lastDataTime: '1541402140770',
          lng: '114.38043908828',
          lat: '30.505139840613',
          nodeStatus: '1'
        },
        {
          nodeId: '34',
          parentId: '33',
          nodeCode: 'f3232',
          nodeName: 'f32f',
          nodeType: '3',
          lastDataTime: '1541402161628',
          lng: '114.36684899496',
          lat: '30.507812747935',
          nodeStatus: '1'
        }
      ],
      // 以上为静态数据
      seeLayer: null
    }
  },
  methods: {
    mapInited: function () {
      this.seeLayer = new SeeLayer().addTo(this.$refs.map.thismap)
    },
    addPoint () {
      this.seeLayer.addFeature('point', 100, [
        114.39277724975,
        30.595631349259
      ])
      this.seeLayer.setStyle(this.styleJsonFunction)
    },
    addLine () {
      this.seeLayer.addFeature('line', 102, [
        [114.39277724975, 30.595631349259],
        [112.39277724975, 35.595631349259]
      ])
      this.seeLayer.setStyle({
        stroke: {
          width: 3,
          color: 'rgba(255, 0, 0, 1)'
        }
      })
    },
    addPolylon () {
      this.seeLayer.addFeature('polygon', 103, [
        [114.19277724975, 30.695631349259],
        [114.09277724975, 30.095631349259],
        [114.99277724975, 30.795631349259],
        [114.39277724975, 30.595631349259]
      ])
      this.seeLayer.setStyle({
        fillColor: 'rgba(0, 0, 0, 0.6)'
      })
    },
    styleJsonFunction (feature, mapZoom) {
      let scale = mapZoom > 10 ? 1 : 0.8
      let json = {
        image: {
          type: 'icon',
          value: {
            src: this.BASE_URL + 'gate/normal.png',
            scale: scale
          }
        }
      }
      if (feature.get('selected')) {
        json.image.value.src = this.BASE_URL + 'gate/warm.png';
      }
      return json
    }
  },
  mounted () {},
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
