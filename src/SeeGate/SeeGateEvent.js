/*
 * @Descripttion:
 * @Date: 2019-09-05 11:18:43
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 13:06:50
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
