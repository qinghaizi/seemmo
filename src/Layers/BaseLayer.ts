import Observable from "../Core/Observable";
import SeeMap from "../SeeMap";
import { AnySourceData, MapLayerEventType, EventData, Layer } from "mapbox-gl";
import LayerGroup from "./LayerGroup";

export type SOURCETYPE =
  | "vector"
  | "raster"
  | "raster-dem"
  | "geojson"
  | "image"
  | "video";
export type LAYERTYPE =
  | "background"
  | "fill"
  | "line"
  | "symbol"
  | "raster"
  | "circle"
  | "fill-extrusion"
  | "heatmap"
  | "hillshade";
export type MAPBOXLISTENERTYPE = keyof MapLayerEventType;

export interface LayerObj extends Layer {
  source: string;
  type: LAYERTYPE;
  metadata: {
    groupIndex?: number;
    index: number;
    typeIndex: number;
    [propName: string]: any;
  };
}
interface BaseLayerParams {
  /**
   * 用作区分的关键字
   */
  key?: string;
  /**
   * 图层索引排序字段
   * @type number
   */
  index?: number;
  //
  /**
   * 图层类型排序字段
   * @type number
   */
  typeIndex?: number;
  /**
   * 图层的source类型数组，枚举值
   */
  source?: AnySourceData;
  /**
   * 图层的layer类型数组，枚举值
   */
  layers?: Layer | Layer[];
}

export default abstract class BaseLayer extends Observable {
  public readonly id: string;
  public readonly index: number;
  public readonly typeIndex: number;
  // 托管图层的seemap对象
  private _seemmoMap: SeeMap;
  private _seeLayerGroup: LayerGroup | null = null;
  // 图层对应的source
  public _source: AnySourceData | null = null;
  // 一个图层可以有多个maobox layer源，但是必须都对应同一个source上，多个type对应不同的style
  // 2019-4-3 14:30:11 可能存在多个相同type的图层，通过不同的filer区分展示不同数据,修改内部实现方案
  public _layers: LayerObj[] = [];
  // 封装内部事件监听
  private _mapboxListeners: {
    [propName in MAPBOXLISTENERTYPE]?: Array<
      (ev: MapLayerEventType[MAPBOXLISTENERTYPE] & EventData) => void
    >;
  } = {};

  constructor(setOptions: BaseLayerParams) {
    super();
    this.id =
      this.uuid +
      "-" +
      (setOptions.key ? setOptions.key : "") +
      "-" +
      new Date().getTime().toString();
    this.index = setOptions.index ? setOptions.index : 99;
    this.typeIndex = setOptions.typeIndex ? setOptions.typeIndex : 99;
    if (setOptions.source) {
      this.setSource(setOptions.source);
    }
    if (setOptions.layers) {
      this.setLayers(setOptions.layers);
    }
  }

  /**
   * 获取当前图层的图层组对象，如果不存在则为null
   */
  protected get seeLayerGroup(): LayerGroup | null {
    return this._seeLayerGroup;
  }
  /**
   * 获取当前图层的容器对象，如果不存在则为null
   */
  protected get seeMap(): SeeMap {
    return this._seemmoMap;
  }
  /**
   * 设置当前图层的source源，将会调用添加至map的方法
   * @param sourceData source 对象
   */
  public setSource(sourceData: AnySourceData): this {
    // 先调用移除，再调用添加
    this._removeMapboxSource();
    this._source = sourceData;
    this._addMapboxSource();
    return this;
  }
  /**
   * 获取当前图层的source源
   */
  public get source(): AnySourceData | null {
    return this._source;
  }

  /**
   * 设置当前layer的所有展示mapbox图层数据，会自动同步所index和typeindex还有groupindex
   * @param setLayer 修改后的图层数据
   */
  public setLayers(setLayer: Layer | Layer[]): this {
    this._removeMapboxLayer();
    this._layers = [];
    if (!Array.isArray(setLayer)) {
      setLayer = [setLayer];
    }
    setLayer.forEach(eachLayer => {
      (eachLayer.source = this.id),
        (eachLayer.metadata = eachLayer.metadata || {});
      eachLayer.metadata.index = this.index;
      eachLayer.metadata.typeIndex = this.typeIndex;
      if (this.seeLayerGroup) {
        eachLayer.metadata.groupIndex = this.seeLayerGroup.groupIndex;
      }
      this._layers.push(eachLayer as LayerObj);
    });
    this._addMapboxLayer();
    return this;
  }
  /**
   * 获取当前图层中的所有mapbox图层源
   */
  public get layers(): LayerObj[] {
    return this._layers;
  }
  /**
   * 所有type对应的id
   */
  protected get layerIds(): string[] {
    let returnArray: string[] = [];
    this.layers.forEach(eachLayer => {
      returnArray.push(eachLayer.id);
    });
    return returnArray;
  }

  /**
   * 封装监听mapbox原生的事件监听，完成所有layer上的监听
   * @param type mapbox事件类型
   * @param listener 监听回调方法
   */
  public onMapboxListeners({
    type,
    listener
  }: {
    type: MAPBOXLISTENERTYPE;
    listener: (ev: MapLayerEventType[MAPBOXLISTENERTYPE] & EventData) => void;
  }): void {
    let cacheListeners = this._mapboxListeners[type];
    if (!cacheListeners) {
      cacheListeners = [];
    }
    if (cacheListeners.indexOf(listener) > -1) {
      return;
    }
    cacheListeners.push(listener);
    this._mapboxListeners[type] = cacheListeners;
    if (this.seeMap) {
      this.layers.forEach(eachLayer => {
        this.seeMap.on(type, eachLayer.id, listener);
      });
    }
  }

  /**
   * 移除并取消图层中所有layer对事件的监听
   * @param type mapbox事件类型
   * @param listener 监听回调方法
   */
  public offMapboxListeners({
    type,
    listener
  }: {
    type: MAPBOXLISTENERTYPE;
    listener: (ev: MapLayerEventType[MAPBOXLISTENERTYPE] & EventData) => void;
  }): void {
    const cacheListeners = this._mapboxListeners[type];
    if (cacheListeners) {
      let findListenerIndex = cacheListeners.indexOf(listener);
      if (findListenerIndex > -1) {
        if (this.seeMap) {
          this.layers.forEach(eachLayer => {
            this.seeMap.off(type, eachLayer.id, listener);
          });
        }
        cacheListeners.splice(findListenerIndex, 1);
        this._mapboxListeners[type] = cacheListeners;
      }
    }
  }

  /**
   * 清楚所有mapbox的监听事件
   */
  public cleanMapboxListeners(): void {
    for (const type in this._mapboxListeners) {
      const eachTypeListeners = this._mapboxListeners[
        type as MAPBOXLISTENERTYPE
      ];
      if (!eachTypeListeners) {
        continue;
      }
      eachTypeListeners.forEach(eachListener => {
        this.offMapboxListeners({
          type: type as MAPBOXLISTENERTYPE,
          listener: eachListener
        });
      });
    }
  }

  /** 将图层添加到容器中（或图层组） */
  public addTo(layerContainer: SeeMap | LayerGroup): this {
    if (layerContainer instanceof SeeMap) {
      this._setSeeLayerGroup(null);
      this._setLayerMap(layerContainer);
      this._addMapbox();
    } else if (layerContainer instanceof LayerGroup) {
      this._setSeeLayerGroup(layerContainer);
      this._setLayerMap(layerContainer.seeMap);
      layerContainer.addLayer(this);
    }
    this.dispatchEvent("changeLayerContainer");
    return this;
  }

  public _setLayerMap(mapContainer?: SeeMap): this {
    if (mapContainer) {
      this._seemmoMap = mapContainer;
    } else {
      delete this._seemmoMap;
    }

    return this;
  }

  public _setSeeLayerGroup(layerGroup: LayerGroup | null): this {
    this._seeLayerGroup = layerGroup;
    // fix setlayer如果在addto之前调用，则之前的layers没有layergrou参数
    this._layers.forEach(eachLayer => {
      eachLayer.metadata.groupIndex = this._seeLayerGroup
        ? this._seeLayerGroup.groupIndex
        : undefined;
    });
    return this;
  }

  public remove(): this {
    if (!this.seeMap) {
      return this;
    }
    if (this.seeLayerGroup) {
      this.seeLayerGroup.removeLayer(this);
    } else {
      this._removeMapboxLayer();
      this._removeMapboxSource();
      this.cleanMapboxListeners();
    }
    return this;
  }

  /**
   * 添加maobox的source源
   */
  protected _addMapboxSource(): this {
    if (this.seeMap && this.source) {
      this.seeMap.addSource(this.id, this.source);
    }
    return this;
  }
  /**
   * 移除mapbox的source源
   */
  protected _removeMapboxSource(): this {
    if (this.seeMap && this.seeMap.getSource(this.id)) {
      this.seeMap.removeSource(this.id);
    }
    return this;
  }

  /**
   * 添加mapbox的layer数组
   */
  protected _addMapboxLayer(): this {
    if (this.seeMap) {
      let findBeforId = BaseLayer._findBeforLayerId(this);
      this.layers.forEach(eachLayer => {
        this.seeMap.addLayer(eachLayer, findBeforId);
      });
    }
    return this;
  }

  /**
   * 移除mapbox中的当前所有图层数组的对应图层
   */
  protected _removeMapboxLayer(): this {
    if (this.seeMap) {
      this.layers.map(eachLayer => {
        this.seeMap.removeLayer(eachLayer.id);
      });
    }
    return this;
  }

  public _addMapbox(): this {
    this._addMapboxSource();
    this._addMapboxLayer();

    return this;
  }

  public _removeMapbox(): this {
    this._removeMapboxLayer();
    this._removeMapboxSource();

    return this;
  }
  /**
   * 查找当前图层所要添加的容器中的对应的排序位置
   * @param layer 待排序的图层
   *
   * @description 该方法较为复杂，主要作用是提供自动排序的功能，即设置图层组排序字段，图层类型还有图层索引自动排序
   *              需考虑多种情况，该方法只会在继承该类的子类调用，可能在操作过程中手动使用原方法操作图层
   *              排序基本规则为 手动跳过该方法的图层在最顶层 接下来是没有图层组的所有图层 最下面是根据图层组添加的图层
   *              * 手动添加的图层不做排序，按照添加顺序或者手动维护顺序
   *              * 没有图层组和在各图层组中的图层按照先 type 后 index 排序
   */
  static _findBeforLayerId(layer: BaseLayer): string | undefined {
    if (!layer.seeMap) return undefined;
    // 假定数组中是已经添加并排序好的
    let getSeemapLayer = layer.seeMap.getStyle().layers || [];
    // 如果当前存在的图层数组为空则直接返回null
    if (getSeemapLayer.length <= 0) {
      return undefined;
    }
    if (!getSeemapLayer[0].metadata || !getSeemapLayer[0].metadata.groupIndex) {
      return getSeemapLayer[0].id;
    }
    /**
     * 数组从上到下依次覆盖
     * [底----------------->顶]
     * [0,1,2,3,4,5,6,7,8,9,10]
     */
    let findIndex: number = 0;
    // 先判断groupindex
    for (findIndex = 0; findIndex < getSeemapLayer.length; findIndex++) {
      const element: LayerObj = getSeemapLayer[findIndex] as LayerObj;
      if (layer.seeLayerGroup) {
        if (!element.metadata.groupIndex) {
          break;
        } else {
          if (element.metadata.groupIndex >= layer.seeLayerGroup.groupIndex) {
            break;
          }
        }
      } else {
        if (!element.metadata.groupIndex) {
          break;
        }
      }
    }
    if (findIndex === getSeemapLayer.length) {
      // 图层组中最后一个都比当前的小
      return undefined;
    }
    // 再判断 typeindex 和 index 这两个属性必定存在
    let lastSeemapLayer = getSeemapLayer.splice(findIndex - 1);
    for (findIndex = 0; findIndex < lastSeemapLayer.length; findIndex++) {
      const element: LayerObj = lastSeemapLayer[findIndex] as LayerObj;
      if (element.metadata.typeIndex > layer.typeIndex) {
        break;
      } else {
        if (
          element.metadata.typeIndex === layer.typeIndex &&
          element.metadata.index > layer.index
        ) {
          break;
        }
      }
    }
    if (findIndex === lastSeemapLayer.length) {
      return undefined;
    } else {
      return lastSeemapLayer[findIndex].id;
    }
  }
}
