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
    require('../helpers/Logger')('ComponentContext.js');
const _optionAttributes =
    require('./OptionAttributes')();
const z$ =
    require('../helpers/ZxQuery');
const util =
    require('../helpers/Util');

// Custom objects definition used to generate JsDoc

/**
 * This function is called after the component is loaded
 * and it is used to initialize its controller.
 *
 * @callback ContextControllerHandler
 * @param {ContextController} cp The component controller object.
 * @this {ContextController}
 */

/**
 * Callback function triggered when an event registered with the `on` method occurs.
 *
 * @callback EventCallback
 * @param {string} event Event name.
 * @param {Object} data Event data.
 * @this {ZxQuery}
 */

// TODO: convert all 'this.<field>' to 'let' variables

/** @type {Zuix} **/
let zuix = null;

/**
 * The component context object.
 *
 * @param {Zuix} zuixInstance
 * @param {ContextOptions} options The context options.
 * @param {function} [eventCallback] Event routing callback.
 * @return {ComponentContext} The component context instance.
 * @constructor
 */

function ComponentContext(zuixInstance, options, eventCallback) {
    zuix = zuixInstance;
    this._options = null;
    this.contextId = (options == null || options.contextId == null) ? null : options.contextId;
    this.componentId = null;
    this.trigger = function(context, eventPath, eventValue) {
        if (typeof eventCallback === 'function') {
            eventCallback(context, eventPath, eventValue);
        }
    };

    /** @protected */
    this._container = null;

    /** @protected */
    this._model = null;
    /** @protected */
    this._view = null;
    /** @protected */
    this._css = null;
    /** @protected */
    this._style = null;
    /**
     * @protected
     * @type {ContextControllerHandler}
     */
    this._controller = null;

    /**
     * Define the local behavior handler for this context instance only.
     * Any global behavior matching the same `componentId` will be overridden.
     *
     * @function behavior
     * @param handler_fn {function}
     */
    this.behavior = null;

    /** @package */
    this._eventMap = [];
    /** @package */
    this._behaviorMap = [];

    /**
     * @package
     * @type {ContextController}
     */
    this._c = null;

    this.options(options);

    return this;
}
/**
 * Gets/Sets the container element of the component.
 * Returns the current container element if no
 * argument is passed, the {ComponentContext} itself
 * otherwise.
 *
 * @param {Element} [container] The container element.
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.container = function(container) {
    // TODO: should automatically re-attach view to the new parent?
    if (container == null) return this._container;
    else if (container instanceof z$.ZxQuery) {
        container = container.get();
    }
    this._container = container;
    return this;
};

/**
 * Gets/Sets the view element of the component.
 * If an *HTML* string is passed, then the view element
 * will be a new `div` wrapping the given markup.
 * Returns the current view element if no
 * argument is passed, the {ComponentContext} itself otherwise.
 *
 * @param {Element|string|undefined} [view] The *HTML* string or element of the view.
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.view = function(view) {
    if (typeof view === 'undefined') return this._view;
    else if (view instanceof z$.ZxQuery) {
        view = view.get();
    }

    _log.t(this.componentId, 'view:attach', 'timer:view:start');
    if (typeof view === 'string') {
        // load view from HTML source

        // trigger `html:parse` hook before assigning content to the view
        const hookData = {content: view};
        this.trigger(this, 'html:parse', hookData);
        view = hookData.content;

        const viewDiv = z$.wrapElement('div', view);
        if (viewDiv.firstElementChild != null) {
            // remove data-ui-view attribute from template if present on root node
            if (viewDiv.firstElementChild.getAttribute(_optionAttributes.dataUiView) != null) {
                if (viewDiv.children.length === 1) {
                    view = viewDiv.firstElementChild.innerHTML;
                }
            } else view = viewDiv.innerHTML;
        }
        if (this._container != null) {
            // append view content to the container
            this._view = this._container;
            this._view.innerHTML += view;
        } else {
            if (this._view != null) {
                this._view.innerHTML = view;
            } else this._view = viewDiv;
        }

        // Run embedded scripts
        z$(this._view).find('script').each(function(i, el) {
            if (this.attr('zuix-loaded') !== 'true') {
                this.attr('zuix-loaded', 'true');
                /* if (el.src != null && el.src.length > 0) {
                    var clonedScript = document.createElement('script');
                    clonedScript.setAttribute('zuix-loaded', 'true');
                    clonedScript.onload = function () {
                        // TODO: ...
                    };
                    if (!util.isNoU(this.type) && this.type.length > 0)
                        clonedScript.type = this.type;
                    if (!util.isNoU(this.text) && this.text.length > 0)
                        clonedScript.text = this.text;
                    if (!util.isNoU(this.src) && this.src.length > 0)
                        clonedScript.src = this.src;
                    this.get().parentNode.insertBefore(clonedScript, this.get());
                } else */
                (eval).call(window, el.innerHTML);
            }
        });

        // trigger `view:process` hook when the view is ready to be processed
        this.trigger(this, 'view:process', z$(this._view));
    } else {
        if (view instanceof z$.ZxQuery) {
            view = view.get();
        }
        // load inline view
        if (this._container != null) {
            this._view = z$.wrapElement('div', view.outerHTML).firstElementChild;
            // remove data-ui-view attribute if present on root node
            this._view.removeAttribute(_optionAttributes.dataUiView);
            this._container.appendChild(this._view);
            this._view = this._container;
        } else this._view = view;
    }

    const v = z$(this._view);
    if (this._options.css === false) {
        // disable local css styling for this instance
        v.addClass('zuix-css-ignore');
    } else {
        // enable local css styling
        v.removeClass('zuix-css-ignore');
    }
    // Disable loading of nested components until the component is ready
    v.find('['+_optionAttributes.dataUiLoad+']').each(function(i, v) {
        this.attr(_optionAttributes.dataUiLoaded, 'false');
    });

    this.modelToView();

    _log.t(this.componentId, 'view:attach', 'timer:view:stop');
    return this;
};

/**
 * Gets/Sets the view style of the component.
 * The `css` argument can be a string containing all
 * styles definitions or a reference to a style
 * element. When a string is passed the css
 * is linked to the `componentId` attribute so that
 * its styles will be only applied to the component
 * container.
 * If no argument is given, then the current style
 * element is returned.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.style("p { font-size: 120%; } .hidden { display: 'none'; }");
 * </code></pre>
 *
 * @param {string|Element|undefined} [css] The CSS string or element.
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.style = function(css) {
    if (typeof css === 'undefined') return this._style;
    _log.t(this.componentId, 'view:style', 'timer:view:start');
    if (css == null || css instanceof Element) {
        this._css = (css instanceof Element) ? css.innerText : css;
        this._style = z$.appendCss(css, this._style, this.componentId);
    } else if (typeof css === 'string') {
        // store original unparsed css (might be useful for debugging)
        this._css = css;

        // trigger `css:parse` hook before assigning content to the view
        const hookData = {content: css};
        this.trigger(this, 'css:parse', hookData);
        css = hookData.content;

        // nest the CSS inside [data-ui-component='<componentId>']
        // so that the style is only applied to this component type
        css = z$.wrapCss('['+_optionAttributes.dataUiComponent+'="' + this.componentId + '"]:not(.zuix-css-ignore)', css);

        // output css
        this._style = z$.appendCss(css, this._style, this.componentId);
    }
    // TODO: should throw error if ```css``` is not a valid type
    _log.t(this.componentId, 'view:style', 'timer:view:stop');
    return this;
};
/**
 * Gets/Sets the data model of the component.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.model({
 *      title: 'Thoughts',
 *      message: 'She stared through the window at the stars.'
 *  });
 * </code></pre>
 *
 * @param {object|undefined} [model] The model object.
 * @return {ComponentContext|object}
 */
ComponentContext.prototype.model = function(model) {
    if (typeof model === 'undefined') return this._model;
    else this._model = model; // model can be set to null
    this.modelToView();
    // call controller `update` method when model is updated
    if (this._c != null && util.isFunction(this._c.update)) {
        this._c.update.call(this._c);
    }
    return this;
};
/**
 * Gets/Sets the handler function of the controller.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.controller(function(cp) {
 *      cp.create = function() {
 *           cp.view().html('Hello World!');
 *      };
 *      // ...
 *  });
 * </code></pre>
 *
 * @param {ContextControllerHandler|undefined} [controller] The handler function of the controller.
 * @return {ComponentContext|ContextControllerHandler}
 */
ComponentContext.prototype.controller = function(controller) {
    if (typeof controller === 'undefined') return this._controller;
    // TODO: should dispose previous context controller first
    else this._controller = controller; // can be null
    return this;
};

/**
 * Gets/Sets the component options.
 *
 * @param {ContextOptions|undefined} options The JSON options object.
 * @return {ComponentContext|object}
 */
ComponentContext.prototype.options = function(options) {
    if (options == null) {
        return this._options;
    }
    const o = this._options = this._options || {};
    z$.each(options, function(k, v) {
        o[k] = v;
    });
    if (o.componentId != null) {
        this.componentId = o.componentId;
    }
    this.container(o.container);
    this.view(o.view);
    if (typeof o.css !== 'undefined') {
        this.style(o.css);
    }
    this.controller(o.controller);
    this.model(o.model);
    return this;
};

/**
 * Listens for a component event.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.on('item:share', function(evt, data) { ... });
 * </code></pre>
 *
 * @param {string} eventPath The event path.
 * @param {EventCallback} eventHandler The event handling function.
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.on = function(eventPath, eventHandler) {
    // TODO: throw error if _c (controller instance) is not yet ready
    this._c.on(eventPath, eventHandler);
    return this;
};
/**
 * Loads the `.css` file and replace the view style of the component.
 * If no `options.path` is specified, it will try to load
 * the file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.css' by default
 * ctx.loadCss();
 * // or loads the view css with options
 * ctx.loadCss({
 *     path: 'url/of/style/file.css',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @private
 * @param {object} [options] The options object.
 * @param {boolean} [enableCaching] Enable HTTP
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.loadCss = function(options, enableCaching) {
    const context = this;
    if (util.isNoU(options)) options = {};
    if (!util.isNoU(options.caching)) {
        enableCaching = options.caching;
    }
    let cssPath = context.componentId + '.css';
    if (!util.isNoU(options.path)) {
        cssPath = options.path;
    }
    if (!enableCaching) {
        cssPath += '?'+new Date().getTime();
    }
    z$.ajax({
        url: zuix.getResourcePath(cssPath),
        success: function(viewCss) {
            context.style(viewCss);
            if (util.isFunction(options.success)) {
                (options.success).call(context, viewCss);
            }
        },
        error: function(err) {
            _log.e(err, context);
            if (util.isFunction(options.error)) {
                (options.error).call(context, err);
            }
        },
        then: function() {
            if (util.isFunction(options.then)) {
                (options.then).call(context);
            }
        }
    });
    return this;
};
/**
 * Loads the `.html` file and replace the view markup code of the component.
 * If no `options.path` is specified, it will try to load the
 * file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.html' by default
 * ctx.loadHtml();
 * // or loads the view html with options
 * ctx.loadHtml({
 *     path: 'url/of/view/file.html',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @private
 * @param {object} [options] The options object.
 * @param {boolean} [enableCaching] Enable HTTP caching
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.loadHtml = function(options, enableCaching) {
    const context = this;
    let htmlPath = context.componentId;
    if (util.isNoU(options)) options = {};
    if (!util.isNoU(options.caching)) {
        enableCaching = options.caching;
    }
    if (!util.isNoU(options.path)) {
        htmlPath = options.path;
    }
    // cache inline "data-ui-view" html
    let inlineViews = zuix.store('zuix.inlineViews');
    if (inlineViews == null) {
        inlineViews = [];
        zuix.store('zuix.inlineViews', inlineViews);
    }
    if (inlineViews[htmlPath] != null) {
        context.view(inlineViews[htmlPath]);
        if (util.isFunction(options.success)) {
            (options.success).call(context, inlineViews[htmlPath]);
        }
        if (util.isFunction(options.then)) {
            (options.then).call(context);
        }
    } else {
        // TODO: check if view caching is working in this case too
        const inlineView = z$().find('[' + _optionAttributes.dataUiView + '="' + htmlPath + '"]:not([' + _optionAttributes.dataUiComponent + '*=""])');
        if (inlineView.length() > 0) {
            const inlineElement = inlineView.get(0);
            inlineViews[htmlPath] = inlineElement.innerHTML;
            if (context.view() === inlineElement || (context.container() != null && context.container().contains(inlineElement))) {
                // TODO: test this case better (or finally integrate some unit testing =))
                // TODO: "html:parse" will not fire in this case (and this is the wanted behavior)
                inlineView.attr(_optionAttributes.dataUiView, null);
                context._view = inlineElement;
                // trigger `view:process` hook
                this.trigger(this, 'view:process', z$(context.view()));
            } else {
                context.view(inlineElement.innerHTML);
            }
            if (util.isFunction(options.success)) {
                (options.success).call(context, inlineElement.innerHTML);
            }
            if (util.isFunction(options.then)) {
                (options.then).call(context);
            }
        } else {
            const cext = util.isNoU(options.cext) ? '.html' : options.cext;
            if (htmlPath == context.componentId) {
                htmlPath += cext + (!enableCaching ? '?' + new Date().getTime() : '');
            }
            z$.ajax({
                url: zuix.getResourcePath(htmlPath),
                success: function(viewHtml) {
                    context.view(viewHtml);
                    if (util.isFunction(options.success)) {
                        (options.success).call(context, viewHtml);
                    }
                },
                error: function(err) {
                    _log.e(err, context);
                    if (util.isFunction(options.error)) {
                        (options.error).call(context, err);
                    }
                },
                then: function() {
                    if (util.isFunction(options.then)) {
                        (options.then).call(context);
                    }
                }
            });
        }
    }
    return this;
};
/**
 * Creates the data model starting from ```data-ui-field```
 * elements declared in the component view.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.viewToModel = function() {
    _log.t(this.componentId, 'view:model', 'timer:vm:start');
    const _t = this;
    this._model = {};
    // create data model from inline view fields
    z$(this._view).find('['+_optionAttributes.dataUiField+']').each(function(i, el) {
        // TODO: this is not so clean
        if (this.parent('pre,code').length() > 0) {
            return true;
        }
        const name = this.attr(_optionAttributes.dataUiField);
        const value =
            // TODO: this is a work around for IE where "el.innerHTML" is lost after view replacing
            (!util.isNoU(el.innerHTML) && util.isIE())
                ? el.cloneNode(true) : el;
        // dotted field path
        if (name.indexOf('.')>0) {
            const path = name.split('.');
            let cur = _t._model;
            for (let p = 0; p < path.length - 1; p++) {
                if (typeof cur[path[p]] === 'undefined') {
                    cur[path[p]] = {};
                }
                cur = cur[path[p]];
            }
            cur[path[path.length - 1]] = value;
        } else _t._model[name] = value;
    });
    _log.t(this.componentId, 'view:model', 'timer:vm:stop');
    return this;
};
/**
 * Copies values from the data model to the ```data-ui-field```
 * elements declared in the component view.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.modelToView = function() {
    _log.t(this.componentId, 'model:view', 'timer:mv:start');
    if (this._view != null && this._model != null) {
        const _t = this;
        z$(this._view).find('['+_optionAttributes.dataUiField+']').each(function(i, el) {
            if (this.parent('pre,code').length() > 0) {
                return true;
            }
            let boundField = this.attr(_optionAttributes.dataBindTo);
            if (boundField == null) {
                boundField = this.attr(_optionAttributes.dataUiField);
            }
            if (typeof _t._model === 'function') {
                (_t._model).call(z$(_t._view), this, boundField);
            } else {
                const boundData = util.propertyFromPath(_t._model, boundField);
                if (typeof boundData === 'function') {
                    (boundData).call(z$(_t._view), this, boundField);
                } else if (boundData != null) {
                    // try to guess target property
                    switch (el.tagName.toLowerCase()) {
                        // TODO: complete binding cases
                        case 'img':
                            el.src = (!util.isNoU(boundData.src) ? boundData.src :
                                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
                            if (boundData.alt) el.alt = boundData.alt;
                            break;
                        case 'a':
                            el.href = (!util.isNoU(boundData.href) ? boundData.getAttribute('href'):
                                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
                            if (boundData.title) el.title = boundData.title;
                            if (!util.isNoU(boundData.href) && !util.isNoU(boundData.innerHTML) && boundData.innerHTML.trim() !== '') {
                                el.innerHTML = boundData.innerHTML;
                            }
                            break;
                        case 'input':
                            el.value = (!util.isNoU(boundData.value) ? boundData.value :
                                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
                            break;
                        default:
                            el.innerHTML = (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData);
                            if (boundData.attributes != null) {
                                for (let i = 0; i < boundData.attributes.length; i++) {
                                    const attr = boundData.attributes[i];
                                    if (attr.specified && attr.name !== _optionAttributes.dataUiField) {
                                        if (attr.value[0] === '+' && el.hasAttribute(attr.name)) {
                                            attr.value = el.getAttribute(attr.name) + ' ' + attr.value.substring(1);
                                        }
                                        el.setAttribute(attr.name, attr.value);
                                    }
                                }
                            }
                    }
                }
            }
        });
    }
    _log.t(this.componentId, 'model:view', 'timer:mv:stop');
    return this;
};

module.exports = ComponentContext;
