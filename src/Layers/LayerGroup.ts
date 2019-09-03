/*
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2019-03-07 14:20:41
 * @LastEditTime: 2019-05-10 11:18:41
 */

import Observable from '../Core/Observable'
import BaseLayer from './BaseLayer';
import SeeMap from '../SeeMap';

interface LayerGroupParmas {
  groupIndex?: number,
  title?: string,
  layers?: BaseLayer[]
}

export default class LayerGroup extends Observable {
  private _title:string
  private _layers: Array<BaseLayer>
  // 设置当前group的索引值
  private _groupIndex: number
  // 存放当前的容器seemap对象
  private _seemap: SeeMap

  constructor (opt: LayerGroupParmas) {
    super()
    this._title = opt.title ? opt.title : ''
    this._layers = opt.layers ? opt.layers : []
    this._groupIndex = opt.groupIndex ? opt.groupIndex : 0
  }

  
  /**
   * 获取当前图层组的图层组排序
   */
  public get groupIndex(): number {
    return this._groupIndex
  }

  public get title(): string {
    return this._title
  }

  public get seeMap(): SeeMap {
    return this._seemap
  }

  public get layers(): BaseLayer[] {
    return this._layers
  }

  /**
   * 将图层组加入到地图容器中
   * @param seemap 地图容器
   * @returns {LayerGroup}
   */
  public addTo (seemap: SeeMap): LayerGroup {
    if (this.seeMap) {
      let t = this.seeMap._seemapLayerGroups.indexOf(this)
      this.seeMap._seemapLayerGroups.splice(t, 1)
      this.layers.forEach(eachLayer => {
        eachLayer._removeMapbox()
      })
    }
    this._seemap = seemap
    this._groupIndex = this.seeMap._seemapLayerGroups.push(this)
    this.layers.forEach(eachLayer => {
      eachLayer._setLayerMap(this.seeMap)
      eachLayer._addMapbox()
    })
    return this
  }

  /**
   * 通过某个属性的值来查找对应的图层
   * @param key   需要查找的属性
   * @param value 需要查找的属性对应的值
   * @returns {Array} 查找得到的图层组中满足条件的所有图层
   */
  public getLayersBy (key: string, value: any): BaseLayer[] {
    let allGroupLayers = this._layers
    let findLayers: BaseLayer[] = []
    allGroupLayers.forEach((eachItem) => {
      if(eachItem.getValueBy(key) === value) {
        findLayers.push(eachItem)
      }
    })
    return findLayers
  }

  /**
   * 删除图层
   * @param layer 需要删除的图层对象
   * */
  public removeLayer (layer: BaseLayer | Array<BaseLayer>): void {
    if (!Array.isArray(layer)) {
      layer = [layer]
    }
    layer.forEach(delLayer => {
      let f = this.layers.indexOf(delLayer)
      if (f > -1) {
        delLayer._removeMapbox()
        delLayer.cleanMapboxListeners()
        // 讲图层从容器中移除，并设置其seemap和layergroup为空
        delLayer._setLayerMap()
        delLayer._setSeeLayerGroup(null)
        this.layers.splice(f, 1)
      }
    })
  }
  /**
   * 移除当前数组中的所有图层
   */
  public removeAllLayers(): this {
    this.layers.forEach(eachLayer => {
      eachLayer._removeMapbox()
      eachLayer._setLayerMap()
      eachLayer._setSeeLayerGroup(null)
    })
    this._layers = []
    return this
  }

  /**
   * @function 添加图层
   *
   * @param layer 需要添加的图层对象
   */
  public addLayer (layer: BaseLayer): void {
    // 检查图层是否存在，如果存在不重复添加
    if (this.layers.indexOf(layer) === -1) {
      this.layers.push(layer)
      // layer.addTo(this)
      layer._addMapbox()
    }
  }
}
