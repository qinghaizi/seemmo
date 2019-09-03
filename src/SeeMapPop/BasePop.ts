import { Anchor, Pos, OffsetOption, anchorTranslate } from ".";
import Observable from "../Core/Observable";
import SeeMap from "../SeeMap";
import { assign } from "../Core/obj";
import { LngLat, Point } from "mapbox-gl";
import './'
import Event from "../Core/events/Event";

export interface PopOptions {
    /** 弹出偏移 */
    offset?: OffsetOption
    /** 弹出位置 */
    positioning?: keyof Anchor
    /** 是否自动居中 */
    autoPan?: boolean
}

const defaultOptions: PopOptions = {
    offset: [0, 0],
    positioning: 'center',
    autoPan: false
}

export default class BasePop extends Observable {
    /** 当前弹出设置 */
    private _popOption: Required<PopOptions>
    /** 对应的地图容器 */
    private _seeMap: SeeMap
    /** 当前弹出框的根内容 */
    private _container: HTMLElement
    /** 弹出框内容，允许放内容组 */
    private _content: HTMLElement[] | HTMLElement
    /** 弹出位置 */
    private _lngLat: LngLat
    /** 删除弹出位置的屏幕坐标 */
    private _pos: Point | null
    /** 是否显示 */
    private _show: boolean
    
    constructor(setOptions?: PopOptions) {
        super()
        this._popOption = assign(defaultOptions, setOptions || {}) as Required<PopOptions>

        this._update = this._update.bind(this)
    }

    public setOptions(options: PopOptions): void {
        this._popOption = assign(this._popOption, options)
        this._update()
    }

    public addTo(map: SeeMap): this {
        this._seeMap = map
        this._seeMap.on('move', this._update)
        this._show = true

        this._update()

        this.dispatchEvent(new Event('SeePopUp'))
        return this
    }

    public get seeMap() {
        return this._seeMap
    }

    public setLngLat(lnglat: mapboxgl.LngLatLike): this {
        this._lngLat = LngLat.convert(lnglat)
        this._pos = null
        this._update()
        return this
    }

    public get pos(): Point | null {
        return this._pos
    }

    private _update(): void {
        if (!this._seeMap || !this._lngLat || !this._content) { return }
        if (!this._container) {
            this._createContainer()
        }
        this._container.style['display'] = this._show ? '' : 'none'
        if (!this._show) { return }

        if (this._seeMap.getRenderWorldCopies()) {
            // 在缩小地图的时候允许多个地图的拷贝渲染
            // smartWrap(this._lonlat, this._pos, this._map.transform)
        }

        // 计算屏幕位置
        const pos: mapboxgl.Point = this._pos = this._seeMap.project(this._lngLat)
        const position = this._popOption.positioning
        const offset = BasePop.normalizeOffset(this._popOption.offset)
        const offsetedPos = pos.add(offset[position]).round()

        // 设置移动的transform位置信息
        this._container.style['transform'] = `${anchorTranslate[position]} translate(${offsetedPos.x}px,${offsetedPos.y}px)`
    }

    private _createContainer(): void {
        this._container = document.createElement('div')
        this._container.className = 'seemmo-popup mapboxgl-popup'
        this._seeMap.getContainer().appendChild(this._container)

        this._appendContent()
    }

    /**
     * 设置展示内容，基本容器只做大框，内部所有内容不关心
     */
    protected set content(content: HTMLElement | HTMLElement[] | string) {
        let updateContent: boolean = false
        // 所有弹出框内部内容都使用 htmlelement 避免不必要的多重判断
        if (this._content) {
            // 存在历史弹出内容, 全部移除的同时删除对象
            let tmpAllChildrens = this._container.childNodes
            tmpAllChildrens.forEach(children => this._container.removeChild(children))
            delete this._content
            updateContent = true
        }
        if (typeof content === 'string') {
            // 如果是string数组，则创建一个default的div来承载
            let defaultHTML = document.createElement('div')
            defaultHTML.innerHTML = content
            this._content = defaultHTML
        } else {
            this._content = content
        }

        if (updateContent) {
            this._appendContent()
        }

        this._update()
    }

    /** 追加 element 节点到 container 容器中 */
    private _appendContent() {
        if (!this._content) { return }
        if (!Array.isArray(this._content)) {
            this._container.appendChild(this._content)
        } else {
            this._content.forEach(eachNode => this._container.appendChild(eachNode))
        }
    }

    private _removeContainer(): void {
        if (this._container) {
            this._seeMap.getContainer().removeChild(this._container)
            delete this._container
        }
    }

    public destory(): void {
        // FIXME: 销毁操作未完全完成
        this._removeContainer()
    }

    public show(): this {
        this._show = true
        return this
    }

    public hide(): this {
        this._show = false
        return this
    }


    static normalizeOffset(offset?: OffsetOption): Pos {
        if (!offset) {
            return BasePop.normalizeOffset(new Point(0, 0))
        } else if (typeof offset === 'number') {
            // input specifies a radius from which to calculate offsets at all positions
            const cornerOffset = Math.round(Math.sqrt(0.5 * Math.pow(offset, 2)))
            return {
                'center': new Point(0, 0),
                'top': new Point(0, offset),
                'top-left': new Point(cornerOffset, cornerOffset),
                'top-right': new Point(-cornerOffset, cornerOffset),
                'bottom': new Point(0, -offset),
                'bottom-left': new Point(cornerOffset, -cornerOffset),
                'bottom-right': new Point(-cornerOffset, -cornerOffset),
                'left': new Point(offset, 0),
                'right': new Point(-offset, 0)
            }
        } else if (offset instanceof Point || Array.isArray(offset)) {
            const convertedOffset = Point.convert(offset)
            return {
                'center': convertedOffset,
                'top': convertedOffset,
                'top-left': convertedOffset,
                'top-right': convertedOffset,
                'bottom': convertedOffset,
                'bottom-left': convertedOffset,
                'bottom-right': convertedOffset,
                'left': convertedOffset,
                'right': convertedOffset
            }
        } else {
            // input specifies an offset per position
            return {
                'center': Point.convert(offset['center'] || [0, 0]),
                'top': Point.convert(offset['top'] || [0, 0]),
                'top-left': Point.convert(offset['top-left'] || [0, 0]),
                'top-right': Point.convert(offset['top-right'] || [0, 0]),
                'bottom': Point.convert(offset['bottom'] || [0, 0]),
                'bottom-left': Point.convert(offset['bottom-left'] || [0, 0]),
                'bottom-right': Point.convert(offset['bottom-right'] || [0, 0]),
                'left': Point.convert(offset['left'] || [0, 0]),
                'right': Point.convert(offset['right'] || [0, 0])
            }
        }
    }
}