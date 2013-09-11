/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library'], function (can) {
    // ## view.js
    // `can.view`  
    // _Templating abstraction._
    var isFunction = can.isFunction,
        makeArray = can.makeArray,
        // Used for hookup `id`s.
        hookupId = 1,

        $view = can.view = function (view, data, helpers, callback) {
            // If helpers is a `function`, it is actually a callback.
            if (isFunction(helpers)) {
                callback = helpers;
                helpers = undefined;
            }

            var pipe = function (result) {
                return $view.frag(result);
            },
                // In case we got a callback, we need to convert the can.view.render
                // result to a document fragment
                wrapCallback = isFunction(callback) ?
                function (frag) {
                    callback(pipe(frag));
                } : null,
                // Get the result.
                result = $view.render(view, data, helpers, wrapCallback),
                deferred = can.Deferred();

            if (isFunction(result)) {
                return result;
            }

            if (can.isDeferred(result)) {
                result.then(function (result, data) {
                    deferred.resolve.call(deferred, pipe(result), data);
                }, function () {
                    deferred.fail.apply(deferred, arguments);
                });
                return deferred;
            }

            // Convert it into a dom frag.
            return pipe(result);
        };

    can.extend($view, {
        // creates a frag and hooks it up all at once
        frag: function (result, parentNode) {
            return $view.hookup($view.fragment(result), parentNode);
        },

        // simply creates a frag
        // this is used internally to create a frag
        // insert it
        // then hook it up
        fragment: function (result) {
            var frag = can.buildFragment(result, document.body);
            // If we have an empty frag...
            if (!frag.childNodes.length) {
                frag.appendChild(document.createTextNode(''));
            }
            return frag;
        },

        // Convert a path like string into something that's ok for an `element` ID.
        toId: function (src) {
            return can.map(src.toString().split(/\/|\./g), function (part) {
                // Dont include empty strings in toId functions
                if (part) {
                    return part;
                }
            }).join("_");
        },

        hookup: function (fragment, parentNode) {
            var hookupEls = [],
                id, func;

            // Get all `childNodes`.
            can.each(fragment.childNodes ? can.makeArray(fragment.childNodes) : fragment, function (node) {
                if (node.nodeType === 1) {
                    hookupEls.push(node);
                    hookupEls.push.apply(hookupEls, can.makeArray(node.getElementsByTagName('*')));
                }
            });

            // Filter by `data-view-id` attribute.
            can.each(hookupEls, function (el) {
                if (el.getAttribute && (id = el.getAttribute('data-view-id')) && (func = $view.hookups[id])) {
                    func(el, parentNode, id);
                    delete $view.hookups[id];
                    el.removeAttribute('data-view-id');
                }
            });

            return fragment;
        },


        hookups: {},


        hook: function (cb) {
            $view.hookups[++hookupId] = cb;
            return " data-view-id='" + hookupId + "'";
        },


        cached: {},

        cachedRenderers: {},


        cache: true,


        register: function (info) {
            this.types["." + info.suffix] = info;
        },

        types: {},


        ext: ".ejs",


        registerScript: function () {},


        preload: function () {},


        render: function (view, data, helpers, callback) {
            // If helpers is a `function`, it is actually a callback.
            if (isFunction(helpers)) {
                callback = helpers;
                helpers = undefined;
            }

            // See if we got passed any deferreds.
            var deferreds = getDeferreds(data);

            if (deferreds.length) { // Does data contain any deferreds?
                // The deferred that resolves into the rendered content...
                var deferred = new can.Deferred(),
                    dataCopy = can.extend({}, data);

                // Add the view request to the list of deferreds.
                deferreds.push(get(view, true))

                // Wait for the view and all deferreds to finish...
                can.when.apply(can, deferreds).then(function (resolved) {
                    // Get all the resolved deferreds.
                    var objs = makeArray(arguments),
                        // Renderer is the last index of the data.
                        renderer = objs.pop(),
                        // The result of the template rendering with data.
                        result;

                    // Make data look like the resolved deferreds.
                    if (can.isDeferred(data)) {
                        dataCopy = usefulPart(resolved);
                    }
                    else {
                        // Go through each prop in data again and
                        // replace the defferreds with what they resolved to.
                        for (var prop in data) {
                            if (can.isDeferred(data[prop])) {
                                dataCopy[prop] = usefulPart(objs.shift());
                            }
                        }
                    }

                    // Get the rendered result.
                    result = renderer(dataCopy, helpers);

                    // Resolve with the rendered view.
                    deferred.resolve(result, dataCopy);

                    // If there's a `callback`, call it back with the result.
                    callback && callback(result, dataCopy);
                }, function () {
                    deferred.reject.apply(deferred, arguments)
                });
                // Return the deferred...
                return deferred;
            }
            else {
                // No deferreds! Render this bad boy.
                var response,
                // If there's a `callback` function
                async = isFunction(callback),
                    // Get the `view` type
                    deferred = get(view, async);

                // If we are `async`...
                if (async) {
                    // Return the deferred
                    response = deferred;
                    // And fire callback with the rendered result.
                    deferred.then(function (renderer) {
                        callback(data ? renderer(data, helpers) : renderer);
                    })
                } else {
                    // if the deferred is resolved, call the cached renderer instead
                    // this is because it's possible, with recursive deferreds to
                    // need to render a view while its deferred is _resolving_.  A _resolving_ deferred
                    // is a deferred that was just resolved and is calling back it's success callbacks.
                    // If a new success handler is called while resoliving, it does not get fired by
                    // jQuery's deferred system.  So instead of adding a new callback
                    // we use the cached renderer.
                    // We also add __view_id on the deferred so we can look up it's cached renderer.
                    // In the future, we might simply store either a deferred or the cached result.
                    if (deferred.state() === "resolved" && deferred.__view_id) {
                        var currentRenderer = $view.cachedRenderers[deferred.__view_id];
                        return data ? currentRenderer(data, helpers) : currentRenderer;
                    } else {
                        // Otherwise, the deferred is complete, so
                        // set response to the result of the rendering.
                        deferred.then(function (renderer) {
                            response = data ? renderer(data, helpers) : renderer;
                        });
                    }
                }

                return response;
            }
        },


        registerView: function (id, text, type, def) {
            // Get the renderer function.
            var func = (type || $view.types[$view.ext]).renderer(id, text);
            def = def || new can.Deferred();

            // Cache if we are caching.
            if ($view.cache) {
                $view.cached[id] = def;
                def.__view_id = id;
                $view.cachedRenderers[id] = func;
            }

            // Return the objects for the response's `dataTypes`
            // (in this case view).
            return def.resolve(func);
        }
    });

    // Makes sure there's a template, if not, have `steal` provide a warning.
    var checkText = function (text, url) {
        if (!text.length) {

            throw "can.view: No template or empty template:" + url;
        }
    },
        // `Returns a `view` renderer deferred.  
        // `url` - The url to the template.  
        // `async` - If the ajax request should be asynchronous.  
        // Returns a deferred.
        get = function (url, async) {
            var suffix = url.match(/\.[\w\d]+$/),
                type,
                // If we are reading a script element for the content of the template,
                // `el` will be set to that script element.
                el,
                // A unique identifier for the view (used for caching).
                // This is typically derived from the element id or
                // the url for the template.
                id,
                // The ajax request used to retrieve the template content.
                jqXHR;

            //If the url has a #, we assume we want to use an inline template
            //from a script element and not current page's HTML
            if (url.match(/^#/)) {
                url = url.substr(1);
            }
            // If we have an inline template, derive the suffix from the `text/???` part.
            // This only supports `<script>` tags.
            if (el = document.getElementById(url)) {
                suffix = "." + el.type.match(/\/(x\-)?(.+)/)[2];
            }

            // If there is no suffix, add one.
            if (!suffix && !$view.cached[url]) {
                url += (suffix = $view.ext);
            }

            if (can.isArray(suffix)) {
                suffix = suffix[0]
            }

            // Convert to a unique and valid id.
            id = $view.toId(url);

            // If an absolute path, use `steal` to get it.
            // You should only be using `//` if you are using `steal`.
            if (url.match(/^\/\//)) {
                var sub = url.substr(2);
                url = !window.steal ? sub : steal.config().root.mapJoin(sub);
            }

            // Set the template engine type.
            type = $view.types[suffix];

            // If it is cached, 
            if ($view.cached[id]) {
                // Return the cached deferred renderer.
                return $view.cached[id];

                // Otherwise if we are getting this from a `<script>` element.
            } else if (el) {
                // Resolve immediately with the element's `innerHTML`.
                return $view.registerView(id, el.innerHTML, type);
            } else {
                // Make an ajax request for text.
                var d = new can.Deferred();
                can.ajax({
                    async: async,
                    url: url,
                    dataType: "text",
                    error: function (jqXHR) {
                        checkText("", url);
                        d.reject(jqXHR);
                    },
                    success: function (text) {
                        // Make sure we got some text back.
                        checkText(text, url);
                        $view.registerView(id, text, type, d)
                    }
                });
                return d;
            }
        },
        // Gets an `array` of deferreds from an `object`.
        // This only goes one level deep.
        getDeferreds = function (data) {
            var deferreds = [];

            // pull out deferreds
            if (can.isDeferred(data)) {
                return [data]
            } else {
                for (var prop in data) {
                    if (can.isDeferred(data[prop])) {
                        deferreds.push(data[prop]);
                    }
                }
            }
            return deferreds;
        },
        // Gets the useful part of a resolved deferred.
        // This is for `model`s and `can.ajax` that resolve to an `array`.
        usefulPart = function (resolved) {
            return can.isArray(resolved) && resolved[1] === 'success' ? resolved[0] : resolved
        };



    can.extend($view, {
        register: function (info) {
            this.types["." + info.suffix] = info;



            $view[info.suffix] = function (id, text) {
                if (!text) {
                    // Return a nameless renderer
                    var renderer = function () {
                        return $view.frag(renderer.render.apply(this, arguments));
                    }
                    renderer.render = function () {
                        var renderer = info.renderer(null, id);
                        return renderer.apply(renderer, arguments);
                    }
                    return renderer;
                }

                $view.preload(id, info.renderer(id, text));
                return can.view(id);
            }
        },
        registerScript: function (type, id, src) {
            return "can.view.preload('" + id + "'," + $view.types["." + type].script(id, src) + ");";
        },
        preload: function (id, renderer) {
            $view.cached[id] = new can.Deferred().resolve(function (data, helpers) {
                return renderer.call(data, data, helpers);
            });

            function frag() {
                return $view.frag(renderer.apply(this, arguments));
            }
            // expose the renderer for mustache
            frag.render = renderer;
            return frag;
        }

    });

    return can;
});