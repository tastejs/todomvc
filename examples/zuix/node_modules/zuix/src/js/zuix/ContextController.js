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

const z$ =
    require('../helpers/ZxQuery');

/**
 * ContextController user-defined handlers definition
 *
 * @typedef {Object} ContextController
 * @property {function} init Function that gets called after loading and before the component is created.
 * @property {function} create Function that gets called after loading, when the component is actually created and ready.
 * @property {function} update Function called when the data model of the component is updated.
 * @property {function} destroy Function called when the component is destroyed.
 */

/**
 * ContextController constructor.
 *
 * @param {ComponentContext} context
 * @return {ContextController}
 * @constructor
 */
function ContextController(context) {
    const _t = this;

    this._view = null;

    this.context = context;

    /**
     * @package
     * @type {!Array.<ZxQuery>}
     **/
    this._fieldCache = [];

    // Interface methods

    /** @type {function} */
    this.init = null;
    /** @type {function} */
    this.create = null;
    /** @type {function} */
    this.update = null;
    /** @type {function} */
    this.destroy = null;

    /**
     * @protected
     * @type {!Array.<Element>}
     * */
    this._childNodes = [];
    /** @type {function} */
    this.saveView = function() {
        this.restoreView();
        this.view().children().each(function(i, el) {
            _t._childNodes.push(el);
        });
    };
    this.restoreView = function() {
        if (this._childNodes.length > 0) {
            _t.view().html('');
            z$.each(_t._childNodes, function(i, el) {
                _t.view().append(el);
            });
            this._childNodes.length = 0;
        }
    };

    this.on = function(eventPath, handler) {
        this.addEvent(eventPath, handler);
        return this;
    };
    /** @protected */
    this.mapEvent = function(eventMap, target, eventPath, handler) {
        if (target != null) {
            target.off(eventPath, this.eventRouter);
            eventMap[eventPath] = handler;
            target.on(eventPath, this.eventRouter);
        } else {
            // TODO: should report missing target
        }
    };
    /** @protected */
    this.eventRouter = function(e) {
        if (typeof context._behaviorMap[e.type] === 'function') {
            context._behaviorMap[e.type].call(_t.view(), e, e.detail);
        }
        if (typeof context._eventMap[e.type] === 'function') {
            context._eventMap[e.type].call(_t.view(), e, e.detail);
        }
        // TODO: else-> should report anomaly
    };

    // create event map from context options
    const options = context.options();
    let handler = null;
    if (options.on != null) {
        for (let ep in options.on) {
            if (options.on.hasOwnProperty(ep)) {
                handler = options.on[ep];
                _t.addEvent(ep, handler);
            }
        }
    }
    // create behavior map from context options
    if (options.behavior != null) {
        for (let bp in options.behavior) {
            if (options.behavior.hasOwnProperty(bp)) {
                handler = options.behavior[bp];
                _t.addBehavior(bp, handler);
            }
        }
    }

    context.controller().call(this, this);

    return this;
}

// TODO: add jsDoc
ContextController.prototype.addEvent = function(eventPath, handler) {
    this.mapEvent(this.context._eventMap, this.view(), eventPath, handler);
    return this;
};

// TODO: add jsDoc
ContextController.prototype.addBehavior = function(eventPath, handler) {
    this.mapEvent(this.context._behaviorMap, this.view(), eventPath, handler);
    return this;
};

/**
 * Gets elements in the component view with `data-ui-field`
 * matching the given `fieldName`.
 * This method implements a caching mechanism and automatic
 * disposal of allocated objects and events.
 *
 * @example
 *
 * <small>**Example - HTML code of the view**</small>
 * <pre><code class="language-html">
 * <h1 data-ui-field="title">...</h1>
 * <p data-ui-field="description">...</p>
 * </code></pre>
 *
 * <small>**Example - JavaScript**</small>
 * <pre><code class="language-js">
 * cp.field('title')
 *   .html('Hello World!');
 * var desc = cp.field('description');
 * desc.html('The spectacle before us was indeed sublime.');
 * </code></pre>
 *
 *
 * @param {!string} fieldName Value to match in the `data-ui-field` attribute.
 * @return {ZxQuery} A `{ZxQuery}` object wrapping the matching element.
 */
ContextController.prototype.field = function(fieldName) {
    // this method is "attached" from Zuix.js on controller initialization
    return null;
};
ContextController.prototype.clearCache = function() {
    this._fieldCache.length = 0;
};
/**
 * Gets the component view or if `filter` argument is passed,
 * gets the view elements matching the given `filter`
 * (shorthand for `cp.view().find(filter)`).
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // get all `checkbox` elements with `.checked` class.
 * var choices = cp.view('input[type="checkbox"].checked');
 * choices.removeClass('.checked');
 * // hide the component's view
 * cp.view().hide();
 * </code></pre>
 *
 * @param {(string|undefined)} [filter]
 * @return {ZxQuery}
 */
ContextController.prototype.view = function(filter) {
    // context view changed, dispose cached fields from previous attacched view
    if (this.context.view() != null || this._view !== this.context.view()) {
        this.clearCache();
        // TODO: !!!!
        // TODO: dispose also events on view change (!!!)
        // TODO: !!!!
        this._view = z$(this.context.view());
    }
    if (filter != null) {
        return this._view.find(filter);
    } else if (this._view !== null) {
        return this._view;
    } else {
        throw new Error('Not attached to a view yet.');
    }
};
/**
 * Gets/Sets the data model of the component.
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * var m = {
 *      title: 'Thoughts',
 *      message: 'She stared through the window at the stars.'
 *  };
 * cp.model(m);
 * cp.model().title = 'Changes';
 * console.log(cp.model().title);
 * </code></pre>
 *
 * @param {object|undefined} [model] The model object.
 * @return {ContextController|object}
 */
ContextController.prototype.model = function(model) {
    if (model == null) {
        return this.context.model();
    } else this.context.model(model);
    return this;
};
/**
 * Gets the component options.
 *
 * @return {object} The component options.
 */
ContextController.prototype.options = function() {
    return this.context.options();
};
/**
 * Triggers the component event `eventPath` with the given
 * `eventData` object. To listen to a component event use the
 * `{ComponentContext}.on(eventPath, handler)` method or
 * in case `isHook` is set to true, use the
 * `zuix.hook(eventPath, handler)` method (global hook event).
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
// somewhere inside the slide-show component controller
cp.trigger('slide:change', slideIndex);

// somewhere in a page hosting the slide-show component
// set component event listeners
zuix.context('my-slide-show')
  .on('slide:change', function(slideIndex) { ... })
  .on(...);
 * </code></pre>
 *
 * @param {string} eventPath The event path.
 * @param {object} eventData The event data.
 * @param {boolean} [isHook] Trigger as global hook event.
 * @return {ContextController}
 */
ContextController.prototype.trigger = function(eventPath, eventData, isHook) {
    if (this.context._eventMap[eventPath] == null && isHook !== true) {
        this.addEvent(eventPath, null);
    }
    // TODO: ...
    if (isHook === true) {
        let target = this.context.container();
        if (target == null) target = this.context.view();
        if (target != null) {
            z$(target)
                .trigger(eventPath, eventData);
        }
        this.context.trigger(this.context, eventPath, eventData);
    } else {
        this.view().trigger(eventPath, eventData);
    }
    return this;
};
/**
 * Exposes a method or property declared in the private
 * scope of the controller as a public member of the
 * component context object.
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre data-line="5"><code class="language-js">
 * // somewhere in the `create` method of the {ContextController}
 * zuix.controller(function(cp){
 *   cp.create = function() {
 *     // ....
 *     cp.expose('setSlide', slide);
 *   }
 *   // ...
 *   function slide(slideIndex) { ... }
 *   // ...
 * });
 * // ...
 * // calling the exposed method
 * // from the component context
 * var ctx = zuix.context('my-slide-show');
 * ctx.setSlide(2);
 * </code></pre>
 *
 * @param {string|JSON} methodName Name of the exposed function, or list of method-name/function pairs.
 * @param {function} [handler] Reference to the controller member to expose.
 * @return {ContextController} The `{ContextController}` itself.
 */
ContextController.prototype.expose = function(methodName, handler) {
    if (typeof methodName === 'object') {
        const _t = this;
        z$.each(methodName, function(k, v) {
            _t.context[k] = v;
        });
    } else this.context[methodName] = handler;
    return this;
};
/**
 * Loads the `.css` file and replace the current view style of the component.
 * If no `options.path` is specified, it will try to load
 * the file with the same base-name as the `componentId`.
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.css' by default
 * cp.loadCss();
 * // or loads the view css with provided options
 * cp.loadCss({
 *     path: 'url/of/style/file.css',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @param {object} [options] The options object.
 * @return {ContextController} The ```{ContextController}``` object itself.
 */
ContextController.prototype.loadCss = function(options) {
    this.context.loadCss(options);
    return this;
};
/**
 * Loads the `.html` file and replace the view markup of the component.
 * If no `options.path` is specified, it will try to load the
 * file with the same base-name as the `componentId`.
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.html' by default
 * cp.loadHtml();
 * // or loads the view html with provided options
 * cp.loadHtml({
 *     path: 'url/of/view/file.html',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @param {object} [options] The options object.
 * @return {ContextController} The ```{ContextController}``` object itself.
 */
ContextController.prototype.loadHtml = function(options) {
    this.saveView();
    this.context.loadHtml(options);
    return this;
};
/**
 * The logger object is "attached" upon controller initialization.
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // same as log.info (...)
 * log.i('Component view', ctx.view());
 * // same as log.error(...)
 * log.e('Error loading data', dataUrl);
 * // other methods are:
 * // log.w(...) / log.warn (...)
 * // log.d(...) / log.debug(...)
 * // log.t(...) / log.trace(...)
 * </code></pre>
 *
 * @type {Logger}
 */
ContextController.prototype.log = {};
/**
 * Register this one as the default controller
 * for the given component type.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
<pre data-line="6"><code class="language-js">
// Controller of component 'path/to/component_name'
var ctrl = zuix.controller(function(cp) {
    // `cp` is the {ContextController}
    cp.create = function() { ... };
    cp.destroy = function() { ... }
}).for('path/to/component_name');
</pre></code>
 *
 * @param {!string} componentId Component identifier.
 * @return {ContextController} The `{ContextController}` itself.
 */
ContextController.prototype.for = function(componentId) {
    // this method is "attached" from Zuix.js on controller initialization
    return this;
};

module.exports = ContextController;
