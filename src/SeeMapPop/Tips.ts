/*
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2019-05-05 15:59:33
 * @LastEditTime: 2019-05-06 13:45:36
 */

import BasePop, { PopOptions } from './BasePop'
import { assign } from '../Core/obj';

export default class Tips extends BasePop {
    /** 提示内容 */
    private _tips: string
    constructor(setOptions?: PopOptions) {
        super(assign({positioning: 'bottom-left', offset: 10}, setOptions || {}))
        this._mouseMove = this._mouseMove.bind(this)
        // FIXME: 会出现重复监听，或者移除出map容器之后监听不删除的问题
        this.on('SeePopUp', this._initEvent)
    }

    private _initEvent(): void {
        this.seeMap.on('mousemove', this._mouseMove)
    }

    private _mouseMove(ev: mapboxgl.MapMouseEvent & mapboxgl.EventData): void {
        this.setLngLat(ev.lngLat)
    } 

    public setTips(tips: string): this {
        this._tips = tips
        let tipNode = document.createElement('div')
        tipNode.className = 'seemmo-tips'
        tipNode.innerText = tips
        this.content = tipNode

        return this
    }

    public getTips(): string {
        return this._tips
    }
}