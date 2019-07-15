/**
 * @author Jonmathon Hibbard
 * @license MIT
 */
import { OBJ_TYPE, ARRAY_TYPE_STRING } from '@app-constants';

const isEmptyObj = obj => (
	typeof obj !== OBJ_TYPE ||
	Object.prototype.toString.call(obj) === ARRAY_TYPE_STRING ||
	Object.keys(obj).length === 0
);

export default isEmptyObj;
