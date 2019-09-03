/**
 * Created by lyuwei
 * User: lvwei@seemmo.com
 * Date: 2018/12/10
 * Describe: 根据传入的json文件得到对应的style样式
 * Log:
 *  ---- 2018/12/10 10:15 [lyuwei] 初次添加
 */

import { styleType } from './CONST'
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
