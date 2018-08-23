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
 *  zUIx, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 *
 */

'use strict';

const _log =
    require('../helpers/Logger')('Zuix.js');
const util =
    require('../helpers/Util');
const z$ =
    require('../helpers/ZxQuery');
const TaskQueue =
    require('../helpers/TaskQueue');
const ComponentContext =
    require('./ComponentContext');
const ContextController =
    require('./ContextController');
const _componentizer =
    require('./Componentizer')();
const _optionAttributes =
    require('./OptionAttributes')();

require('./ComponentCache');

// Custom objects definition used to generate JsDoc

/**
 * This object can be supplied when loading a component. It can be either passed as argument for the
 * `zuix.load(...)` method in the javascript code, or in the `data-ui-options` attribute of the HTML code
 * of the component container.
 *
 * @typedef {object} ContextOptions
 * @property {Object|undefined} contextId The context id. HTML attribute equivalent: `data-ui-context`.
 * @property {Element|undefined} container The container element.
 * @property {JSON|undefined} model The data model.  HTML attribute equivalent: `data-bind-model`.
 * @property {Element|undefined} view The view element. HTML attribute equivalent: `data-ui-view`.
 * @property {ContextControllerHandler|undefined} controller The controller handler.
 * @property {Array.<Object.<string, EventCallback>>|undefined} on The handling map for events.
 * @property {Array.<Object.<string, EventCallback>>|undefined} behavior The handling map for behaviors.
 * @property {Element|string|boolean|undefined} css The stylesheet of the view.
 * @property {string|undefined} cext When loading content of the view, appends the specified extension instead of `.html`.
 * @property {boolean|undefined} html Enables or disables HTML auto-loading (**default:** true).
 * @property {boolean|undefined} lazyLoad Enables or disables lazy-loading (**default:** false).
 * @property {number|undefined} priority Loading priority (**default:** 0).
 * @property {ContextReadyCallback|undefined} ready The ready callback, triggered once the component is succesfully loaded.
 * @property {ContextErrorCallback|undefined} error The error callback, triggered when an error occurs.
 */

/**
 * Callback function triggered if an error occurs when loading a component.
 *
 * @callback ContextErrorCallback
 * @param {Object} error
 * @this {ComponentContext}
 */

/**
 * Callback function triggered when a component has been successfully loaded.
 *
 * @callback ContextReadyCallback
 * @param {ComponentContext} ctx The component context.
 * @this {ComponentContext}
 */


/**
 * @private
 * @type {!Array.<ComponentContext>}
 */
const _contextRoot = [];
/** @private */
const _hooksCallbacks = [];
/** @private */
const _globalHandlers = {};
/** @private **/
const _componentTask = [];
/** @private **/
const _pendingResourceTask = {};
/** @private */
const resourceLoadTask = [];
/**
 * @private
 * @param {String} tid Task id
 * @return {TaskQueue}
 */
const taskQueue = function(tid) {
    if (util.isNoU(_componentTask[tid])) {
        _componentTask[tid] = new TaskQueue(function(tq, eventPath, eventValue) {
            trigger(tq, eventPath, eventValue);
        });
    }
    return _componentTask[tid];
};

/**
 * @private
 * @type {!Array.<ComponentCache>}
 */
let _componentCache = [];
/** @private */
let _contextSeqNum = 0;
/** @private */
let _enableHttpCaching = true;

/**
 *  zUIx, Javascript library for component-based development.
 *
 * @class Zuix
 * @constructor
 * @return {Zuix}
 */
function Zuix() {
    _componentizer.setHost(this);
    /**
     * @type {Array}
     * @private
     */
    this._store = [];
    /**
     * @type {!Array.<ZxQuery>}
     * @private
     **/
    this._fieldCache = [];
    return this;
}

/**
 *
 * @private
 * @param {ContextControllerHandler} handler The context controller handler
 * @return {ContextControllerHandler}
 */
function controller(handler) {
    if (typeof handler['for'] !== 'function') {
        handler['for'] = function(componentId) {
            _globalHandlers[componentId] = handler;
            return handler;
        };
    }
    return handler;
}

/**
 *
 * @private
 * @param {!string} fieldName Value to match in the `data-ui-field` attribute.
 * @param {!Element|!ZxQuery} [container] Starting DOM element for this search (**default:** *document*)
 * @param {object} [context] The context
 * @return {ZxQuery} ZxQuery object with elements matching the given ```data-ui-field``` attribute.
 * If the matching element is just one, then it will also have the extra method `field(fieldName)`
 * to search for fields contained in it.
 *
 */
function field(fieldName, container, context) {
    if (util.isNoU(context)) {
        context = this;
    }
    if (context._fieldCache == null) {
        context._fieldCache = {};
    }

    let el = null;
    if (typeof context._fieldCache[fieldName] === 'undefined') {
        el = z$(container).find('[' + _optionAttributes.dataUiField + '="' + fieldName + '"]');
        if (el != null && el.length() > 0) {
            context._fieldCache[fieldName] = el;
            // extend the returned `ZxQuery` object adding the `field` method
            if (el.length() === 1 && util.isNoU(el.field)) {
                const that = this;
                el.field = function(name) {
                    return that.field(name, el, el);
                };
            }
        }
    } else el = context._fieldCache[fieldName];

    return el;
}

/**
 *
 * @private
 * @param {!string} componentId The id/name of the component we want to load.
 * @param {ContextOptions|undefined} [options] context options used to initialize the loaded component
 * @return {ComponentContext}
 */
function load(componentId, options) {
    // TODO: throw error on argument mismatch
    // TODO: prevent load loops when including recursively a component
    componentId = _componentizer.resolvePath(componentId);
    /** @type {ComponentContext} */
    let ctx = null;
    if (!util.isNoU(options)) {
        // the `componentId` property is mandatory for `createContext` to work properly
        options.componentId = componentId;
        // check if context has its unique id assigned
        if (!util.isNoU(options.contextId)) {
            // if it does, try to pick it from allocated contexts list
            ctx = context(options.contextId);
            if (ctx !== null) {
                ctx.options(options);
            } else {
                // if no context is already allocated
                // with that id, then add a new one
                ctx = createContext(options);
            }
        } else {
            if (options === false) {
                options = {};
            }
            // generate contextId (this is a bit buggy, but it's quick)
            options.contextId = 'zuix-ctx-' + (++_contextSeqNum);
            ctx = createContext(options);
        }
    } else {
        // TODO: check if this case is of any use
        // empty context
        options = {};
        ctx = new ComponentContext(zuix, options, trigger);
    }

    // assign the given component (widget) to this context
    if (ctx.componentId != componentId) {
        // mutable component, rebind to a different component
        // preserving current context data
        ctx.componentId = componentId;
        /*
         TODO: to be fixed
         if (!util.isNoU(context.view())) {
         // TODO: implement this code in a context.detach() method
         //context.controller().pause()
         context.view().detach();
         context.view(null);
         }*/
    }

    if (util.isFunction(options.ready)) {
        ctx.ready = options.ready;
    }
    if (util.isFunction(options.error)) {
        ctx.error = options.error;
    }

    if (resourceLoadTask[componentId] == null) {
        resourceLoadTask[componentId] = true;
        return loadResources(ctx, options);
    } else {
        if (_pendingResourceTask[componentId] == null) {
            _pendingResourceTask[componentId] = [];
        }
        _pendingResourceTask[componentId].push({c: ctx, o: options});
    }

    return ctx;
}

function getResourcePath(path) {
    let config = zuix.store('config');
    if (config != null && config[location.host] != null) {
        config = config[location.host];
    }
    path = _componentizer.resolvePath(path);
    if (!path.startsWith('//') && path.indexOf('://') < 0) {
        path = (config != null && config.resourcePath != null ? config.resourcePath : '') + path;
    }
    return path;
}

/**
 * @private
 * @param {ComponentContext} ctx Component context
 * @param {JSON} options Context loading options
 * @return {ComponentContext}
 */
function loadResources(ctx, options) {
    // pick it from cache if found
    /** @type {ComponentCache} */
    let cachedComponent = getCachedComponent(ctx.componentId);
    if (cachedComponent !== null && options.controller == null && ctx.controller() == null) {
        ctx.controller(cachedComponent.controller);
        _log.t(ctx.componentId+':js', 'component:cached:js');
    }

    if (util.isNoU(options.view)) {
        if (cachedComponent !== null) {
            if (cachedComponent.view != null) {
                ctx.view(cachedComponent.view);
                _log.t(ctx.componentId+':html', 'component:cached:html');
            }
            /*
             TODO: CSS caching, to be tested.
             */
            if (options.css !== false) {
                options.css = false;
                if (!cachedComponent.css_applied) {
                    cachedComponent.css_applied = true;
                    ctx.style(cachedComponent.css);
                    _log.t(ctx.componentId + ':css', 'component:cached:css');
                }
            }
        }

        // if not able to inherit the view from the base cachedComponent
        // or from an inline element, then load the view from web
        if (util.isNoU(ctx.view())) {
            // Load View
            taskQueue('resource-loader').queue(ctx.componentId+':html', function() {
                resourceLoadTask[ctx.componentId] = this;

                ctx.loadHtml({
                    cext: options.cext,
                    caching: _enableHttpCaching,
                    success: function(html) {
                        if (cachedComponent == null) {
                            cachedComponent = cacheComponent(ctx);
                        }
                        cachedComponent.view = html;
                        delete cachedComponent.controller;
                        if (options.css !== false) {
                            resourceLoadTask[ctx.componentId].step(ctx.componentId+':css');
                            ctx.loadCss({
                                caching: _enableHttpCaching,
                                success: function(css) {
                                    cachedComponent.css = css;
                                },
                                error: function(err) {
                                    _log.e(err, ctx);
                                },
                                then: function() {
                                    loadController(ctx, resourceLoadTask[ctx.componentId]);
                                }
                            });
                        } else {
                            loadController(ctx, resourceLoadTask[ctx.componentId]);
                        }
                    },
                    error: function(err) {
                        _log.e(err, ctx);
                        if (util.isFunction(options.error)) {
                            (ctx.error).call(ctx, err);
                        }
                    }
                });
            }, options.priority);
            // defer controller loading
            return ctx;
        }
    } else {
        ctx.view(options.view);
    }
    if (ctx.controller() == null) {
        taskQueue('resource-loader').queue(ctx.componentId + ':js', function() {
            resourceLoadTask[ctx.componentId] = this;
            loadController(ctx, resourceLoadTask[ctx.componentId]);
        }, _contextRoot.length);
    } else loadController(ctx);

    return ctx;
}
/**
 *
 * @private
 * @param context {ComponentContext|Element}
 */
function unload(context) {
    if (context instanceof Element) {
        const el = context;
        context = zuix.context(el);
        // remove element from componentizer queue if
        // it's a lazy-loadable element not yet loaded
        _componentizer.dequeue(el);
    }
    if (!util.isNoU(context)) {
        if (!util.isNoU(context._c)) {
            if (!util.isNoU(context._c.view())) {
                context._c.view().attr(_optionAttributes.dataUiComponent, null);
                // un-register event handlers associated to the view
                context._c.view().reset();
                // un-register event handlers for all cached fields accessed through cp.field(...) method
                if (!util.isNoU(context._c._fieldCache)) {
                    z$.each(context._c._fieldCache, /** @param {ZxQuery} v */ function(k, v) {
                        v.reset();
                    });
                }
                // detach from parent
                context._c.view().detach();
            }
            if (util.isFunction(context._c.destroy)) {
                context._c.destroy.call(context);
            }
        }
        // detach the container from the DOM as well
        const cel = context.container();
        if (cel != null && cel.parentNode != null) {
            cel.parentNode.removeChild(cel);
        }
    }
}

/** @private */
function createContext(options) {
    const context = new ComponentContext(zuix, options, trigger);
    _contextRoot.push(context);
    return context;
}

/**
 *
 * @private
 * @param {Element|ZxQuery|object} contextId The `contextId` object
 * (usually a string) or the container/view element of the component.
 * @param {function} [callback] The callback function that will pass the context object once it is ready.
 * @return {ComponentContext} The matching component context or `null` if the context does not exists or it is not yet loaded.
 */
function context(contextId, callback) {
    let context = null;
    if (contextId instanceof z$.ZxQuery) {
        contextId = contextId.get();
    } else if (typeof contextId === 'string') {
        const ctx = z$.find('['+_optionAttributes.dataUiContext+'="'+contextId+'"]');
        if (ctx.length() > 0) contextId = ctx.get();
    }
    z$.each(_contextRoot, function(k, v) {
        if ((contextId instanceof Element && (v.view() === contextId || v.container() === contextId))
            || util.objectEquals(v.contextId, contextId)) {
            context = v;
            return false;
        }
    });
    if (typeof callback === 'function' && (contextId instanceof Element || contextId instanceof z$.ZxQuery)) {
        if (context == null) {
            z$(contextId).one('component:ready', function() {
                context = zuix.context(this);
                callback.call(context, context);
            });
        } else callback.call(context, context);
    }
    return context;
}

/**
 *
 * @private
 * @param {string} path
 * @param {function|undefined} handler
 */
function hook(path, handler) {
    if (util.isNoU(handler)) {
        delete _hooksCallbacks[path];
    } else _hooksCallbacks[path] = handler;
}

/**
 * Fires a ZUIX hook.
 *
 * @private
 * @param {object} context
 * @param {string} path
 * @param {object|undefined} data
 */
function trigger(context, path, data) {
    if (util.isFunction(_hooksCallbacks[path])) {
        _hooksCallbacks[path].call(context, data);
    }
}

/**
 * Enable/Disable HTTP caching
 *
 * @private
 * @param {boolean} [enable]
 * @return {boolean} *true* if HTTP caching is enabled, *false* otherwise.
 */
function httpCaching(enable) {
    if (enable != null) {
        _enableHttpCaching = enable;
    }
    return _enableHttpCaching;
}

// *********************** private members ************************* //


/** @private */
function removeCachedComponent(componentId) {
    // TODO: removeCachedComponent
    // TODO: should this be called when last instance of a component type is disposed?
}

/**
 * @private
 * @param {Object} componentId
 * @return {ComponentCache}
 */
function getCachedComponent(componentId) {
    /** @type {ComponentCache|null} */
    let cached = null;
    z$.each(_componentCache, function(k, v) {
        if (util.objectEquals(v.componentId, componentId)) {
            cached = v;
            return false;
        }
    });
    return cached;
}

/**
 * @private
 * @param {ComponentContext} context
 * @param {TaskQueue} [task]
 */
function loadController(context, task) {
    if (typeof context.options().controller === 'undefined' && context.controller() === null) {
        _log.d(context.componentId, 'controller:load');
        if (!util.isNoU(task)) {
            task.step(context.componentId+':js');
        }
        if (util.isFunction(_globalHandlers[context.componentId])) {
            context.controller(_globalHandlers[context.componentId]);
            createComponent(context, task);
        } else {
            const job = function(t) {
                const jsPath = context.componentId + '.js' + (_enableHttpCaching ? '' : '?'+new Date().getTime());
                z$.ajax({
                    url: getResourcePath(jsPath),
                    success: function(ctrlJs) {
                        // TODO: improve js parsing!
                        try {
                            const fn = ctrlJs.indexOf('function');
                            const il = ctrlJs.indexOf('.load');
                            if (il > 1 && il < fn) {
                                ctrlJs = ctrlJs.substring(0, il - 4);
                            }
                            const ih = ctrlJs.indexOf('.controller');
                            if (ih > 1 && ih < fn) {
                                ctrlJs = ctrlJs.substring(ih + 11);
                            }
                            const ec = ctrlJs.indexOf('//<--controller');
                            if (ec > 0) {
                                ctrlJs = ctrlJs.substring(0, ec);
                            }
                            ctrlJs += '\n//# sourceURL="'+context.componentId + '.js"\n';
                            context.controller(getController(ctrlJs));
                        } catch (e) {
                            _log.e(new Error(), e, ctrlJs, context);
                            if (util.isFunction(context.error)) {
                                (context.error).call(context, e);
                            }
                        }
                    },
                    error: function(err) {
                        _log.e(err, new Error(), context);
                        if (util.isFunction(context.error)) {
                            (context.error).call(context, err);
                        }
                    },
                    then: function() {
                        createComponent(context, t);
                    }
                });
            };
            if (util.isNoU(task)) {
                taskQueue('resource-loader').queue(context.componentId+':js', function() {
                    job(resourceLoadTask[context.componentId] = this);
                }, context.options().priority);
            } else job(task);
        }
    } else {
        createComponent(context, task);
    }
}

function cacheComponent(context) {
    const html = context.view().innerHTML; // (context.view() === context.container() ? context.view().innerHTML : context.view().outerHTML);
    const c = z$.wrapElement('div', html);
    /** @type {ComponentCache} */
    const cached = {
        componentId: context.componentId,
        view: c.innerHTML,
        css: context._css,
        controller: context.controller()
    };
    _componentCache.push(cached);
    _log.t(context.componentId, 'bundle:added');
    return cached;
}

/**
 * @private
 * @param {ComponentContext} context
 * @param {TaskQueue} [task]
 */
function createComponent(context, task) {
    resourceLoadTask[context.componentId] = null;
    if (!util.isNoU(context.view())) {
        let cached = getCachedComponent(context.componentId);
        if (!context.options().viewDeferred) {
            if (cached === null) {
                cached = cacheComponent(context);
            } else if (cached.controller == null) {
                cached.controller = context.controller();
            }
        } else _log.w(context.componentId, 'component:deferred:load');

        if (task != null) {
            task.callback(function() {
                _log.d(context.componentId, 'controller:create:deferred');
                initController(context._c);
            });
        }
        const v = z$(context.view());
        if (v.attr(_optionAttributes.dataUiContext) == null) {
            v.attr(_optionAttributes.dataUiContext, context.contextId);
        }

        _log.d(context.componentId, 'component:initializing');
        if (util.isFunction(context.controller())) {
            // TODO: should use 'require' instead of 'new Controller' ... ?
            /** @type {ContextController} */
            const c = context._c = new ContextController(context);
            c.log = require('../helpers/Logger')(context.contextId);
            if (typeof c.init === 'function') {
                c.init();
            }
            if (!util.isNoU(c.view())) {
                // if it's not null, a controller was already loaded, so we preserve the base controller name
                // TODO: when loading multiple controllers perhaps some code paths can be skipped -- check/optimize this!
                if (c.view().attr(_optionAttributes.dataUiComponent) == null) {
                    c.view().attr(_optionAttributes.dataUiComponent, context.componentId);
                }
                // if no model is supplied, try auto-create from view fields
                if (util.isNoU(context.model()) && !util.isNoU(context.view())) {
                    context.viewToModel();
                }
                c.trigger('view:apply');
                if (context.options().viewDeferred) {
                    context.options().viewDeferred = false;
                    // save the original inline view
                    // before loading the view template
                    // it can be then restored with c.restoreView()
                    c.saveView();

                    // TODO: check if this case is still required, otherwise remove it.
                    if (cached === null) {
                        cached = {
                            componentId: context.componentId,
                            controller: context.controller()
                        };
                        _componentCache.push(cached);
                        _log.t(context.componentId, 'bundle:added');
                        _log.d(context.componentId, 'component:deferred:load');
                    }

                    let pending = -1;
                    if (context.options().css !== false) {
                        if (cached.css == null) {
                            if (pending === -1) pending = 0;
                            pending++;
                            context.loadCss({
                                caching: _enableHttpCaching,
                                success: function(css) {
                                    // TODO: this is a work-around for 'componentize' overlapping issue
                                    if (cached.css == null) {
                                        cached.css = css;
                                    }
                                    _log.d(context.componentId, 'component:deferred:css', pending);
                                },
                                then: function() {
                                    if (--pending === 0 && task != null) {
                                        task.end();
                                    }
                                }
                            });
                        } else context.style(cached.css);
                    }
                    if (context.options().html !== false) {
                        if (cached.view == null) {
                            if (pending === -1) pending = 0;
                            pending++;
                            context.loadHtml({
                                cext: context.options().cext,
                                caching: _enableHttpCaching,
                                success: function(html) {
                                    // TODO: this is a work-around for 'componentize' overlapping issue
                                    if (cached.view == null) {
                                        cached.view = html;
                                    }
                                    _log.d(context.componentId, 'component:deferred:html', pending);
                                },
                                error: function(err) {
                                    _log.e(err, context);
                                    if (util.isFunction(context.options().error)) {
                                        (context.options().error).call(context, err);
                                    }
                                },
                                then: function() {
                                    if (--pending === 0 && task != null) {
                                        task.end();
                                    }
                                }
                            });
                        } else context.view(cached.view);
                    }
                    if (pending === -1 && task != null) {
                        task.end();
                    }
                } else if (task != null) task.end();
            }

            if (task == null) {
                _log.d(context.componentId, 'controller:create');
                initController(c);
            }
        } else {
            _log.w(context.componentId, 'component:controller:undefined');
        }
    } else {
        // TODO: report error
        _log.e(context.componentId, 'component:view:undefined');
    }
}

/**
 * @private
 * @param {ContextController} c
 */
function initController(c) {
    _log.t(c.context.componentId, 'controller:init', 'timer:init:start');

    // re-enable nested components loading
    c.view().find('['+_optionAttributes.dataUiLoaded+'="false"]:not(['+_optionAttributes.dataUiComponent+'])').each(function(i, v) {
        this.attr(_optionAttributes.dataUiLoaded, null);
    });

    // bind {ContextController}.field method
    c.field = function(fieldName) {
        const el = field(fieldName, c.view(), c);
        el.on = function(eventPath, eventHandler, eventData, isHook) {
            if (typeof eventHandler === 'string') {
                const eh = eventHandler;
                eventHandler = function() {
                    c.trigger(eh, eventData, isHook);
                };
            }
            return z$.ZxQuery.prototype.on.call(this, eventPath, eventHandler);
        };
        return el;
    };

    if (util.isFunction(c.create)) c.create();
    c.trigger('view:create');

    if (util.isFunction(c.context.ready)) {
        (c.context.ready).call(c.context, c.context);
    }

    c.trigger('component:ready', c.view(), true);

    _log.t(c.context.componentId, 'controller:init', 'timer:init:stop');
    _log.i(c.context.componentId, 'component:loaded', c.context.contextId);

    if (_pendingResourceTask[c.context.componentId] != null) {
        const pendingRequests = _pendingResourceTask[c.context.componentId];
        _pendingResourceTask[c.context.componentId] = null;
        let ctx;
        while (pendingRequests != null && (ctx = pendingRequests.shift()) != null) {
            loadResources(ctx.c, ctx.o);
        }
    }

    zuix.componentize(c.view());
}

/**
 * @private
 * @param javascriptCode string
 * @return {ContextControllerHandler}
 */
// TODO: refactor this method name
function getController(javascriptCode) {
    let instance = function(ctx) { };
    if (typeof javascriptCode === 'string') {
        try {
            instance = (eval).call(this, javascriptCode);
        } catch (e) {
            // TODO: should trigger a global hook
            // eg. 'controller:error'
            _log.e(this, e, javascriptCode);
        }
    }
    return instance;
}

function replaceCache(c) {
    _componentCache = c;
}

// ******************* proto ******************** //


/**
 * Search the document or inside the given `container` for elements
 * with `data-ui-field` attribute matching the provided `fieldName`.
 * This method implements a caching mechanism and automatic
 * disposal of allocated objects and events.
 *
 * @example
 *
<small>**Example - HTML**</small>
```html
<div data-ui-field="container-div">
   <!-- container HTML -->
</div>
```

<small>**Example - JavaScript**</small>
```js
var containerDiv = zuix.field('container-div');
containerDiv.html('Hello World!');
```
 *
 * @param {!string} fieldName Value of `data-ui-field` to look for.
 * @param {!Element} [container] Starting DOM element for this search (**default:** *document*)
 * @return {ZxQuery} ZxQuery object with elements matching the given ```data-ui-field``` attribute.
 * If the matching element is just one, then it will also have the extra method `field(fieldName)`
 * to search for fields contained in it.
 *
 */
Zuix.prototype.field = function(fieldName, container) {
    return field.call(this, fieldName, container);
};
/**
 * Loads a component with the given options.
 * This is the programmatic equivalent of `data-ui-include`
 * or `data-ui-load` attributes used to
 * include content or load components from the HTML code.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
var exampleController = zuix.controller(function(cp){
    cp.create = function() {
        cp.expose('test', testMethod);
        cp.view().html('Helllo World!');
    }
    function testMethod() {
        console.log("Method exposing test");
        cp.view().html('A simple test.');
    }
});
var componentOptions = {
    container: zuix.field('container-div');
    controller: exampleController,
    ready: function () {
        console.log("Loading complete.");
        console.log("Component instance context", this);
    },
    error: function(error) {
        console.log("Loading error!", error);
    }
};
var ctx = zuix.load('path/to/component_name', componentOptions);
ctx.test();
```
 *
 * @param {!string} componentId The identifier name of the component to be loaded.
 * @param {ContextOptions} [options] Options used to initialize the loaded component.
 * @return {ComponentContext} The component context.
 */
Zuix.prototype.load = function(componentId, options) {
    return load.call(this, componentId, options);
};
/**
 * Unloads the given component context releasing all allocated resources.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
zuix.unload(ctx);
```
 *
 * @param {ComponentContext|Element} context The instance of the component to be unloaded or its container element.
 * Pass *Element* type if the underlying component is lazy-loadable and it might not have been instantiated yet.
 * @return {Zuix} The ```{Zuix}``` object itself.
 */
Zuix.prototype.unload = function(context) {
    unload(context);
    return this;
};
/**
 * Allocates the handler for the component controller. The provided `handler` function will be called
 * to initialize the controller object once the component has been loaded.
 *
 * @example
 *
 <small>**Example - JavaScript**</small>
 <pre data-line="2"><code class="language-js">
 // Allocates the controller handler to be used for the component 'path/to/component_name'
 var ctrl = zuix.controller(function(cp) {
    // `cp` is the {ContextController}
    cp.create = function() { ... };
    cp.destroy = function() { ... }
}).for('path/to/component_name');
 </code></pre>
 *
 * @param {ContextControllerHandler} handler Function called to initialize the component controller that will be passed as argument of this function.
 * @return {ContextControllerHandler} The allocated controller handler.
 */
Zuix.prototype.controller = function(handler) {
    return controller.call(this, handler);
};
/**
 * Gets a `ComponentContext` object, given its `contextId` or its container/view element.
 * The `contextId` is the one specified by the `ContextOptions` object or by using the HTML attribute `data-ui-context`.
 *
 * @example
 *
<small>**Example - HTML**</small>
```html
<div data-ui-load="site/components/slideshow"
     data-ui-context="my-slide-show">...</div>
```
<small>**Example - JavaScript**</small>
```js
var slideShowDiv = zuix.$.find('[data-ui-context="my-slide-show"]');
var ctx = zuix.context(slideShowDiv);
// or
var ctx = zuix.context('my-slide-show');
// call exposed component methods
ctx.setSlide(1);
// or
var ctx;
zuix.context('my-slide-show', function(c) {
    // call component methods
    c.setSlide(1);
    // eventually store a reference to the component for later use
    ctx = c;
});
```
 *
 * @param {Element|ZxQuery|object} contextId The `contextId` object
 * (usually a string) or the container/view element of the component.
 * @param {function} [callback] The callback function that will be called once the component is loaded. The {ComponentContext} object will be passed as argument of this callback.
 * @return {ComponentContext} The matching component context or `null` if the component does not exists or it is not yet loaded.
 */
Zuix.prototype.context = function(contextId, callback) {
    return context.call(this, contextId, callback);
};
/**
 * Creates the component specified by `componentId` and returns its `{ComponentContext}` object.
 * The returned component it's unloaded and detached from the DOM and it must be explicitly attached.
 * After attaching it to the DOM, `zuix.componentize()` must be called in
 * order to actually load and display the component.
 *
 * @param {string} componentId Identifier name of the component to create.
 * @param {ContextOptions|undefined} [options] Component context options.
 * @return {ComponentContext}
 */
Zuix.prototype.createComponent = function(componentId, options) {
    if (options == null) options = {};
    if (util.isNoU(options.contextId)) {
        options.contextId = 'zuix-ctx-' + (++_contextSeqNum);
    }
    if (context(options.contextId) != null) {
        throw new Error('Context arelady exists.');
    } else {
        options.container = document.createElement('div');
        options.componentId = componentId;
        _componentizer.applyOptions(options.container, options);
    }
    return createContext(options);
};
/**
 * Triggers the event specified by `eventPath`.
 *
 * @param {Object} context The context object (`this`) passed to handler functions listening to this event.
 * @param {string} eventPath The path of the event to fire.
 * @param {object} [eventData] The data object of the event.
 * @return {Zuix} The ```{Zuix}``` object itself.
 */
Zuix.prototype.trigger = function(context, eventPath, eventData) {
    trigger(context, eventPath, eventData);
    return this;
};
/**
 * Registers a callback for a global ZUIX event.
 * There can only be one callback for each kind of global hook event.
 * Pass null as <eventHandler> to stop listening to a previously registered callback.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
// The context `this` in the event handlers will be
// the {ComponentContext} object that sourced the event.
// The `data` parameter passed to the handlers, is of
// variant type, depending on the type of the occurring event.
zuix
  .hook('load:begin', function(data){
    loaderMessage.html('Loading "'+data.task+'" ...');
    loaderMessage.show();

}).hook('load:next', function(data){
    loaderMessage.html('"'+data.task+'" done, loading next..');

}).hook('load:end', function(){
    loaderMessage.hide();

}).hook('html:parse', function (data) {
    // ShowDown - MarkDown syntax compiler
    if (this.options().markdown === true && typeof showdown !== 'undefined')
        data.content = new showdown.Converter()
            .makeHtml(data.content);

}).hook('css:parse', function (data) {
    // process css, eg. run a CSS pre-processor
    // eg. Sass, Less, ...

}).hook('view:process', function (view) {
    // The view DOM is now fully loaded and ready

    // Prism code syntax highlighter
    view.find('code').each(function (i, block) {
        this.addClass('language-javascript');
        Prism.highlightElement(block);
    });

    // Force opening of all non-local links in a new window
    zuix.$('a[href*="://"]').attr('target','_blank');

    // Material Design Light auto-detection
    // Call DOM upgrade on newly added view elements
    if (componentHandler)
        componentHandler.upgradeElements(view.get());

});
```
 *
 * @param {string} eventPath The event path.
 * @param {function|undefined} eventHandler The handler function.
 * @return {Zuix} The ```{Zuix}``` object itself.
 */
Zuix.prototype.hook = function(eventPath, eventHandler) {
    hook(eventPath, eventHandler);
    return this;
};
/**
 * Loads a CSS or Javascript resource. All CSS styles and Javascript scripts
 * loaded with this method will be also included in the application bundle.
 * If a resource is already loaded, the request will be ignored.
 * This command is also meant to be used inside a components' controller.
 * This enables the loading of a component without the need of manually including
 * all of its dependencies since those will be automatically fetched as required.
 *
 * @example
 *
 <small>**Example - JavaScript**</small>
 <pre><code class="language-js">
 // Controller of component 'path/to/component_name'
 zuix.controller(function(cp) {
    cp.init = function() {
        zuix.using('script', 'https://some.cdn.js/moment.min.js', function(){
            // can start using moment.js
        });
    };
    cp.create = function() { ... };
    cp.destroy = function() { ... }
});
 </code></pre>
 *
 *
 * @param {string} resourceType Either `style`, `script` or `component`.
 * @param {string} resourcePath Relative or absolute resource url path
 * @param {function} [callback] Callback function to call once resource is loaded.
 * @return {void}
 */
Zuix.prototype.using = function(resourceType, resourcePath, callback) {
    resourcePath = _componentizer.resolvePath(resourcePath);
    resourceType = resourceType.toLowerCase();
    const hashId = resourceType+'-'+resourcePath.hashCode();

    if (resourceType === 'component') {
        const c = context(hashId);
        if (c == null) {
            zuix.load(resourcePath, {
                contextId: hashId,
                view: '',
                priority: -10,
                ready: function(ctx) {
                    if (typeof callback === 'function') {
                        callback(resourcePath, ctx);
                    }
                },
                error: function() {
                    callback(resourcePath, null);
                }
            });
        } else if (typeof callback === 'function') {
            // already loaded
            callback(resourcePath, c);
        }
    } else {
        const isCss = (resourceType === 'style');
        if (z$.find(resourceType + '[id="' + hashId + '"]').length() === 0) {
            const head = document.head || document.getElementsByTagName('head')[0];
            const resource = document.createElement(resourceType);
            if (isCss) {
                resource.type = 'text/css';
                resource.id = hashId;
            } else {
                resource.type = 'text/javascript';
                resource.id = hashId;
            }
            head.appendChild(resource);

            // TODO: add logging
            const addResource = function(text) {
                // TODO: add logging
                if (isCss) {
                    if (resource.styleSheet) {
                        resource.styleSheet.cssText = text;
                    } else {
                        resource.appendChild(document.createTextNode(text));
                    }
                } else {
                    if (resource.innerText) {
                        resource.innerText = text;
                    } else {
                        resource.appendChild(document.createTextNode(text));
                    }
                }
                if (callback) {
                    callback(resourcePath, hashId);
                }
            };

            const cid = '_res/' + resourceType + '/' + hashId;
            const cached = getCachedComponent(cid);
            if (cached != null) {
                addResource(isCss ? cached.css : cached.controller);
            } else {
                z$.ajax({
                    url: resourcePath,
                    success: function(resText) {
                        // TODO: add logging
                        /** @type {ComponentCache} */
                        const cached = {
                            componentId: cid,
                            view: null,
                            css: isCss ? resText : null,
                            controller: !isCss ? resText : null,
                            using: resourcePath
                        };
                        _componentCache.push(cached);
                        addResource(resText);
                    },
                    error: function() {
                        // TODO: add logging
                        head.removeChild(resource);
                        if (callback) {
                            callback(resourcePath);
                        }
                    }
                });
            }
        } else {
            // TODO: add logging
            console.log('Resource already added ' + hashId + '(' + resourcePath + ')');
            if (callback) {
                callback(resourcePath, hashId);
            }
        }
    }
};
/**
 * Enables/Disables lazy-loading or gets the current setting.
 *
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Load-ahead threshold (default is 1.0 => 100% of view size).
 * @return {Zuix|boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Zuix.prototype.lazyLoad = function(enable, threshold) {
    if (enable != null) {
        _componentizer.lazyLoad(enable, threshold);
    } else {
        return _componentizer.lazyLoad();
    }
    return this;
};
/**
 * Enables/Disables HTTP caching or gets the current settings.
 *
 * @param {boolean} [enable]
 * @return {Zuix|boolean} *true* if HTTP caching is enabled, *false* otherwise.
 */
Zuix.prototype.httpCaching = function(enable) {
    if (enable != null) {
        httpCaching(enable);
    } else {
        return httpCaching();
    }
    return this;
};
/**
 * Searches the document, or inside the given ```element```,
 * for all ```data-ui-include``` and ```data-ui-load``` attributes
 * and processes these by loading the requested components.
 * This is a service function that should only be called if dynamically
 * adding content with elements that contain *load* or *include* directives.
 *
 * @example
 *
 <small>**Example - JavaScript**</small>
 ```js
 zuix.componentize(document);
 ```
 *
 * @param {Element|ZxQuery} [element] Container to use as starting node for the search (**default:** *document*).
 * @return {Zuix} The ```{Zuix}``` object itself.
 */
Zuix.prototype.componentize = function(element) {
    _componentizer.componentize(element);
    return this;
};
/**
 * Gets/Sets a global store entry.
 * @param {string} name Entry name
 * @param {object} value Entry value
 * @return {object}
 */
Zuix.prototype.store = function(name, value) {
    if (value != null) {
        this._store[name] = value;
    }
    return this._store[name];
};
/**
 * Get a resource path.
 * @param {string} path resource id/path
 * @return {string}
 */
Zuix.prototype.getResourcePath = function(path) {
    return getResourcePath(path);
};
/**
 * Gets/Sets the components data bundle.
 *
 * @param {!Array.<BundleItem>} bundleData A bundle object holding in memory all components data (cache).
 * @param {function} [callback]
 * @return {Zuix|Array.<BundleItem>}
 */
Zuix.prototype.bundle = function(bundleData, callback) {
    if (util.isNoU(bundleData)) {
        return _componentCache;
    } else if (bundleData && typeof bundleData === 'boolean') {
        _log.t('bundle:start');
        const ll = _componentizer.lazyLoad();
        _componentizer.lazyLoad(false);
        _componentizer.componentize();
        if (typeof callback === 'function') {
            const waitLoop = function(w) {
                setTimeout(function() {
                    if (_componentizer.willLoadMore()) {
                        _log.t('bundle:wait');
                        w(w);
                    } else {
                        _log.t('bundle:end');
                        _componentizer.lazyLoad(ll);
                        callback();
                    }
                }, 1000);
            };
            waitLoop(waitLoop);
        }
    } else {
        // reset css flag before importing bundle
        for (let c = 0; c < bundleData.length; c++) {
            if (bundleData[c].css_applied) {
                delete bundleData[c].css_applied;
            }
            if (typeof bundleData[c].controller === 'string') {
                bundleData[c].controller = eval(bundleData[c].controller);
            }
        }
        _componentCache = bundleData;
    }
    return this;
};

/**
 * @property {ZxQuery}
 */
Zuix.prototype.$ = z$;
Zuix.prototype.TaskQueue = TaskQueue;
Zuix.prototype.ZxQuery = z$.ZxQuery;
/**
 * Dumps content of the components cache. Mainly for debugging purpose.
 * @return {Array<ComponentCache>}
 */
Zuix.prototype.dumpCache = function() {
    return _componentCache;
};
/**
 * Dumps allocated component contexts. Mainly for debugging purpose.
 * @return {Array<ComponentContext>}
 */
Zuix.prototype.dumpContexts = function() {
    return _contextRoot;
};

// TODO: add zuix.options to configure stuff like
// TODO: the css/html/js lookup base path (each individually own prop)

/**
 * @param root
 * @return {Zuix}
 */
module.exports = function(root) {
    const zuix = new Zuix();
    if (document.readyState != 'loading') {
        zuix.componentize();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            zuix.componentize();
        });
    }
    // log messages monitor (one global listener)
    _log.monitor(function(level, args) {
        if (util.isFunction(zuix.monitor)) {
            zuix.monitor(level, Array.prototype.slice.call(args));
        }
    });
    return zuix;
};
