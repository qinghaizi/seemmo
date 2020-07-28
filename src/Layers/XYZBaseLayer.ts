/*
 * @Descripttion:
 * @Date: 2019-11-20 10:33:20
 * @LastEditors: tande
 * @LastEditTime: 2020-07-28 10:27:18
 */
import BaseLayer from "./BaseLayer";

export default class XYZBaseLayer extends BaseLayer {
  private _baseService: string;
  private _layerUrl: string | null;

  constructor(baseService: string, urlOrType: string) {
    super({
      index: 1,
      typeIndex: 1,
      key: "seemmo_xyz_base_layer"
    });
    this._baseService = baseService;
    this.setUrl(urlOrType);
  }

  public setUrl(urlOrType: string): void {
    let layerUrl: string;
    if (
      urlOrType.indexOf("http://") > -1 ||
      urlOrType.indexOf("https://") > -1
    ) {
      layerUrl = urlOrType;
    } else {
      layerUrl = `${this._baseService}/offlines/tiled/${urlOrType}/{z}/{x}/{y}.png`;
    }

    this._layerUrl = layerUrl;

    // 如果已经添加了对应的layer属性，则需要先删除对应的layer再修改source
    if (this.layers) {
      this.setLayers([]);
    }
    this.setSource({
      type: "raster",
      tiles: [
        // wms
        "http://support.supermap.com:8090/iserver/services/map-china400/wms130/China?service=WMS&version=1.3.0&request=GetMap&styles=&layers=0.79,0.78,0.77,0.76,0.75,0.74,0.73,0.72,0.71,0.70,0.69,0.68,0.67,0.66,0.65,0.64,0.63,0.62,0.61,0.60,0.59,0.58,0.57,0.56,0.55,0.54,0.53,0.52,0.51,0.50,0.49,0.48,0.47,0.46,0.45,0.44,0.43,0.42,0.41,0.40,0.39,0.38,0.37,0.36,0.35,0.34,0.33,0.32,0.31,0.30,0.29,0.28,0.27,0.26,0.25,0.24,0.23,0.22,0.21,0.20,0.19,0.18,0.17,0.16,0.15,0.14,0.13,0.12,0.11,0.10,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1,0.0&crs=EPSG:3857&bbox={bbox-epsg-3857}&width=256&height=256&format=image/png&transparent=TRUE"
        // this._layerUrl
        // "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        // 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256
    });
    this.setLayers({
      id: `xyz-base-${this.generateUuid()}`,
      type: "raster"
    });
  }
}
