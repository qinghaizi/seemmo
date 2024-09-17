/*
 * @LastEditors: lyuwei
 * @Author: lyuwei
 * @Date: 2019-05-09 11:22:40
 * @LastEditTime: 2019-05-09 17:40:27
 */
import SeeLayer, { SeeLayerParams } from "./SeeLayer";
import { Style } from "../Style";
import { assign } from "../Core/obj";
import LayerEvent, { GateEvent } from "./LayerEvent";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

interface SeeGateConstKey {
  /** NAME字段key */
  name: string;
  /** ID字段key */
  id: string;
  /** 经度字段key */
  lat: string;
  /** 维度字段key */
  lng: string;
}

interface SeeGateParams extends SeeLayerParams {
  enableShowLabel?: boolean;
  clickMinZoom?: number;

  constKey?: SeeGateConstKey;
}

export interface GateStyle extends Style {
  type: "symbol" | "circle";
  layout?: mapboxgl.SymbolLayout | mapboxgl.CircleLayout;
  paint?: mapboxgl.SymbolPaint | mapboxgl.CirclePaint;
}

const GATEBASEOPTION: SeeLayerParams = {
  key: "gate",
  index: 10,
  typeIndex: 10,
  enableClick: false
};

const GATEBASESTYLE: GateStyle = {
  type: "symbol",
  layout: {
    "icon-image": "gate-{_icon}",
    "icon-anchor": "bottom",
    // 设置是否进行碰撞检测，关闭则全部显示
    "icon-allow-overlap": true
  }
};

export default class SeeGate extends SeeLayer {
  /** 是否鼠标移上自动显示label */
  private _enableShowLabel: boolean = true;
  /** 最小可点击的范围 */
  private _clickMinZoom: number = 0;
  /** const 属性key */
  private _constKey: SeeGateConstKey = {
    name: "nodeName",
    id: "nodeId",
    lat: "lat",
    lng: "lng"
  };

  /** 当前所有是点击状态的卡口, 按照点击顺序 */
  private _selectedGateIds: string[] = [];
  /** 所有卡口 ID 用来添加的时候去重 */
  private _allGateIds: string[] = [];

  constructor(
    setOptions: SeeGateParams = {},
    styleJson?: GateStyle | GateStyle[]
  ) {
    super(assign(GATEBASEOPTION, setOptions), styleJson || GATEBASESTYLE);

    this._enableShowLabel = setOptions.enableShowLabel
      ? setOptions.enableShowLabel
      : this._enableShowLabel;
    this._constKey = assign(this._constKey, setOptions.constKey || {});

    // 监听layer的click事件
    this._featureClickFunc = this._featureClickFunc.bind(this);
    this._featureMoveOnFunc = this._featureMoveOnFunc.bind(this);
    this._featureMoveLeaveFunc = this._featureMoveLeaveFunc.bind(this);
    this.on("featureClick", this._featureClickFunc);
    this.on("featureOver", this._featureMoveOnFunc);
    this.on("featureLeave", this._featureMoveLeaveFunc);
  }

  /**
   * 更改gate图层的交互状态
   * @param boolean 是否可以点击，默认不可点击
   * @return {SeeGate}
   */
  public changeGateClickEnable(boolean: boolean = false): this {
    this.changeClickEnable(boolean);
    // 每次改变状态都要更新要素的点击状态
    this.setSelectedGates();
    return this;
  }

  private _featureClickFunc(evt_obj: LayerEvent): void {
    if (this.seeMap.getZoom() < this._clickMinZoom || !evt_obj.features) {
      return;
    }
    // 选中和未选中
    let selectedGates: mapboxgl.MapboxGeoJSONFeature[] = [];
    let unSelectedGates: mapboxgl.MapboxGeoJSONFeature[] = [];
    evt_obj.features.forEach(eachFeature => {
      eachFeature.properties = eachFeature.properties || {};
      const isSelected: boolean = !eachFeature.properties["selected"];
      eachFeature.properties["selected"] = isSelected;
      if (isSelected) {
        this._selectedGateIds.push(eachFeature.properties[this._constKey.id]);
        selectedGates.push(eachFeature);
      } else {
        let oldIndex = this._selectedGateIds.indexOf(
          eachFeature.properties[this._constKey.id]
        );
        if (oldIndex > -1) {
          this._selectedGateIds.splice(oldIndex, 1);
        }
        unSelectedGates.push(eachFeature);
      }
    });
    this.setFeaturesProperties(
      selectedGates.map(each => {
        return each.id;
      }) as (string | number)[],
      "selected",
      true
    );
    this.setFeaturesProperties(
      selectedGates.map(each => {
        return each.id;
      }) as (string | number)[],
      "_icon",
      "click"
    );
    this.setFeaturesProperties(
      unSelectedGates.map(each => {
        return each.id;
      }) as (string | number)[],
      "selected",
      false
    );
    this.setFeaturesProperties(
      unSelectedGates.map(each => {
        return each.id;
      }) as (string | number)[],
      "_icon",
      "normal"
    );

    this.dispatchEvent(
      new GateEvent("gateSelect", {
        features: selectedGates,
        coordinate: evt_obj.coordinate,
        message: "选中",
        source: evt_obj.source
      })
    );
    this.dispatchEvent(
      new GateEvent("gateUnSelect", {
        features: unSelectedGates,
        coordinate: evt_obj.coordinate,
        message: "取消选中",
        source: evt_obj.source
      })
    );
  }

  private _featureMoveOnFunc(evt_obj: LayerEvent): void {
    if (evt_obj.features) {
      this.seeMap.getCanvas().style.cursor = "point";
      if (!this._enableShowLabel) {
        return;
      }
      let features = evt_obj.features;
      if (!Array.isArray(features)) {
        features = [features];
      }
      const pointProperties = features[0].properties || {};
      const showLabelText = pointProperties[this._constKey.name];
      if (showLabelText) {
        let geometry = features[0].geometry as GeoJSON.Point;
        this.seeMap.setPointTips(
          geometry.coordinates as [number, number],
          showLabelText
        );
      }
      this.dispatchEvent(
        new GateEvent("gateMoveOn", {
          features: evt_obj.features,
          coordinate: evt_obj.coordinate,
          message: "鼠标移入",
          source: evt_obj.source
        })
      );
    }
  }

  private _featureMoveLeaveFunc(): void {
    this.seeMap.getCanvas().style.cursor = "";
    this.seeMap.setPointTips();
  }

  /**
   * 根据gatelist 创建gate要素并添加到图层中,清空重建
   *
   * @param gateList gatelist
   * @returns 返回当前对象
   */
  public createGateFeatures(gateList: object[] = []): this {
    this.setGeojsonFeatures([]);
    this._allGateIds = [];
    this.setSelectedGates([]);
    // 清空所有的要素之后添加全新的要素
    this.addGateFeatures(gateList);
    return this;
  }

  /**
   * 添加要展示的gate，根据设置id的字段来判断并去重
   * @param gateList
   * @return
   */
  public addGateFeatures(gateList: { [param: string]: any }[] = []): this {
    const LATKEY = this._constKey.lat;
    const LONKEY = this._constKey.lng;
    const GATEID = this._constKey.id;
    let featurePoins: {
      id: string | number;
      geometry: GeoJSON.Geometry;
      properties?: GeoJSON.GeoJsonProperties;
    }[] = [];
    gateList.forEach(eachGate => {
      if (eachGate.hasOwnProperty(LATKEY) && eachGate.hasOwnProperty(LONKEY)) {
        // 判断是否添加过，如果添加过不重复添加
        if (
          eachGate.hasOwnProperty(GATEID) &&
          this._allGateIds.indexOf(eachGate[GATEID].toString()) === -1
        ) {
          this._allGateIds.push(eachGate[GATEID].toString());
          featurePoins.push({
            id: eachGate[GATEID].toString(),
            geometry: {
              type: "Point",
              coordinates: [Number(eachGate[LONKEY]), Number(eachGate[LATKEY])]
            },
            properties: { ...eachGate, _icon: "normal" }
          });
        }
      }
    });
    this.addFeatures(featurePoins);
    return this;
  }

  /** 获取所有选中的卡口id */
  public get SelectedGateIds(): string[] {
    return this._selectedGateIds;
  }
  /**
   * 设置选中的gate
   * @param selecteds 选中卡扣id数组
   */
  public setSelectedGates(selecteds: (string | number)[] = []): this {
    let stringIds: string[] = [];
    selecteds.forEach(eachId => {
      stringIds.push(eachId.toString());
    });
    let allGates = this.geojsonData.features;
    allGates.forEach(eachGeojsonGate => {
      eachGeojsonGate.properties = eachGeojsonGate.properties || {};
      if (
        eachGeojsonGate.id &&
        stringIds.indexOf(eachGeojsonGate.id.toString()) > -1
      ) {
        eachGeojsonGate.properties["selected"] = true;
        eachGeojsonGate.properties["_icon"] = "click";
      } else {
        eachGeojsonGate.properties["selected"] = false;
        eachGeojsonGate.properties["_icon"] = "normal";
      }
    });
    this._selectedGateIds = stringIds;
    this.setGeojsonFeatures(allGates);
    this.updateMapboxSource();
    return this;
  }

  /**
   * 计算所有包含在传入的面空间对象上的所有要素
   * @param poplygon 待分析的面geojson
   */
  public calcGateInPolygon(
    poplygon: GeoJSON.Polygon | GeoJSON.MultiPolygon
  ): (string | number)[] {
    let inPolygonGates: (string | number)[] = [];
    this.geojsonData.features.forEach(eachFeature => {
      if (eachFeature.geometry.type === "Point" && eachFeature.id) {
        if (booleanPointInPolygon(eachFeature.geometry.coordinates, poplygon)) {
          inPolygonGates.push(eachFeature.id);
        }
      }
    });
    return inPolygonGates;
  }
}
