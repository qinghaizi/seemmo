/*
 * @Descripttion:
 * @Date: 2019-09-05 11:18:43
 * @LastEditors: tande1124@163.com
 * @LastEditTime: 2019-09-10 20:22:01
 */

export let create =
  Object.create ||
  (function() {
    function F() {}

    return function(proto) {
      F.prototype = proto
      return new F()
    }
  })()

/**
 * 简易的融合option对象，不会深度融合只有一层
 * @param {merge base options} obj 基本options对象
 * @param {set options} options 融合使用的options对象
 */
export function mergeOptions(obj = {}, options = {}) {
  for (let i in options) {
    obj[i] = options[i]
  }
  return obj
}
