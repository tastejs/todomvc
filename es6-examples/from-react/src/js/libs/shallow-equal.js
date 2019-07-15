import { OBJ } from '@app-constants';
/**
 * @author Jonmathon Hibbard
 * @license MIT
 */

/**
 * Original Source
 * @see https://github.com/facebook/react/blob/72434a7686035b4af766ee7d06c070d7f5d6a5f2/packages/shared/shallowEqual.js
 * ---------
 * Updated to be more es6-friendly... ;)
 */
const shallowEqual = (objA, objB) => {
	if (typeof objA !== OBJ || objA === null || typeof objB !== OBJ || objB === null) {
		return false;
	}

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);
	const isSameLength = keysA.length === keysB.length;

	const valueMismatch = keysA.some(key => {
		const hasProp = objB.hasOwnProperty(key);
		const hasWrongVal = objA[key] === objB[key];

		return !hasProp || hasWrongVal;
	});

	return isSameLength && !valueMismatch;
};

export default shallowEqual;
