/**
 * Created by lyuwei
 * User: lvwei@seemmo.com
 * Date: 2018/12/07
 * Describe:
 * Log:
 *  ---- 2018/12/07 11:35 [lyuwei] 初次添加
 */
import olEventBase from 'ol/events/Event'

export default class SeeGateEvent extends olEventBase {
  constructor (type, gates, coordinate, message) {
    super(type)

    this.gates = gates
    this.coordinate = coordinate
    this.message = message
  }
}
