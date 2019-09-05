/*
 * @Descripttion: 
 * @Date: 2019-09-05 13:18:32
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 13:20:02
 */
import GeoJSON from 'ol/format/GeoJSON'
import * as CoordTrans from './CoordTrans'

const GeoJsonFromat = new GeoJSON()

/**
 * 读取空间对象
 * @param geometry 空间属性
 * @return {geomObj} 格式化的空间对象,type 为对象类型，geom 为空间对象的坐标数组
 */
export function readGeometry(geometry) {
  let clonReadGeometry = geometry.clone()
  let geomObj = {}
  geomObj.type = clonReadGeometry.getType().toString()
  geomObj.geom = clonReadGeometry.transform('EPSG:3857', 'EPSG:4326').getCoordinates()
  if (geomObj.type.toLowerCase() === 'polygon') {
    geomObj.geom = geomObj.geom[0]
  }
  return geomObj
}

/**
 * 格式化绘制结束的geometry对象，返回geojson数据
 * @param geometry 绘制结束的空间对象
 * @return {string} 返回的geojson对象
 */
export function readGeomAsGeoJson(geometry) {
  let clonReadGeometry = geometry.clone()
  return GeoJsonFromat.writeGeometry(clonReadGeometry.transform('EPSG:3857', 'EPSG:4326'))
}

export {
  CoordTrans
}
