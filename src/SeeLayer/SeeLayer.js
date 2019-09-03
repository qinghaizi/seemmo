/**
 * Created by lyuwei
 * User: lvwei@seemmo.com
 * Date: 2018/12/12
 * Describe:
 * Log:
 *  ---- 2018/12/12 15:29 [lyuwei] 初次添加
 */

import Observable, {
  unByKey
} from 'ol/Observable'
import {
  mergeOptions
} from '../Utils'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import SeeLayerEvent from './SeeLayerEvent'
import SeeLayerEvetnType from './SeeLayerEventType'
import SeeMap from '../SeeMap'
import StyleJsonFunction from '../Style'
import Feature from 'ol/Feature'
import LineString from 'ol/geom/LineString'
import Polygon from 'ol/geom/Polygon'
import Point from 'ol/geom/Point'
import {
  readGeometry,
  CoordTrans
} from '../Tools'

const options = {
  enableClick: false,
  layerType: 999,
  layerIndex: 999,
}

const MAX_ANALYSIS_POINTS_NUM = 30

export default class SeeLayer extends Observable {
  /**
   * 构造函数
   * @param setOptions {Object} 设置的option，覆盖默认的配置
   * @param styleJson {Object | Array<Object> | Function } 图层的样式
   */
  constructor (setOptions = {}, styleJson) {
    super()
    this.getOptions = mergeOptions(options, setOptions)
    this._seemmoMap = null
    this._vectorLayer = new VectorLayer({
      name: '图层对象_' + new Date().getTime().toString(),
      layerIndex: this.getOptions.layerIndex,
      layerType: this.getOptions.layerType,
      source: new VectorSource({
        wrapX: false,
      }),
    })

    // 根据styleJson来设置图层的style，
    if (styleJson) {
      this.setStyle(styleJson)
    }
    // 是否可以点击
    this._canClick = this.getOptions.enableClick

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
  addTo (seemap) {
    if (!(seemap instanceof SeeMap)) {
      throw new Error('容器非法！')
    }
    this._seemmoMap = seemap
    this._seemmoMap.getBusinessLayerGroup().addLayer(this._vectorLayer)
    this._initMapEvent()
    return this
  }

  /**
   * 初始化地图相关事件
   * @returns {SeeGate}
   * @private
   */
  _initMapEvent () {
    if (!this._seemmoMap) {
      return
    }

    this._pointerMoveListenerKey = this._seemmoMap.on('pointermove', evt =>
      this._gatePointerMove(evt)
    )
    this._pointerMoveListenerKey = this._seemmoMap.on('singleclick', evt =>
      this._gateClickFunc(evt)
    )
    return this
  }

  /**
   * 通过pixel获取要素，如果图层不显示则返回null
   * @param pixel
   * @returns {Feature|null}
   * @private
   */
  _getFeatureByPixel (pixel) {
    let findFeature = null
    if (this._vectorLayer.getVisible() && this._seemmoMap) {
      findFeature = this._seemmoMap.forEachFeatureAtPixel(
        pixel,
        (feaure, layer) => {
          if (layer === this._vectorLayer) {
            return feaure
          }
        }
      )
    }
    return findFeature
  }

  /**
   * 鼠标移动事件，如果有要素就批发相关事件
   * @param evt olMap上的鼠标事件
   * @private
   */
  _gatePointerMove (evt) {
    if (!this._vectorLayer.getVisible() && this._seemmoMap) {
      return
    }
    let pointFeature = this._getFeatureByPixel(evt.pixel)
    if (pointFeature) {
      this.dispatchEvent(
        new SeeLayerEvent(
          SeeLayerEvetnType.FEATUREMOVEON,
          pointFeature,
          evt.coordinate,
          ''
        )
      )
    }
  }

  /**
   * 鼠标点击事件，如果可以交互就将点击的卡口变更状态
   * @param evt olMap上的鼠标事件
   * @private
   */
  _gateClickFunc (evt) {
    if (this._canClick && this._vectorLayer.getVisible() && this._seemmoMap) {
      let findGate = this._getFeatureByPixel(evt.pixel)
      if (findGate) {
        this.dispatchEvent(
          new SeeLayerEvent(
            SeeLayerEvetnType.FEATURECLICK,
            findGate,
            evt.coordinate,
            ''
          )
        )
      } else {
        this.dispatchEvent(
          new SeeLayerEvent(
            SeeLayerEvetnType.FEATURECLICKNONE,
            null,
            evt.coordinate,
            ''
          )
        )
      }
    }
  }

  /**
   * 更改gate图层的交互状态
   * @param boolean 是否可以点击，默认不可点击
   * @return {SeeGate}
   */
  changeGateClickEnable (boolean = false) {
    this._canClick = boolean
    return this
  }

  /**
   * 当前图层增加要素，存在同一id则先删除后添加
   * @param type {string('point'|'line'|'polygon')} 要素类别
   * @param id {string|number} 要素id
   * @param coordinates {Array<number>|Array<Array<number>>} 点要素就是一个包含坐标的数组，线面要素就是点要素的集合
   * @param properties {Object|null} 设置属性
   * @return {null | geomertry}
   */
  addFeature (type, id, coordinates, properties) {
    if (!id) {
      throw new Error('请提供必要的要素ID，以便区分')
    }
    let feature = null
    switch (type.toString().toLowerCase()) {
      case 'point':
        feature = new Feature({
          geometry: new Point(coordinates),
        })
        break
      case 'line':
        if (!(coordinates instanceof Array) || coordinates.length < 2) {
          throw new Error('请检查线对象的坐标串长度，小于两个不能构成线！')
        }
        feature = new Feature({
          geometry: new LineString(coordinates),
        })
        break
      case 'polygon':
        if (!(coordinates instanceof Array) || coordinates.length < 3) {
          throw new Error('请检查线对象的坐标串长度，小于三个不能构成面！')
        }
        feature = new Feature({
          geometry: new Polygon([coordinates]),
        })
        break
      default:
        throw new Error('请设置正确的要素类型!')
    }
    if (feature) {
      feature.setId(id)
      if (properties) {
        feature.setProperties(properties)
      }
      let findLastFeature = this._vectorLayer.getSource().getFeatureById(id)
      if (findLastFeature) {
        this._vectorLayer.getSource().removeFeature(findLastFeature)
      }
      feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
      this._vectorLayer.getSource().addFeature(feature)
    }
    return feature ? feature.getGeometry() : feature
  }

  /**
   * 通过要素id找到要素
   * @param id 设置的id
   * @return {*} 要素的feature对象
   */
  getFeatureById (id) {
    return this._vectorLayer.getSource().getFeatureById(id)
  }

  /**
   * 删除指定id数组的所有要素
   * @param ids
   * @return {SeeLayer}
   */
  removeFeatures (ids = []) {
    ids.map(eachId => {
      let findFeature = this._vectorLayer.getSource().getFeatureById(eachId)
      if (findFeature) {
        this._vectorLayer.getSource().removeFeature(findFeature)
      }
    })
    return this
  }

  /**
   * 保留给定id数组的所有要素，其余的要素将会被删除
   * @param ids
   * @return {SeeLayer}
   */
  keepFeatures (ids = []) {
    this._vectorLayer.getSource().forEachFeature(eachFeature => {
      if (ids.indexOf(eachFeature.getId()) === -1) {
        this._vectorLayer.getSource().removeFeature(eachFeature)
      }
    })
    return this
  }

  /**
   * 移除所有要素
   * @return {SeeLayer}
   */
  removeAll () {
    this._vectorLayer.getSource().clear()
    return this
  }

  /**
   * 设置gate图层样式
   * @param styleJson {Object | Array | Function} 设置样式
   * @return {SeeGate}
   */
  setStyle (styleJson) {
    if (styleJson instanceof Function) {
      this._vectorLayer.setStyle(feature => {
        let getStyleJson = styleJson(
          feature,
          this._seemmoMap.getView().getZoom()
        )
        return generateStyle(getStyleJson)
      })
    } else {
      this._vectorLayer.setStyle(generateStyle(styleJson))
    }

    function generateStyle (setJson) {
      // 采用instanceof判断的时候，任何类型都是Object类型, 所以先判断数组
      if (setJson instanceof Array) {
        let styles = []
        for (let i = 0; i < setJson.length; i++) {
          styles.push(StyleJsonFunction(setJson[i]))
        }
        return styles
      } else if (setJson instanceof Object) {
        return StyleJsonFunction(setJson)
      }
    }

    return this
  }

  /**
   * 获取当前类使用的图层
   * @return {VectorLayer}
   */
  getLayer () {
    return this._vectorLayer
  }

  /**
   * 显示对象
   * @returns {SeeGate}
   */
  show () {
    this._vectorLayer.setVisible(true)
    return this
  }

  /**
   * 隐藏对象
   * @returns {SeeGate}
   */
  hide () {
    this._vectorLayer.setVisible(false)
    return this
  }

  /**
   * 销毁对象
   */
  destroy () {
    if (!this._seemmoMap) {
      // 如果没有添加到地图上则，则直接删除
      return
    }
    this._seemmoMap.getTopLayerGroup().removeLayer(this._vectorLayer)
    // 清楚监听
    if (this._pointerMoveListenerKey) {
      unByKey(this._pointerMoveListenerKey)
    }
    if (this._singleClickListenerKey) {
      unByKey(this._singleClickListenerKey)
    }
  }

  /**
   * 对给定id的线做最短路径分析，并格式化显示
   * @param lineId 需要格式化的最短路径线对象id
   * @return {SeeLayer}
   */
  analysisOneLine (lineId) {
    let _this = this
    let findFeature = this.getFeatureById(lineId)
    if (
      !findFeature ||
      findFeature
      .getGeometry()
      .getType()
      .toString()
      .toLowerCase() !== 'linestring'
    ) {
      errorCallBack('待分析的对象类型必须是线！')
      return this
    }
    let coors = readGeometry(findFeature.getGeometry()).geom

    this.shortAnalysis(coors, successCallBack, failureCallBack, errorCallBack)
    return this

    function successCallBack (coorsData) {
      let findFeature = _this.getFeatureById(lineId)
      if (findFeature) {
        let analysisLine = new LineString(coorsData).transform(
          'EPSG:4326',
          'EPSG:3857'
        )
        findFeature.setGeometry(analysisLine)
      }
    }

    function failureCallBack (a) {
      // 暂时没失败不做处理
    }

    function errorCallBack (errorMessage) {
      _this.dispatchEvent(
        new SeeLayerEvent(
          SeeLayerEvetnType.ANALYSISERROR,
          null,
          null,
          errorMessage
        )
      )
    }
  }

  /**
   * 最短路径分析，最多同时分析30个节点
   * @param coors {Array<Array<Number>>} 待分析的坐标串
   * @param success {Function} 成功之后的回调，参数为分析过后的道路数据
   * @param failure {Function} 失败之后的回调，参数是失败event
   * @param error {Function} 错误之后的回调，传参是错误信息
   */
  shortAnalysis (coors = [], success, failure, error) {
    if (!this._seemmoMap) {
      error('请先将图层设置到容器中，以便获取相关请求地址！')
      return
    }
    if (coors instanceof Array && coors.length > 1 && coors.length < MAX_ANALYSIS_POINTS_NUM) {
      let transCoors = []
      coors.map(eachCoor => {
        transCoors.push(
          CoordTrans.gcj02towgs84(Number(eachCoor[0]), Number(eachCoor[1]))
        )
      })
      // init xhr
      const xhr = new XMLHttpRequest()
      xhr.open(
        'post',
        this._seemmoMap.getMapServiceUrl().replace('offlines', '') + '/analysis/get_shortroad',
        // this._seemmoMap.getMapServiceUrl() + '/analysis/short',
        true
      )
      // 设置头
      xhr.setRequestHeader('Content-Type', 'application/json')

      xhr.onload = function (event) {
        // status will be 0 for file:// urls
        if (!xhr.status || (xhr.status >= 200 && xhr.status < 300)) {
          let source = xhr.responseText
          if (source) {
            source = JSON.parse(source)
            if (source.errorCode === 0) {
              let transResponseCoors = []
              source.data.map(eachCoor => {
                transResponseCoors.push(
                  CoordTrans.wgs84togcj02(eachCoor[0], eachCoor[1])
                )
              })
              success.call(this, transResponseCoors)
            } else {
              error(source.message)
            }
            success.call(this, source)
          } else {
            failure.call(this)
          }
        } else {
          failure.call(this)
        }
      }.bind(this)

      xhr.onerror = function () {
        failure.call(this)
      }.bind(this)

      let param = {
        'coordinates': transCoors
      }
      // // send data white response
      // xhr.send(JSON.stringify(transCoors))
      xhr.send(param)
    } else {
      error('请检查待分析的坐标数组！')
    }
  }
}
