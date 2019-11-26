/*
 * @Descripttion:
 * @Date: 2019-09-05 13:18:32
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 13:18:32
 */
import OLOverlay from 'ol/Overlay'
import './seeTips.less'

export function createPointTips (olmap) {
    if (!olmap) {
        throw new Error('创建tips需要对应的map容器')
    }

    if (olmap.pointTipsElement) {
        olmap.pointTipsElement.parentNode.removeChild(olmap.pointTipsElement)
        olmap.removeOverlay(olmap.pointTips)
    }
    olmap.pointTipsElement = document.createElement('div')
    olmap.pointTipsElement.className = 'seemmo-tooltip tooltip-point'
    olmap.pointTips = new OLOverlay({
        element: olmap.pointTipsElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    })
    olmap.addOverlay(olmap.pointTips)
}

export function createMouseTips (olmap) {
    if (!olmap) {
        throw new Error('创建tips需要对应的map容器')
    }

    if (olmap.mouseTipsElement) {
        olmap.mouseTipsElement.parentNode.removeChild(olmap.mouseTipsElement)
        olmap.removeOverlay(olmap.mouseTips)
    }
    olmap.mouseTipsElement = document.createElement('div')
    olmap.mouseTipsElement.className = 'seemmo-tooltip'
    olmap.mouseTips = new OLOverlay({
        element: olmap.mouseTipsElement,
        offset: [15, 0],
        positioning: 'center-left'
    })
    olmap.addOverlay(olmap.mouseTips)
}
