/*
 * @Descripttion: 
 * @Date: 2019-09-05 11:18:43
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 13:07:20
 */
import olEventBase from 'ol/events/Event'

export default class SeeLayerEvent extends olEventBase {
  constructor(type, feature, coordinate, message) {
    super(type)

    this.feature = feature
    this.coordinate = coordinate
    this.message = message
  }
}
