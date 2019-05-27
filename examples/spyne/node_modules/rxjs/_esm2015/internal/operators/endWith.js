import { concat } from '../observable/concat';
export function endWith(...array) {
    return (source) => concat(source, ...array);
}
//# sourceMappingURL=endWith.js.map