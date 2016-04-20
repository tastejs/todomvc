/**
 * @type Function
 * @summary add class to DOM element
 *
 * @param el {HTMLElement}
 * @param className {String}
 */
function addClass(el, className) {
    var classes = el.className.split(' ');
    if (classes.indexOf(className) === -1) {
        el.className = classes.concat([className]).join(' ');
    }
}
/**
 * @type Function
 * @summary add class to DOM element
 *
 * @param el {HTMLElement}
 * @param className {String}
 */
function removeClass(el, className) {
    var classes = el.className.split(' ');
    if (classes.indexOf(className) !== -1) {
        classes.splice(classes.indexOf(className), 1);
        el.className = classes.join(' ');
    }
}
/**
 * @type Function
 * @summary toggle class for DOM element
 *
 * @param el {HTMLElement}
 * @param className {String}
 * @param add {Boolean}
 */
function toggleClass(el, className, add) {
    if (add) {
        addClass(el, className);
    }
    else {
        removeClass(el, className);
    }
}
