<!--
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2019-01-03 10:57:52
 * @LastEditTime: 2019-05-09 17:33:14
 -->

<template>
  <el-container>
    <el-main>
      <map-base ref="map" style="height: 100%; width: 100%" @mapInited="mapInited"></map-base>
    </el-main>
    <el-aside width="300px">
      <div class="tree-area">
        <el-tree v-show="isShowTree" :data="gateDatas" :props="defaultProps" ></el-tree>
        <el-tag v-show="currentGate" type="success" style="float:left;margin-top:10px;">当前点击:{{currentGate}}</el-tag>
        <el-tag v-show="currentUnGate" type="error" style="float:left;margin-top:10px;">当前取消选中:{{currentUnGate}}</el-tag>
      </div>
      <div>
        <el-row class="btn-wrap">
          <el-button @click="createGateFeatures" v-show="level===1" type="primary">创建卡口</el-button>
          <el-button @click="setStyle" v-show="level===2" type="primary">自定义卡口样式</el-button>
          <el-button @click="setSelectedGates" v-show="level===3" type="primary">一键选中5,21,7</el-button>
          <el-button @click="getSelectGateIds" v-show="level===4" type="primary">获取已选择卡口id</el-button>
        </el-row>
        <el-row class="btn-wrap">
          <el-button @click.once="addGateFeatures" v-show="level===2" type="primary">再加一些卡口</el-button>
          <el-button @click="changeGateClickEnable" v-show="level===3" type="primary">设置卡口点击交互</el-button>
        </el-row>
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
      gateDatas2: [
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
      currentGate: '',
      currentUnGate: '',
      level: 1
    }
  },
  methods: {
    mapInited: function () {
      this.seeGate = new SeeGate().addTo(this.$refs.map.thismap)
      // 可点击卡口
      // this.seeGate.changeGateClickEnable(true)
      // 监听卡口点击
      this.seeGate.on('gateSelect', (eventObj) => {
        if (eventObj.gates) {
          this.currentGate = eventObj.gates.map(each => each['nodeName']).join(',')
        }
      })
      this.seeGate.on('gateUnSelect', (eventObj) => {
        if (eventObj.gates) {
          this.currentUnGate = eventObj.gates.map(each => each['nodeName']).join(',')
        }
      })
    },
    createGateFeatures () {
      this.isShowTree = true
      this.level = 2
      let gate84 = {
          'nodeId': '99',
          'parentId': '4',
          'nodeCode': '444',
          'nodeName': 'k484',
          'nodeType': '2',
          'lastDataTime': '1541061740247',
          'lng': '114.39364319007817',
          'lat': '30.507611099084592',
          'nodeStatus': '1'
        }
      this.gateDatas.push(gate84)
      this.seeGate.createGateFeatures(this.gateDatas)
    },
    addGateFeatures () {
      this.seeGate.addGateFeatures(this.gateDatas2)
    },
    setStyle () {
      this.level = 3
      this.seeGate.setStyle([
        {
          type: 'symbol',
          layout: {
            'icon-image': 'gate-{_icon}',
            'icon-anchor': 'bottom',
            // 设置是否进行碰撞检测，关闭则全部显示
            'icon-allow-overlap': true
          },
          minzoom: 9,
        },
        {
          type: 'circle',
          paint: {
            'circle-color': 'rgba(1, 0, 0, 1)'
          },
          maxzoom: 9
        }
      ])
    },
    changeGateClickEnable () {
      this.level = 4
      this.seeGate.changeGateClickEnable(true)
    },
    getSelectGateIds () {
      const selectedId = this.seeGate.SelectedGateIds
      this.$notify({
        title: '选中之id',
        message: selectedId,
        type: 'success'
      })
    },
    setSelectedGates () {
      this.seeGate.setSelectedGates(['5', '21', '7'])
    },
    handleNodeClick (a, b, c) {
      this.currentGate = a.nodeName
      this.seeGate.setSelectedGates(a.nodeId)
    },
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
.btn-wrap {
  margin-top: 10px;
}
</style>
