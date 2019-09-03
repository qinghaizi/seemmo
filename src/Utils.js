/**
 * Created by lyuwei
 * User: lvwei@seemmo.com
 * Date: 2018/12/06
 * Describe:
 * Log:
 *  ---- 2018/12/06 20:50 [lyuwei] 初次添加
 *  ---- 2018/12/18 20:21 [lyuwei] 添加注释
 */

// @function create(proto: Object, properties?: Object): Object
// Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
export let create = Object.create || (function () {
  function F () {}

  return function (proto) {
    F.prototype = proto
    return new F()
  }
})()

/**
 * 简易的融合option对象，不会深度融合只有一层
 * @param {merge base options} obj 基本options对象
 * @param {set options} options 融合使用的options对象
 */
export function mergeOptions (obj = {}, options = {}) {
  for (let i in options) {
    obj[i] = options[i]
  }
  return obj
}
