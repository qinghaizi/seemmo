/**
 * Created by lyuwei
 * User: lvwei@seemmo.com
 * Date: 2018/12/14
 * Describe:
 * Log:
 *  ---- 2018/12/14 16:14 [lyuwei] 初次添加
 */
import olEventBase from 'ol/events/Event'

export default class DrawEvent extends olEventBase {
  constructor (type, geometry, id, message) {
    super(type)

    this.geometry = geometry
    this.message = message
    this.id = id
  }
}
