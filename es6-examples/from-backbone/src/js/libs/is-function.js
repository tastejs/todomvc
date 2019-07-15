/**
 * @author Jonmathon Hibbard
 * @license MIT
 */
/**
 * Original Source from `underscorejs`
 * Updated to be more es6 friendly...
 *
 * @see https://underscorejs.org/docs/underscore.html#section-151
 */
export const FUNCTION_TYPE = 'function';
export const OBJECT_TYPE = 'object';
export const REGEX_TYPE = (typeof /./).toLowerCase();
export const INT8_ARRAY_TYPE = (typeof Int8Array).toLowerCase();
export const NODE_LIST_TYPE = (typeof nodelist).toLowerCase();
export const root = typeof self == OBJECT_TYPE && self.self === self && self || typeof global == OBJECT_TYPE && global.global === global && global || this || {};
export const nodelist = root.document && root.document.childNodes;
export const isFunction = (() => {
	if (REGEX_TYPE !== FUNCTION_TYPE && INT8_ARRAY_TYPE !== OBJECT_TYPE && NODE_LIST_TYPE !== FUNCTION_TYPE) {
		return obj => typeof obj == FUNCTION_TYPE || false;
	}

	return obj => toString.call(obj) === `[object ${ name  }]`;
})();
