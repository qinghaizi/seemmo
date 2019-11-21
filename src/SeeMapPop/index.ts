// 作为库文件没有必要把框架引入其中。会显著增加库文件打包大小,vue的弹出框由封装组件来完成

import "./BasePop.less";

export { default as SeeMapPop } from "./BasePop";
export { default as SeeMapTip } from "./Tips";

export type Anchor = {
  center: string;
  top: string;
  "top-left": string;
  "top-right": string;
  bottom: string;
  "bottom-left": string;
  "bottom-right": string;
  left: string;
  right: string;
};

export type Pos = {
  center: mapboxgl.Point;
  top: mapboxgl.Point;
  "top-left": mapboxgl.Point;
  "top-right": mapboxgl.Point;
  bottom: mapboxgl.Point;
  "bottom-left": mapboxgl.Point;
  "bottom-right": mapboxgl.Point;
  left: mapboxgl.Point;
  right: mapboxgl.Point;
};

export type PreOffsetOption = {
  center?: mapboxgl.PointLike;
  top?: mapboxgl.PointLike;
  "top-left"?: mapboxgl.PointLike;
  "top-right"?: mapboxgl.PointLike;
  bottom?: mapboxgl.PointLike;
  "bottom-left"?: mapboxgl.PointLike;
  "bottom-right"?: mapboxgl.PointLike;
  left?: mapboxgl.PointLike;
  right?: mapboxgl.PointLike;
};

export type OffsetOption = mapboxgl.PointLike | number | PreOffsetOption;

export const anchorTranslate: Anchor = {
  center: "translate(-50%,-50%)",
  top: "translate(-50%,0)",
  "top-left": "translate(0,0)",
  "top-right": "translate(-100%,0)",
  bottom: "translate(-50%,-100%)",
  "bottom-left": "translate(0,-100%)",
  "bottom-right": "translate(-100%,-100%)",
  left: "translate(0,-50%)",
  right: "translate(-100%,-50%)"
};
