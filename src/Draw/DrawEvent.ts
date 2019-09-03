/*
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2018-12-20 21:18:22
 * @LastEditTime: 2019-04-10 14:52:48
 */
import olEventBase from '../Core/events/Event'

export default class DrawEvent extends olEventBase {
  public data:any
  constructor (type: string, eventData: any) {
    super(type)
    
    this.data = eventData
  }
}
