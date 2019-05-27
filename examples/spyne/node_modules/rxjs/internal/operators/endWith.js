"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var concat_1 = require("../observable/concat");
function endWith() {
    var array = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        array[_i] = arguments[_i];
    }
    return function (source) { return concat_1.concat.apply(void 0, [source].concat(array)); };
}
exports.endWith = endWith;
//# sourceMappingURL=endWith.js.map