/*
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

'use strict';

const _log =
    require('./Logger')('TaskQueue.js');
const util = require('./Util.js');


// Types definitions for JsDoc

/**
 * The `ElementPosition` object returned by the `position()` method.
 *
 * @typedef {object} ElementPosition
 * @property {number} x X coordinate of the element in the viewport.
 * @property {number} y Y coordinate of the element in the viewport.
 * @property {boolean} visible Boolean value indicating whether the element is visible in the viewport.
 */

/**
 * The `IterationCallback` function.
 *
 * @private
 * @callback IterationCallback
 * @param {number} i Iteration count.
 * @param {object} item Current element.
 * @this {object}
 */

/**
 * Callback function used with the `each(..)` method.
 *
 * @callback ElementsIterationCallback
 * @param {number} count Iteration count.
 * @param {Element} item Current element.
 * @this {ZxQuery}
 */

/** @private */
let supportsPassive = util.hasPassiveEvents();

/** @private */
const _zuix_events_mapping = [];
function routeEvent(e) {
    triggerEventHandlers(this, e.type, e);
}
function addEventHandler(el, path, handler, options) {
    let found = false;
    z$.each(_zuix_events_mapping, function() {
        if (this.element === el && this.path === path && this.handler === handler) {
            _log.w('Handler already registered', el, path, handler);
            found = true;
            return false;
        }
    });
    if (!found) {
        _zuix_events_mapping.push({element: el, path: path, handler: handler, opgions: options});
        el.addEventListener(path, routeEvent, supportsPassive && (options == null || options.passive !== false) ? {passive: true} : false);
    }
}
function removeEventHandler(el, path, handler) {
    let left = 1;
    let index = -1;
    z$.each(_zuix_events_mapping, function(i) {
        if (this.element === el && this.path === path && this.handler === handler) {
            left--;
            index = i;
        }
    });
    if (index !== -1) {
        _zuix_events_mapping.splice(index, 1);
    }
    // unregister event handler since it was the last one
    if (left === 0) {
        el.removeEventListener(path, routeEvent);
    }
}
function triggerEventHandlers(el, path, evt) {
    const element = z$(el);
    z$.each(_zuix_events_mapping, function() {
        if (this.element === el && this.path === path) {
            this.handler.call(element, evt);
        }
    });
}
function removeAllEventHandlers(el) {
    z$.each(_zuix_events_mapping, function() {
        if (this.element === el) {
            _log.t('Removing event handler', this.element, this.path, this.handler);
            removeEventHandler(this.element, this.path, this.handler);
        }
    });
}

/**
 * ZxQuery, a very lite subset of jQuery-like functions
 * internally used in Zuix for DOM operations.
 *
 * The constructor takes one optional argument that can be
 * a DOM element, a node list or a valid DOM query selector string expression.
 * If no parameter is given, the resulting ZxQuery object will wrap the
 * root *document* element.
 *
 * @class ZxQuery
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined} [element] Element or list of elements to include in the ZxQuery object.
 * @return {ZxQuery} The *ZxQuery* object containing the given element(s).
 * @constructor
 */
function ZxQuery(element) {
    /** @protected */
    this._selection = [];

    if (typeof element === 'undefined') {
        element = document.documentElement;
    }

    if (element instanceof ZxQuery) {
        return element;
    } else if (element instanceof HTMLCollection || element instanceof NodeList) {
        const list = this._selection = [];
        z$.each(element, function(i, el) {
            list.push(el);
        });
    } else if (Array.isArray(element)) {
        this._selection = element;
    } else if (element === window || element instanceof HTMLElement || element instanceof Node) {
        this._selection = [element];
    } else if (typeof element === 'string') {
        this._selection = document.documentElement.querySelectorAll(element);
    } else if (element !== null) { // if (typeof element === 'string') {
        _log.e('ZxQuery cannot wrap object of this type.', (typeof element), element);
        throw new Error('ZxQuery cannot wrap object of this type.');
    }
    return this;
}


/**
 * Gets the number of elements in the ZxQuery object.
 *
 * @return {Number} Number of DOM elements.
 */
ZxQuery.prototype.length = function() {
    return this._selection.length;
};
/**
 * Gets the closest parent matching the given selector filter.
 * This only applies to the first element in the ZxQuery object.
 *
 * @param {string} [filter] A valid DOM query selector filter (**default:** *first parent*).
 * @return {ZxQuery} A new *ZxQuery* object containing the matching parent element.
 */
ZxQuery.prototype.parent = function(filter) {
    if (!util.isNoU(filter)) {
        return new ZxQuery(z$.getClosest(this._selection[0], filter));
    }
    return new ZxQuery(this._selection[0].parentNode);
};
/**
 * Gets the children matching the given selector filter.
 * This only applies to the first element in the ZxQuery object.
 *
 * @param {string} [filter] A valid DOM query selector filter (**default:** *all children*).
 * @return {ZxQuery}  A new *ZxQuery* object containing the selected *children*.
 */
ZxQuery.prototype.children = function(filter) {
    // TODO: implement filtering
    if (!util.isNoU(filter)) {
        return new ZxQuery(this._selection[0].querySelectorAll(filter));
    }
    return new ZxQuery(this._selection[0].children);
};
/**
 * Reverses order of the elements in the current set.
 *
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.reverse = function() {
    const elements = (Array.prototype.slice).call(this._selection, 0);
    this._selection = elements.reverse();
    return this;
};
/**
 * Gets the DOM Element located at the given position in the ZxQuery object.
 * If no index is provided, the default element will be returned.
 *
 * @param {number} [i] Position of element (**default:** 0).
 * @return {Node|Element} The *DOM* element.
 */
ZxQuery.prototype.get = function(i) {
    if (util.isNoU(i)) i = 0;
    return this._selection[i];
};
/**
 * Gets a new ZxQuery object containing the element
 * located at the given position in the current ZxQuery object.
 *
 * @param {number} i Position of element.
 * @return {ZxQuery} A new *ZxQuery* object containing the selected element.
 */
ZxQuery.prototype.eq = function(i) {
    const selection = this._selection;
    let resultSet = selection[i];
    if (arguments.length > 1) {
        resultSet = [];
        z$.each(arguments, function(k, v) {
            if (selection[v] != null) {
                resultSet.push(selection[v]);
            }
        });
    }
    return new ZxQuery(resultSet);
};
/**
 * Selects all descendants matching the given *DOM* query selector filter.
 * This only applies to the first element in the ZxQuery object.
 *
 * @param {string} selector A valid *DOM* query selector.
 * @return {ZxQuery} A new *ZxQuery* object containing the selected elements.
 */
ZxQuery.prototype.find = function(selector) {
    return new ZxQuery(this._selection[0].querySelectorAll(selector));
};
/**
 * Iterates through all *DOM* elements in the selection.
 * The context object *this*, passed to the
 * *iterationCallback*`(index, item)` function, will be the
 * *DOM* element corresponding the current iteration.
 * `index` will be the iteration count, and `item`
 * the current Element. The function context `this` will be a
 * `{ZxQuery}` instance containing the current `item`.
 * To interrupt the iteration loop, return `false` in the callback
 * function or return `true` to continue to the next iteration.
 *
 * @param {ElementsIterationCallback} iterationCallback The callback function to call for each element in the ZxQuery object.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.each = function(iterationCallback) {
    z$.each(this._selection, iterationCallback);
    return this;
};
/**
 * Gets the value of an attribute for the first element in the ZxQuery object,
 * or sets one or more attributes for all elements in the ZxQuery object.
 *
 * @param {string|JSON} attr The attribute name.
 * @param {string|undefined} [val] The attribute value.
 * @return {string|ZxQuery} The *attr* attribute value when no *val* specified, otherwise the *ZxQuery* object itself.
 */
ZxQuery.prototype.attr = function(attr, val) {
    const _t = this;
    if (typeof attr === 'object') {
        z$.each(attr, function(i, v) {
            _t.each(function(k, el) {
                el.setAttribute(i, v);
            });
        });
    } else if (typeof val == 'undefined') {
        return this._selection[0].getAttribute(attr);
    } else if (val === null) {
        this._selection[0].removeAttribute(attr);
    } else {
        this.each(function(k, v) {
            this.get().setAttribute(attr, val);
        });
    }
    return this;
};
/**
 * Triggers the given event for all elements in the ZxQuery object.
 *
 * @param {string} eventPath Path of the event to trigger.
 * @param {object} eventData Value of the event.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.trigger = function(eventPath, eventData) {
    let event;
    if (window.CustomEvent) {
        event = new CustomEvent(eventPath, {detail: eventData});
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventPath, true, true, eventData);
    }
    this.each(function(k, el) {
        el.dispatchEvent(event);
    });
    return this;
};
/**
 * Listens once to the given event for all elements in the ZxQuery object.
 *
 * @param {string} eventPath Event path.
 * @param {function} eventHandler Event handler.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.one = function(eventPath, eventHandler) {
    let fired = false;
    this.on(eventPath, function(a, b) {
        if (fired) return;
        fired = true;
        z$(this).off(eventPath, eventHandler);
        (eventHandler).call(this, a, b);
    });
    return this;
};
/**
 * Listens to the given event for all elements in the ZxQuery object.
 *
 * @param {string} eventPath Event path.
 * @param {function} eventHandler Event handler.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.on = function(eventPath, eventHandler) {
    const events = eventPath.match(/\S+/g) || [];
    let options;
    if (typeof eventHandler !== 'function') {
        options = eventHandler;
        eventHandler = options.handler;
    }
    this.each(function(k, el) {
        z$.each(events, function(k, ev) {
            addEventHandler(el, ev, eventHandler, options);
        });
    });
    return this;
};
/**
 * Stops listening for the given event.
 * @param {string} eventPath Event path.
 * @param {function} eventHandler Event handler.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.off = function(eventPath, eventHandler) {
    const events = eventPath.match(/\S+/g) || [];
    this.each(function(k, el) {
        z$.each(events, function(k, ev) {
            removeEventHandler(el, ev, eventHandler);
        });
    });
    return this;
};
/**
 * De-register all event handlers of all elements in the ZxQuery object.
 *
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.reset = function() {
    this.each(function(k, el) {
        removeAllEventHandlers(el);
    });
    return this;
};
/**
 * Returns *true* if the first element markup code is empty.
 *
 * @return {boolean} *true* if the element is empty, *false* otherwise.
 */
ZxQuery.prototype.isEmpty = function() {
    return (this._selection[0].innerHTML.replace(/\s/g, '').length === 0);
};
/**
 * Gets coordinates and visibility status of the first element.
 *
 * @return {ElementPosition}
 */
ZxQuery.prototype.position = function() {
    if (this._selection[0] != null) {
        return z$.getPosition(this._selection[0]);
    } else {
        // TODO: check this out; should prevent this from happening
        return {x: -1, y: -1, visible: false};
    }
};

/**
 * Gets the value of a CSS property for the first element in the ZxQuery object,
 * or sets one or more CSS property for all elements in the ZxQuery object.
 *
 * @param {string|JSON} prop The CSS property name or JSON list of property/value pairs.
 * @param {string|undefined} [val] The CSS property value.
 * @return {string|ZxQuery} The CSS property value when no *val* specified, otherwise the *ZxQuery* object itself.
 */
ZxQuery.prototype.css = function(prop, val) {
    const _t = this;
    if (typeof prop === 'object') {
        z$.each(prop, function(i, v) {
            _t.each(function(k, el) {
                el.style[i] = v;
            });
        });
    } else if (util.isNoU(val)) {
        return this._selection[0].style[prop];
    } else {
        _t.each(function(k, el) {
            el.style[prop] = val;
        });
    }
    return this;
};
/**
 * Adds the given CSS class to the class list of all elements in the ZxQuery object.
 *
 * @param {string} className The CSS class name.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.addClass = function(className) {
    const classes = className.match(/\S+/g) || [];
    z$.each(this._selection, function(k, el) {
        if (el.classList) {
            z$.each(classes, function(k, cl) {
                el.classList.add(cl);
            });
        } else el.className += ' ' + className;
    });
    return this;
};
/**
 * Returns *true* if the first element in the ZxQuery object contains the given CSS class.
 *
 * @param {string} className The CSS class name.
 * @return {boolean} *true* if the element contains the given CSS class, *false* otherwise.
 */
ZxQuery.prototype.hasClass = function(className) {
    return z$.hasClass(this._selection[0], className);
};
/**
 * Removes the given CSS class from all elements in the ZxQuery object.
 *
 * @param {string} className The CSS class name.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.removeClass = function(className) {
    const classes = className.match(/\S+/g) || [];
    z$.each(this._selection, function(k, el) {
        if (el.classList) {
            z$.each(classes, function(k, cl) {
                el.classList.remove(cl);
            });
        } else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    });
    return this;
};
/**
 * Moves to the previous sibling in the DOM.
 * This only applies to the first element in the ZxQuery object.
 *
 * @return {ZxQuery} A new *ZxQuery* object containing the previous sibling element.
 */
ZxQuery.prototype.prev = function() {
    return new ZxQuery(this._selection[0].previousElementSibling);
};
/**
 * Moves to the next sibling in the DOM.
 * This only applies to the first element in the ZxQuery object.
 *
 * @return {ZxQuery} A new *ZxQuery* object containing the next sibling element.
 */
ZxQuery.prototype.next = function() {
    return new ZxQuery(this._selection[0].nextElementSibling);
};
/**
 * Gets the HTML string of the first element in the ZxQuery object,
 * or sets the HTML string for all elements in the ZxQuery object.
 *
 * @param {string|undefined} [htmlText] HTML text.
 * @return {ZxQuery|string}
 */
ZxQuery.prototype.html = function(htmlText) {
    if (util.isNoU(htmlText)) {
        return this._selection[0].innerHTML;
    }
    this.each(function(k, el) {
        el.innerHTML = htmlText;
    });
    return this;
};
/**
 * Gets the `checked` attribute of the first element in the ZxQuery object,
 * or sets the `checked` attribute value for all elements in the ZxQuery object.
 *
 * @param {boolean|undefined} [check] Value to assign to the 'checked' attribute.
 * @return {ZxQuery|boolean}
 */
ZxQuery.prototype.checked = function(check) {
    if (util.isNoU(check)) {
        const checked = this._selection[0].checked;
        return (checked != null && checked != 'false' && (checked || checked == 'checked'));
    }
    this.each(function(k, el) {
        el.checked = check;
    });
    return this;
};
/**
 * Gets the `value` attribute of the first element in the ZxQuery object,
 * or sets the `value` attribute value for all elements in the ZxQuery object.
 *
 * @param {string|undefined} [value] Value to assign to the 'value' attribute.
 * @return {ZxQuery|string}
 */
ZxQuery.prototype.value = function(value) {
    if (util.isNoU(value)) {
        return this._selection[0].value;
    }
    this.each(function(k, el) {
        el.value = value;
    });
    return this;
};
/**
 * Appends the given element or HTML string to the first element in the ZxQuery object.
 *
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string} el Element or HTML to append.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.append = function(el) {
    if (typeof el === 'string') {
        this._selection[0].innerHTML += el;
    } else {
        this._selection[0].appendChild(el);
    }
    return this;
};
/**
 * Inserts the given child element before the one located at the specified index
 * to the first element in the ZxQuery object.
 *
 * @param {number} index Position where to insert `el` Element.
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList} el Element to insert.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.insert = function(index, el) {
    const target = this.children().get(index);
    if (target !== null) {
        this._selection[0].insertBefore(el, target);
    } else {
        this._selection[0].appendChild(el);
    }
    return this;
};
/**
 * Prepends the given element or HTML string to the first element in the ZxQuery object.
 *
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string} el Element to append.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.prepend = function(el) {
    if (typeof el === 'string') {
        this._selection[0].innerHTML = el + this._selection[0].innerHTML;
    } else {
        this._selection[0].insertBefore(el, this._selection[0].firstElementChild);
    }
    return this;
};
/**
 * Detach from its parent the first element in the ZxQuery object.
 *
 * @return {ZxQuery}
 */
ZxQuery.prototype.detach = function() {
    const el = this._selection[0];
    const parent = el.parentNode;
    if (parent != null) {
        el.__zuix_oldParent = parent;
        el.__zuix_oldIndex = Array.prototype.indexOf.call(parent.children, el);
        parent.removeChild(el);
        _log.t('Detached from parent', parent, el);
    }
    return this;
};
/**
 * Re-attach to its parent the first element in the ZxQuery object.
 *
 * @return {ZxQuery}
 */
ZxQuery.prototype.attach = function() {
    const el = this._selection[0];
    if (el.parentNode == null && el.__zuix_oldParent != null) {
        z$(el.__zuix_oldParent).insert(el.__zuix_oldIndex, el);
        el.__zuix_oldParent = null;
        delete el.__zuix_oldParent;
        delete el.__zuix_oldIndex;
    }
    return this;
};
/**
 * Gets the CSS `display` property of the first element in the ZxQuery object,
 * or sets the `display` property value for all elements in the ZxQuery object.
 *
 * @param {string|undefined} [mode] The display value.
 * @return {string|ZxQuery} The *display* value when no *mode* specified, otherwise the *ZxQuery* object itself.
 */
ZxQuery.prototype.display = function(mode) {
    if (util.isNoU(mode)) {
        return this._selection[0].style.display;
    }
    z$.each(this._selection, function(k, el) {
        el.style.display = mode;
    });
    return this;
};
/**
 * Gets the CSS `visibility` property of the first element in the ZxQuery object,
 * or sets the `visibility` property value for all elements in the ZxQuery object.
 *
 * @param {string|undefined} [mode] The visibility value.
 * @return {string|ZxQuery} The *visibility* value when no *mode* specified, otherwise the *ZxQuery* object itself.
 */
ZxQuery.prototype.visibility = function(mode) {
    if (util.isNoU(mode)) {
        return this._selection[0].style.visibility;
    }
    z$.each(this._selection, function(k, el) {
        el.style.visibility = mode;
    });
    return this;
};
/**
 * Sets the CSS `display` property to '' if no argument value is provided, otherwise set it to the given value.
 *
 * @param {string} [mode] Set the display mode to be used to show element (eg. block, inline, etc..).
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.show = function(mode) {
    return this.display(mode == null ? '' : mode);
};
/**
 * Sets the CSS `display` property to 'none'.
 *
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.hide = function() {
    return this.display('none');
};

// --- ZxQuery factory members --- //

/**
 * Exported ZxQuery interface.
 *
 * @param [what] {Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined}
 * @return {ZxQuery}
 */
const z$ = function(what) {
    return new ZxQuery(what);
};
z$.find = function(filter) {
    return z$().find(filter);
};
/**
 * Iterate through all objects in the given `items` collection.
 * The context object *this*, passed to the
 * *iterationCallback*`(index, item)`, will be the
 * object corresponding the current iteration and
 * the `index` passed to the callback will be the iteration count.
 *
 * If the callback returns *false*, the iteration loop will interrupt.
 *
 * @param {Array<Object>|JSON} items Enumerable objects collection.
 * @param {IterationCallback} iterationCallback The callback *fn* to call at each iteration
 * @return {z$} `this`.
 */
z$.each = function(items, iterationCallback) {
    const len = (items == null ? 0 : Object.keys(items).length);
    if (len > 0) {
        let count = 0;
        for (let i in items) {
            if (items.hasOwnProperty(i)) {
                let item = items[i];
                if (item instanceof Element) {
                    item = z$(item);
                }
                if (iterationCallback.call(item, i, items[i]) === false) {
                    break;
                }
                count++;
                if (count >= len) {
                    break;
                }
            }
        }
    }
    return this;
};
z$.ajax = function(opt) {
    let url;
    if (!util.isNoU(opt) && !util.isNoU(opt.url)) {
        url = opt.url;
    } else {
        url = opt;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
        if (xhr.status === 200) {
            if (util.isFunction(opt.success)) opt.success(xhr.responseText);
        } else {
            if (util.isFunction(opt.error)) opt.error(xhr);
        }
        if (util.isFunction(opt.then)) opt.then(xhr);
    };
    xhr.send();
    return this;
};
z$.hasClass = function(el, className) {
    const classes = className.match(/\S+/g) || [];
    let success = false;
    z$.each(classes, function(k, cl) {
        if (el.classList) {
            success = el.classList.contains(cl);
        } else {
            success = (new RegExp('(^| )' + cl + '( |$)', 'gi').test(el.className));
        }
        if (success) return false;
    });
    return success;
};
z$.classExists = function(className) {
    const classes = className.match(/\S+/g) || [];
    let success = false;
    z$.each(classes, function(k, cl) {
        // Perform global style check
        const docStyles = document.styleSheets;
        if (docStyles != null) {
            for (let sx = 0; sx < docStyles.length; sx++) {
                // the try statement is needed because on Firefox accessing CSS rules
                // loaded from a remote source will raise a security exception
                try {
                    const classes = docStyles[sx].rules || docStyles[sx].cssRules;
                    if (classes != null) {
                        for (let cx = 0; cx < classes.length; cx++) {
                            if (classes[cx].selectorText === cl) {
                                success = true;
                                break;
                            }
                        }
                    }
                } catch (e) {
                    if (e.name !== 'SecurityError' && e.name !== 'InvalidAccessError') {
                        throw e;
                    }
                }
            }
        }
    });
    return success;
};
z$.wrapElement = function(containerTag, element) {
    // $(element).wrap($('<'+containerTag+'/>'));
    // return element;
    /** @type Element */
    const container = document.createElement(containerTag);
    if (typeof element === 'string') {
        container.innerHTML = element;
    } else {
        // TODO: test this, it may not work
        container.appendChild(element);
    }
    return container;
};
z$.wrapCss = function(wrapperRule, css) {
    const wrapReX = /(([a-zA-Z0-9\240-\377=:-_\n,.@]+.*){([^{}]|((.*){([^}]+)[}]))*})/g;
    let wrappedCss = '';
    let ruleMatch;
    // remove comments
    css = css.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/g, '');
    do {
        ruleMatch = wrapReX.exec(css);
        if (ruleMatch && ruleMatch.length > 1) {
            let ruleParts = ruleMatch[2];
            if (ruleParts != null && ruleParts.length > 0) {
                ruleParts = ruleParts.replace(/\n/g, '');
                const classes = ruleParts.split(',');
                let isMediaQuery = false;
                z$.each(classes, function(k, v) {
                    if (v.replace(' ', '') === '.') {
                        // a single `.` means 'self' (the container itself)
                        // so we just add the wrapperRule
                        wrappedCss += '\n' + wrapperRule + ' ';
                    } else if (v.trim()[0] === '@') {
                        // leave it as is if it's an animation or media rule
                        wrappedCss += v + ' ';
                        if (v.trim().toLowerCase().startsWith('@media')) {
                            isMediaQuery = true;
                        }
                    } else {
                        // wrap the class name (v)
                        wrappedCss += '\n' + wrapperRule + '\n' + v + ' ';
                    }
                    if (k < classes.length - 1) {
                        wrappedCss += ', ';
                    }
                });
                if (isMediaQuery) {
                    const wrappedMediaQuery = z$.wrapCss(wrapperRule, ruleMatch[1].substring(ruleMatch[2].length).replace(/^{([^\0]*?)}$/, '$1'));
                    wrappedCss += '{\n  '+wrappedMediaQuery+'\n}';
                } else {
                    wrappedCss += ruleMatch[1].substring(ruleMatch[2].length) + '\n';
                }
            } else {
                _log.w('z$.wrapCss was unable to parse rule.', ruleParts, ruleMatch);
            }
        }
    } while (ruleMatch);
    if (wrappedCss !== '') {
        css = wrappedCss;
    }
    return css;
};
z$.appendCss = function(css, target, cssId) {
    const head = document.head || document.getElementsByTagName('head')[0];
    let style = null;
    // remove old style if already defined
    if (!util.isNoU(target)) {
        head.removeChild(target);
    } else {
        const oldStyle = document.getElementById(cssId);
        if (oldStyle != null) {
            head.removeChild(oldStyle);
        }
    }
    if (typeof css === 'string') {
        // output css
        style = document.createElement('style');
        style.type = 'text/css';
        style.id = cssId;
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    } else if (css instanceof Element) style = css;
    // Append new CSS
    if (!util.isNoU(style)) {
        head.appendChild(style);
    }
    return style;
};
z$.replaceCssVars = function(css, model) {
    const vars = new RegExp(/\B\$var\[(.*[^\[\]])]/g);
    let outCss = '';
    let matched = 0;
    let currentIndex = 0;
    let result;
    while (result = vars.exec(css)) {
        let value = result[0];
        if (result.length > 1) {
            const name = result[1];
            // resolve dotted field path
            let cur = model;
            if (name.indexOf('.') > 0) {
                const path = name.split('.');
                for (let p = 0; p < path.length - 1; p++) {
                    cur = cur[path[p]];
                    if (typeof cur === 'undefined') {
                        break;
                    }
                }
                if (typeof cur !== 'undefined') {
                    value = cur[path[path.length - 1]];
                    matched++;
                }
            } else if (typeof cur[name] !== 'undefined') {
                value = cur[name];
                matched++;
            }
        }
        outCss += css.substr(currentIndex, result.index-currentIndex)+value;
        currentIndex = result.index+result[0].length;
    }
    if (matched > 0) {
        outCss += css.substr(currentIndex);
        css = outCss;
    }
    return css;
};
z$.replaceBraces = function(html, callback) {
    // TODO: add optional parameter for custom regex
    const tags = new RegExp(/{?{.*?}?}/g); // <-- single/double braces wrapper
    let outHtml = '';
    let matched = 0;
    let currentIndex = 0;
    let result;
    while (result = tags.exec(html)) {
        if (typeof result[0] === 'string' && (result[0].trim().length === 0 || result[0].indexOf('\n') >= 0)) {
            const nv = html.substr(currentIndex, result.index-currentIndex)+result[0];
            outHtml += nv;
            currentIndex += nv.length;
            continue;
        }
        let value = result[0];
        if (typeof callback === 'function') {
            const r = callback(result[0]);
            if (!util.isNoU(r)) {
                value = r;
                matched++;
            }
        }
        outHtml += html.substr(currentIndex, result.index-currentIndex)+value;
        currentIndex = result.index+result[0].length;
    }
    if (matched > 0) {
        outHtml += html.substr(currentIndex);
        return outHtml;
    }
    return null;
};
z$.getClosest = function(elem, selector) {
    // Get closest match
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
    }
    return null;
};
z$.getPosition = function(el, tolerance) {
    const visibleClass = '--ui--visible';
    const position = (function() {
        let x = 0;
        let y = 0;
        let rect = el.getBoundingClientRect();
        let parent = el;
        while (parent) {
            if (parent.tagName.toLowerCase() === 'body') {
                // deal with browser quirks with body/window/document and page scroll
                const scrollX = parent.scrollLeft || document.documentElement.scrollLeft;
                const scrollY = parent.scrollTop || document.documentElement.scrollTop;
                x += (parent.offsetLeft - scrollX + parent.clientLeft);
                y += (parent.offsetTop - scrollY + parent.clientTop);
            } else {
                // for all other non-BODY elements
                x += (parent.offsetLeft - parent.scrollLeft + parent.clientLeft);
                y += (parent.offsetTop - parent.scrollTop + parent.clientTop);
            }
            parent = parent.offsetParent;
        }
        return {
            x: x,
            y: y,
            rect: rect
        };
    })(el);
    position.visible = false;
    let scrollable = el.offsetParent;
    if (scrollable != null) {
        if (scrollable !== document.body) {
            // find the scrollable container
            let s = scrollable.offsetParent;
            while (s != null && s.offsetParent !== null && s.offsetHeight === s.scrollHeight) {
                s = s.offsetParent;
            }
            if (s != null) scrollable = s;
        }
        let r1 = scrollable.getBoundingClientRect();
        if (scrollable === document.body) {
            // modify from read-only object
            r1 = {
                x: r1.x,
                y: r1.y,
                width: document.documentElement.offsetWidth || document.documentElement.clientWidth,
                height: document.documentElement.offsetHeight || document.documentElement.clientHeight,
                top: 0,
                left: 0,
                right: document.documentElement.clientWidth || document.documentElement.offsetWidth,
                bottom: document.documentElement.clientHeight || document.documentElement.offsetHeight
            };
        }
        if (tolerance == null) tolerance = 0;
        const r2 = el.getBoundingClientRect();
        // visible status
        const visible = !(r2.left-1 > r1.right - tolerance ||
            r2.right+1 < r1.left + tolerance ||
            r2.top-1 > r1.bottom - tolerance ||
            r2.bottom+1 < r1.top + tolerance);
        position.visible = visible;
        // viewport-relative frame position
        position.frame = {
            dx: (r2.left + (r2.width / 2) - r1.left) / r1.width,
            dy: (r2.top + (r2.height / 2) - r1.top) / r1.height
        };
        // update status event and and/remove 'visibleClass'
        el = z$(el);
        if (!visible && el.hasClass(visibleClass)) {
            el.removeClass(visibleClass);
            position.event = 'exit';
        } else if (!visible) {
            position.event = 'off-scroll';
        } else if (visible) {
            if (!el.hasClass(visibleClass)) {
                position.event = 'enter';
                el.addClass(visibleClass);
            } else position.event = 'scroll';
        }
    }
    return position;
};

z$.ZxQuery = ZxQuery;

// Element.matches() polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            const matches = (this.document || this.ownerDocument).querySelectorAll(s);
            let i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {
            }
            return i > -1;
        };
}
// window.CustomEvent polyfill for IE>=9
(function() {
    if (typeof window.CustomEvent === 'function') return false;
    function CustomEvent(event, params) {
        params = params || {bubbles: false, cancelable: false, detail: undefined};
        const evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();
// String.hashCode extension
String.prototype.hashCode = function() {
    let hash = 0;
    if (this.length === 0) return hash;
    for (let i = 0; i < this.length; i++) {
        let chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
// String.startsWith polyfill
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}

module.exports = z$;
