
export function deepFreeze<T>(obj: T): T {
	if (!obj || typeof obj !== 'object') {
		return obj;
	}
	const stack: any[] = [obj];
	while (stack.length > 0) {
		const obj = stack.shift();
		Object.freeze(obj);
		for (const key in obj) {
			if (_hasOwnProperty.call(obj, key)) {
				const prop = obj[key];
				if (typeof prop === 'object' && !Object.isFrozen(prop)) {
					stack.push(prop);
				}
			}
		}
	}
	return obj;
}

const _hasOwnProperty = Object.prototype.hasOwnProperty;


/**
 * Polyfill for Object.assign().  Assigns enumerable and own properties from
 * one or more source objects to a target object.
 * See https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign.
 *
 * @param {!Object} target The target object.
 * @param {...Object} var_sources The source object(s).
 * @return {!Object} The modified target object.
 */
export function assign<T>(destination: T): T;
export function assign<T, U>(destination: T, u: U): T & U;
export function assign<T, U, V>(destination: T, u: U, v: V): T & U & V;
export function assign<T, U, V, W>(destination: T, u: U, v: V, w: W): T & U & V & W;
export function assign(destination: any, ...sources: any[]): any {
	sources.forEach(source => Object.keys(source).forEach(key => destination[key] = source[key]));
	return destination;
}
/**
 * Removes all properties from an object.
 * @param object The object to clear.
 */
export function clear (object: {[property: string]: any}): void {
  for (const property in object) {
    delete object[property]
  }
}