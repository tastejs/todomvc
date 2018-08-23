zuix.controller(function (cp) {
    /** @type {ComponentContext} */
    var componentListView = null;
    /** @type {ZxQuery} */
    var editorFragment = null,
        /** @type {ZxQuery} */
        componentListFragment = null,
        /** @type {ComponentContext} (bundle_item) */
        currentItem;

    cp.create = function () {
        editorFragment = cp.field('fragment-editor');
        componentListFragment = cp.field('fragment-list');
        cp.field('component-list').on('component:ready', function () {
            componentListView = zuix.context(this);
            componentListView.config({
                htmlMode: false
            });
            update();
            showComponents();
        });
        cp.expose({
            update: update,
            show: showComponents,
            serialize: serialize
        });
    };

    // private members

    function update() {
        if (componentListView == null) return;
        var instancesCount = 0;
        var bundle = zuix.bundle().slice(0);
        bundle.sort(function (a, b) {
            return (a.componentId.toString() < b.componentId.toString())
                ? -1 : (a.componentId.toString() > b.componentId.toString())
                    ? 1 : 0;
        });
        componentListView.model({
            itemList: bundle,
            getItem: function (index, item) {
                item.index = index;
                return {
                    // unique identifier for this item
                    itemId: item.componentId,
                    // display as "bundle item"
                    componentId: 'ui/widgets/zuix_editor/bundle_item',
                    // loading options
                    options: {
                        model: item,
                        lazyLoad: true,
                        height: '56px',
                        on: {
                            'item:click': openEditor,
                            'item:update': function () {
                                var ctx = zuix.context(this);
                                // do not count if is zuix-hackbox
                                if (ctx.instanceCount != null && (ctx.isHackBox == null || !ctx.isHackBox()))
                                    instancesCount += ctx.instanceCount();
                                if (index == bundle.length - 1) {
                                    cp.field('total-components').html(zuix.bundle().length);
                                    cp.field('total-instances').html(instancesCount);
                                }
                            }
                        },
                        ready: function () {
                        }
                    }
                }
            }
        });
    }

    function showComponents() {
        closeEditor();
        cp.trigger('page:change', {
            page: 'list'
        });
    }

    function openEditor(e, item) {
        // get the item component context
        var ctx = zuix.context(this);
        currentItem = ctx;
        var tabs = cp.view('.mdl-tabs__tab,.mdl-tabs__panel')
            .hide();
        if (ctx.hasResource('css')) {
            tabs.removeClass('is-active')
                .eq(2, 5).show().addClass('is-active');
            cp.field('css').html(item.css);
            Prism.highlightElement(cp.field('css').get());
        }
        if (ctx.hasResource('html')) {
            tabs.removeClass('is-active')
                .eq(1, 4).show().addClass('is-active');
            var html = item.view
                .replace(/\</g, "&lt;")
                .replace(/\>/g, "&gt;")
                .replace(/ zuix-loaded="true"/g, '');
            cp.field('html').html(html);
            Prism.highlightElement(cp.field('html').get());
        }
        if (ctx.hasResource('js')) {
            tabs.removeClass('is-active')
                .eq(0, 3).show().addClass('is-active');
            cp.field('js').html(serialize(item.controller));
            Prism.highlightElement(cp.field('js').get());
        }
        editorFragment.animateCss('slideInRight', { duration: '0.2s' }).show();
        componentListFragment.animateCss('slideOutLeft', { duration: '0.2s' }, function () {
            this.hide();
        });
        cp.trigger('page:change', {
            page: 'editor',
            context: ctx
        });
    }

    function closeEditor() {
        if (currentItem != null) {
            componentListFragment.show().animateCss('slideInLeft', { duration: '0.2s' });
            editorFragment.animateCss('slideOutRight', { duration: '0.2s' }, function () {
                this.hide();
            });
            currentItem = null;
            cp.trigger('page:change', {
                page: 'list'
            });
        } else {
            componentListFragment.show();
            editorFragment.hide();
        }
    }

    // component item serialization

    var isRegExp = function (re) {
        return Object.prototype.toString.call(re) === '[object RegExp]';
    };

    // FileSaver polyfill:
    //      https://github.com/eligrey/FileSaver.js/blob/master/FileSaver.min.js
    // Generate an internal UID to make the regexp pattern harder to guess.

    var UID                 = Math.floor(Math.random() * 0x10000000000).toString(16);
    var PLACE_HOLDER_REGEXP = new RegExp('"@__(F|R)-' + UID + '-(\\d+)__@"', 'g');

    var IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
    var UNSAFE_CHARS_REGEXP   = /[<>\/\u2028\u2029]/g;

    // Mapping of unsafe HTML and invalid JavaScript line terminator chars to their
    // Unicode char counterparts which are safe to use in JavaScript strings.
    var ESCAPED_CHARS = {
        '<'     : '\\u003C',
        '>'     : '\\u003E',
        '/'     : '\\u002F',
        '\u2028': '\\u2028',
        '\u2029': '\\u2029'
    };

    function escapeUnsafeChars(unsafeChar) {
        return ESCAPED_CHARS[unsafeChar];
    }

    var serialize = function(obj, options) {
        options || (options = {});

        // Backwards-compatability for `space` as the second argument.
        if (typeof options === 'number' || typeof options === 'string') {
            options = {space: options};
        }

        var functions = [];
        var regexps = [];

        // Returns placeholders for functions and regexps (identified by index)
        // which are later replaced by their string representation.
        function replacer(key, value) {
            if (!value) {
                return value;
            }

            var type = typeof value;

            if (type === 'object') {
                if (isRegExp(value)) {
                    return '@__R-' + UID + '-' + (regexps.push(value) - 1) + '__@';
                }

                return value;
            }

            if (type === 'function') {
                return '@__F-' + UID + '-' + (functions.push(value) - 1) + '__@';
            }

            return value;
        }

        var str;

        // Creates a JSON string representation of the value.
        // NOTE: Node 0.12 goes into slow mode with extra JSON.stringify() args.
        if (options.isJSON && !options.space) {
            str = JSON.stringify(obj);
        } else {
            str = JSON.stringify(obj, options.isJSON ? null : replacer, options.space);
        }

        // Protects against `JSON.stringify()` returning `undefined`, by serializing
        // to the literal string: "undefined".
        if (typeof str !== 'string') {
            return String(str);
        }

        // Replace unsafe HTML and invalid JavaScript line terminator chars with
        // their safe Unicode char counterpart. This _must_ happen before the
        // regexps and functions are serialized and added back to the string.
        str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);

        if (functions.length === 0 && regexps.length === 0) {
            return str;
        }

        // Replaces all occurrences of function and regexp placeholders in the JSON
        // string with their string representations. If the original value can not
        // be found, then `undefined` is used.
        return str.replace(PLACE_HOLDER_REGEXP, function (match, type, valueIndex) {
            if (type === 'R') {
                return regexps[valueIndex].toString();
            }

            var fn = functions[valueIndex];
            var serializedFn = fn.toString();

            if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
                throw new TypeError('Serializing native function: ' + fn.name);
            }

            return serializedFn;
        });
    };

});