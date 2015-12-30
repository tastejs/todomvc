/*jslint eqeq: true, plusplus: true, undef: true, sloppy: true, vars: true, forin: true, nomen: true */
/*!
 * Mobiscroll v2.9.0
 * http://mobiscroll.com
 *
 * Copyright 2010-2013, Acid Media
 * Licensed under the MIT license.
 *
 */
(function ($) {

    function testProps(props) {
        var i;
        for (i in props) {
            if (mod[props[i]] !== undefined) {
                return true;
            }
        }
        return false;
    }

    function testPrefix() {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            p;

        for (p in prefixes) {
            if (testProps([prefixes[p] + 'Transform'])) {
                return '-' + prefixes[p].toLowerCase() + '-';
            }
        }
        return '';
    }

    function getCoord(e, c) {
        var org = e.originalEvent,
            ct = e.changedTouches;
        return ct || (org && org.changedTouches) ? (org ? org.changedTouches[0]['page' + c] : ct[0]['page' + c]) : e['page' + c];
    }

    function init(that, options, args) {
        var ret = that;

        // Init
        if (typeof options === 'object') {
            return that.each(function () {
                if (!this.id) {
                    this.id = 'mobiscroll' + (++id);
                }
                if (instances[this.id]) {
                    instances[this.id].destroy();
                }
                new $.mobiscroll.classes[options.component || 'Scroller'](this, options);
            });
        }

        // Method call
        if (typeof options === 'string') {
            that.each(function () {
                var r,
                    inst = instances[this.id];

                if (inst && inst[options]) {
                    r = inst[options].apply(this, Array.prototype.slice.call(args, 1));
                    if (r !== undefined) {
                        ret = r;
                        return false;
                    }
                }
            });
        }

        return ret;
    }

    function testTouch(e) {
        if (e.type == 'touchstart') {
            touches[e.target] = true;
        } else if (touches[e.target]) {
            delete touches[e.target];
            return false;
        }
        return true;
    }

    var id = +new Date,
        touches = {},
        instances = {},
        extend = $.extend,
        mod = document.createElement('modernizr').style,
        has3d = testProps(['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']),
        prefix = testPrefix(),
        pr = prefix.replace(/^\-/, '').replace(/\-$/, '').replace('moz', 'Moz');

    $.fn.mobiscroll = function (method) {
        extend(this, $.mobiscroll.components);
        return init(this, method, arguments);
    };

    $.mobiscroll = $.mobiscroll || {
        util: {
            prefix: prefix,
            jsPrefix: pr,
            has3d: has3d,
            getCoord: getCoord,
            testTouch: testTouch
        },
        presets: {},
        themes: {},
        i18n: {},
        instances: instances,
        classes: {},
        components: {},
        defaults: {},
        setDefaults: function (o) {
            extend(defaults, o);
        },
        presetShort: function (name, c) {
            this.components[name] = function (s) {
                return init(this, extend(s, { component: c, preset: name }), arguments);
            };
        }
    };

    $.scroller = $.scroller || $.mobiscroll;
    $.fn.scroller = $.fn.scroller || $.fn.mobiscroll;

})(jQuery);