import { clear } from './obj'
import Target, { EventTargetLike } from './events/Target';
/**
 * Key to use with {@link module:ol/Observable~Observable#unByKey}.
 * @typedef {Object} EventsKey
 * @property {Object} [bindTo]
 * @property {ListenerFunction} [boundListener]
 * @property {boolean} callOnce
 * @property {number} [deleteIndex]
 * @property {ListenerFunction} listener
 * @property {import("./events/Target.js").EventTargetLike} target
 * @property {string} type
 * @api
 */
export interface EventsKey {
  bindTo?: object,
  boundListener?: ListenerFunction,
  callOnce: boolean,
  deleteIndex?: number,
  listener: ListenerFunction,
  target: EventTargetLike,
  type: string
}

/**
 * Listener function. This function is called with an event object as argument.
 * When the function returns `false`, event propagation will stop.
 *
 * @typedef {function((Event|import("./events/Event.js").default)): (void|boolean)} ListenerFunction
 * @api
 */

export interface ListenerFunction {
  (property?: any): boolean | void
}
/**
 * @param {EventsKey} listenerObj Listener object.
 * @return {ListenerFunction} Bound listener.
 */
export function bindListener (listenerObj: EventsKey): ListenerFunction {
  const boundListener = function (evt: EventsKey) {
    const listener = listenerObj.listener
    const bindTo = listenerObj.bindTo || listenerObj.target
    if (listenerObj.callOnce) {
      unlistenByKey(listenerObj)
    }
    return listener.call(bindTo, evt)
  }
  listenerObj.boundListener = boundListener
  return boundListener
}

/**
 * Finds the matching {@link module:ol/events~EventsKey} in the given listener
 * array.
 *
 * @param listeners Array of listeners.
 * @param listener The listener function.
 * @param opt_this The `this` value inside the listener.
 * @param opt_setDeleteIndex Set the deleteIndex on the matching listener, for {@link module:ol/events~unlistenByKey}.
 * @return The matching listener object.
 */
export function findListener (listeners: EventsKey[], listener: ListenerFunction, opt_this?: object, opt_setDeleteIndex?: boolean): EventsKey | undefined {
  let listenerObj
  for (let i = 0, ii = listeners.length; i < ii; ++i) {
    listenerObj = listeners[i]
    if (listenerObj.listener === listener &&
        listenerObj.bindTo === opt_this) {
      if (opt_setDeleteIndex) {
        listenerObj.deleteIndex = i
      }
      return listenerObj
    }
  }
  return undefined
}

/**
 * @param target Target.
 * @param type Type.
 * @return Listeners.
 */
export function getListeners (target: EventTargetLike, type: string): EventsKey[] | undefined {
  const listenerMap = getListenerMap(target)
  return listenerMap ? listenerMap[type] : undefined
}

/**
 * Get the lookup of listeners.
 * @param target Target.
 * @param opt_create If a map should be created if it doesn't exist.
 * @return Map of listeners by event type.
 */
function getListenerMap (target: any, opt_create?: boolean): {[property: string]: EventsKey[]} {
  let listenerMap = target.ol_lm
  if (!listenerMap && opt_create) {
    listenerMap = target.ol_lm = {}
  }
  return listenerMap
}

/**
 * Remove the listener map from a target.
 * @param {Object} target Target.
 */
function removeListenerMap (target: any) {
  delete target.ol_lm
}

/**
 * Clean up all listener objects of the given type.  All properties on the
 * listener objects will be removed, and if no listeners remain in the listener
 * map, it will be removed from the target.
 * @param target Target.
 * @param type Type.
 */
function removeListeners (target: EventTargetLike, type: string): void {
  const listeners = getListeners(target, type)
  if (listeners) {
    for (let i = 0, ii = listeners.length; i < ii; ++i) {
      let tmp: EventsKey = listeners[i]
      if (tmp.boundListener) {
        (target as Target).removeEventListener(type, tmp.boundListener)
      }
      clear(listeners[i])
    }
    listeners.length = 0
    const listenerMap = getListenerMap(target)
    if (listenerMap) {
      delete listenerMap[type]
      if (Object.keys(listenerMap).length === 0) {
        removeListenerMap(target)
      }
    }
  }
}

/**
 * Registers an event listener on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * This function efficiently binds a `listener` to a `this` object, and returns
 * a key for use with {@link module:ol/events~unlistenByKey}.
 *
 * @param target Event target.
 * @param type Event type.
 * @param listener Listener.
 * @param opt_this Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 * @param opt_once If true, add the listener as one-off listener.
 * @return Unique key for the listener.
 */
export function listen (target: EventTargetLike, type: string, listener: ListenerFunction, opt_this?: object, opt_once?: boolean): EventsKey {
  const listenerMap = getListenerMap(target, true)
  let listeners = listenerMap[type]
  if (!listeners) {
    listeners = listenerMap[type] = []
  }
  let listenerObj = findListener(listeners, listener, opt_this, false)
  if (listenerObj) {
    if (!opt_once) {
      // Turn one-off listener into a permanent one.
      listenerObj.callOnce = false
    }
  } else {
    listenerObj = {
      bindTo: opt_this,
      callOnce: !!opt_once,
      listener: listener,
      target: target,
      type: type
    };
    (target as Target).addEventListener(type, bindListener(listenerObj))
    listeners.push(listenerObj)
  }

  return listenerObj
}

/**
 * Registers a one-off event listener on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * This function efficiently binds a `listener` as self-unregistering listener
 * to a `this` object, and returns a key for use with
 * {@link module:ol/events~unlistenByKey} in case the listener needs to be
 * unregistered before it is called.
 *
 * When {@link module:ol/events~listen} is called with the same arguments after this
 * function, the self-unregistering listener will be turned into a permanent
 * listener.
 *
 * @param target Event target.
 * @param type Event type.
 * @param listener Listener.
 * @param opt_this Object referenced by the `this` keyword in the listener. Default is the `target`.
 * @return Key for unlistenByKey.
 */
export function listenOnce (target: EventTargetLike, type: string, listener: ListenerFunction, opt_this?: object): EventsKey {
  return listen(target, type, listener, opt_this, true)
}

/**
 * Unregisters an event listener on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * To return a listener, this function needs to be called with the exact same
 * arguments that were used for a previous {@link module:ol/events~listen} call.
 *
 * @param target Event target.
 * @param type Event type.
 * @param listener Listener.
 * @param opt_this Object referenced by the `this` keyword in the listener. Default is the `target`.
 */
export function unlisten (target: EventTargetLike, type: string, listener: ListenerFunction, opt_this?: object) {
  const listeners = getListeners(target, type)
  if (listeners) {
    const listenerObj = findListener(listeners, listener, opt_this, true)
    if (listenerObj) {
      unlistenByKey(listenerObj)
    }
  }
}

/**
 * Unregisters event listeners on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * The argument passed to this function is the key returned from
 * {@link module:ol/events~listen} or {@link module:ol/events~listenOnce}.
 *
 * @param key The key.
 */
export function unlistenByKey (key: EventsKey): void {
  if (key && key.target) {
    if (key.boundListener) {
      (key.target as Target).removeEventListener(key.type, key.boundListener)
    }
    const listeners = getListeners(key.target, key.type)
    if (listeners) {
      const i = key.deleteIndex ? key.deleteIndex : listeners.indexOf(key)
      if (i !== -1) {
        listeners.splice(i, 1)
      }
      if (listeners.length === 0) {
        removeListeners(key.target, key.type)
      }
    }
    clear(key)
  }
}

/**
 * Unregisters all event listeners on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * @param target Target.
 */
export function unlistenAll (target: EventTargetLike): void {
  const listenerMap = getListenerMap(target)
  if (listenerMap) {
    for (const type in listenerMap) {
      removeListeners(target, type)
    }
  }
}
