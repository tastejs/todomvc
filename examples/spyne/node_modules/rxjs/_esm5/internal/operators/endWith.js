/** PURE_IMPORTS_START _observable_concat PURE_IMPORTS_END */
import { concat } from '../observable/concat';
export function endWith() {
    var array = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        array[_i] = arguments[_i];
    }
    return function (source) { return concat.apply(void 0, [source].concat(array)); };
}
//# sourceMappingURL=endWith.js.map
