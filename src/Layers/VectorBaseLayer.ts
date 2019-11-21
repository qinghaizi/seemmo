/*
 * @LastEditors: tande
 * @Author: lyuwei
 * @Date: 2019-03-22 16:49:31
 * @LastEditTime: 2019-11-21 14:25:07
 */

import BaseLayer from "./BaseLayer";
import { xhrRequest } from "../Core/requestService";

export default class SeeVectorBaseLayer extends BaseLayer {
  // source 源路径
  private _sourceUrl: string;
  // 原始图层样式json url
  private _layerSource: mapboxgl.Layer[] | null = null;

  /**
   * 生成seemmo特有的矢量图层（对接自有的后台的服务）
   * @param layerSrouceUrl 图层服务地址
   * @param layerStyleJsonUrl 图层样式的url
   */
  constructor(layerSrouceUrl: string, layerStyleJsonUrl: string) {
    super({
      index: 1,
      typeIndex: 10,
      key: "seemmo_vector_base_layer"
    });

    this._sourceUrl = layerSrouceUrl;
    this.setSource({
      type: "vector",
      tiles: [this._sourceUrl],
      minzoom: 0,
      maxzoom: 20
    });
    this.setSourceUrl(layerStyleJsonUrl);
    this.on("changeLayerContainer", this.changeContainer);
  }

  /**
   * 设置原始样式数据的json数据源
   * url 原始json的数据源
   */
  public setSourceUrl(url: string) {
    xhrRequest({
      url: url,
      method: "GET",
      type: "json",
      timeout: 3000
    }).then(res => {
      this._layerSource = res.data;
      this.changeContainer();
    });
  }

  private changeContainer(): void {
    if (!this._layerSource) {
      return;
    }
    this.setLayers(this._layerSource);
  }
}
