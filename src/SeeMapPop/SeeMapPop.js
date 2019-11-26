/*
 * @Descripttion:
 * @Date: 2019-09-05 13:18:32
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 13:20:09
 */
import Observable from 'ol/Observable'
import {
    mergeOptions
} from '../Utils'
import Overlay from 'ol/Overlay'
import Vue from 'vue'
import SeeMap from '../SeeMap'

const options = {
    offset: [0, 0],
    positioning: 'bottom-center',

    autoPan: false
}

export default class SeeMapPop extends Observable {
    constructor (setOptions = {}, vueClass) {
        super()

        this.getOptions = mergeOptions(options, setOptions)
        this._seemmoMap = null
        this._Overlay = new Overlay({
            id: new Date().getTime(),
            element: '',
            autoPan: false,
            offset: this.getOptions.offset,
            positioning: this.getOptions.positioning
        })
        this._vueClass = null
        this._vueVm = null
        this._lastVue = null
        this._visible = true

        if (vueClass) {
            this.setVueClass(vueClass)
        }
    }

    /**
     * 添加至容器中
     * @param seemap {SeeMap} 地图容器
     * @returns {SeeGate}
     */
    addTo (seemap) {
        if (this._seemmoMap && this._visible) {
            this._seemmoMap.removeOverlay(this._Overlay)
        }
        if (!(seemap instanceof SeeMap)) {
            throw new Error('容器非法！')
        }
        this._seemmoMap = seemap
        if (this._visible) {
            this._seemmoMap.addOverlay(this._Overlay)
        }
        return this
    }

    setVueClass (vueClass) {
        this._vueClass = vueClass
        this._vueVm = Vue.extend(this._vueClass)
        return this
    }

    createVuePop (params) {
        if (this._lastVue) {
            this._lastVue.$destroy()
            this._lastVue = null
        }
        if (!this._vueClass || !this._vueVm) {
            throw new Error('请先设置弹出的class类！')
        }
        this._lastVue = new this._vueVm(params).$mount()
        document.body.appendChild(this._lastVue.$el)
        this._Overlay.setElement(this._lastVue.$el)
        return this
    }

    setOptions (options) {
        this.getOptions = mergeOptions(this.getOptions, options)
        this._Overlay.setOffset(this.getOptions.offset)
        this._Overlay.setPositioning(this.getOptions.positioning)
    }

    setPopPosition (coordinates) {
        if (this._Overlay && this._seemmoMap) {
            if (coordinates instanceof Array) {
                let x = Number(coordinates[0])
                let y = Number(coordinates[1])
                let wg84Coordinate = this._seemmoMap.corTransform(x, y)
                this._Overlay.setPosition(wg84Coordinate)
                if (this.getOptions.autoPan) {
                    this._seemmoMap.getView().setCenter(wg84Coordinate)
                }
            } else if (coordinates === null || coordinates === undefined) {
                this._Overlay.setPosition(null)
            }
        }
        return this
    }

    setVisible (visible = false) {
        this._visible = visible
        if (this._visible && this._seemmoMap) {
            this._seemmoMap.addOverlay(this._Overlay)
        } else {
            this._seemmoMap.removeOverlay(this._Overlay)
        }
        return this
    }

    getVisible () {
        return this._visible
    }

    destroy () {
        if (this._lastVue) {
            this._lastVue.$destroy()
        }
        if (this._Overlay && this._seemmoMap) {
            this._seemmoMap.removeOverlay(this._Overlay)
        }
    }
}
