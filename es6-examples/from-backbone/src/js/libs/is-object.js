/**
 * @author Jonmathon Hibbard
 * @license MIT
 */
/**
 * Original Source from `underscorejs`
 * Updated to be more es6 friendly...
 *
 * @see https://underscorejs.org/docs/underscore.html#section-148
 */
export const FUNCTION_TYPE = 'function';
export const OBJECT_TYPE = 'object';
export const isObject = obj => {
	const type = typeof obj;

	return type === FUNCTION_TYPE || type === OBJECT_TYPE && !!obj;
};
