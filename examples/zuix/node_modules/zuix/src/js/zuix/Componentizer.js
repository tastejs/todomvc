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

const _optionAttributes =
    require('./OptionAttributes')();

const LIBRARY_PATH_DEFAULT = 'https://genielabs.github.io/zkit/lib/'; // CORS works only over HTTPS

/**
 * TODO: describe this...
 *
 * @param {Element|ZxQuery|undefined} [element] Scan and process loadable elements inside `element`.
 * @param {Element|undefined} [child] Process only the specified `child` of `element`.
 * @return {Componentizer}
 */
Componentizer.prototype.componentize = function(element, child) {
    zuix.trigger(this, 'componentize:begin');
    if (child != null) {
        const cache = getElementCache(element);
        if (cache == null) {
            setElementCache(element, [child]);
        } else cache.push(child);
    } else {
        addRequest(element);
    }
    loadNext(element);
    return this;
};

Componentizer.prototype.applyOptions = function(element, options) {
    applyOptions(element, options);
    return this;
};

Componentizer.prototype.resolvePath = function(path) {
    return resolvePath(path);
};

/**
 *
 * @return {boolean}
 */
Componentizer.prototype.willLoadMore = function() {
    return _componentizeQueue.length > 0 || _componentizeRequests.length > 0;
};

/**
 * Enable/Disable lazy-loading, or get current value.
 *
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Load-ahead threshold (default is 1.0 => 100% of view size).
 * @return {boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Componentizer.prototype.lazyLoad = function(enable, threshold) {
    return lazyLoad(enable, threshold);
};


Componentizer.prototype.dequeue = function(element) {
    for (let i = 0; i < _componentizeQueue.length; i++) {
        const item = _componentizeQueue[i];
        if (item.element === element) {
            _componentizeQueue.splice(i, 1);
            break;
        }
    }
};


/**
 *
 * @param {Zuix} zuixInstance
 * @return {Componentizer}
 */
Componentizer.prototype.setHost = function(zuixInstance) {
    zuix = zuixInstance;
    return this;
};

module.exports = function() {
    return new Componentizer();
};


// ---------------------------------------------


const _log =
    require('../helpers/Logger')('ComponentContext.js');
const util =
    require('../helpers/Util');
const z$ =
    require('../helpers/ZxQuery');

/** @private */
const _componentizeRequests = [];
/** @private */
const _componentizeQueue = [];
/** @private */
const _lazyElements = [];
/** @private */
const _lazyContainers = [];

/** @private */
const TaskItem = function() {
    return {
        /** @typedef {Element} */
        element: null,
        /** @typedef {number} */
        priority: 0,
        /** @typedef {boolean} */
        visible: true,
        /** @typedef {boolean} */
        lazy: false
    };
};

// Components Loading Chain
const loader = require('./../helpers/AsynChain')({

    doWork: function(item, callback) {
        z$(item.element).one('component:ready', function() {
            callback();
        });
        return loadInline(item.element);
    },
    willBreak: function() {
        return false;
    },
    status: function(status) {
        switch (status) {
            case 'start':
                break;
            case 'done':
                loadNext();
                break;
        }
    }

});

/** @private */
let _disableLazyLoading = false;
/** @private */
let _lazyLoadingThreshold = 1;

/** @type {Zuix} **/
let zuix = null;

// Browser Agent / Bot detection
/** @private */
let _isCrawlerBotClient = false;
if (navigator && navigator.userAgent) {
    _isCrawlerBotClient = new RegExp(/bot|googlebot|crawler|spider|robot|crawling/i)
        .test(navigator.userAgent);
}
if (_isCrawlerBotClient) {
    _log.d(navigator.userAgent, 'is a bot, ignoring `lazy-loading` option.');
}


function Componentizer() {
    // ...
}
/**
 * Lazy Loading settings.
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Read ahead tolerance (default is 1.0 => 100% of view size).
 * @return {boolean}
 */
function lazyLoad(enable, threshold) {
    if (enable != null) {
        _disableLazyLoading = !enable;
    }
    if (threshold != null) {
        _lazyLoadingThreshold = threshold;
    }
    return !_isCrawlerBotClient && !_disableLazyLoading;
}

function addRequest(element) {
    if (element == null) {
        element = document;
    }
    if (!_componentizeRequests.indexOf(element)) {
        _componentizeRequests.push(element);
    }
}

const _elementCache = [];
function setElementCache(element, waiting) {
    _elementCache.push({
        element: element,
        waiting: waiting
    });
}
function getElementCache(element) {
    for (let i = 0; i < _elementCache.length; i++) {
        const cache = _elementCache[i];
        if (cache.element === element) {
            return cache.waiting;
        }
    }
    return null;
}

function queueLoadables(element) {
    if (element == null && _componentizeRequests.length > 0) {
        element = _componentizeRequests.unshift();
    }
    if (element instanceof z$.ZxQuery) {
        element = element.get();
    }
    // Select all loadable elements
    let waitingLoad = getElementCache(element);
//    if (waitingLoad == null || waitingLoad.length == 0) {
    waitingLoad = z$(element).find('['+
        _optionAttributes.dataUiLoad+']:not(['+_optionAttributes.dataUiLoaded+']),['+
        _optionAttributes.dataUiInclude+']:not(['+_optionAttributes.dataUiLoaded+'])');
    waitingLoad = Array.prototype.slice.call(waitingLoad._selection);
    setElementCache(element, waitingLoad);
//    }
    const waitingTasks = [];
    for (let w = 0; w < waitingLoad.length; w++) {
        const el = waitingLoad[w];
        let pri = parseInt(el.getAttribute(_optionAttributes.dataUiPriority));
        if (isNaN(pri)) pri = 0;
        // adjust priority by element level
        let level = 0;
        let parent = el.parentNode;
        let ignore = false;
        while (parent != null && parent !== document) {
            level++;
            if (parent.getAttribute(_optionAttributes.dataUiView) != null) {
                ignore = true;
                break;
            }
            parent = parent.parentNode;
        }
        if (!ignore) {
            const task = new TaskItem();
            task.element = el;
            task.priority = pri + (level * 1000);
            waitingTasks.push(task);
        } else {
            // _log.w("Element belongs to a template: process only when attached to a context instance.", el);
        }
    }
    let added = 0;
    // add selected elements to the requests queue
    for (let i = 0; i < waitingTasks.length; i++) {
        let alreadyAdded = false;
        for (let j = 0; j < _componentizeQueue.length; j++) {
            if (waitingTasks[i].element === _componentizeQueue[j].element) {
                alreadyAdded = true;
                break;
            }
        }
        if (!alreadyAdded) {
            // Add attributes to element if data-ui-options was provided
            const el = waitingTasks[i].element;
            const options = el.getAttribute(_optionAttributes.dataUiOptions);
            applyOptions(el, options);
            // Add task to the queue
            _componentizeQueue.push(waitingTasks[i]);
            added++;
        }
    }

    _log.t('componentize:count', _componentizeQueue.length, added);

    if (added === 0 || (_componentizeRequests.length === 0 && _componentizeQueue.length === 0)) {
        zuix.trigger(this, 'componentize:end');
    }
}

function getNextLoadable() {
    // sort by priority (elements with lower pri number get processed first)
    _componentizeQueue.sort(function(a, b) {
        return a.priority - b.priority;
    });
    let job = null;
    let item = _componentizeQueue.length > 0 ? _componentizeQueue.shift() : null;
    while (item != null && item.element != null) {
        // defer element loading if lazy loading is enabled and the element is not in view
        const isLazy = lazyElementCheck(item.element);
        if (lazyLoad() && isLazy) {
            item.lazy = true;
            item.visible = z$.getPosition(item.element, _lazyLoadingThreshold).visible;
        } else {
            item.lazy = false;
            item.visible = true;
        }
        if (item != null && item.element != null && item.visible) {
            job = {
                item: item,
                cancelable: item.lazy
            };
            break;
        }
        if (_componentizeQueue.length > 0) {
            item = _componentizeQueue.shift();
        } else break;
    }
    return job;
}

function loadNext(element) {
    queueLoadables(element);
    const job = getNextLoadable();
    if (job != null) {
        loader.append([job]);
    }
}

/** @protected */
function loadInline(element) {
    const v = z$(element);
    if (v.attr(_optionAttributes.dataUiLoaded) != null || v.parent('pre,code').length() > 0) {
        // _log.w("Skipped", element);
        return false;
    } else {
        v.attr(_optionAttributes.dataUiLoaded, 'true');
    }

    /** @type {ContextOptions} */
    let options = v.attr(_optionAttributes.dataUiOptions);
    if (!util.isNoU(options)) {
        options = util.propertyFromPath(window, options);
        // copy passed options
        options = util.cloneObject(options) || {};
    } else {
        options = {};
    }

    const contextId = v.attr(_optionAttributes.dataUiContext);
    if (!util.isNoU(contextId)) {
        // inherit options from context if already exists
        const ctx = zuix.context(contextId);
        if (ctx !== null) {
            options = ctx.options();
        }
        options.contextId = contextId;
    }

    // Automatic view/container selection
    if (util.isNoU(options.view) && !v.isEmpty()) {
        options.view = element;
        options.viewDeferred = true;
    } else if (util.isNoU(options.view) && util.isNoU(options.container) && v.isEmpty()) {
        options.container = element;
    }

    let componentId = v.attr(_optionAttributes.dataUiLoad);
    if (util.isNoU(componentId)) {
        const include = v.attr(_optionAttributes.dataUiInclude);
        if (include != null) {
            componentId = resolvePath(include);
            v.attr(_optionAttributes.dataUiInclude, componentId);
            v.attr(_optionAttributes.dataUiComponent, componentId);
            // Static include hove no controller
            if (util.isNoU(options.controller)) {
                options.controller = function() {};
            }
        } else {
            return false;
        }
    } else {
        componentId = resolvePath(componentId);
        v.attr(_optionAttributes.dataUiLoad, componentId);
    }

    // inline attributes have precedence over ```options```

    const model = v.attr(_optionAttributes.dataBindModel);
    if (!util.isNoU(model) && model.length > 0) {
        options.model = util.propertyFromPath(window, model);
    }

    const priority = v.attr(_optionAttributes.dataUiPriority);
    if (!util.isNoU(priority)) {
        options.priority = parseInt(priority);
    }

    const el = z$(element);
    el.one('component:ready', function() {
        addRequest(element);
        loadNext(element);
    });

    zuix.load(componentId, options);

    return true;
}

function resolvePath(path) {
    let config = zuix.store('config');
    if (config != null && config[location.host] != null) {
        config = config[location.host];
    }
    const libraryPath = config != null && config.libraryPath != null ? config.libraryPath : LIBRARY_PATH_DEFAULT;
    if (path.startsWith('@lib/')) {
        path = libraryPath+path.substring(5);
    }
    return path;
}

function applyOptions(element, options) {
    if (typeof options === 'string') {
        options = util.propertyFromPath(window, options);
    }
    // TODO: should check if options object is valid
    if (element != null && options != null) {
        if (options.lazyLoad != null) {
            element.setAttribute(_optionAttributes.dataUiLazyload, options.lazyLoad.toString().toLowerCase());
        }
        if (options.contextId != null) {
            element.setAttribute(_optionAttributes.dataUiContext, options.contextId.toString().toLowerCase());
        }
        if (options.componentId != null) {
            element.setAttribute(_optionAttributes.dataUiLoad, options.componentId.toString().toLowerCase());
        }
        // TODO: eventually map other attributes from options
    }
}

// ------------ Lazy Loading

function getLazyElement(el) {
    for (let l = 0; l < _lazyElements.length; l++) {
        const le = _lazyElements[l];
        if (le.element === el) {
            return le;
        }
    }
    return null;
}

function addLazyElement(el) {
    const le = {
        element: el
    };
    _lazyElements.push(le);
    return le;
}

function getLazyContainer(el) {
    for (let l = 0; l < _lazyContainers.length; l++) {
        const ls = _lazyContainers[l];
        if (ls.element === el) {
            return ls;
        }
    }
    return null;
}

function addLazyContainer(el) {
    const lc = {
        element: el
    };
    _lazyContainers.push(lc);
    return lc;
}

function lazyElementCheck(element) {
    // Check if element has explicit lazyLoad=false flag set
    if (element.getAttribute(_optionAttributes.dataUiLazyload) === 'false') {
        return false;
    }
    // Check if element is already added to Lazy-Element list
    let le = getLazyElement(element);
    if (le == null) {
        // Check if element inherits lazy-loading from a parent lazy container/scroll
        const lazyContainer = z$.getClosest(element.parentNode, '['+
            _optionAttributes.dataUiLazyload+'=scroll],['+
            _optionAttributes.dataUiLazyload+'=true]');
        if (lazyContainer != null) {
            le = addLazyElement(element);
            // Check if the lazy container is already added to the lazy container list
            let lc = getLazyContainer(lazyContainer);
            if (lc == null) {
                lc = addLazyContainer(lazyContainer);
                // if it's of type 'scroll' attach 'scroll' event handler
                if (lazyContainer.getAttribute(_optionAttributes.dataUiLazyload) === 'scroll') {
                    (function(instance, lc) {
                        let lastScroll = new Date().getTime();
                        z$(lc === document.body ? window : lc).on('scroll', function() {
                            const now = new Date().getTime();
                            if (now - lastScroll > 100) {
                                lastScroll = now;
                                loadNext(lc);
                            }
                        });
                    })(this, lazyContainer);
                }
            }
            return true;
        } else if (element.getAttribute(_optionAttributes.dataUiLazyload) === 'true') {
            // element has explicit lazyLoad=true flag set
            le = addLazyElement(element);
            return true;
        }
    } else return true;
    return false;
}
