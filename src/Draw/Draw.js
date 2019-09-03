/**
 * Created by lyuwei
 * User: lvwei@seemmo.com
 * Date: 2018/12/14
 * Describe:
 * Log:
 *  ---- 2018/12/14 15:59 [lyuwei] 初次添加
 *  ---- 2018/12/24 13:49 [lyuwei] 添加矩形框绘制
 */

import Observable, { unByKey } from 'ol/Observable'
import { mergeOptions } from '../Utils'
import { SeeLayer } from '../SeeLayer'
import DrawEvent from './DrawEvent'
import DrawEventType from './DrawEventType'
import OlDraw, { createBox } from 'ol/interaction/Draw'
import StyleJsonFunction from '../Style'
import SeeMap from '../SeeMap'

const options = {
  type: 'Polygon',
  free: true,
}

export default class Draw extends Observable {
  constructor (sourceSeeLayer = null, setOptions = {}, styleJson = null) {
    super()
    this.getOptions = mergeOptions(options, setOptions)

    this._sourceSeeLayer = null
    this._drawInteraction = null
    this._seemmoMap = null
    this._drawStyle = null

    // 根据初始化的参数来设置相关属性
    if (sourceSeeLayer) {
      this.setSourceSeeLayer(sourceSeeLayer)
    }
    if (styleJson) {
      this.setStyle(styleJson)
    }
  }

  /**
   * 设置对应的地图容器
   * @param seemap {SeeMap} 地图容器
   * @returns {Draw}
   */
  setMap (seemap) {
    if (!(seemap instanceof SeeMap)) {
      throw new Error('容器非法！')
    }
    this._seemmoMap = seemap
    return this
  }

  /**
   * 设置绘制的图层类
   * @param sourceSeeLayer 图层类
   * @return {Draw}
   */
  setSourceSeeLayer (sourceSeeLayer) {
    if (this._drawInteraction) {
      this.remove()
    }
    if (sourceSeeLayer instanceof SeeLayer) {
      this._sourceSeeLayer = sourceSeeLayer
    } else {
      throw new Error('传入的对象不是SeeLayer对象！')
    }
    return this
  }

  /**
   * 设置新属性
   * @param newOptions 新属性
   * @return {Draw}
   */
  setOption (newOptions = {}) {
    this.getOptions = mergeOptions(this.getOptions, newOptions)
    return this
  }

  /**
   * 设置绘制的样式
   * @param styleJson
   * @return {Draw}
   */
  setStyle (styleJson) {
    if (styleJson instanceof Function) {
      throw new Error('该类设置的样式不支持function的方式！')
    }
    this._drawStyle = styleJson
    return this
  }

  /**
   * 激活根据当前类中的设置项，激活绘制功能
   * @return {boolean} 是否成功激活
   */
  active () {
    if (!this._seemmoMap || !this._sourceSeeLayer) {
      this.dispatchEvent(
        new DrawEvent(DrawEventType.MESSAGE, null, null, '请先设置容器和对应的图层类！')
      )
      return false
    }
    let drawObj = {
      source: this._sourceSeeLayer.getLayer().getSource(),
      type: this.getOptions.type,
      freehand: this.getOptions.free,
    }
    // 如果是绘制矩形，则单独处理 2018-12-24
    if (this.getOptions.type.toString().toLowerCase() === 'box') {
      drawObj.type = 'Circle'
      drawObj.geometryFunction = createBox()
    }
    if (this._drawStyle) {
      drawObj.style = StyleJsonFunction(this._drawStyle)
    }
    this._drawInteraction = new OlDraw(drawObj)
    this._drawEndEventKey = this._drawInteraction.on('drawstart', (evt) => {
      this.dispatchEvent(
        new DrawEvent(DrawEventType.DRAWSTART, null, null, '开始绘制!')
      )
    })
    this._drawEndEventKey = this._drawInteraction.on('drawend', (evt) => {
      let constId = 'seemmo-绘制要素-' + new Date().getTime().toString()
      evt.feature.setId(constId)
      setTimeout(() => {
        this.dispatchEvent(
          new DrawEvent(DrawEventType.DRAWEND, evt.feature.getGeometry(), constId, null)
        )
      }, 100)
      this.remove()
    })
    this._seemmoMap.addInteraction(this._drawInteraction)
    return true
  }

  /**
   * 移除当前激活的绘制功能
   * @return {Draw}
   */
  remove () {
    if (this._drawInteraction) {
      unByKey(this._drawEndEventKey)
      this._drawEndEventKey = null
      this._seemmoMap.removeInteraction(this._drawInteraction)
      this._drawInteraction = null
    }

    return this
  }

  /**
   * 销毁对象
   */
  destroy () {
    if (this._drawInteraction) {
      this.remove()
    }
  }
}
