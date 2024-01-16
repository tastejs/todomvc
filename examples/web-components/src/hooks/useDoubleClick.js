/**
 * A simple function to normalize a double-click and a double-tab action.
 * There is currently no comparable tab action to dblclick.
 *
 * @param {Function} fn
 * @param {number} delay
 * @returns
 */
export function useDoubleClick(fn, delay) {
    let last = 0;
    return function (...args) {
        const now = new Date().getTime();
        const difference = now - last;
        if (difference < delay && difference > 0)
            fn.apply(this, args);

        last = now;
    };
}
