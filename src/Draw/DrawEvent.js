/*
 * @Descripttion:
 * @Date: 2019-09-05 11:18:43
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 13:06:18
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
