/*
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2019-05-08 17:58:29
 * @LastEditTime: 2019-05-09 17:08:19
 */

import EventBase from '../Core/events/Event'

export default class LayerEvent extends EventBase {
    /** 选中的 features 要素 */
  public features?: mapboxgl.MapboxGeoJSONFeature[]
  /** 当前坐标点 */
  public coordinate?: mapboxgl.LngLat
  /** 提示文本 */
  public message?: string
  /** 原始事件信息 */
  public source?: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData

  constructor (
      type: string,
      eventObj?: {
          features?: mapboxgl.MapboxGeoJSONFeature[],
          coordinate?: mapboxgl.LngLat,
          message?: string,
          source?: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData
    }) {
        super(type)
        const ev_obj = eventObj || {}
        this.features = ev_obj.features
        this.coordinate = ev_obj.coordinate
        this.message = ev_obj.message
        this.source = ev_obj.source
    }
}

export class GateEvent extends LayerEvent {
    public gates: any
    constructor (
        type: string,
        eventObj?: {
            features?: mapboxgl.MapboxGeoJSONFeature[],
            coordinate?: mapboxgl.LngLat,
            message?: string,
            source?: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData
      }) {
          super(type, eventObj)
          if (eventObj && eventObj.features) {
            this.gates = eventObj.features.map(eachFeature => {
                return eachFeature.properties
            })
          }
      }
}