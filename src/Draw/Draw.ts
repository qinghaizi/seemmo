/*
 * @LastEditors: tande
 * @Author: lyuwei
 * @Date: 2019-04-08 13:41:13
 * @LastEditTime: 2019-11-29 11:49:40
 */
import mapboxglDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Observable from "../Core/Observable";
import SeeMap from "../SeeMap";
import drawRect from "./DrawRect";
import drawCircle from "./DrawCircle";
import DrawEvent from "./DrawEvent";

interface DrawType {
  Select: string | null;
  Point: string | null;
  LineString: string | null;
  Polygon: string | null;
  Circle: string | null;
  Box: string | null;
}

const DrawEventType = {
  DRAWEND: "drawEnd",
  MESSAGE: "message"
};

export default class Draw extends Observable {
  private _seemmoMap: SeeMap | null = null;
  private readonly _draw: mapboxglDraw;

  public static readonly TYPE: DrawType = {
    Select: "simple_select",
    Point: "draw_point",
    LineString: "draw_line_string",
    Polygon: "draw_polygon",
    Circle: "draw_circle",
    Box: "draw_rect"
  };

  constructor() {
    super();
    this._draw = new mapboxglDraw({
      // controls: {
      //     point: true
      // },
      displayControlsDefault: false,
      touchEnabled: false,
      modes: Object.assign(mapboxglDraw.modes, {
        draw_rect: drawRect,
        draw_circle: drawCircle
      })
    });
    // bind listen call back func
    this._createCallBack = this._createCallBack.bind(this);
    this._updateCallBack = this._updateCallBack.bind(this);
    this._deleteCallBack = this._deleteCallBack.bind(this);
  }

  public get SeeMap(): SeeMap | null {
    return this._seemmoMap;
  }

  public addTo(mapContainer: SeeMap): this {
    if (this.SeeMap) {
      this.SeeMap.removeControl(this._draw);
      this._removeMapboxDrawEvent();
    }
    this._seemmoMap = mapContainer;
    this._seemmoMap.addControl(this._draw);
    this._addMapboxDrawEvent();
    return this;
  }

  private _addMapboxDrawEvent(): void {
    if (!this.SeeMap) {
      return;
    }
    this.SeeMap.on("draw.create", this._createCallBack);
    this.SeeMap.on("draw.update", this._updateCallBack);
    this.SeeMap.on("draw.delete", this._deleteCallBack);
  }
  private _removeMapboxDrawEvent(): void {
    if (!this.SeeMap) {
      return;
    }
    this.SeeMap.off("draw.create", this._createCallBack);
    this.SeeMap.off("draw.update", this._updateCallBack);
    this.SeeMap.off("draw.delete", this._deleteCallBack);
  }
  private _createCallBack(e: any): void {
    this.dispatchEvent(new DrawEvent(DrawEventType.DRAWEND, e));
  }
  private _updateCallBack(e: any): void {
    console.log("draw.update", e);
  }
  private _deleteCallBack(e: any): void {
    console.log("draw.delete", e);
  }

  public changeMode(mode: keyof DrawType): void {
    let type_mode: string | null = Draw.TYPE[mode];
    if (!type_mode) {
      return;
    }
    this._draw.changeMode(type_mode);
  }

  public clear(): void {
    this._draw.deleteAll();
  }

  public destory(): void {
    if (this.SeeMap) {
      this.SeeMap.removeControl(this._draw);
      delete this._seemmoMap;
    }
  }
}
