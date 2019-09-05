/*
 * @Descripttion: 
 * @Date: 2019-09-05 11:18:43
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 11:18:43
 */
import {
  mergeOptions
} from '../Utils'
import SeeGateEvent from './SeeGateEvent'
import SeeGateEventType from './SeeGateEventType'
import SeeMap from '../SeeMap'
import Observable, {
  unByKey
} from 'ol/Observable'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import StyleJsonFunction from '../Style'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'

const options = {
  enableClick: false,
  enableShowLabel: true,
  clickMinZoom: 10,
  constKey: {
    name: 'nodeName',
    id: 'nodeId',
    lat: 'lat',
    lng: 'lng',
  }
}

export default class SeeGate extends Observable {
  constructor(setOptions = {}, styleJson) {
    super()
    this.getOptions = mergeOptions(options, setOptions)
    this._seemmoMap = null
    this._gateLayer = new VectorLayer({
      name: '所有卡口_' + new Date().getTime().toString(),
      layerIndex: 10,
      layerType: 10,
      source: new VectorSource({
        wrapX: false
      }),
    })
    // 根据styleJson来设置图层的style，
    if (styleJson) {
      this.setStyle(styleJson)
    }
    // 是否可以点击
    this._canClick = this.getOptions.enableClick
    // 当前所有是点击状态的卡口, 按照点击顺序
    this._selectedGateIds = []
    // 所有卡口 ID 用来添加的时候去重
    this._allGateIds = []

    // 属性设置结束，开始设置相关初始化内容
    this._pointerMoveListenerKey = null
    this._singleClickListenerKey = null
    this._initMapEvent()
  }

  /**
   * 添加至容器中
   * @param seemap {SeeMap} 地图容器
   * @returns {SeeGate}
   */
  addTo(seemap) {
    if (!(seemap instanceof SeeMap)) {
      throw new Error('容器非法！')
    }
    this._seemmoMap = seemap
    this._seemmoMap.getTopLayerGroup().addLayer(this._gateLayer)
    this._initMapEvent()
    return this
  }

  /**
   * 设置gate图层样式
   * @param styleJson {Object | Array | Function} 设置样式
   * @return {SeeGate}
   */
  setStyle(styleJson) {
    if (styleJson instanceof Function) {
      this._gateLayer.setStyle((feature) => {
        let getStyleJson = styleJson(feature, this._seemmoMap.getView().getZoom())
        return generateStyle(getStyleJson)
      })
    } else {
      this._gateLayer.setStyle(generateStyle(styleJson))
    }
    // 使样式生效
    this._gateLayer.changed()

    function generateStyle(setJson) {
      if (setJson instanceof Object) {
        return StyleJsonFunction(setJson)
      } else if (setJson instanceof Array) {
        let styles = []
        for (let i = 0; i < setJson.length; i++) {
          styles.push(StyleJsonFunction(setJson[i]))
        }
        return styles
      }
    }

    return this
  }

  /**
   * 更改gate图层的交互状态
   * @param boolean 是否可以点击，默认不可点击
   * @return {SeeGate}
   */
  changeGateClickEnable(boolean = false) {
    this._canClick = boolean
    // 每次改变状态都要更新要素的点击状态
    this.setSelectedGates()
    return this
  }

  /**
   * 初始化地图相关事件
   * @returns {SeeGate}
   * @private
   */
  _initMapEvent() {
    if (!this._seemmoMap) {
      return
    }

    this._pointerMoveListenerKey = this._seemmoMap.on('pointermove', (evt) => this._gatePointerMove(evt))
    this._singleClickListenerKey = this._seemmoMap.on('singleclick', (evt) => this._gateClickFunc(evt))
    return this
  }

  /**
   * 通过pixel获取要素，如果图层不显示则返回null
   * @param pixel
   * @returns {Feature|null}
   * @private
   */
  _getFeatureByPixel(pixel) {
    let findFeature = null
    if (this._gateLayer.getVisible() && this._seemmoMap) {
      findFeature = this._seemmoMap.forEachFeatureAtPixel(pixel, (feaure, layer) => {
        if (layer === this._gateLayer) {
          return feaure
        }
      })
    }
    return findFeature
  }

  /**
   * 鼠标点击事件，如果可以交互就将点击的卡口变更状态
   * @param evt olMap上的鼠标事件
   * @private
   */
  _gateClickFunc(evt) {
    if (this._canClick) {
      let findGate = this._getFeatureByPixel(evt.pixel)

      if (findGate) {
        // 不过滤直接派发事件
        this.dispatchEvent(new SeeGateEvent(SeeGateEventType.GATECLICK, findGate, evt.coordinate))
        let isSlected = !findGate.get('selected')

        if (this._seemmoMap.getView().getZoom() < this.getOptions.clickMinZoom && isSlected) {
          // 取消选择不需要放大到指定的级别
          this.dispatchEvent(new SeeGateEvent(SeeGateEventType.GATEMESSAGE, null, evt.coordinate, '请放大地图再选择点击选择卡口！'))
          return
        }

        findGate.set('selected', isSlected)
        if (isSlected) {
          this._selectedGateIds.push(findGate.get(this.getOptions.constKey.id))
        } else {
          // 再次点击的时候取消选中效果
          let oldIndex = this._selectedGateIds.indexOf(findGate.get(this.getOptions.constKey.id))
          if (oldIndex > -1) {
            this._selectedGateIds.splice(oldIndex, 1)
          }
        }
        // 派发点击事件
        this.dispatchEvent(
          new SeeGateEvent(SeeGateEventType.GATESELECT, findGate, evt.coordinate, findGate.get('selected') ? '选中' : '取消选中')
        )
      }
    }
  }

  /**
   * 鼠标移动事件，如果存在指定字段的名字的话，就可以显示到tips上
   * @param evt olMap上的鼠标事件
   * @private
   */
  _gatePointerMove(evt) {
    if (!this._gateLayer.getVisible()) {
      return
    }
    let pointFeature = this._getFeatureByPixel(evt.pixel)
    if (pointFeature) {
      this.dispatchEvent(
        new SeeGateEvent(SeeGateEventType.GATEMOVEON, pointFeature, evt.coordinate, '鼠标移上')
      )
    }
    if (!this.getOptions.enableShowLabel) {
      return
    }
    if (pointFeature && pointFeature.get(this.getOptions.constKey.name)) {
      this._seemmoMap.setPointTips(evt.coordinate, pointFeature.get(this.getOptions.constKey.name))
    } else {
      this._seemmoMap.setPointTips(null)
    }
  }

  /**
   * 根据gatelist 创建gate要素并添加到图层中,清空重建
   * @param gateList gatelist
   * @returns {SeeGate} 返回当前对象
   */
  createGateFeatures(gateList = []) {
    let features = []
    this._gateLayer.getSource().clear()
    this._allGateIds = []
    this.setSelectedGates([])
    gateList.map((eachGate) => {
      let feature = this._createGateFeature(eachGate)
      if (feature) {
        features.push(feature)
      }
    })

    this._gateLayer.getSource().addFeatures(features)
    return this
  }

  /**
   * 添加要展示的gate，根据设置id的字段来判断并去重
   * @param gateList
   * @return {SeeGate}
   */
  addGateFeatures(gateList = []) {
    let features = []
    gateList.map((eachGate) => {
      let feature = this._createGateFeature(eachGate)
      if (feature) {
        features.push(feature)
      }
    })
    this._gateLayer.getSource().addFeatures(features)
    return this
  }

  /**
   * 创建gate要素，会根据设置的id字段做判断是否重复添加
   * @param gateObj gate要素对象
   * @return {Feature | null} 如果不合法或者已存在则返回null，否则返回feature
   * @private
   */
  _createGateFeature(gateObj = {}) {
    let latKey = this.getOptions.constKey.lat
    let lonKey = this.getOptions.constKey.lng
    let gateId = this.getOptions.constKey.id
    if (gateObj.hasOwnProperty(latKey) && gateObj.hasOwnProperty(lonKey)) {
      // 判断是否添加过，如果添加过不重复添加
      if (gateObj.hasOwnProperty(gateId) && this._allGateIds.indexOf(gateObj[gateId].toString()) === -1) {
        let gateGeom = new Point([Number(gateObj[lonKey]), Number(gateObj[latKey])])
        this._allGateIds.push(gateObj[gateId].toString())
        return new Feature({
          geometry: gateGeom.transform('EPSG:4326', 'EPSG:3857'),
          ...gateObj
        })
      }
    }
    return null
  }

  /**
   * 获取所有选中的卡口id
   * @returns {Array}
   */
  getSelectedGateIds() {
    return this._selectedGateIds
  }

  /**
   * 设置选中的gate
   * @param selecteds {Array} 选中卡口id数组
   * @returns {SeeGate}
   */
  setSelectedGates(selecteds = []) {
    let stringSelectedIds = []
    selecteds.map((eachId) => {
      stringSelectedIds.push(eachId.toString())
    })
    this._gateLayer.getSource().getFeatures().map(
      (feature) => {
        let featureId = feature.get(this.getOptions.constKey.id).toString()
        if (featureId && stringSelectedIds.indexOf(featureId) > -1) {
          feature.set('selected', true)
        } else {
          feature.set('selected', false)
        }
      }
    )
    this._selectedGateIds = stringSelectedIds
    return this
  }

  /**
   * 计算所有包含在传入的面空间对象上的所有要素
   * @param geometry {ol/geom} 空间坐标对象
   * @returns {Array} 包含面的要素id
   */
  calcGateInPolygon(geometry) {
    let inPolygonGates = []
    this._gateLayer.getSource().forEachFeature((feature) => {
      if (geometry.intersectsCoordinate(feature.getGeometry().getCoordinates())) {
        inPolygonGates.push(feature.get(this.getOptions.constKey.id))
      }
    })
    return inPolygonGates
  }

  /**
   * 显示对象
   * @returns {SeeGate}
   */
  show() {
    this._gateLayer.setVisible(true)
    return this
  }

  /**
   * 隐藏对象
   * @returns {SeeGate}
   */
  hide() {
    this._gateLayer.setVisible(false)
    return this
  }

  /**
   * 销毁对象
   */
  destroy() {
    if (!this._seemmoMap) {
      // 如果没有添加到地图上则，则直接删除
      return
    }
    this._seemmoMap.getTopLayerGroup().removeLayer(this._gateLayer)
    // 清楚监听
    if (this._pointerMoveListenerKey) {
      unByKey(this._pointerMoveListenerKey)
    }
    if (this._singleClickListenerKey) {
      unByKey(this._singleClickListenerKey)
    }
  }
}
