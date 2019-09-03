/**
 * Created by lyuwei
 * User: lvwei@seemmo.com
 * Date: 2018/09/10
 * Describe:
 * Log:
 *  ---- 2018/09/10 14:38 [lyuwei] 初次添加
 */
import { Loading, Message, Notification } from 'element-ui'

let globalLoading = null

/**
 *全屏加载动画
 * @param {String} msg 提示性文字
 */
function showLoading (msg) {
  globalLoading = Loading.service({
    lock: true,
    text: msg,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.9)'
  })
  return globalLoading
}

function closeLoading () {
  if (globalLoading) {
    globalLoading.close()
    globalLoading = null
  }
}

/**
 *消息
 * @param {String} msg 提示文字
 * @param {String} type 类型四种 success, warning, info, error
 * @param {Number||String} duration 持续时间，时间到即自动消失，传'0'则不自动消失。
 */
function message (msg, type, duration) {
  return Message({
    showClose: true,
    message: msg,
    type: type || 'error',
    duration: duration || 3000
  })
}

/**
 * 通知
 * @param {String} msg 提示文字
 * @param {String} type 类型四种 success, warning, info, error
 * @param {String} title 通知标题
 * @param {Number||String} duration 持续时间，时间到即自动消失，传'0'则不自动消失。
 */
function notify (msg, type, title, duration) {
  return Notification({
    message: msg,
    type: type,
    title: title,
    duration: duration || 4500
  })
}

/**
 * 时间转换方法
 * @param val
 * @param type
 * @returns {string}
 */
function timeFormat (val, type) {
  val = Number(val)
  let date = new Date(val)
  let Y = date.getFullYear() + '-'
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

  if (type === 'dateTime') {
    return Y + M + D + h + m + s
  } else {
    return Y + M + D
  }
}

export default {
  timeFormat,
  showLoading,
  closeLoading,
  message,
  notify
}
