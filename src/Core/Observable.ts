import { listen, unlistenByKey, unlisten, listenOnce, EventsKey, ListenerFunction } from './events'
import EventTarget from './events/Target'

/**
 * Counter for uuid.
 * @type {number}
 * @private
 */
let _uuidCounter: number = 0

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * An event target providing convenient methods for listener registration
 * and unregistration. A generic `change` event is always available through
 *
 * @api
 */
export default class Observable extends EventTarget {
  private _revision: number = 0
  private readonly _uuid: number
  [property: string]: any

  constructor() {
    super()
    this._uuid = this.generateUuid()
  }

  public getValueBy (key: string): any {
    return this[key]
  }

  /**
   * Increases the revision counter and dispatches a 'change' event.
   * @api
   */
  public changed (): void {
    ++this._revision
    this.dispatchEvent('change')
  }

  /**
   * Get the version number for this object.  Each time the object is modified,
   * its version number will be incremented.
   * @return Revision.
   * @api
   */
  public getRevision (): number {
    return this._revision
  }

  /**
   * get uuid
   */
  public get uuid(): number {
    return this._uuid
  }

  /**
   * 生成一个全局唯一的uuid计数器id
   */
  public generateUuid(): number {
    return ++_uuidCounter
  }

  /**
   * Listen for a certain type of event.
   * @param type The event type or array of event types.
   * @param listener The listener function.
   * @return Unique key for the listener. If called with an array of event types as the first argument, the return
   *     will be an array of keys.
   * @api
   */
  public on (type: string | Array<string>, listener: ListenerFunction): EventsKey | EventsKey[] {
    if (Array.isArray(type)) {
      const len = type.length
      const keys = new Array(len)
      for (let i = 0; i < len; ++i) {
        keys[i] = listen(this, type[i], listener)
      }
      return keys
    } else {
      return listen(this, type, listener)
    }
  }

  /**
   * Listen once for a certain type of event.
   * @param type The event type or array of event types.
   * @param listener The listener function.
   * @return Unique key for the listener. If
   *     called with an array of event types as the first argument, the return
   *     will be an array of keys.
   * @api
   */
  public once (type: string | string[], listener: ListenerFunction): EventsKey | EventsKey[] {
    if (Array.isArray(type)) {
      const len = type.length
      const keys = new Array(len)
      for (let i = 0; i < len; ++i) {
        keys[i] = listenOnce(this, type[i], listener)
      }
      return keys
    } else {
      return listenOnce(this, type, listener)
    }
  }

  /**
   * Unlisten for a certain type of event.
   * @param type The event type or array of event types.
   * @param listener The listener function.
   * @api
   */
  public un (type: string | Array<string>, listener: ListenerFunction): void {
    if (Array.isArray(type)) {
      for (let i = 0, ii = type.length; i < ii; ++i) {
        unlisten(this, type[i], listener)
      }
    } else {
      unlisten(this, type, listener)
    }
  }
}

/**
 * Removes an event listener using the key returned by `on()` or `once()`.
 * @param key The key returned by `on()` or `once()` (or an array of keys).
 * @api
 */
export function unByKey (key: EventsKey | EventsKey[]): void {
  if (Array.isArray(key)) {
    for (let i = 0, ii = key.length; i < ii; ++i) {
      unlistenByKey(key[i])
    }
  } else {
    unlistenByKey(key)
  }
}
