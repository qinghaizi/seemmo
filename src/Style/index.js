/*
 * @Descripttion: 
 * @Date: 2019-09-05 13:18:32
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 13:18:32
 */
import {
  styleType
} from './CONST'
import imageStyleFunction from './ImageStyle'
import Style from 'ol/style/Style'
import FillStyleFunction from './FillStyle'
import StrokeStyleFunction from './StrokeStyle'
import TextStyleFunction from './TextStyle'

export default function (styleJson) {
  let styleObj = {}
  for (let styleKey in styleJson) {
    if (styleJson.hasOwnProperty(styleKey)) {
      switch (styleKey) {
        case styleType.IMAGE:
          styleObj.image = imageStyleFunction(styleJson[styleKey])
          break
        case styleType.FILLCOLOR:
          styleObj.fill = FillStyleFunction(styleJson[styleKey])
          break
        case styleType.STROKE:
          styleObj.stroke = StrokeStyleFunction(styleJson[styleKey])
          break
        case styleType.TEXT:
          styleObj.text = TextStyleFunction(styleJson[styleKey])
          break
        case styleType.ZINDEX:
          styleObj.zIndex = Number(styleJson[styleKey])
          break
      }
    }
  }

  // 如果根据设置的styleJson根本不能生成style，就不返回style对象，简单的控制内存
  let keys = Object.keys(styleObj)
  if (keys.length > 0) {
    return new Style(styleObj)
  } else {
    return null
  }
}
