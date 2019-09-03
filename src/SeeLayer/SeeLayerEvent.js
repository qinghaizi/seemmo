/**
 * Created by lyuwei
 * User: lvwei@seemmo.com
 * Date: 2018/12/12
 * Describe:
 * Log:
 *  ---- 2018/12/12 16:07 [lyuwei] 初次添加
 */

import olEventBase from 'ol/events/Event'

export default class SeeLayerEvent extends olEventBase {
  constructor (type, feature, coordinate, message) {
    super(type)

    this.feature = feature
    this.coordinate = coordinate
    this.message = message
  }
}
