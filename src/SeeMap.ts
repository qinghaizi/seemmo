/*
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2019-03-07 14:14:31
 * @LastEditTime: 2019-05-27 19:06:17
 */

import LayerGroup from './Layers/LayerGroup'
import BaseLayer from "./Layers/BaseLayer";
import * as mapboxgl from 'mapbox-gl'
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl-dev'
import 'mapbox-gl/dist/mapbox-gl.css'
import SeeVectorBaseLayer from './Layers/VectorBaseLayer'
import XYZBaseLayer from './Layers/XYZBaseLayer';
import { assign } from './Core/obj'
import Tips from './SeeMapPop/Tips';


interface SeemapOptions {
  /** 地图基本服务地址，不用以 / 结尾，例 http://10.10.4.147:8088/map */
  serviceUrl: string,
  /** 字体和图标资源地址，不用以 / 结尾，例 http://localhost:4001/map_resource */
  resourceUrl: string,
  /** 地图默认缩放级别 */
  zoom?: number,
  /** 地图默认缩放最大级别 */
  maxZoom?: number,
  /** 地图默认缩放最小级别 */
  minZoom?: number,
  /** 地图默认中心点 */
  center?: [number, number],
  /** 地图默认缩放的范围，将忽视center的值 */
  bounds?: [number, number, number, number],
  /** measured in degrees counter-clockwise from north */
  bearing?: number,
  /**  measured in degrees away from the plane of the screen (0-60) */
  pitch?: number,
  /** 是否显示缩放或帮助按钮 */
  zoomSlide?: boolean,
  /** 底图相关设置 */
  baseLayer: {
    /** 底图类型 */
    type: 'vector' | 'xyz',
    /** xyz对应底图服务地址或图层类别，vector对应图层类别 */
    layerTypeOrUrl: string
  },
  /** 重写底层mapbox的options，将忽略所有设置值 */
  extendOptions?: mapboxgl.MapboxOptions
}

let defaultOption: SeemapOptions = {
  serviceUrl: '',
  resourceUrl: '',
  zoom: 11,
  center: [114.41719120, 30.46677258],
  pitch: 0,
  bearing: 0,
  baseLayer: {
    type: 'vector',
    layerTypeOrUrl: 'baseLayer_white'
  }
}

// 最大缩放级别
let MAPMAXZOOM: number = 17
/**
 * SeeMap 基本地图容器
 */
export default class SeeMap extends mapboxgl.Map {
  /** 地图服务地址 */
  private _mapServiceUrl: string
  /** 地图资源地址 */
  private _mapResourceUrl: string
  /** 地图样式类型 */
  private _layerTypeOrUrl: string
  /** 矢量底图图层 */
  private _vectorBaseLayer: BaseLayer
  /** xyz底图图层 */
  private _xyzBaseLayer: BaseLayer
  /** 底图类型 */
  private _baselayerType: string
  /** 缓存layergourp */
  public _seemapLayerGroups: LayerGroup[]
  private readonly _baseLayerGroup: LayerGroup
  private readonly _businessLayerGroup: LayerGroup
  private readonly _topLayerGroup: LayerGroup
  /** 缓存_mapOptions */
  public _mapOptions: mapboxgl.MapboxOptions
  /** 弹出框资源 */
  private readonly pointTips: mapboxgl.Popup
  private readonly mouseTips: Tips
  /**
   * SeeMap 基本地图容器
   * @param mapdivOrId 存放地图容器的div或其Id
   * @param mapServiceUrl 
   * @param optOptions 可选的基本设置参数
   */
  public constructor(mapdivOrId: string | Element, options: SeemapOptions) {
    let getOptions: SeemapOptions = assign(defaultOption, options)
    if (!/[a-zA-z0-9]+:?[0-9]/.exec(getOptions.serviceUrl)) {
      throw new Error('请填写正确的地图服务地址！')
    }
    if (getOptions.resourceUrl.length <= 0) {
      throw new Error('请填写正确的资源路径！')
    } else {
      if (getOptions.resourceUrl.indexOf('http') === -1) {
        getOptions.resourceUrl = window.location.origin + getOptions.resourceUrl
      }
    }
    let mapboxOptions: mapboxgl.MapboxOptions = {
      container: mapdivOrId,
      zoom: getOptions.zoom,
      center: getOptions.center,
      doubleClickZoom: false,
      maxZoom: getOptions.maxZoom,
      minZoom: getOptions.minZoom,
      pitch: getOptions.pitch,
      bearing: getOptions.bearing,
      // 雪碧图和基本的字体位置
      style: {
        version: 8,
        sprite: `${getOptions.resourceUrl}/sprite`,
        glyphs: `${getOptions.resourceUrl}/font/{fontstack}/{range}.pbf`,
        sources: {},
        layers: []
      }
    }
    if (getOptions.extendOptions) {
      mapboxOptions = assign(mapboxOptions, getOptions.extendOptions)
    }
    super(mapboxOptions)

    this._mapOptions = mapboxOptions

    // 底图默认vector，地图样式为baseLayer_white
    this._baselayerType = getOptions.baseLayer.type
    this._layerTypeOrUrl = getOptions.baseLayer.layerTypeOrUrl
    this._mapServiceUrl = getOptions.serviceUrl
    this._mapResourceUrl = getOptions.resourceUrl

    this._seemapLayerGroups = []

    this._baseLayerGroup = new LayerGroup({ title: '底图图层', groupIndex: 0 }).addTo(this)
    this._businessLayerGroup = new LayerGroup({ title: '业务图层', groupIndex: 1 }).addTo(this)
    this._topLayerGroup = new LayerGroup({ title: '置顶图层', groupIndex: 2 }).addTo(this)

    // FIXME: 改成自由的basepop弹出框
    this.pointTips = new mapboxgl.Popup({
      offset: { bottom: [0, 0] },// 2.5D效果下，弹出的位置不好控制，图标的大小都会影响弹出内容
      closeButton: false,
      closeOnClick: false
    })
    this.mouseTips = new Tips({}).addTo(this)

    this.on('load', () => {
      // 根据底图类型判断加载XYZBase还是VectorBase
      if (this._baselayerType === 'vector') {
        this.addSeeVectorBaseLayer()
      } else if (this._baselayerType === 'xyz') {
        this.addXYZBaseLayer()
      }
      // 2. 如果设置有底图范围，则初始化到指定的范围
      if (getOptions.bounds) {
        this.moveToExtent(getOptions.bounds)
      }
      if (getOptions.zoomSlide) {
        this.addControl(new mapboxgl.NavigationControl())
      }
    })
    // init event
    this._initEvent()
  }

  /**
   * 初始化相关的监听事件
   */
  private _initEvent(): void {

  }

  /** 加载XYZBaseLayer */
  public addXYZBaseLayer(): void {
    this._xyzBaseLayer = new XYZBaseLayer(
      `${this.getMapServiceUrl()}`,
      `${this.getLayerTypeOrUrl()}`
    ).addTo(this.getBaseLayerGroup())
    if (!this._mapOptions['maxZoom']) {
      MAPMAXZOOM = 17
      this.getLayerTypeOrUrl() === 'white' ? MAPMAXZOOM = 18 : MAPMAXZOOM = 17
      this.setMaxZoom(MAPMAXZOOM)
    }
  }

  /** 加载SeeVectorBaseLayer */
  public addSeeVectorBaseLayer(): void {
    this._vectorBaseLayer = new SeeVectorBaseLayer(
      `${this.getMapServiceUrl()}/vectors/tiled/{z}/{x}/{y}.pbf`,
      `${this.getMapResourceUrl()}/${this.getLayerTypeOrUrl()}.json`,
    ).addTo(this.getBaseLayerGroup())
    if (!this._mapOptions['maxZoom']) {
      MAPMAXZOOM = 20
      this.setMaxZoom(MAPMAXZOOM)
    }

  }

  /** 获取容器中底图类型（xyz|vector） */
  public getBaseLayerType(): string {
    return this._baselayerType
  }
  /** 获取当前容器所设置的基础服务地址 */
  public getMapServiceUrl(): string {
    return this._mapServiceUrl
  }
  /** 获取容器中地图资源路径 */
  public getMapResourceUrl(): string {
    return this._mapResourceUrl
  }
  /** 获取容器中xyz/vertor地图样式类型或xyz调用的服务地址 */
  public getLayerTypeOrUrl(): string {
    return this._layerTypeOrUrl
  }
  /** 获取容器中矢量瓦片图层 */
  public getVecterBaseLayer(): BaseLayer {
    return this._vectorBaseLayer
  }
  /** 获取容器中xyz瓦片图层 */
  public getXYZBaseLayer(): BaseLayer {
    return this._xyzBaseLayer
  }

  /** 获取底图图层组 */
  public getBaseLayerGroup(): LayerGroup {
    return this._baseLayerGroup
  }

  /** 获取业务图层组 */
  public getBusinessLayerGroup(): LayerGroup {
    return this._businessLayerGroup
  }

  /** 获取最顶层图层组 */
  public getTopLayerGroup(): LayerGroup {
    return this._topLayerGroup
  }

  public changeResource(resourceUrl: string): void {
    let oldStyle = this.getStyle()
    oldStyle.sprite = resourceUrl + 'sprite'
    oldStyle.glyphs = resourceUrl + 'font/{fontstack}/{range}.pbf'
    this.setStyle(oldStyle)
  }

  /** 切换底图样式 */
  public changeMapStyle(layerTypeOrUrl: string): void {// 其实都是remove后addlayer
    // 根本不同的baselayer有不同的操作
    let baselayerType = this.getBaseLayerType()
    if (baselayerType === 'vector') {
      let baseLayer = this.getVecterBaseLayer()
      let layerStyleJsonUrl = `${this.getMapResourceUrl()}/${layerTypeOrUrl}.json`
      // 1.获取json，2._removeMapboxLayer，3._addMapboxLayer
      baseLayer.setSourceUrl(layerStyleJsonUrl)
    } else if (baselayerType === 'xyz') {//对于xyz来说，这个方法还可以换同类型（xyz）的底图
      let baseLayer = this.getXYZBaseLayer()
      baseLayer.setUrl(layerTypeOrUrl)
    }
  }

  /** 切换底图 */
  public changeBaseLayer(baseLayer: SeemapOptions['baseLayer']): void {
    let baselayerType = baseLayer.type
    let mebaselayerType = this.getBaseLayerType()
    if (mebaselayerType === 'vector') {
      let baseLayer = this.getVecterBaseLayer()
      baseLayer._removeMapbox()
    } else if (mebaselayerType === 'xyz') {
      let baseLayer = this.getXYZBaseLayer()
      baseLayer._removeMapbox()
    }
    this._baselayerType = baseLayer.type
    this._layerTypeOrUrl = baseLayer.layerTypeOrUrl
    if (baselayerType === 'vector') {
      this.addSeeVectorBaseLayer()
    } else if (baselayerType === 'xyz') {
      this.addXYZBaseLayer()
    }
  }

  /**
   * 移动到刚好设置的矩形范围显示，已经在多分辨率上做好适配
   * @param willMoveExtent {Array} 需要移动至的EPSG:4326范围,[xmin，ymin，xmax，ymax]
   */
  public moveToExtent(willMoveExtent: number[]): this {
    if (!willMoveExtent || willMoveExtent.length !== 4) {
      return this
    }
    this.fitBounds([[willMoveExtent[0], willMoveExtent[1]], [willMoveExtent[2], willMoveExtent[3]]], {})
    return this
  }

  /**
   * 获取当前地图窗口的外接矩形
   */
  public getMapExtent(): mapboxgl.LngLatBounds {
    return this.getBounds()
  }

  /**
   * 移动到指定中心点的位置
   * @param centPoints 指定的中心点
   * @param options 相关移动的参数
   * @return
   */
  public moveToCenter(centPoints: [number, number], options: mapboxgl.CameraOptions = {}): this {
    let getOptions = assign(
      {
        maxZoom: MAPMAXZOOM,
        minZoom: null,
      },
      options
    )
    if (!(centPoints instanceof Array) || centPoints.length !== 2) {
      return this
    }
    let currentZoom: number = this.getZoom()
    if (currentZoom > getOptions.maxZoom) {
      currentZoom = getOptions.maxZoom
    }
    const getMinZoom = getOptions.minZoom
    if (getMinZoom && currentZoom < getMinZoom) {
      currentZoom = getMinZoom
    }
    this.jumpTo({ center: centPoints, zoom: currentZoom })

    return this
  }

  public fit(extent: number[], options: mapboxgl.FitBoundsOptions = {}): this {
    if (extent && extent.length !== 4) {
      return this
    }
    if (!options.maxZoom) {
      options.maxZoom = MAPMAXZOOM
    }
    this.fitBounds([[extent[0], extent[1]], [extent[2], extent[3]]], options)
    return this
  }


  /**
   * 设置点显示的提示
   * @param coordinate 弹出位置坐标 null 或者 undefined 为关闭弹出内容
   * @param innerHtml 弹出框显示内容
   */
  public setPointTips(coordinate?: mapboxgl.LngLatLike | undefined | null, innerHtml?: string): void {
    if (coordinate && innerHtml) {
      this.pointTips.setLngLat(coordinate)
        .setHTML(innerHtml)
      if (!this.pointTips.isOpen()) {
        this.pointTips.addTo(this)
      }
    } else {
      if (this.pointTips) {
        this.pointTips.remove()
      }
    }
  }

  /**
   * 设置鼠标右侧的提示
   * @param innerHtml
   */
  public setMouseTips(innerHtml: string | null): void {
    if (innerHtml) {
      this.mouseTips.setTips(innerHtml)
      this.mouseTips.show()
    } else {
      this.mouseTips.hide()
    }
  }
}
