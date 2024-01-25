"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOnEvent = void 0;
/**
 * A property decorator that subscribes to an event on the property value and
 * calls `requestUpdate` when the event fires.
 *
 * If we were using this outside of just this one app we'd use the type system
 * to enforce that the property value is an `EventTarget`.
 */
const updateOnEvent = (eventName) => (target, propertyKey) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    const { get, set } = descriptor;
    const newDescriptor = Object.assign(Object.assign({}, descriptor), { set(v) {
            var _a, _b, _c;
            const listener = (_a = this.__updateOnEventListener) !== null && _a !== void 0 ? _a : (this.__updateOnEventListener = () => this.requestUpdate());
            const oldValue = get.call(this);
            (_b = oldValue === null || oldValue === void 0 ? void 0 : oldValue.removeEventListener) === null || _b === void 0 ? void 0 : _b.call(oldValue, eventName, listener);
            (_c = v === null || v === void 0 ? void 0 : v.addEventListener) === null || _c === void 0 ? void 0 : _c.call(v, eventName, listener);
            return set.call(this, v);
        } });
    Object.defineProperty(target, propertyKey, newDescriptor);
};
exports.updateOnEvent = updateOnEvent;
