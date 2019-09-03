/*
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2019-05-07 09:56:30
 * @LastEditTime: 2019-05-09 17:19:28
 */
import BaseLayer from "./BaseLayer";
import { FeatureCollection, Feature } from "geojson";
import { Style } from "../Style";
import LayerEvent from "./LayerEvent";
import { xhrRequest } from "../Core/requestService";

export interface SeeLayerParams {
    key?: string,
    index?: number,
    typeIndex?: number,
    enableClick?: boolean
}

export default class SeeLayer extends BaseLayer {
    /** 是否可以点击 */
    private _enableClick: boolean

    /** 相关geojson的参数 */
    private _geojsonData: FeatureCollection = {
        type: 'FeatureCollection',
        features: []
    }

    /** 本地缓存样式数组 */
    private _styles: Style[] = []

    constructor(setOptions: SeeLayerParams = {}, styleJson?: Style | Style[]) {
        super({
            key: setOptions.key ? setOptions.key : 'seelayer',
            index: setOptions.index ? setOptions.index : 10,
            typeIndex: setOptions.typeIndex ? setOptions.typeIndex : 5
        })

        this._enableClick = setOptions.enableClick || false

        // bind listen function
        this._mouseLeaveFunc = this._mouseLeaveFunc.bind(this)
        this._mouseOverFunc = this._mouseOverFunc.bind(this)
        this._clickFunc = this._clickFunc.bind(this)

        // 初始化设置source为 geojson源
        this.setSource({
            type: 'geojson',
            data: this.geojsonData
        })
        // 默认初始化提供一套基本的点线面样式
        this.style = styleJson || [
            {
                type: 'circle',
                paint: {
                    "circle-color": '#4264fb',
                    "circle-opacity": 0.8
                },
                filter: ["==", "$type", "Point"]
            },
            {
                type: 'line',
                paint: {
                    "line-color": '#3399CC',
                    "line-width": 1.25
                },
                filter: ["==", "$type", "LineString"]
            },
            {
                type: "fill",
                paint: {
                    "fill-color": 'rgba(255,255,255,0.4)'
                },
                filter: ["==", "$type", "Polygon"]
            }
        ]

        // 添加到容器中之后需要手动监听相关maobox事件
        this.on('changeLayerContainer', this._changeContainer)
    }

    public get geojsonData(): FeatureCollection {
        return this._geojsonData
    }

    private _changeContainer(): void {
        this.setLayers(this.styles as mapboxgl.Layer[])
        // 切换容器需要初始化相关监听事件
        this._initMapEvent()
    }

    /**
     * 设置geojson的features数据
     * @param data 设置的feature的数组
     */
    public setGeojsonFeatures(data: Feature[]): void {
        this._geojsonData.features = data
    }
    /**
     * 向geojson中添加需要增加的feature数据
     * @param data 待添加的feature数组
     */
    public addGeojsonFeatures(data: Feature[]): void {
        this._geojsonData.features = this._geojsonData.features.concat(data)
    }

    /**
     * 更新mapbox中的source对象
     */
    public updateMapboxSource(): void {
        if (!this.seeMap) { return }
        let mapboxSource: mapboxgl.GeoJSONSource = this.seeMap.getSource(this.id) as mapboxgl.GeoJSONSource
        if (mapboxSource) {
            mapboxSource.setData(this.geojsonData)
        }
    }

    /**
     * 设置gate图层样式
     * @param styleJson 图层样式对象或数组
     */
    public setStyle(styleJson: Style | Style[]): this {
        // remove old style layer
        this.setLayers([])
        this.cleanMapboxListeners()
        this.style = styleJson
        // 更新图层样式
        this.setLayers(this.styles as mapboxgl.Layer[])
        this._initMapEvent()
        return this
    }

    /**
        * 查看底层mapbox对于样式这块是怎么完成的，尽可能的更智能化
        * mapbox的图层样式分为layout和pain两者
        * layout 大多作用于GPU单元，改动大多需要在下一个frame渲染的时候生效
        * pain 可以同步做出相应修改`
        */
    private set style(setStyle: Style | Style[]) {
        if (!Array.isArray(setStyle)) {
            setStyle = [setStyle]
        }
        setStyle.map((eachStyle) => {
            eachStyle.id = eachStyle.id ? eachStyle.id : `seemmo_layer_${this.uuid}_${this.generateUuid()}`
        })
        this._styles = setStyle
    }

    /** 获取当前使用的所有样式 */
    public get styles(): Style[] {
        return this._styles
    }

    /** 获取所有样式的id数组 */
    private get styleIds(): string[] {
        let ids: string[] = []
        this._styles.map((eachStyle) => {
            ids.push(eachStyle.id as string)
        })
        return ids
    }

    /** 初始化mapbox相关的监听事件,每次修改maoboxlayer的时候需要重新监听一下 */
    private _initMapEvent(): void {
        // init 相关监听事件
        // mouseover mouseleave click
        this.onMapboxListeners({ type: 'click', listener: this._clickFunc })
        this.onMapboxListeners({ type: 'mouseover', listener: this._mouseOverFunc })
        this.onMapboxListeners({ type: 'mouseleave', listener: this._mouseLeaveFunc })
    }

    /**
     * 更改当前图层的可点击状态
     * @param boolean 是否可以点击
     */
    public changeClickEnable(boolean: boolean = false): this {
        this._enableClick = boolean
        return this
    }

    private _clickFunc(evt: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData): void {
        if (this._enableClick) {
            if (evt.features && evt.features.length > 0) {
                this.dispatchEvent(
                    new LayerEvent('featureClick', { features: evt.features, coordinate: evt.lngLat, source: evt })
                )
            } else {
                this.dispatchEvent(
                    new LayerEvent('featureClickNone', { coordinate: evt.lngLat, source: evt })
                )
            }
        }
    }

    private _mouseOverFunc(evt: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData): void {
        this.dispatchEvent(
            new LayerEvent('featureOver', { features: evt.features, coordinate: evt.lngLat, source: evt })
        )
    }

    private _mouseLeaveFunc(evt: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData): void {
        this.dispatchEvent(
            new LayerEvent('featureLeave', { features: evt.features, coordinate: evt.lngLat, source: evt })
        )
    }

    /**
     * 显示对象
     * @returns 当前对象
     */
    public show(): this {
        if (this.seeMap) {
            this.styleIds.map(eachId => this.seeMap.setLayoutProperty(eachId, 'visibility', 'visible'))
        }
        return this
    }

    /**
     * 隐藏对象
     * @returns 当前对象
     */
    public hide(): this {
        if (this.seeMap) {
            this.styleIds.map(eachId => this.seeMap.setLayoutProperty(eachId, 'visibility', 'none'))
        }
        return this
    }

    /******     要素相关增删改查方法       ********/

    public addFeature(id: string | number, geometry: GeoJSON.Geometry, properties?: GeoJSON.GeoJsonProperties): GeoJSON.Feature {
        // 直接构造对应的feature对象
        const createFeature = this._createFeature(id, geometry, properties)
        this.addGeojsonFeatures([createFeature])
        this.updateMapboxSource()
        return createFeature
    }

    public addFeatures(features: { id: string | number, geometry: GeoJSON.Geometry, properties?: GeoJSON.GeoJsonProperties }[]): GeoJSON.Feature[] {
        let allFeatures: GeoJSON.Feature[] = []
        features.forEach(each => allFeatures.push(this._createFeature(each.id, each.geometry, each.properties)))
        this.addGeojsonFeatures(allFeatures)
        this.updateMapboxSource()
        return allFeatures
    }

    private _createFeature(id: string | number, geometry: GeoJSON.Geometry, properties?: GeoJSON.GeoJsonProperties): GeoJSON.Feature {
        // 直接构造对应的feature对象
        let feature: GeoJSON.Feature = {
            type: 'Feature',
            id: id,
            geometry: geometry,
            properties: properties || {}
        }
        const existFeature = this.getFeature(id)
        if (existFeature) {
            const index = this.geojsonData.features.indexOf(existFeature)
            this._geojsonData.features.splice(index, 1)
        }
        return feature
    }

    public getFeature(id: string | number): GeoJSON.Feature | null {
        for (let eachFeature of this.geojsonData.features) {
            if (eachFeature.id === id) {
                return eachFeature
            }
        }
        return null
    }

    public removeFeatures(ids: (string | number)[]): void {
        if (!Array.isArray(ids)) { ids = [ids] }
        let keepFeatures: GeoJSON.Feature[] = []
        this.geojsonData.features.forEach(eachFeature => {
            if (eachFeature.id && ids.indexOf(eachFeature.id) === -1) {
                keepFeatures.push(eachFeature)
            }
        });
        this.setGeojsonFeatures(keepFeatures)
        this.updateMapboxSource()
    }

    public removeAll(): void {
        this.setGeojsonFeatures([])
        this.updateMapboxSource()
    }

    public keepFeatures(ids: (string | number)[]): void {
        if (!Array.isArray(ids)) { ids = [ids] }
        let keepFeatures: GeoJSON.Feature[] = []
        this.geojsonData.features.forEach(eachFeature => {
            if (eachFeature.id && ids.indexOf(eachFeature.id) >= 0) {
                keepFeatures.push(eachFeature)
            }
        });
        this.setGeojsonFeatures(keepFeatures)
        this.updateMapboxSource()
    }
    /******     获取和设置要素的属性       ********/
    public getFeatureProperties(id: string | number, key?: string): any {
        const allFeatures = this.geojsonData.features
        for (const feature of allFeatures) {
            if (feature.id && feature.id === id) {
                const pro = feature.properties || {}
                return key ? pro[key] : pro
            }
        }
        return null
    }

    public setFeaturesProperties(ids: (string | number)[], key: string, value: any): void {
        let stringIds: string[] = []
        ids.forEach((eachId) => { stringIds.push(eachId.toString()) })
        let allFeatures = this.geojsonData.features
        allFeatures.forEach(eachFeature => {
            if (eachFeature.id && stringIds.indexOf(eachFeature.id.toString()) > -1) {
                eachFeature.properties = eachFeature.properties || {}
                eachFeature.properties[key] = value
            }
        })
        this.setGeojsonFeatures(allFeatures)
        this.updateMapboxSource()
    }

    /******     最短路径分析       ********/
    public shortAnalysis(coors: GeoJSON.Position[], success: (coor: GeoJSON.Position[]) => void, failure?: () => void, error?: (str: string) => void): void {
        if (!this.seeMap) {
            if (error) {
                error('请先将图层设置到容器中，以便获取相关请求地址！')
            }
            return
        }
        xhrRequest({
            url: `${this.seeMap.getMapServiceUrl()}/analysis/short`,
            method: 'POST',
            type: 'json',
            data: JSON.stringify(coors)
        }).then((res) => {
            if (!res.res.statusCode || (res.res.statusCode >= 200 && res.res.statusCode < 300)) {
                // 正常状态
                success(res.data.data)
            } else {
                if (failure) { failure() }
            }
        }).catch(() => {
            if (error) { error('接口服务错误！') }
        })
    }

    public analysisOneLine(lineId: string | number): void {
        let _this = this
        let findFeature = _this.getFeature(lineId)
        if (!findFeature || findFeature.geometry.type !== 'LineString') {
            _this.dispatchEvent(new LayerEvent('analysisError', { message: '待分析的对象类型必须是线！' }))
            return
        }
        _this.shortAnalysis(
            findFeature.geometry.coordinates,
            (coor) => {
                findFeature = _this.getFeature(lineId)
                if (findFeature) {
                    _this.addFeature(lineId, { type: 'LineString', coordinates: coor })
                }
            }
        )
    }
}