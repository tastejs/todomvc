/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('mojito-mu', function(Y, NAME) {

    var CACHE = {},
        QUEUE_POOL = {}, // hash URL: contents private functions
        isCached,
        Mustache;


    Mustache = (function() {
        var sRE,
            Renderer = function() {};

        Renderer.prototype = {
            otag: '{{',
            ctag: '}}',
            pragmas: {},
            buffer: [],
            pragmas_implemented: {
                'IMPLICIT-ITERATOR': true
            },
            context: {},


            render: function(template, context, partials, in_recursion) {
                var html;

                if (!in_recursion) {
                    this.context = context;
                    this.buffer = [];
                }

                if (!this.includes('', template)) {
                    if (in_recursion) {
                        return template;
                    } else {
                        this.send(template);
                        return;
                    }
                }

                template = this.render_pragmas(template);
                html = this.render_section(template, context, partials);

                if (in_recursion) {
                    return this.render_tags(html, context, partials,
                        in_recursion);
                }

                this.render_tags(html, context, partials, in_recursion);
            },


            send: function(line) {
                if (line) {
                    this.buffer.push(line);
                }
            },


            render_pragmas: function(template) {
                var my,
                    regex;

                if (!this.includes('%', template)) {
                    return template;
                }

                my = this;
                regex = new RegExp(this.otag + '%([\\w-]+) ?([\\w]+=[\\w]+)?' +
                    this.ctag);

                return template.replace(regex,
                    function(match, pragma, options) {
                        var opts;
                        if (!my.pragmas_implemented[pragma]) {
                            throw ({message:
                                'This implementation of mustache ' +
                                'doesn\'t understand the ' +
                                pragma + '\' pragma'});
                        }

                        my.pragmas[pragma] = {};
                        if (options) {
                            opts = options.split('=');
                            my.pragmas[pragma][opts[0]] = opts[1];
                        }
                        return '';
                    });
            },


            render_partial: function(name, context, partials) {
                name = this.trim(name);
                if (!partials || partials[name] === undefined) {
                    throw ({message: 'unknown_partial \'' + name + '\''});
                }
                if (typeof context[name] !== 'object') {
                    return this.render(partials[name], context, partials, true);
                }
                return this.render(partials[name], context[name], partials,
                    true);
            },


            render_section: function(template, context, partials) {
                var my,
                    regex;

                if (!this.includes('#', template) &&
                        !this.includes('^', template)) {
                    return template;
                }

                my = this;
                regex = new RegExp(this.otag + '(\\^|\\#)\\s*(.+)\\s*' +
                      this.ctag + '\n*([\\s\\S]+?)' +
                      this.otag + '\\/\\s*\\2\\s*' +
                      this.ctag + '\\s*', 'mg');

                return template.replace(regex,
                    function(match, type, name, content) {
                        var value = my.find(name, context);
                        if (type === '^') {
                            if (!value || (my.is_array(value) &&
                                    value.length === 0)) {
                                return my.render(content, context, partials,
                                    true);
                            } else {
                                return '';
                            }
                        } else if (type === '#') { // normal section
                            if (my.is_array(value)) {
                                // Enumerable, Let's loop!
                                return my.map(value,
                                    function(row) {
                                        return my.render(content,
                                            my.create_context(row),
                                            partials, true);
                                    }).join('');
                            } else if (my.is_object(value)) {
                                // Object, Use it as subcontext!
                                return my.render(content,
                                    my.create_context(value), partials, true);
                            } else if (typeof value === 'function') {
                                // higher order section
                                return value.call(context, content,
                                    function(text) {
                                        return my.render(text, context,
                                            partials, true);
                                    });
                            } else if (value) {
                                // boolean section
                                return my.render(content, context, partials,
                                    true);
                            } else {
                                return '';
                            }
                        }
                    });
            },


            render_tags: function(template, context, partials, in_recursion) {
                var my = this,
                    new_regex = function() {
                        return new RegExp(my.otag +
                            '(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?' +
                            my.ctag + '+', 'g');
                    },
                    regex = new_regex(),
                    tag_replace_callback = function(match, operator, name) {
                        switch (operator) {
                        case '!': // ignore comments
                            return '';
                        case '=': // set new delimiters, rebuild replace regexp
                            my.set_delimiters(name);
                            regex = new_regex();
                            return '';
                        case '>': // render partial
                            return my.render_partial(name, context, partials);
                        case '{': // the triple mustache is unescaped
                            return my.find(name, context);
                        default: // escape the value
                            return my.escape(my.find(name, context));
                        }
                    },
                    lines = template.split('\n'),
                    i;

                for (i = 0; i < lines.length; i += 1) {
                    lines[i] = lines[i].replace(regex, tag_replace_callback,
                        this);
                    if (!in_recursion) {
                        this.send(lines[i]);
                    }
                }

                if (in_recursion) {
                    return lines.join('\n');
                }
            },


            set_delimiters: function(delimiters) {
                var dels = delimiters.split(' ');
                this.otag = this.escape_regex(dels[0]);
                this.ctag = this.escape_regex(dels[1]);
            },


            escape_regex: function(text) {
                // thank you Simon Willison
                if (!sRE) {
                    var specials = [
                        '/', '.', '*', '+', '?', '|',
                        '(', ')', '[', ']', '{', '}', '\\'
                    ];
                    sRE = new RegExp(
                        '(\\' + specials.join('|\\') + ')',
                        'g'
                    );
                }
                return text.replace(sRE, '\\$1');
            },


            find: function(name, context) {
                var value;

                // TODO: don't assign to a parameter.
                name = this.trim(name);

                // TODO: make this a utility function.
                // Checks whether a value is thruthy or false or 0.
                function is_kinda_truthy(bool) {
                    return bool === false || bool === 0 || bool;
                }

                if (is_kinda_truthy(context[name])) {
                    value = context[name];
                } else if (is_kinda_truthy(this.context[name])) {
                    value = this.context[name];
                }

                if (typeof value === 'function') {
                    return value.apply(context);
                }
                if (value !== undefined) {
                    return value;
                }
                return '';
            },


            includes: function(needle, haystack) {
                return haystack.indexOf(this.otag + needle) !== -1;
            },


            escape: function(s) {
                s = String(s === null ? '' : s);
                return s.replace(/&(?!\w+;)|["'<>\\]/g,
                    function(s) {
                        switch (s) {
                        case '&': return '&amp;';
                        case '\\': return '\\\\';
                        case '"': return '&quot;';
                        case '\'': return '&#39;';
                        case '<': return '&lt;';
                        case '>': return '&gt;';
                        default: return s;
                        }
                    });
            },


            create_context: function(_context) {
                var iterator,
                    ctx;
                if (this.is_object(_context)) {
                    return _context;
                } else {
                    iterator = '.';
                    if (this.pragmas['IMPLICIT-ITERATOR']) {
                        iterator = this.pragmas['IMPLICIT-ITERATOR'].iterator;
                    }
                    ctx = {};
                    ctx[iterator] = _context;
                    return ctx;
                }
            },


            is_object: function(a) {
                return a && typeof a === 'object';
            },


            is_array: function(a) {
                return Object.prototype.toString.call(a) === '[object Array]';
            },


            trim: function(s) {
                return s.replace(/^\s*|\s*$/g, '');
            },


            map: function(array, fn) {
                var r, l, i;
                if (typeof array.map === 'function') {
                    return array.map(fn);
                } else {
                    r = [];
                    l = array.length;
                    for (i = 0; i < l; i += 1) {
                        r.push(fn(array[i]));
                    }
                    return r;
                }
            }
        };  // End of Renderer.prototype definition.

        return {
            name: 'mustache.js',
            version: '0.3.1-dev',

            to_html: function(template, view, partials, send_fun) {
                var renderer = new Renderer();
                if (send_fun) {
                    renderer.send = send_fun;
                }
                renderer.render(template, view, partials);
                if (!send_fun) {
                    return renderer.buffer.join('\n');
                }
            }
        };
    }());   // End of Mustache definition.


    /**
     * Class text.
     * @class MuAdapterClient
     * @private
     */
    function MuAdapter() {}


    /**
     * Renders the mustache template using the data provided.
     * @param {object} data The data to render.
     * @param {string} mojitType The name of the mojit type.
     * @param {string} tmpl The name of the template to render.
     * @param {object} adapter The output adapter to use.
     * @param {object} meta Optional metadata.
     * @param {boolean} more Whether there will be more content later.
     */
    MuAdapter.prototype.render = function(data,
            mojitType, tmpl, adapter, meta, more) {

        var handler,
            useCompiled = true,
            handlerArgs,
            ns = mojitType.replace(/\./g, '_');

        handler = function(id, obj) {
            var i,
                iC,
                queue = [],
                myAdapter,
                myMore,
                myData,
                myMeta;

            CACHE[tmpl] = obj.responseText;

            queue = QUEUE_POOL[tmpl].slice(0);
            delete QUEUE_POOL[tmpl];

            for (i = 0, iC = queue.length; i < iC; i += 1) {
                myAdapter = queue[i].adapter;
                myMore = queue[i].more;
                myData = queue[i].data;
                myMeta = queue[i].meta;

                if (myMore) {
                    myAdapter.flush(
                        Mustache.to_html(obj.responseText, myData),
                        myMeta
                    );
                } else {
                    myAdapter.done(
                        Mustache.to_html(obj.responseText, myData),
                        myMeta
                    );
                }
            }
        };

        if (meta && meta.view && meta.view['content-path']) {
            // in this case, the view name doesn't necessarily relate to the
            // contents
            useCompiled = false;
        }

        handlerArgs = {
            data: data,
            adapter: adapter,
            meta: meta,
            more: more
        };

        if (!QUEUE_POOL[tmpl]) {
            QUEUE_POOL[tmpl] = [handlerArgs];
        } else {
            QUEUE_POOL[tmpl].push(handlerArgs);
            return;
        }

        // Do we have a compiled template?
        if (useCompiled && isCached(meta, ns)) {
            // Log we are using a compiled view
            Y.log('Using a compiled view for file "' + tmpl + '"', 'mojito',
                NAME);
            // If we do just hand it to the handler.
            handler(null, {
                responseText:
                    YUI._mojito._cache.compiled[ns].views[meta.view.name]
            });
            // We don't need to do an IO call now so return.
            return;
        }

        // Now we do some bad stuff for iOS
        if (typeof window !== 'undefined') {
            tmpl = Y.mojito.util.iOSUrl(tmpl);
        }

        /*
         * YUI has a bug that returns failure on success with file://.
         * calls.
         */
        if (!CACHE[tmpl]) {
            Y.io(tmpl, {
                on: {
                    complete: handler
                }
            });
        } else {
            handler(null, {responseText: CACHE[tmpl]});
        }
    };


    // TODO: refactor this into app/autoload/view-renderer.common.js?
    // (so that each view engine doesn't need to implement it itself)
    isCached = function(meta, ns) {

        // TODO: would a simple try/catch on the final one here be faster? It's
        // either there (and no error) or not (error) and we return accordingly.
        // try {
        //     return YUI._mojito._cache.compiled[ns].views[meta.view.name] !==
        //         'undefined';
        // } catch {
        //     return false;
        // }

        // wow, what a checklist!
        return meta &&
            meta.view &&
            meta.view.name &&
            YUI._mojito._cache &&
            YUI._mojito._cache.compiled &&
            YUI._mojito._cache.compiled[ns] &&
            YUI._mojito._cache.compiled[ns].views &&
            YUI._mojito._cache.compiled[ns].views[meta.view.name];
    };

    Y.namespace('mojito.addons.viewEngines').mu = MuAdapter;

}, '0.1.0', {requires: [
    'mojito-util',
    'io-base'
]});
