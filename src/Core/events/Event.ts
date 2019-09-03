/**
 * @classdesc
 * Stripped down implementation of the W3C DOM Level 2 Event interface.
 * See https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-interface.
 *
 * This implementation only provides `type` and `target` properties, and
 * `stopPropagation` and `preventDefault` methods. It is meant as base class
 * for higher level events defined in the library, and works with
 * {@link module:ol/events/Target~Target}.
 */
class Event {
  public propagationStopped: boolean
  /** The event type */
  public type: string
  /** The event target */
  public target: object | null

  constructor(type: string) {
    /**
     * @type {boolean}
     */
    this.propagationStopped
    this.type = type
    this.target = null
  }

  /**
   * Stop event propagation.
   * @api
   */
  preventDefault() {
    this.propagationStopped = true
  }

  /**
   * Stop event propagation.
   * @api
   */
  stopPropagation() {
    this.propagationStopped = true
  }
}

/**
 * @param {Event|import("./Event.js").default} evt Event
 */
export function stopPropagation(evt: Event) {
  evt.stopPropagation()
}

/**
 * @param {Event|import("./Event.js").default} evt Event
 */
export function preventDefault(evt: Event) {
  evt.preventDefault()
}

export default Event
