/*
 * @Descripttion:
 * @Date: 2019-09-05 13:18:32
 * @LastEditors: tande
 * @LastEditTime: 2019-11-26 18:21:30
 */
import {
    SeeMap
} from '#/index'

export function initMap (div) {
    let _map = new SeeMap(div, 'http://10.10.4.92/map/tiledmap/black/{z}/{x}/{y}.png')

    return _map
}
