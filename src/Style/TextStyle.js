/**
 * Created by lyuwei
 * User: lvwei@seemmo.com
 * Date: 2018/12/10
 * Describe:
 * Log:
 *  ---- 2018/12/10 16:01 [lyuwei] 初次添加
 */

import { textStyleConst } from './CONST'
import FillStyleFunction from './FillStyle'
import StrokeStyleFunction from './StrokeStyle'
import Text from 'ol/style/Text'

export default function (textStyleJson) {
  for (let key in textStyleJson) {
    if (!textStyleJson.hasOwnProperty(key)) {
      continue
    }
    switch (key) {
      case textStyleConst.FILLCOLOR:
        textStyleJson.fill = FillStyleFunction(textStyleJson[key])
        break
      case textStyleConst.STROKE:
        textStyleJson.stroke = StrokeStyleFunction(textStyleJson[key])
        break
      case textStyleConst.BACKGROUNDFILLCOLOR:
        textStyleJson.backgroundFill = FillStyleFunction(textStyleJson[key])
        break
      case textStyleConst.BACKGROUNDSTROKE:
        textStyleJson.backgroundStroke = StrokeStyleFunction(textStyleJson[key])
        break
    }
  }
  return new Text(textStyleJson)
}
