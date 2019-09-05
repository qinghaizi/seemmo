/*
 * @Descripttion: 
 * @Date: 2019-09-05 11:18:43
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 13:05:12
 */
import OLLayerGroup from 'ol/layer/Group'
import OLLayerBase from 'ol/layer/Base'

export default class LayerGroup extends OLLayerGroup {
  // eslint-disable-next-line
  constructor(param) {
    super(param)
  }

  /**
   * 将图层组加入到地图容器中
   * @param seemap 地图容器
   * @returns {LayerGroup}
   */
  addTo(seemap) {
    seemap.addLayer(this)
    return this
  }

  /**
   * 通过某个属性的值来查找对应的图层
   * @param key   需要查找的属性
   * @param value 需要查找的属性对应的值
   * @returns {Array} 查找得到的图层组中满足条件的所有图层
   */
  getLayersBy(key, value) {
    if (!key || !value) {
      return []
    }
    let allGroupLayers = this.getLayers()
    let findLayers = []

    allGroupLayers.forEach((eachItem) => {
      if (eachItem.get(key) === value) {
        findLayers.push(eachItem)
      }
    })

    return findLayers
  }

  /**
   * 移除当前数组中的所有图层
   */
  removeAllLayers() {
    let allGroupLayers = this.getLayers()

    allGroupLayers.clear()
  }

  /**
   * @function 添加图层
   *
   * @param layer 需要添加的图层对象
   */
  addLayer(layer) {
    let allGroupLayers = this.getLayers()

    if (layer instanceof OLLayerBase) {
      allGroupLayers.push(layer)
      if (allGroupLayers.getArray().length > 1) {
        LayerGroup.sortLayers(allGroupLayers.getArray())
      }

      // let index = this._findInsertIndex(layer)
      // // insertAt
      // if (index !== -1) {
      //   allGroupLayers.insertAt(index, layer)
      // } else {
      //   allGroupLayers.push(layer)
      // }
    } else {
      throw new Error('非法的图层类型')
    }
  }

  /**
   * 查找传入图层需要插入的索引位置
   * @param layer 传入的图层
   * @returns {number} 插入的索引位置
   * @private
   */
  _findInsertIndex(layer) {
    let index = -1
    let layerPorperties = layer.getProperties()

    if (layerPorperties.hasOwnProperty('layerIndex') && layerPorperties.hasOwnProperty('layerType')) {
      let allGroupLayers = this.getLayers()

      for (let i = 0; i < allGroupLayers.getLength(); i++) {
        let property = allGroupLayers.item(i).getProperties()

        if (property.hasOwnProperty('layerIndex') && property.hasOwnProperty('layerType')) {
          let typeBoolean = Number(layerPorperties['layerType']) - Number(property['layerType'])
          let indexBoolea = Number(layerPorperties['layerIndex']) - Number(property['layerIndex'])

          if (typeBoolean > 0) {
            index = i + 1
            break
          } else if (typeBoolean === 0) {
            // tyep 相等，判断index
            if (indexBoolea >= 0) {
              index = i + 1
              if (indexBoolea === 0) {
                break
              }
            }
          }
        }
      }
    }

    return index
  }

  /**
   * 图层排序，使用图层属性中的layerInde和layerType
   * @param layers 待排序的图层数组
   * @returns {Array} 排好序的图层
   */
  static sortLayers(layers) {
    layers.sort(function (layerA, layerB) {
      let propertyA = layerA.getProperties()
      let propertyB = layerB.getProperties()

      if (!propertyA.hasOwnProperty('layerIndex') ||
        !propertyA.hasOwnProperty('layerType') ||
        !propertyB.hasOwnProperty('layerIndex') ||
        !propertyB.hasOwnProperty('layerType')
      ) {
        return null
      }

      if (propertyA.layerType === propertyB.layerType) {
        return propertyA.layerIndex - propertyB.layerIndex
      }
      return propertyA.layerType - propertyB.layerType
    })
  }

  /**
   * 删除图层
   * @param layer 需要删除的图层对象
   * */
  removeLayer(layer) {
    let allGroupLayers = this.getLayers()

    if (layer instanceof OLLayerBase) {
      allGroupLayers.remove(layer)
    }
  }

  /**
   * 删除图层组
   * @param { Array } layers 需要删除的图层数组对象
   * */
  removeLayers(layers) {
    let _this = this

    if (layers instanceof Array) {
      for (let Layermap in layers) {
        _this.removeLayer(layers[Layermap])
      }
    }
  }
}
