/**
 * @classdesc
 * Objects that need to clean up after themselves.
 */
export default class Disposable {
  /**
   * The object has already been disposed.
   */
  private _disposed: boolean

  constructor () {
    this._disposed = false
  }

  /**
   * Clean up.
   */
  public dispose (): void {
    if (!this._disposed) {
      this._disposed = true
      this.disposeInternal()
    }
  }

  /**
   * Extension point for disposable objects.
   * @protected
   */
  public disposeInternal (): void {}
}
