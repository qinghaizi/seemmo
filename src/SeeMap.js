import "ol/ol.css";
import { mergeOptions } from "./Utils";
import OLMap from "ol/Map";
import OLView from "ol/View";
import { defaults as OLControlDefaults } from "ol/control";
import { defaults as OLInteractionDefaults } from "ol/interaction";
import { transform } from "ol/proj";
import LayerGroup from "./LayerGroup";
import { createPointTips, createMouseTips } from "./SeeTips";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

const options = {
  zoom: 10,
  zoomSlide: false,
  center: [114.4171912, 30.46677258],
  bounds: null,
  defaultControl: {},
  defaultBaseLayer: "white"
};

/**
 * SeeMap 基本地图容器
 */
export default class SeeMap extends OLMap {
  /**
   * SeeMap 基本地图容器
   * @param mapdivOrId {String | Document} 存放地图容器的div或其Id
   * @param mapServiceUrl {String} 地图基本服务地址，不用以 / 结尾，例 http://10.10.4.147:8088/map
   * @param optOptions 可选的基本设置参数
   */
  constructor(mapdivOrId, mapServiceUrl, optOptions) {
    if (!mapServiceUrl || !/[a-zA-z0-9]+:?[0-9]/.exec(mapServiceUrl)) {
      throw new Error("请填写正确的地图服务地址！");
    }
    let getOptions = mergeOptions(options, optOptions || {});
    let setOptions = {};

    setOptions.target = mapdivOrId;
    setOptions.view = new OLView({
      zoom: getOptions.zoom,
      center: transform(getOptions.center, "EPSG:4326", "EPSG:3857"),
      maxZoom: 18
    });
    // 常规控制器，zoom，rotate，attribution
    setOptions.controls = OLControlDefaults({
      attribution: getOptions.defaultControl.attribution || false,
      zoom: getOptions.zoomSlide,
      zoomOptions: getOptions.defaultControl.zoomOptions || {
        zoomInTipLabel: "放大",
        zoomOutTipLabel: "缩小"
      }
    });
    // 默认取消鼠标双击放大事件
    setOptions.interactions = OLInteractionDefaults({
      doubleClickZoom: false
    });

    super(setOptions);
    let _this = this;
    _this._mapServiceUrl = mapServiceUrl;
    _this._mouseTips = null;

    _this._baseLayerGroup = new LayerGroup({
      title: "底图图层",
      layers: []
    }).addTo(this);
    _this._businessLayerGroup = new LayerGroup({
      title: "业务图层",
      layers: []
    }).addTo(this);
    _this._topLayerGroup = new LayerGroup({
      title: "置顶图层",
      layers: []
    }).addTo(this);

    // _this.MKTFormat = new WKT()
    /** 结束初始化，开始初始化需要一键完成的工作 */
    // 1. 初始化底图
    _this.setBaseLayer(getOptions.defaultBaseLayer);
    // 2. 如果设置有底图范围，则初始化到指定的范围
    if (getOptions.bounds) {
      _this.moveToExtent(getOptions.bounds);
    }

    // init event
    this._initEvent();
  }

  _initEvent() {
    this.on("pointermove", this._mouseMoveHandler);
  }

  /**
   * 获取当前容器所设置的基础服务地址
   * @returns {String}
   */
  getMapServiceUrl() {
    return this._mapServiceUrl;
  }

  /**
   * 获取底图图层组
   * @return LayerGroup {SeemmoLayerGroup} 图层组
   * */
  getBaseLayerGroup() {
    return this._baseLayerGroup;
  }

  /**
   * 获取业务图层组
   * @return LayerGroup {SeemmoLayerGroup} 图层组
   * */
  getBusinessLayerGroup() {
    return this._businessLayerGroup;
  }

  /**
   * 获取最顶层图层组
   * @return LayerGroup {SeemmoLayerGroup} 图层组
   * */
  getTopLayerGroup() {
    return this._topLayerGroup;
  }

  /**
   * 设置地图类型，支持第三方的xyz图层
   * @param layerprefixOrUrl {String} 底图type或地图url
   * @return {SeeMap}
   */
  setBaseLayer(layerprefixOrUrl) {
    const baseLayerKey = "SEEMMOBASELAYER";
    let layerUrl = "";
    // 如果参数直接为带有http的路径就直接使用，否则认为传入的是type字段，对接自有后台，需要对应类型的图层
    if (layerprefixOrUrl.indexOf("http://") > -1) {
      layerUrl = layerprefixOrUrl;
    } else {
      layerUrl =
        this.getMapServiceUrl() +
        "/tiled/" +
        layerprefixOrUrl +
        "/{z}/{x}/{y}.png";
    }
    let baseLayers = this.getBaseLayerGroup().getLayersBy(
      "baseLayerKey",
      baseLayerKey
    );
    if (baseLayers.length > 0) {
      // 存在layer则直接修改对应的url
      baseLayers[0].getSource().setUrl(layerUrl);
    } else {
      // 不存在对应的图层，添加
      baseLayers = new TileLayer({
        source: new XYZ({
          url: layerUrl
        }),
        layerType: 0,
        layerIndex: 0
      });
      baseLayers.set("baseLayerKey", baseLayerKey);
      this.getBaseLayerGroup().addLayer(baseLayers);
    }
    return this;
  }

  /**
   * 坐标转换工具
   * @param lon {Number}  经度
   * @param lat {Number}  纬度
   * @param SourceEPSGCode  {String}   源EPSG代码，默认EPSG4326
   * @param TargetEPSGCode  {String}   目标EPSG代码，默认为当前地图坐标系
   * @returns {module:ol/coordinate}
   */
  corTransform(
    lon,
    lat,
    SourceEPSGCode = "EPSG:4326",
    TargetEPSGCode = this.getView().getProjection()
  ) {
    let coordinate = [Number(lon), Number(lat)];

    return transform(coordinate, SourceEPSGCode, TargetEPSGCode);
  }

  /**
   * 移动到刚好设置的矩形范围显示，已经在多分辨率上做好适配
   * @param willMoveExtent {Array} 需要移动至的EPSG:4326范围,[xmin，ymin，xmax，ymax]
   * @return {SeeMap}
   */
  moveToExtent(willMoveExtent) {
    if (!willMoveExtent || willMoveExtent.length !== 4) {
      return this;
    }
    let newExtend = [];

    newExtend = newExtend.concat(
      this.corTransform(willMoveExtent[0], willMoveExtent[1])
    );
    newExtend = newExtend.concat(
      this.corTransform(willMoveExtent[2], willMoveExtent[3])
    );
    let thisMapView = this.getView();
    let viewBounds = newExtend;
    let resolution = thisMapView.getResolutionForExtent(viewBounds);

    thisMapView.setResolution(resolution);
    thisMapView.fit(viewBounds, {
      constrainResolution: false,
      nearest: true
    });
    return this;
  }

  /**
   * 获取当前地图窗口的外接矩形
   * @param getProject {string} 想要获取的范围坐标系，默认 EPSG:4326
   * @return {Array} 返回的外接矩形
   */
  getMapExtent(getProject = "EPSG:4326") {
    let currentExtent = this.getView().calculateExtent(this.getSize());
    let viewProject = this.getView().getProjection();
    let returnExtent = [];

    returnExtent = returnExtent.concat(
      this.corTransform(
        currentExtent[0],
        currentExtent[1],
        viewProject,
        getProject
      )
    );
    returnExtent = returnExtent.concat(
      this.corTransform(
        currentExtent[2],
        currentExtent[3],
        viewProject,
        getProject
      )
    );
    return returnExtent;
  }

  /**
   * 移动到指定中心点的位置
   * @param centPoints 指定的中心点
   * @param options 相关移动的参数
   * @return {SeeMap}
   */
  moveToCenter(centPoints, options = {}) {
    let getOptions = mergeOptions(
      {
        maxZoom: null,
        minZoom: null,
        animate: false,
        animateDuration: 1000
      },

      options
    );
    if (centPoints instanceof Array && centPoints.length === 2) {
      centPoints = this.corTransform(centPoints[0], centPoints[1]);
    }
    let currentZoom = this.getView().getZoom();
    if (getOptions.maxZoom && currentZoom > getOptions.maxZoom) {
      currentZoom = getOptions.maxZoom;
    }
    if (getOptions.minZoom && currentZoom < getOptions.minZoom) {
      currentZoom = getOptions.minZoom;
    }
    if (getOptions.animate) {
      this.getView().animate({
        zoom: currentZoom,
        center: centPoints,
        duration: getOptions.animateDuration
      });
    } else {
      this.getView().setZoom(currentZoom);
      this.getView().setCenter(centPoints);
    }

    return this;
  }

  fit(geometryOrExtent, options = {}) {
    if (!options.maxZoom) {
      options.maxZoom = 18;
    }
    this.getView().fit(geometryOrExtent, options);
    return this;
  }

  /**
   * 设置点显示的提示
   * @param coordinate {ol/coordinate~Coordinate|undefined}
   * @param innerHtml
   */
  setPointTips(coordinate, innerHtml) {
    if (!this.pointTips) {
      createPointTips(this);
    }
    if (innerHtml) {
      this.pointTipsElement.innerHTML = innerHtml;
    }
    this.pointTips.setPosition(coordinate);
  }

  /**
   * 设置鼠标右侧的提示
   * @param innerHtml
   */
  setMouseTips(innerHtml) {
    this._mouseTips = innerHtml;
  }

  /**
   * 鼠标移动所响应的方法，如果 _mouseTips 为null则不显示
   * @param evt
   * @private
   */
  _mouseMoveHandler(evt) {
    if (evt.dragging) {
      return;
    }
    if (!this.mouseTips) {
      createMouseTips(this);
    }
    if (this._mouseTips) {
      this.mouseTipsElement.innerHTML = this._mouseTips;
      this.mouseTips.setPosition(evt.coordinate);
    } else {
      this.mouseTips.setPosition(null);
    }
  }
}
