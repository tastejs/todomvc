"use strict";
function require( path ){ return $node[ path ] };
"use strict"

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var globalThis = globalThis || ( typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this )
var $ = ( typeof module === 'object' ) ? ( module['export'+'s'] = globalThis ) : globalThis
$.$$ = $

;

var $node = $node || {}
void function( module ) { var exports = module.exports = this; function require( id ) { return $node[ id.replace( /^.\// , "../" ) ] }; 
;
"use strict";
Error.stackTraceLimit = 50;
var $;
(function ($) {
})($ || ($ = {}));
module.exports = $;
//mam.ts
;

$node[ "../mam.ts" ] = $node[ "../mam.ts" ] = module.exports }.call( {} , {} )
;
"use strict";
var $;
(function ($) {
})($ || ($ = {}));
//mol/dom/context/context.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_dom_context = self;
})($ || ($ = {}));
//mol/dom/context/context.web.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_report_bugsnag = '';
    globalThis.onerror = function (msg, url, line, col, err) {
        const doc = $mol_dom_context.document;
        const report = {
            apiKey: $.$mol_report_bugsnag,
            payloadVersion: 5,
            notifier: {
                name: '$mol_report_bugsnag',
                version: '1',
                url: '$mol_report_bugsnag',
            },
            events: [{
                    device: {
                        locale: navigator.language,
                        userAgent: navigator.userAgent,
                        time: new Date().toISOString(),
                    },
                    context: doc?.activeElement?.id,
                    exceptions: [{
                            message: err?.message || err || msg,
                            errorClass: err?.constructor.name,
                            stacktrace: [{
                                    columnNumber: col,
                                    file: url,
                                    lineNumber: line,
                                    method: '',
                                }],
                        }],
                    metaData: {
                        stack: err && err.stack,
                    },
                    request: {
                        url: doc?.location.href,
                        referer: doc?.referrer,
                    },
                }],
        };
        if (location.hostname === 'localhost') {
            console.debug('Error report', report);
        }
        else {
            fetch('https://notify.bugsnag.com/', {
                method: 'post',
                body: JSON.stringify(report),
            }).catch(() => null);
        }
    };
    globalThis.onunhandledrejection = function (event) {
        globalThis.onerror('Unhandled Rejection', '', 0, 0, event.reason);
    };
    const error = console.error;
    console.error = function (...args) {
        globalThis.onerror('Logged Error', '', 0, 0, arguments[0]);
        error.apply(console, args);
    };
})($ || ($ = {}));
//mol/report/bugsnag/bugsnag.ts
;
"use strict";
var $;
(function ($) {
    $mol_report_bugsnag = '18acf016ed2a2a4cc4445daa9dd2dd3c';
})($ || ($ = {}));
//hyoo/hyoo.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_ambient_ref = Symbol('$mol_ambient_ref');
    function $mol_ambient(overrides) {
        return Object.setPrototypeOf(overrides, this || $);
    }
    $.$mol_ambient = $mol_ambient;
})($ || ($ = {}));
//mol/ambient/ambient.ts
;
"use strict";
var $;
(function ($) {
    const instances = new WeakSet();
    function $mol_delegate(proto, target) {
        const proxy = new Proxy(proto, {
            get: (_, field) => {
                const obj = target();
                let val = Reflect.get(obj, field);
                if (typeof val === 'function') {
                    val = val.bind(obj);
                }
                return val;
            },
            has: (_, field) => Reflect.has(target(), field),
            set: (_, field, value) => Reflect.set(target(), field, value),
            getOwnPropertyDescriptor: (_, field) => Reflect.getOwnPropertyDescriptor(target(), field),
            ownKeys: () => Reflect.ownKeys(target()),
            getPrototypeOf: () => Reflect.getPrototypeOf(target()),
            setPrototypeOf: (_, donor) => Reflect.setPrototypeOf(target(), donor),
            isExtensible: () => Reflect.isExtensible(target()),
            preventExtensions: () => Reflect.preventExtensions(target()),
            apply: (_, self, args) => Reflect.apply(target(), self, args),
            construct: (_, args, retarget) => Reflect.construct(target(), args, retarget),
            defineProperty: (_, field, descr) => Reflect.defineProperty(target(), field, descr),
            deleteProperty: (_, field) => Reflect.deleteProperty(target(), field),
        });
        instances.add(proxy);
        return proxy;
    }
    $.$mol_delegate = $mol_delegate;
    Reflect.defineProperty($mol_delegate, Symbol.hasInstance, {
        value: (obj) => instances.has(obj),
    });
})($ || ($ = {}));
//mol/delegate/delegate.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_owning_map = new WeakMap();
    function $mol_owning_allow(having) {
        try {
            if (!having)
                return false;
            if (typeof having !== 'object')
                return false;
            if (having instanceof $mol_delegate)
                return false;
            if (typeof having['destructor'] !== 'function')
                return false;
            return true;
        }
        catch {
            return false;
        }
    }
    $.$mol_owning_allow = $mol_owning_allow;
    function $mol_owning_get(having, Owner) {
        if (!$mol_owning_allow(having))
            return null;
        while (true) {
            const owner = $.$mol_owning_map.get(having);
            if (!owner)
                return owner;
            if (!Owner)
                return owner;
            if (owner instanceof Owner)
                return owner;
            having = owner;
        }
    }
    $.$mol_owning_get = $mol_owning_get;
    function $mol_owning_check(owner, having) {
        if (!$mol_owning_allow(having))
            return false;
        if ($.$mol_owning_map.get(having) !== owner)
            return false;
        return true;
    }
    $.$mol_owning_check = $mol_owning_check;
    function $mol_owning_catch(owner, having) {
        if (!$mol_owning_allow(having))
            return false;
        if ($.$mol_owning_map.get(having))
            return false;
        $.$mol_owning_map.set(having, owner);
        return true;
    }
    $.$mol_owning_catch = $mol_owning_catch;
})($ || ($ = {}));
//mol/owning/owning.ts
;
"use strict";
var $;
(function ($) {
    function $mol_fail(error) {
        throw error;
    }
    $.$mol_fail = $mol_fail;
})($ || ($ = {}));
//mol/fail/fail.ts
;
"use strict";
var $;
(function ($) {
    function $mol_fail_hidden(error) {
        throw error;
    }
    $.$mol_fail_hidden = $mol_fail_hidden;
})($ || ($ = {}));
//mol/fail/hidden/hidden.ts
;
"use strict";
//mol/type/writable/writable.ts
;
"use strict";
var $;
(function ($) {
    class $mol_object2 {
        static $ = $;
        [$mol_ambient_ref] = null;
        get $() {
            if (this[$mol_ambient_ref])
                return this[$mol_ambient_ref];
            const owner = $mol_owning_get(this);
            return this[$mol_ambient_ref] = owner?.$ || $mol_object2.$;
        }
        set $(next) {
            if (this[$mol_ambient_ref])
                $mol_fail_hidden(new Error('Context already defined'));
            this[$mol_ambient_ref] = next;
        }
        static create(init) {
            const obj = new this;
            if (init)
                init(obj);
            return obj;
        }
        static [Symbol.toPrimitive]() {
            return this.toString();
        }
        static toString() {
            if (Symbol.toStringTag in this)
                return this[Symbol.toStringTag];
            return this.name;
        }
        destructor() { }
        toString() {
            return this[Symbol.toStringTag] || this.constructor.name + '()';
        }
        toJSON() {
            return this.toString();
        }
    }
    $.$mol_object2 = $mol_object2;
})($ || ($ = {}));
//mol/object2/object2.ts
;
"use strict";
var $;
(function ($) {
    class $mol_after_tick extends $mol_object2 {
        task;
        promise;
        cancelled = false;
        constructor(task) {
            super();
            this.task = task;
            this.promise = Promise.resolve().then(() => {
                if (this.cancelled)
                    return;
                task();
            });
        }
        destructor() {
            this.cancelled = true;
        }
    }
    $.$mol_after_tick = $mol_after_tick;
})($ || ($ = {}));
//mol/after/tick/tick.ts
;
"use strict";
var $;
(function ($) {
    let all = [];
    let el = null;
    let timer = null;
    function $mol_style_attach(id, text) {
        all.push(`/* ${id} */\n\n${text}`);
        if (timer)
            return el;
        const doc = $mol_dom_context.document;
        if (!doc)
            return null;
        el = doc.createElement('style');
        el.id = `$mol_style_attach`;
        doc.head.appendChild(el);
        timer = new $mol_after_tick(() => {
            el.innerHTML = '\n' + all.join('\n\n');
            all = [];
            el = null;
            timer = null;
        });
        return el;
    }
    $.$mol_style_attach = $mol_style_attach;
})($ || ($ = {}));
//mol/style/attach/attach.ts
;
"use strict";
var $;
(function ($) {
    class $mol_decor {
        value;
        constructor(value) {
            this.value = value;
        }
        prefix() { return ''; }
        valueOf() { return this.value; }
        postfix() { return ''; }
        toString() {
            return `${this.prefix()}${this.valueOf()}${this.postfix()}`;
        }
    }
    $.$mol_decor = $mol_decor;
})($ || ($ = {}));
//mol/decor/decor.ts
;
"use strict";
var $;
(function ($) {
    class $mol_style_unit extends $mol_decor {
        literal;
        constructor(value, literal) {
            super(value);
            this.literal = literal;
        }
        postfix() {
            return this.literal;
        }
        static per(value) { return new $mol_style_unit(value, '%'); }
        static px(value) { return new $mol_style_unit(value, 'px'); }
        static mm(value) { return new $mol_style_unit(value, 'mm'); }
        static cm(value) { return new $mol_style_unit(value, 'cm'); }
        static Q(value) { return new $mol_style_unit(value, 'Q'); }
        static in(value) { return new $mol_style_unit(value, 'in'); }
        static pc(value) { return new $mol_style_unit(value, 'pc'); }
        static pt(value) { return new $mol_style_unit(value, 'pt'); }
        static cap(value) { return new $mol_style_unit(value, 'cap'); }
        static ch(value) { return new $mol_style_unit(value, 'ch'); }
        static em(value) { return new $mol_style_unit(value, 'em'); }
        static rem(value) { return new $mol_style_unit(value, 'rem'); }
        static ex(value) { return new $mol_style_unit(value, 'ex'); }
        static ic(value) { return new $mol_style_unit(value, 'ic'); }
        static lh(value) { return new $mol_style_unit(value, 'lh'); }
        static rlh(value) { return new $mol_style_unit(value, 'rlh'); }
        static vh(value) { return new $mol_style_unit(value, 'vh'); }
        static vw(value) { return new $mol_style_unit(value, 'vw'); }
        static vi(value) { return new $mol_style_unit(value, 'vi'); }
        static vb(value) { return new $mol_style_unit(value, 'vb'); }
        static vmin(value) { return new $mol_style_unit(value, 'vmin'); }
        static vmax(value) { return new $mol_style_unit(value, 'vmax'); }
        static deg(value) { return new $mol_style_unit(value, 'deg'); }
        static rad(value) { return new $mol_style_unit(value, 'rad'); }
        static grad(value) { return new $mol_style_unit(value, 'grad'); }
        static turn(value) { return new $mol_style_unit(value, 'turn'); }
        static s(value) { return new $mol_style_unit(value, 's'); }
        static ms(value) { return new $mol_style_unit(value, 'ms'); }
    }
    $.$mol_style_unit = $mol_style_unit;
})($ || ($ = {}));
//mol/style/unit/unit.ts
;
"use strict";
var $;
(function ($) {
    const { per } = $mol_style_unit;
    class $mol_style_func extends $mol_decor {
        name;
        constructor(name, value) {
            super(value);
            this.name = name;
        }
        prefix() { return this.name + '('; }
        postfix() { return ')'; }
        static calc(value) {
            return new $mol_style_func('calc', value);
        }
        static vary(name) {
            return new $mol_style_func('var', name);
        }
        static url(href) {
            return new $mol_style_func('url', JSON.stringify(href));
        }
        static hsla(hue, saturation, lightness, alpha) {
            return new $mol_style_func('hsla', [hue, per(saturation), per(lightness), alpha]);
        }
        static clamp(min, mid, max) {
            return new $mol_style_func('clamp', [min, mid, max]);
        }
        static rgba(red, green, blue, alpha) {
            return new $mol_style_func('rgba', [red, green, blue, alpha]);
        }
    }
    $.$mol_style_func = $mol_style_func;
})($ || ($ = {}));
//mol/style/func/func.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("mol/theme/theme.css", "[mol_theme] {\n\tbackground-color: var(--mol_theme_back);\n\tcolor: var(--mol_theme_text);\n\tfill: var(--mol_theme_text);\n}\n\n[mol_theme=\"$mol_theme_light\"] , :root {\n\t--mol_theme_back: hsl( 210 , 50% , 99% );\n\t--mol_theme_hover: rgba( 0 , 0 , 0 , .05 );\n\t--mol_theme_current: hsl( 210 , 100% , 80% );\n\t--mol_theme_text: hsl( 0 , 0% , 0% );\n\t--mol_theme_control: hsla( 210 , 60% , 35% , 1 );\n\t--mol_theme_shade: rgba( 0 , 0 , 0 , .5 );\n\t--mol_theme_line: rgba( 220 , 220 , 220 , 1 );\n\t--mol_theme_focus: hsl( 290 , 70% , 50% );\n\t--mol_theme_field: white;\n\t--mol_theme_image: none;\n}\n\n[mol_theme=\"$mol_theme_dark\"] {\n\t--mol_theme_back: hsl( 210 , 50% , 10% );\n\t--mol_theme_hover: rgba( 255 , 255 , 255 , .05 );\n\t--mol_theme_current: hsl( 210 , 100% , 30% );\n\t--mol_theme_text: hsl( 0 , 0% , 80% );\n\t--mol_theme_control: hsla( 210 , 60% , 70% , 1 );\n\t--mol_theme_shade: rgba( 255 , 255 , 255 , .5 );\n\t--mol_theme_line: rgba( 70 , 70 , 70 , 1 );\n\t--mol_theme_focus: hsl( 60 , 100% , 70% );\n\t--mol_theme_field: black;\n\t--mol_theme_image: invert(1) hue-rotate(180deg);\n}\n\n[mol_theme=\"$mol_theme_base\"] {\n\t--mol_theme_back: hsla( 210 , 60% , 35% , 1 );\n\t--mol_theme_hover: hsla( 210 , 60% , 20% , 1 );\n\t--mol_theme_current: hsl( 210 , 100% , 20% );\n\t--mol_theme_text: white;\n\t--mol_theme_line: white;\n\t--mol_theme_control: white;\n}\n\n[mol_theme=\"$mol_theme_accent\"] {\n\t--mol_theme_back: hsl( 15 , 60% , 50% );\n\t--mol_theme_hover: hsl( 15 , 60% , 40% );\n\t--mol_theme_text: white;\n\t--mol_theme_line: rgba( 50 , 50 , 50 , 1 );\n\t--mol_theme_control: white;\n\t--mol_theme_focus: black;\n}\n\n[mol_theme=\"$mol_theme_accent\"] [mol_theme=\"$mol_theme_accent\"] {\n\t--mol_theme_back: black;\n\t--mol_theme_text: white;\n}\n");
})($ || ($ = {}));
//mol/theme/-css/theme.css.ts
;
"use strict";
var $;
(function ($) {
    const { vary } = $mol_style_func;
    $.$mol_theme = {
        back: vary('--mol_theme_back'),
        hover: vary('--mol_theme_hover'),
        current: vary('--mol_theme_current'),
        text: vary('--mol_theme_text'),
        control: vary('--mol_theme_control'),
        shade: vary('--mol_theme_shade'),
        line: vary('--mol_theme_line'),
        focus: vary('--mol_theme_focus'),
        field: vary('--mol_theme_field'),
        image: vary('--mol_theme_image'),
    };
})($ || ($ = {}));
//mol/theme/theme.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("mol/skin/skin.css", ":root {\n\t--mol_skin_font: 16px/24px Segoe UI, sans-serif;\n\t/* --mol_skin_font_monospace: Monaco, monospace; */\n\t--mol_skin_font_monospace: monospace;\n}\n\n/* Deprecated, use mol_theme instead */\n:root {\n\n\t--mol_skin_outline: 0 0 0 1px var(--mol_theme_line);\n\t\n\t--mol_skin_base: #3a8ccb;\n\t--mol_skin_base_text: white;\n\t\n\t--mol_skin_current: var(--mol_skin_base);\n\t--mol_skin_current_text: white;\n\t--mol_skin_current_line: #1471b8;\n\t\n\t--mol_skin_button: var(--mol_skin_card);\n\t--mol_skin_hover: rgba( 0 , 0 , 0 , .05 );\n\t\n\t--mol_skin_round: 0px;\n\t\n\t--mol_skin_focus_line: rgba( 0 , 0 , 0 , .2 );\n\t--mol_skin_focus_outline: 0 0 0 1px var(--mol_skin_focus_line);\n\t\n\t--mol_skin_float: var(--mol_skin_focus_outline);\n\n\t--mol_skin_passive: #eee;\n\t--mol_skin_passive_text: rgba( 0 , 0 , 0 , .5 );\n\t\n\t--mol_skin_light: #fcfcfc;\n\t--mol_skin_light_line: rgba( 230 , 230 , 230 , .75 );\n\t--mol_skin_light_text: rgba( 0 , 0 , 0 , .9 );\n\t--mol_skin_light_hover: #f7f7f7;\n\t--mol_skin_light_outline: 0 0 0 1px var(--mol_theme_line);\n\n\t--mol_skin_card: var(--mol_theme_back);\n\t--mol_skin_card_text: var(--mol_theme_text);\n\t\n\t--mol_skin_accent: #dd0e3e;\n\t--mol_skin_accent_text: white;\n\t--mol_skin_accent_hover: #c50d37;\n\n\t--mol_skin_warn: rgba( 255 , 50 , 50 , 0.75 );\n\t--mol_skin_warn_text: white;\n\t--mol_skin_warn_hover: color( var(--mol_skin_warn) lightness(-5%) );\n\n\t--mol_skin_good: #96DAA9;\n\t--mol_skin_good_text: black;\n\n\t--mol_skin_bad: #CC5252;\n\t--mol_skin_bad_text: white;\n}\n");
})($ || ($ = {}));
//mol/skin/-css/skin.css.ts
;
"use strict";
var $;
(function ($_1) {
    let $$;
    (function ($$) {
        let $;
    })($$ = $_1.$$ || ($_1.$$ = {}));
    $_1.$mol_object_field = Symbol('$mol_object_field');
    class $mol_object extends $mol_object2 {
        static make(config) {
            return super.create(obj => {
                for (let key in config)
                    obj[key] = config[key];
            });
        }
    }
    $_1.$mol_object = $mol_object;
})($ || ($ = {}));
//mol/object/object.ts
;
"use strict";
var $;
(function ($) {
    let $mol_wire_cursor;
    (function ($mol_wire_cursor) {
        $mol_wire_cursor[$mol_wire_cursor["stale"] = new (class stale extends Number {
        })(-1)] = "stale";
        $mol_wire_cursor[$mol_wire_cursor["doubt"] = new (class doubt extends Number {
        })(-2)] = "doubt";
        $mol_wire_cursor[$mol_wire_cursor["fresh"] = new (class fresh extends Number {
        })(-3)] = "fresh";
        $mol_wire_cursor[$mol_wire_cursor["final"] = new (class solid extends Number {
        })(-4)] = "final";
    })($mol_wire_cursor = $.$mol_wire_cursor || ($.$mol_wire_cursor = {}));
})($ || ($ = {}));
//mol/wire/cursor/cursor.ts
;
"use strict";
var $;
(function ($) {
    class $mol_wire_pub extends Array {
        static get [Symbol.species]() {
            return Array;
        }
        sub_from = 0;
        get sub_list() {
            const res = [];
            for (let i = this.sub_from; i < this.length; i += 2) {
                res.push(this[i]);
            }
            return res;
        }
        get sub_empty() {
            return this.sub_from === this.length;
        }
        sub_on(sub, pub_pos) {
            const pos = this.length;
            this.push(sub, pub_pos);
            return pos;
        }
        sub_off(sub_pos) {
            if (!(sub_pos < this.length)) {
                $mol_fail(new Error(`Wrong pos ${sub_pos}`));
            }
            const end = this.length - 2;
            if (sub_pos !== end) {
                this.peer_move(end, sub_pos);
            }
            this.pop();
            this.pop();
            if (this.length === this.sub_from)
                this.reap();
        }
        reap() { }
        track_promote() {
            $mol_wire_auto?.track_next(this);
        }
        up() { }
        down() { }
        emit() {
            for (let i = this.sub_from; i < this.length; i += 2) {
                ;
                this[i].stale();
            }
        }
        stale() {
            if (!this.affect($mol_wire_cursor.stale))
                return false;
            while ($mol_wire_affected.length) {
                const next = $mol_wire_affected.pop();
                next.affect($mol_wire_cursor.doubt);
            }
            return true;
        }
        affect(quant) {
            for (let i = this.sub_from; i < this.length; i += 2) {
                const sub = this[i];
                $mol_wire_affected.push(sub);
            }
            return true;
        }
        peer_move(from_pos, to_pos) {
            const peer = this[from_pos];
            const self_pos = this[from_pos + 1];
            this[to_pos] = peer;
            this[to_pos + 1] = self_pos;
            peer.peer_repos(self_pos, to_pos);
        }
        peer_repos(peer_pos, self_pos) {
            this[peer_pos + 1] = self_pos;
        }
    }
    $.$mol_wire_pub = $mol_wire_pub;
})($ || ($ = {}));
//mol/wire/pub/pub.ts
;
"use strict";
//mol/wire/sub/sub.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_wire_auto = null;
    $.$mol_wire_affected = [];
})($ || ($ = {}));
//mol/wire/wire.ts
;
"use strict";
var $;
(function ($) {
    $['devtoolsFormatters'] = $['devtoolsFormatters'] || [];
    function $mol_dev_format_register(config) {
        $['devtoolsFormatters'].push(config);
    }
    $.$mol_dev_format_register = $mol_dev_format_register;
    $.$mol_dev_format_head = Symbol('$mol_dev_format_head');
    $.$mol_dev_format_body = Symbol('$mol_dev_format_body');
    $mol_dev_format_register({
        header: (val, config = false) => {
            if (config)
                return null;
            if (!val)
                return null;
            if ($.$mol_dev_format_head in val) {
                return val[$.$mol_dev_format_head]();
            }
            if (typeof val === 'function') {
                return $mol_dev_format_native(val);
            }
            return null;
        },
        hasBody: val => val[$.$mol_dev_format_body],
        body: val => val[$.$mol_dev_format_body](),
    });
    function $mol_dev_format_native(obj) {
        if (typeof obj === 'undefined')
            return $.$mol_dev_format_shade('undefined');
        if (typeof obj !== 'object' && typeof obj !== 'function')
            return obj;
        return [
            'object',
            {
                object: obj,
                config: true,
            },
        ];
    }
    $.$mol_dev_format_native = $mol_dev_format_native;
    function $mol_dev_format_auto(obj) {
        if (obj == null)
            return $.$mol_dev_format_shade(String(obj));
        if (typeof obj === 'object' && $.$mol_dev_format_head in obj) {
            return obj[$.$mol_dev_format_head]();
        }
        return [
            'object',
            {
                object: obj,
                config: false,
            },
        ];
    }
    $.$mol_dev_format_auto = $mol_dev_format_auto;
    function $mol_dev_format_element(element, style, ...content) {
        const styles = [];
        for (let key in style)
            styles.push(`${key} : ${style[key]}`);
        return [
            element,
            {
                style: styles.join(' ; '),
            },
            ...content,
        ];
    }
    $.$mol_dev_format_element = $mol_dev_format_element;
    function $mol_dev_format_span(style, ...content) {
        return $mol_dev_format_element('span', {
            'vertical-align': '8%',
            ...style,
        }, ...content);
    }
    $.$mol_dev_format_span = $mol_dev_format_span;
    $.$mol_dev_format_div = $mol_dev_format_element.bind(null, 'div');
    $.$mol_dev_format_ol = $mol_dev_format_element.bind(null, 'ol');
    $.$mol_dev_format_li = $mol_dev_format_element.bind(null, 'li');
    $.$mol_dev_format_table = $mol_dev_format_element.bind(null, 'table');
    $.$mol_dev_format_tr = $mol_dev_format_element.bind(null, 'tr');
    $.$mol_dev_format_td = $mol_dev_format_element.bind(null, 'td');
    $.$mol_dev_format_accent = $mol_dev_format_span.bind(null, {
        'color': 'magenta',
    });
    $.$mol_dev_format_strong = $mol_dev_format_span.bind(null, {
        'font-weight': 'bold',
    });
    $.$mol_dev_format_string = $mol_dev_format_span.bind(null, {
        'color': 'green',
    });
    $.$mol_dev_format_shade = $mol_dev_format_span.bind(null, {
        'color': 'gray',
    });
    $.$mol_dev_format_indent = $.$mol_dev_format_div.bind(null, {
        'margin-left': '13px'
    });
})($ || ($ = {}));
//mol/dev/format/format.ts
;
"use strict";
var $;
(function ($) {
    class $mol_wire_pub_sub extends $mol_wire_pub {
        pub_from = 0;
        cursor = $mol_wire_cursor.stale;
        get pub_list() {
            const res = [];
            for (let i = this.pub_from; i < this.sub_from; i += 2) {
                res.push(this[i]);
            }
            return res;
        }
        track_on() {
            this.cursor = this.pub_from;
            const sub = $mol_wire_auto;
            $mol_wire_auto = this;
            return sub;
        }
        track_promote() {
            if (this.cursor >= this.pub_from) {
                $mol_fail(new Error('Circular subscription'));
            }
            super.track_promote();
        }
        track_next(pub) {
            if (this.cursor < 0)
                $mol_fail(new Error('Promo to non begun sub'));
            if (this.cursor < this.sub_from) {
                const next = this[this.cursor];
                if (pub === undefined)
                    return next ?? null;
                if (next === pub) {
                    this.cursor += 2;
                    return next;
                }
                next?.sub_off(this[this.cursor + 1]);
            }
            else {
                if (pub === undefined)
                    return null;
                if (this.sub_from < this.length) {
                    this.peer_move(this.sub_from, this.length);
                }
                this.sub_from += 2;
            }
            this[this.cursor] = pub;
            this[this.cursor + 1] = pub.sub_on(this, this.cursor);
            this.cursor += 2;
            return pub;
        }
        track_off(sub) {
            $mol_wire_auto = sub;
            if (this.cursor < 0)
                $mol_fail(new Error('End of non begun sub'));
            this.forget(this.cursor);
            for (let cursor = this.pub_from; cursor < this.sub_from; cursor += 2) {
                const pub = this[cursor];
                pub.up();
            }
            this.cursor = $mol_wire_cursor.fresh;
        }
        pub_off(sub_pos) {
            this[sub_pos] = undefined;
            this[sub_pos + 1] = undefined;
        }
        destructor() {
            for (let cursor = this.length - 2; cursor >= this.sub_from; cursor -= 2) {
                const sub = this[cursor];
                const pos = this[cursor + 1];
                sub.pub_off(pos);
                this.pop();
                this.pop();
            }
            this.forget();
            this.cursor = $mol_wire_cursor.final;
        }
        forget(from = this.pub_from) {
            let tail = 0;
            for (let cursor = from; cursor < this.sub_from; cursor += 2) {
                const pub = this[cursor];
                pub?.sub_off(this[cursor + 1]);
                if (this.sub_from < this.length) {
                    this.peer_move(this.length - 2, cursor);
                    this.pop();
                    this.pop();
                }
                else {
                    ++tail;
                }
            }
            for (; tail; --tail) {
                this.pop();
                this.pop();
            }
            this.sub_from = from;
        }
        affect(quant) {
            if (this.cursor >= quant)
                return false;
            this.cursor = quant;
            return super.affect(quant);
        }
        [$mol_dev_format_head]() {
            return $mol_dev_format_native(this);
        }
        get derived() {
            return this.sub_from === this.pub_from;
        }
    }
    $.$mol_wire_pub_sub = $mol_wire_pub_sub;
})($ || ($ = {}));
//mol/wire/pub/sub/sub.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_compare_deep_cache = new WeakMap();
    function $mol_compare_deep(left, right) {
        if (Object.is(left, right))
            return true;
        if (left === null)
            return false;
        if (right === null)
            return false;
        if (typeof left !== 'object')
            return false;
        if (typeof right !== 'object')
            return false;
        const left_proto = Reflect.getPrototypeOf(left);
        const right_proto = Reflect.getPrototypeOf(right);
        if (left_proto !== right_proto)
            return false;
        if (left instanceof Boolean)
            return Object.is(left.valueOf(), right['valueOf']());
        if (left instanceof Number)
            return Object.is(left.valueOf(), right['valueOf']());
        if (left instanceof String)
            return Object.is(left.valueOf(), right['valueOf']());
        if (left instanceof Date)
            return Object.is(left.valueOf(), right['valueOf']());
        if (left instanceof RegExp)
            return left.source === right['source'] && left.flags === right['flags'];
        let left_cache = $.$mol_compare_deep_cache.get(left);
        if (left_cache) {
            const right_cache = left_cache.get(right);
            if (typeof right_cache === 'boolean')
                return right_cache;
        }
        else {
            left_cache = new WeakMap([[right, true]]);
            $.$mol_compare_deep_cache.set(left, left_cache);
        }
        let result;
        try {
            if (left_proto && !Reflect.getPrototypeOf(left_proto))
                result = compare_pojo(left, right);
            else if (Array.isArray(left))
                result = compare_array(left, right);
            else if (left instanceof Set)
                result = compare_set(left, right);
            else if (left instanceof Map)
                result = compare_map(left, right);
            else if (ArrayBuffer.isView(left))
                result = compare_buffer(left, right);
            else if (Symbol.toPrimitive in left)
                result = compare_primitive(left, right);
            else
                result = false;
        }
        finally {
            left_cache.set(right, result);
        }
        return result;
    }
    $.$mol_compare_deep = $mol_compare_deep;
    function compare_array(left, right) {
        const len = left.length;
        if (len !== right.length)
            return false;
        for (let i = 0; i < len; ++i) {
            if (!$mol_compare_deep(left[i], right[i]))
                return false;
        }
        return true;
    }
    function compare_buffer(left, right) {
        const len = left.byteLength;
        if (len !== right.byteLength)
            return false;
        for (let i = 0; i < len; ++i) {
            if (left[i] !== right[i])
                return false;
        }
        return true;
    }
    function compare_iterator(left, right, compare) {
        while (true) {
            const left_next = left.next();
            const right_next = right.next();
            if (left_next.done !== right_next.done)
                return false;
            if (left_next.done)
                break;
            if (!compare(left_next.value, right_next.value))
                return false;
        }
        return true;
    }
    function compare_set(left, right) {
        if (left.size !== right.size)
            return false;
        return compare_iterator(left.values(), right.values(), $mol_compare_deep);
    }
    function compare_map(left, right) {
        if (left.size !== right.size)
            return false;
        return compare_iterator(left.keys(), right.keys(), Object.is)
            && compare_iterator(left.values(), right.values(), $mol_compare_deep);
    }
    function compare_pojo(left, right) {
        const left_keys = Object.getOwnPropertyNames(left);
        const right_keys = Object.getOwnPropertyNames(right);
        if (left_keys.length !== right_keys.length)
            return false;
        for (let key of left_keys) {
            if (!$mol_compare_deep(left[key], Reflect.get(right, key)))
                return false;
        }
        return true;
    }
    function compare_primitive(left, right) {
        return Object.is(left[Symbol.toPrimitive]('default'), right[Symbol.toPrimitive]('default'));
    }
})($ || ($ = {}));
//mol/compare/deep/deep.ts
;
"use strict";
var $;
(function ($) {
    function $mol_guid(length = 8, exists = () => false) {
        for (;;) {
            let id = Math.random().toString(36).substring(2, length + 2).toUpperCase();
            if (exists(id))
                continue;
            return id;
        }
    }
    $.$mol_guid = $mol_guid;
})($ || ($ = {}));
//mol/guid/guid.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_key_store = new WeakMap();
    function $mol_key(value) {
        if (!value)
            return JSON.stringify(value);
        if (typeof value !== 'object' && typeof value !== 'function')
            return JSON.stringify(value);
        return JSON.stringify(value, (field, value) => {
            if (!value)
                return value;
            if (typeof value !== 'object' && typeof value !== 'function')
                return value;
            if (Array.isArray(value))
                return value;
            const proto = Reflect.getPrototypeOf(value);
            if (!proto)
                return value;
            if (Reflect.getPrototypeOf(proto) === null)
                return value;
            if ('toJSON' in value)
                return value;
            if (value instanceof RegExp)
                return value.toString();
            let key = $.$mol_key_store.get(value);
            if (key)
                return key;
            key = $mol_guid();
            $.$mol_key_store.set(value, key);
            return key;
        });
    }
    $.$mol_key = $mol_key;
})($ || ($ = {}));
//mol/key/key.ts
;
"use strict";
var $;
(function ($) {
    class $mol_after_frame extends $mol_object2 {
        task;
        static _promise = null;
        static get promise() {
            if (this._promise)
                return this._promise;
            return this._promise = new Promise(done => {
                requestAnimationFrame(() => {
                    this._promise = null;
                    done();
                });
                setTimeout(() => {
                    this._promise = null;
                    done();
                }, 100);
            });
        }
        cancelled = false;
        promise;
        constructor(task) {
            super();
            this.task = task;
            this.promise = $mol_after_frame.promise.then(() => {
                if (this.cancelled)
                    return;
                task();
            });
        }
        destructor() {
            this.cancelled = true;
        }
    }
    $.$mol_after_frame = $mol_after_frame;
})($ || ($ = {}));
//mol/after/frame/frame.web.ts
;
"use strict";
var $;
(function ($) {
    function $mol_wire_method(host, field, descr) {
        if (!descr)
            descr = Reflect.getOwnPropertyDescriptor(host, field);
        const orig = descr?.value ?? host[field];
        const sup = Reflect.getPrototypeOf(host);
        if (typeof sup[field] === 'function') {
            Object.defineProperty(orig, 'name', { value: sup[field].name });
        }
        const value = function (...args) {
            const fiber = $mol_wire_fiber.temp(this ?? null, orig, ...args);
            return fiber.sync();
        };
        Object.defineProperty(value, 'name', { value: orig.name + ' ' });
        Object.assign(value, { orig });
        const descr2 = { ...descr, value };
        Reflect.defineProperty(host, field, descr2);
        return descr2;
    }
    $.$mol_wire_method = $mol_wire_method;
})($ || ($ = {}));
//mol/wire/method/method.ts
;
"use strict";
var $;
(function ($) {
    const handled = new WeakSet();
    class $mol_wire_fiber extends $mol_wire_pub_sub {
        host;
        task;
        static temp(host, task, ...args) {
            const existen = $mol_wire_auto?.track_next();
            reuse: if (existen) {
                if (!(existen instanceof $mol_wire_fiber))
                    break reuse;
                if (existen.host !== host)
                    break reuse;
                if (existen.task !== task)
                    break reuse;
                if (!$mol_compare_deep(existen.args, args))
                    break reuse;
                return existen;
            }
            return new this(host, task, host + '.' + task.name + '(#)', ...args);
        }
        static persist(host, task, ...args) {
            const field = task.name + '()';
            let dict, key, existen, fiber;
            if (args.length) {
                key = `${host}.${task.name}(${args.map(v => $mol_key(v)).join(',')})`;
                dict = Object.getOwnPropertyDescriptor(host, field)?.value;
                if (dict)
                    existen = dict.get(key);
                else
                    dict = host[field] = new Map();
            }
            else {
                key = `${host}.${field}`;
                existen = Object.getOwnPropertyDescriptor(host, field)?.value;
            }
            reuse: if (existen) {
                if (!(existen instanceof $mol_wire_fiber))
                    break reuse;
                if (existen.host !== host)
                    break reuse;
                if (existen.task !== task)
                    break reuse;
                return existen;
            }
            fiber = new this(host, task, key, ...args);
            if (args.length)
                dict.set(key, fiber);
            else
                host[field] = fiber;
            return fiber;
        }
        static warm = true;
        static planning = [];
        static reaping = [];
        static plan_task = null;
        static plan() {
            if (this.plan_task)
                return;
            this.plan_task = new $mol_after_frame(() => {
                try {
                    this.sync();
                }
                finally {
                    $mol_wire_fiber.plan_task = null;
                }
            });
        }
        static sync() {
            while (this.planning.length) {
                const fibers = this.planning.splice(0, this.planning.length);
                for (const fiber of fibers) {
                    fiber.up();
                }
            }
            while (this.reaping.length) {
                const fibers = this.reaping.splice(0, this.reaping.length);
                for (const fiber of fibers) {
                    if (!fiber.sub_empty)
                        continue;
                    fiber.destructor();
                }
            }
        }
        cache = undefined;
        get args() {
            return this.slice(0, this.pub_from);
        }
        get result() {
            if (this.cache instanceof Promise)
                return;
            if (this.cache instanceof Error)
                return;
            return this.cache;
        }
        get persist() {
            const id = this[Symbol.toStringTag];
            return id[id.length - 2] !== '#';
        }
        field() {
            return this.task.name + '()';
        }
        constructor(host, task, id, ...args) {
            super(...args, undefined);
            this.host = host;
            this.task = task;
            this.pop();
            this.pub_from = this.sub_from = args.length;
            this[Symbol.toStringTag] = id;
        }
        destructor() {
            super.destructor();
            const prev = this.cache;
            if ($mol_owning_check(this, prev)) {
                prev.destructor();
            }
            this.cache = undefined;
            if (this.persist) {
                if (this.pub_from === 0) {
                    this.host[this.field()] = null;
                }
                else {
                    this.host[this.field()].delete(this[Symbol.toStringTag]);
                }
            }
        }
        plan() {
            $mol_wire_fiber.planning.push(this);
            $mol_wire_fiber.plan();
        }
        reap() {
            $mol_wire_fiber.reaping.push(this);
            $mol_wire_fiber.plan();
        }
        toString() {
            return this[Symbol.toStringTag];
        }
        [$mol_dev_format_head]() {
            const cursor = this.cursor >= 0
                ? '@' + this.cursor
                : this.cursor?.constructor?.name;
            return $mol_dev_format_div({}, $mol_dev_format_native(this), $mol_dev_format_shade(' ' + cursor + ' = '), $mol_dev_format_auto(this.cache));
        }
        get $() {
            return this.host['$'];
        }
        affect(quant) {
            if (!super.affect(quant))
                return false;
            if (this.sub_from === this.length) {
                this.plan();
            }
            return true;
        }
        down() {
            if (this.persist)
                return;
            this.destructor();
        }
        up() {
            if (this.cursor === $mol_wire_cursor.fresh)
                return;
            check: if (this.cursor === $mol_wire_cursor.doubt) {
                for (let i = this.pub_from; i < this.sub_from; i += 2) {
                    ;
                    this[i]?.up();
                    if (this.cursor !== $mol_wire_cursor.doubt)
                        break check;
                }
                this.cursor = $mol_wire_cursor.fresh;
                return;
            }
            const bu = this.track_on();
            let result;
            try {
                result = this.task.call(this.host, ...this.args);
                if (result instanceof Promise) {
                    const put = (res) => {
                        if (this.cache === result)
                            this.put(res);
                        return res;
                    };
                    result = Object.assign(result.then(put, put), {
                        destructor: result['destructor']
                    });
                    handled.add(result);
                }
            }
            catch (error) {
                result = error;
                if (result instanceof Promise && !handled.has(result)) {
                    result = Object.assign(result.finally(() => {
                        if (this.cache === result)
                            this.stale();
                    }), {
                        destructor: result['destructor']
                    });
                    handled.add(result);
                }
            }
            this.track_off(bu);
            this.put(result);
        }
        put(next) {
            const prev = this.cache;
            if (next !== prev) {
                if ($mol_owning_check(this, prev)) {
                    prev.destructor();
                }
                this.cache = next;
                if (this.persist && $mol_owning_catch(this, next)) {
                    try {
                        next[Symbol.toStringTag] = this[Symbol.toStringTag];
                    }
                    catch { }
                }
                if (this.sub_from < this.length) {
                    if (!$mol_compare_deep(prev, next)) {
                        this.emit();
                    }
                }
            }
            this.cursor = $mol_wire_cursor.fresh;
            if (next instanceof Promise)
                return next;
            if (this.persist) {
                for (let cursor = this.pub_from; cursor < this.sub_from; cursor += 2) {
                    const pub = this[cursor];
                    pub?.down();
                }
            }
            else {
                this.cursor = this.pub_from;
                this.forget();
                this.cursor = $mol_wire_cursor.fresh;
            }
            return next;
        }
        recall(...args) {
            return this.put(this.task.call(this.host, ...args));
        }
        sync() {
            if (!$mol_wire_fiber.warm) {
                return this.result;
            }
            this.track_promote();
            this.up();
            if (this.cache instanceof Error) {
                return $mol_fail_hidden(this.cache);
            }
            if (this.cache instanceof Promise) {
                return $mol_fail_hidden(this.cache);
            }
            return this.cache;
        }
        async async() {
            while (true) {
                this.up();
                if (this.cache instanceof Error) {
                    $mol_fail_hidden(this.cache);
                }
                if (!(this.cache instanceof Promise))
                    return this.cache;
                await this.cache;
                if (this.cursor === $mol_wire_cursor.final) {
                    await new Promise(() => { });
                }
            }
        }
    }
    __decorate([
        $mol_wire_method
    ], $mol_wire_fiber.prototype, "recall", null);
    $.$mol_wire_fiber = $mol_wire_fiber;
})($ || ($ = {}));
//mol/wire/fiber/fiber.ts
;
"use strict";
var $;
(function ($) {
    const cacthed = new WeakMap();
    function $mol_fail_catch(error) {
        if (typeof error !== 'object')
            return false;
        if (cacthed.get(error))
            return false;
        cacthed.set(error, true);
        return true;
    }
    $.$mol_fail_catch = $mol_fail_catch;
})($ || ($ = {}));
//mol/fail/catch/catch.ts
;
"use strict";
var $;
(function ($) {
    function $mol_fail_log(error) {
        if (error instanceof Promise)
            return false;
        if (!$mol_fail_catch(error))
            return false;
        console.error(error);
        return true;
    }
    $.$mol_fail_log = $mol_fail_log;
})($ || ($ = {}));
//mol/fail/log/log.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_wire_mem = (keys) => (host, field, descr) => {
        if (!descr)
            descr = Reflect.getOwnPropertyDescriptor(host, field);
        const orig = descr?.value ?? host[field];
        const sup = Reflect.getPrototypeOf(host);
        if (typeof sup[field] === 'function') {
            Object.defineProperty(orig, 'name', { value: sup[field].name });
        }
        function value(...args) {
            let atom = $mol_wire_fiber.persist(this, orig, ...args.slice(0, keys));
            if (args[keys] === undefined)
                return atom.sync();
            try {
                atom.sync();
            }
            catch (error) {
                $mol_fail_log(error);
            }
            return atom.recall(...args);
        }
        Object.defineProperty(value, 'name', { value: orig.name + ' ' });
        Object.assign(value, { orig });
        const descr2 = { ...descr, value };
        Reflect.defineProperty(host, field, descr2);
        return descr2;
    };
})($ || ($ = {}));
//mol/wire/mem/mem.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_mem = $mol_wire_mem(0);
    $.$mol_mem_key = $mol_wire_mem(1);
    $.$mol_mem_key2 = $mol_wire_mem(2);
    $.$mol_mem_key3 = $mol_wire_mem(3);
})($ || ($ = {}));
//mol/mem/mem.ts
;
"use strict";
var $;
(function ($) {
    class $mol_window extends $mol_object {
        static size() {
            this.resizes();
            return {
                width: self.innerWidth,
                height: self.innerHeight,
            };
        }
        static resizes(next) { return next; }
    }
    __decorate([
        $mol_mem
    ], $mol_window, "size", null);
    __decorate([
        $mol_mem
    ], $mol_window, "resizes", null);
    $.$mol_window = $mol_window;
    self.addEventListener('resize', event => $mol_window.resizes(event));
})($ || ($ = {}));
//mol/window/window.web.ts
;
"use strict";
var $;
(function ($) {
    class $mol_view_selection extends $mol_object {
        static focused(next) {
            const parents = [];
            let element = next?.[0] ?? $mol_dom_context.document.activeElement;
            while (element) {
                parents.push(element);
                element = element.parentNode;
            }
            new $mol_after_tick(() => {
                const element = this.focused()[0];
                if (element)
                    element.focus();
                else
                    $mol_dom_context.blur();
            });
            return parents;
        }
    }
    __decorate([
        $mol_mem
    ], $mol_view_selection, "focused", null);
    $.$mol_view_selection = $mol_view_selection;
})($ || ($ = {}));
//mol/view/selection/selection.ts
;
"use strict";
var $;
(function ($) {
    function $mol_maybe(value) {
        return (value == null) ? [] : [value];
    }
    $.$mol_maybe = $mol_maybe;
})($ || ($ = {}));
//mol/maybe/maybe.ts
;
"use strict";
var $;
(function ($) {
    if ($mol_dom_context.document) {
        $mol_dom_context.document.documentElement.addEventListener('focus', (event) => {
            $mol_view_selection.focused($mol_maybe($mol_dom_context.document.activeElement));
        }, true);
    }
})($ || ($ = {}));
//mol/view/selection/selection.web.ts
;
"use strict";
var $;
(function ($) {
    function $mol_dom_qname(name) {
        return name.replace(/\W/g, '').replace(/^(?=\d+)/, '_');
    }
    $.$mol_dom_qname = $mol_dom_qname;
})($ || ($ = {}));
//mol/dom/qname/qname.ts
;
"use strict";
var $;
(function ($) {
    function $mol_const(value) {
        var getter = (() => value);
        getter['()'] = value;
        getter[Symbol.toStringTag] = value;
        return getter;
    }
    $.$mol_const = $mol_const;
})($ || ($ = {}));
//mol/const/const.ts
;
"use strict";
var $;
(function ($) {
    function $mol_dom_render_attributes(el, attrs) {
        for (let name in attrs) {
            let val = attrs[name];
            if (val === null || val === false) {
                if (!el.hasAttribute(name))
                    continue;
                el.removeAttribute(name);
            }
            else {
                const str = String(val);
                if (el.getAttribute(name) === str)
                    continue;
                el.setAttribute(name, str);
            }
        }
    }
    $.$mol_dom_render_attributes = $mol_dom_render_attributes;
})($ || ($ = {}));
//mol/dom/render/attributes/attributes.ts
;
"use strict";
var $;
(function ($) {
    function $mol_wire_async(obj) {
        return new Proxy(obj, {
            get(obj, field) {
                const val = obj[field];
                if (typeof val !== 'function')
                    return val;
                let fiber;
                return function $mol_wire_async(...args) {
                    fiber?.destructor();
                    fiber = $mol_wire_fiber.temp(obj, val, ...args);
                    return fiber.async();
                };
            }
        });
    }
    $.$mol_wire_async = $mol_wire_async;
})($ || ($ = {}));
//mol/wire/async/async.ts
;
"use strict";
var $;
(function ($) {
    function $mol_dom_render_styles(el, styles) {
        for (let name in styles) {
            let val = styles[name];
            const style = el.style;
            if (typeof val === 'number') {
                style[name] = `${val}px`;
            }
            else {
                style[name] = val;
            }
        }
    }
    $.$mol_dom_render_styles = $mol_dom_render_styles;
})($ || ($ = {}));
//mol/dom/render/styles/styles.ts
;
"use strict";
var $;
(function ($) {
    function $mol_dom_render_children(el, childNodes) {
        const node_set = new Set(childNodes);
        let nextNode = el.firstChild;
        for (let view of childNodes) {
            if (view == null)
                continue;
            if (view instanceof $mol_dom_context.Node) {
                while (true) {
                    if (!nextNode) {
                        el.appendChild(view);
                        break;
                    }
                    if (nextNode == view) {
                        nextNode = nextNode.nextSibling;
                        break;
                    }
                    else {
                        if (node_set.has(nextNode)) {
                            el.insertBefore(view, nextNode);
                            break;
                        }
                        else {
                            const nn = nextNode.nextSibling;
                            el.removeChild(nextNode);
                            nextNode = nn;
                        }
                    }
                }
            }
            else {
                if (nextNode && nextNode.nodeName === '#text') {
                    const str = String(view);
                    if (nextNode.nodeValue !== str)
                        nextNode.nodeValue = str;
                    nextNode = nextNode.nextSibling;
                }
                else {
                    const textNode = $mol_dom_context.document.createTextNode(String(view));
                    el.insertBefore(textNode, nextNode);
                }
            }
        }
        while (nextNode) {
            const currNode = nextNode;
            nextNode = currNode.nextSibling;
            el.removeChild(currNode);
        }
    }
    $.$mol_dom_render_children = $mol_dom_render_children;
})($ || ($ = {}));
//mol/dom/render/children/children.ts
;
"use strict";
var $;
(function ($) {
    function $mol_dom_render_fields(el, fields) {
        for (let key in fields) {
            const val = fields[key];
            if (val === undefined)
                continue;
            el[key] = val;
        }
    }
    $.$mol_dom_render_fields = $mol_dom_render_fields;
})($ || ($ = {}));
//mol/dom/render/fields/fields.ts
;
"use strict";
var $;
(function ($) {
    class $mol_wrapper extends $mol_object2 {
        static wrap;
        static run(task) {
            return this.func(task)();
        }
        static func(func) {
            return this.wrap(func);
        }
        static get class() {
            return (Class) => {
                const construct = (target, args) => new Class(...args);
                const handler = {
                    construct: this.func(construct)
                };
                handler[Symbol.toStringTag] = Class.name + '#';
                return new Proxy(Class, handler);
            };
        }
        static get method() {
            return (obj, name, descr) => {
                descr.value = this.func(descr.value);
                return descr;
            };
        }
        static get field() {
            return (obj, name, descr) => {
                descr.get = descr.set = this.func(descr.get);
                return descr;
            };
        }
    }
    $.$mol_wrapper = $mol_wrapper;
})($ || ($ = {}));
//mol/wrapper/wrapper.ts
;
"use strict";
var $;
(function ($) {
    class $mol_memo extends $mol_wrapper {
        static wrap(task) {
            const store = new WeakMap();
            return function (next) {
                if (next === undefined && store.has(this))
                    return store.get(this);
                const val = task.call(this, next) ?? next;
                store.set(this, val);
                return val;
            };
        }
    }
    $.$mol_memo = $mol_memo;
})($ || ($ = {}));
//mol/memo/memo.ts
;
"use strict";
var $;
(function ($) {
    function $mol_func_name(func) {
        let name = func.name;
        if (name?.length > 1)
            return name;
        for (let key in this) {
            try {
                if (this[key] !== func)
                    continue;
                name = key;
                Object.defineProperty(func, 'name', { value: name });
                break;
            }
            catch { }
        }
        return name;
    }
    $.$mol_func_name = $mol_func_name;
    function $mol_func_name_from(target, source) {
        Object.defineProperty(target, 'name', { value: source.name });
        return target;
    }
    $.$mol_func_name_from = $mol_func_name_from;
})($ || ($ = {}));
//mol/func/name/name.ts
;
"use strict";
var $;
(function ($) {
    function $mol_log3_area_lazy(event) {
        const self = this;
        const stack = self.$mol_log3_stack;
        const deep = stack.length;
        let logged = false;
        stack.push(() => {
            logged = true;
            self.$mol_log3_area.call(self, event);
        });
        return () => {
            if (logged)
                self.console.groupEnd();
            if (stack.length > deep)
                stack.length = deep;
        };
    }
    $.$mol_log3_area_lazy = $mol_log3_area_lazy;
    $.$mol_log3_stack = [];
})($ || ($ = {}));
//mol/log3/log3.ts
;
"use strict";
//mol/type/keys/extract/extract.ts
;
"use strict";
var $;
(function ($) {
    function $mol_log3_web_make(level, color) {
        return function $mol_log3_logger(event) {
            const pending = this.$mol_log3_stack.pop();
            if (pending)
                pending();
            let tpl = '%c';
            const chunks = Object.values(event);
            for (let i = 0; i < chunks.length; ++i) {
                tpl += (typeof chunks[i] === 'string') ? ' ⦙ %s' : ' ⦙ %o';
            }
            const style = `color:${color};font-weight:bolder`;
            this.console[level](tpl, style, ...chunks);
            const self = this;
            return () => self.console.groupEnd();
        };
    }
    $.$mol_log3_web_make = $mol_log3_web_make;
    $.$mol_log3_come = $mol_log3_web_make('info', 'royalblue');
    $.$mol_log3_done = $mol_log3_web_make('info', 'forestgreen');
    $.$mol_log3_fail = $mol_log3_web_make('error', 'orangered');
    $.$mol_log3_warn = $mol_log3_web_make('warn', 'goldenrod');
    $.$mol_log3_rise = $mol_log3_web_make('log', 'magenta');
    $.$mol_log3_area = $mol_log3_web_make('group', 'cyan');
})($ || ($ = {}));
//mol/log3/log3.web.ts
;
"use strict";
var $;
(function ($) {
    function $mol_deprecated(message) {
        return (host, field, descr) => {
            const value = descr.value;
            let warned = false;
            descr.value = function $mol_deprecated_wrapper(...args) {
                if (!warned) {
                    $$.$mol_log3_warn({
                        place: `${host.constructor.name}::${field}`,
                        message: `Deprecated`,
                        hint: message,
                    });
                    warned = true;
                }
                return value.call(this, ...args);
            };
        };
    }
    $.$mol_deprecated = $mol_deprecated;
})($ || ($ = {}));
//mol/deprecated/deprecated.ts
;
"use strict";
//mol/type/pick/pick.ts
;
"use strict";
var $;
(function ($) {
    function $mol_view_visible_width() {
        return $mol_window.size().width;
    }
    $.$mol_view_visible_width = $mol_view_visible_width;
    function $mol_view_visible_height() {
        return $mol_window.size().height;
    }
    $.$mol_view_visible_height = $mol_view_visible_height;
    function $mol_view_state_key(suffix) {
        return suffix;
    }
    $.$mol_view_state_key = $mol_view_state_key;
    class $mol_view extends $mol_object {
        static Root(id) {
            return new this;
        }
        autorun() {
            try {
                this.dom_tree();
                document.title = this.title();
            }
            catch (error) {
                $mol_fail_log(error);
            }
        }
        static autobind() {
            const nodes = $mol_dom_context.document.querySelectorAll('[mol_view_root]');
            for (let i = nodes.length - 1; i >= 0; --i) {
                const name = nodes.item(i).getAttribute('mol_view_root');
                const View = $[name];
                if (!View) {
                    console.error(`Can not attach view. Class not found: ${name}`);
                    continue;
                }
                const view = View.Root(i);
                view.dom_node(nodes.item(i));
                view.autorun();
            }
        }
        title() {
            return this.constructor.toString();
        }
        focused(next) {
            let node = this.dom_node();
            const value = $mol_view_selection.focused(next === undefined ? undefined : (next ? [node] : []));
            return value.indexOf(node) !== -1;
        }
        state_key(suffix = '') {
            return this.$.$mol_view_state_key(suffix);
        }
        dom_name() {
            return $mol_dom_qname(this.constructor.toString()) || 'div';
        }
        dom_name_space() { return 'http://www.w3.org/1999/xhtml'; }
        sub() {
            return [];
        }
        sub_visible() {
            return this.sub();
        }
        minimal_width() {
            const sub = this.sub();
            if (!sub)
                return 0;
            let min = 0;
            try {
                sub.forEach(view => {
                    if (view instanceof $mol_view) {
                        min = Math.max(min, view.minimal_width());
                    }
                });
            }
            catch (error) {
                $mol_fail_log(error);
                return 24;
            }
            return min;
        }
        maximal_width() {
            return this.minimal_width();
        }
        minimal_height() {
            let min = 0;
            try {
                for (const view of this.sub() ?? []) {
                    if (view instanceof $mol_view) {
                        min = Math.max(min, view.minimal_height());
                    }
                }
            }
            catch (error) {
                $mol_fail_log(error);
                return 24;
            }
            return min;
        }
        static watchers = new Set();
        view_rect() {
            this.view_rect_watcher();
            return this.view_rect_cache();
        }
        view_rect_cache(next = null) {
            return next;
        }
        view_rect_watcher() {
            $mol_view.watchers.add(this);
            return { destructor: () => $mol_view.watchers.delete(this) };
        }
        dom_id() {
            return this.toString();
        }
        dom_node(next) {
            const node = next || $mol_dom_context.document.createElementNS(this.dom_name_space(), this.dom_name());
            const id = this.dom_id();
            node.setAttribute('id', id);
            node.toString = $mol_const('<#' + id + '>');
            $mol_dom_render_attributes(node, this.attr_static());
            const events = $mol_wire_async(this.event());
            for (let event_name in events) {
                node.addEventListener(event_name, events[event_name], { passive: false });
            }
            return node;
        }
        dom_tree(next) {
            const node = this.dom_node(next);
            try {
                $mol_dom_render_attributes(node, { mol_view_error: null });
                try {
                    this.render();
                }
                finally {
                    for (let plugin of this.plugins()) {
                        if (plugin instanceof $mol_plugin) {
                            plugin.dom_tree();
                        }
                    }
                }
            }
            catch (error) {
                $mol_dom_render_attributes(node, { mol_view_error: error.name || error.constructor.name });
                if ($mol_fail_log(error)) {
                    try {
                        node.innerText = error.message || error;
                    }
                    catch { }
                }
            }
            this.auto();
            return node;
        }
        dom_node_actual() {
            const node = this.dom_node();
            $mol_dom_render_styles(node, {
                minHeight: this.minimal_height(),
                minWidth: this.minimal_width(),
            });
            const attr = this.attr();
            const style = this.style();
            const fields = this.field();
            $mol_dom_render_attributes(node, attr);
            $mol_dom_render_styles(node, style);
            return node;
        }
        auto() { }
        render() {
            const node = this.dom_node_actual();
            const sub = this.sub_visible();
            if (!sub)
                return;
            const nodes = sub.map(child => {
                if (child == null)
                    return null;
                return (child instanceof $mol_view)
                    ? child.dom_node()
                    : child instanceof $mol_dom_context.Node
                        ? child
                        : String(child);
            });
            $mol_dom_render_children(node, nodes);
            for (const el of sub)
                if (el && typeof el === 'object' && 'dom_tree' in el)
                    el['dom_tree']();
            $mol_dom_render_fields(node, this.field());
        }
        static view_classes() {
            const proto = this.prototype;
            let current = proto;
            const classes = [];
            while (current) {
                classes.push(current.constructor);
                if (!(current instanceof $mol_view))
                    break;
                current = Object.getPrototypeOf(current);
            }
            return classes;
        }
        view_names_owned() {
            const names = [];
            let owner = $mol_owning_get(this);
            if (owner?.host instanceof $mol_view) {
                const suffix = owner.task.name.trim();
                const suffix2 = '_' + suffix[0].toLowerCase() + suffix.substring(1);
                for (let Class of owner.host.constructor.view_classes()) {
                    if (suffix in Class.prototype)
                        names.push(this.$.$mol_func_name(Class) + suffix2);
                    else
                        break;
                }
                for (let prefix of owner.host.view_names_owned()) {
                    names.push(prefix + suffix2);
                }
            }
            return names;
        }
        view_names() {
            const names = [];
            for (let name of this.view_names_owned()) {
                if (names.indexOf(name) < 0)
                    names.push(name);
            }
            for (let Class of this.constructor.view_classes()) {
                const name = this.$.$mol_func_name(Class);
                if (!name)
                    continue;
                if (names.indexOf(name) < 0)
                    names.push(name);
            }
            return names;
        }
        attr_static() {
            let attrs = {};
            for (let name of this.view_names())
                attrs[name.replace(/\$/g, '').replace(/^(?=\d)/, '_').toLowerCase()] = '';
            return attrs;
        }
        attr() {
            return {};
        }
        style() {
            return {};
        }
        field() {
            return {};
        }
        event() {
            return {};
        }
        event_async() {
            return {};
        }
        plugins() {
            return [];
        }
        [$mol_dev_format_head]() {
            return $mol_dev_format_span({}, $mol_dev_format_native(this));
        }
        *view_find(check, path = []) {
            if (check(this))
                return yield [...path, this];
            for (const item of this.sub()) {
                if (item instanceof $mol_view) {
                    yield* item.view_find(check, [...path, this]);
                }
            }
        }
        force_render(path) {
            const kids = this.sub();
            const index = kids.findIndex(item => {
                if (item instanceof $mol_view) {
                    return path.has(item);
                }
                else {
                    return false;
                }
            });
            if (index >= 0) {
                kids[index].force_render(path);
            }
        }
        async ensure_visible(view, align = "start") {
            const path = this.view_find(v => v === view).next().value;
            this.force_render(new Set(path));
            $mol_wire_fiber.sync();
            view.dom_node().scrollIntoView({ block: align });
        }
    }
    __decorate([
        $mol_mem
    ], $mol_view.prototype, "autorun", null);
    __decorate([
        $mol_mem
    ], $mol_view.prototype, "focused", null);
    __decorate([
        $mol_mem
    ], $mol_view.prototype, "minimal_width", null);
    __decorate([
        $mol_mem
    ], $mol_view.prototype, "minimal_height", null);
    __decorate([
        $mol_mem
    ], $mol_view.prototype, "view_rect", null);
    __decorate([
        $mol_mem
    ], $mol_view.prototype, "view_rect_cache", null);
    __decorate([
        $mol_mem
    ], $mol_view.prototype, "view_rect_watcher", null);
    __decorate([
        $mol_mem
    ], $mol_view.prototype, "dom_node", null);
    __decorate([
        $mol_mem
    ], $mol_view.prototype, "dom_tree", null);
    __decorate([
        $mol_mem
    ], $mol_view.prototype, "dom_node_actual", null);
    __decorate([
        $mol_memo.method
    ], $mol_view.prototype, "view_names", null);
    __decorate([
        $mol_deprecated('Use $mol_view::event instead.')
    ], $mol_view.prototype, "event_async", null);
    __decorate([
        $mol_mem_key
    ], $mol_view, "Root", null);
    __decorate([
        $mol_mem
    ], $mol_view, "autobind", null);
    __decorate([
        $mol_memo.method
    ], $mol_view, "view_classes", null);
    $.$mol_view = $mol_view;
})($ || ($ = {}));
//mol/view/view/view.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("mol/view/view/view.css", "[mol_view] {\n\ttransition-property: height, width, min-height, min-width, max-width, max-height, transform;\n\ttransition-duration: .2s;\n\ttransition-timing-function: ease-out;\n\t-webkit-appearance: none;\n\tword-break: break-word;\n\tbox-sizing: border-box;\n\tdisplay: flex;\n\tflex-shrink: 0;\n\tmax-width: 100%;\n\tcontain: style;\n\ttab-size: 4;\n}\n\n[mol_view]::selection {\n\tbackground: var(--mol_theme_current);\n}\n\n[mol_view] > * {\n\tword-break: inherit;\n}\n\n[mol_view_root] {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbox-sizing: border-box;\n\tfont: var(--mol_skin_font);\n\tbackground: var(--mol_theme_back);\n\tcolor: var(--mol_theme_text);\n\tcontain: unset; /** Fixes bg ignoring when applied to body on Chrome */\n}\n\n[mol_view][mol_view_error]:not([mol_view_error=\"Promise\"]) {\n\tbackground-image: repeating-linear-gradient(\n\t\t-45deg,\n\t\t#f92323,\n\t\t#f92323 10px,\n\t\t#ff3d3d 10px,\n\t\t#ff3d3d 30px\n\t);\n\tcolor: black;\n}\n\n@keyframes mol_view_wait_move {\n\tfrom {\n\t\tbackground-position: 0 0;\n\t}\n\tto {\n\t\tbackground-position: 200vmax 0;\n\t}\n}\n\n@keyframes mol_view_wait_show {\n\tto {\n\t\tbackground-image: repeating-linear-gradient(\n\t\t\t45deg,\n\t\t\thsla( 0 , 0% , 50% , .25 ) 0% ,\n\t\t\thsla( 0 , 0% , 50% , 0 ) 5% ,\n\t\t\thsla( 0 , 0% , 50% , 0 ) 45% ,\n\t\t\thsla( 0 , 0% , 50% , .25 ) 50% ,\n\t\t\thsla( 0 , 0% , 50% , 0 ) 55% ,\n\t\t\thsla( 0 , 0% , 50% , 0 ) 95% ,\n\t\t\thsla( 0 , 0% , 50% , .25 ) 100%\n\t\t);\n\t\tbackground-size: 200vmax 200vmax;\n\t}\n}\n\n[mol_view][mol_view_error=\"Promise\"] {\n\tanimation: mol_view_wait_show .5s .5s linear forwards , mol_view_wait_move 1s linear infinite;\n\topacity: .75;\n}\n");
})($ || ($ = {}));
//mol/view/view/-css/view.css.ts
;
"use strict";
var $;
(function ($) {
    if ($mol_dom_context.document) {
        Promise.resolve().then(() => {
            $mol_view.autobind();
        });
        function $mol_view_watch() {
            new $mol_after_frame($mol_view_watch);
            for (const view of $mol_view.watchers) {
                view.view_rect_cache(view.dom_node().getBoundingClientRect().toJSON());
            }
        }
        $mol_view_watch();
    }
})($ || ($ = {}));
//mol/view/view/view.web.ts
;
"use strict";
var $;
(function ($) {
    class $mol_plugin extends $mol_view {
        dom_node(next) {
            const node = next || $mol_owning_get(this).host.dom_node();
            $mol_dom_render_attributes(node, this.attr_static());
            const events = $mol_wire_async(this.event());
            for (let event_name in events) {
                node.addEventListener(event_name, events[event_name], { passive: false });
            }
            return node;
        }
        attr_static() {
            return {};
        }
        event() {
            return {};
        }
        render() {
            this.dom_node_actual();
        }
    }
    __decorate([
        $mol_mem
    ], $mol_plugin.prototype, "dom_node", null);
    $.$mol_plugin = $mol_plugin;
})($ || ($ = {}));
//mol/plugin/plugin.ts
;
"use strict";
var $;
(function ($) {
    class $mol_hotkey extends $mol_plugin {
        event() {
            return {
                ...super.event(),
                keydown: (event) => this.keydown(event)
            };
        }
        key() {
            return {};
        }
        mod_ctrl() {
            return false;
        }
        mod_alt() {
            return false;
        }
        mod_shift() {
            return false;
        }
        keydown(event) {
            if (event !== undefined)
                return event;
            return null;
        }
    }
    __decorate([
        $mol_mem
    ], $mol_hotkey.prototype, "keydown", null);
    $.$mol_hotkey = $mol_hotkey;
})($ || ($ = {}));
//mol/hotkey/-view.tree/hotkey.view.tree.ts
;
"use strict";
var $;
(function ($) {
    let $mol_keyboard_code;
    (function ($mol_keyboard_code) {
        $mol_keyboard_code[$mol_keyboard_code["backspace"] = 8] = "backspace";
        $mol_keyboard_code[$mol_keyboard_code["tab"] = 9] = "tab";
        $mol_keyboard_code[$mol_keyboard_code["enter"] = 13] = "enter";
        $mol_keyboard_code[$mol_keyboard_code["shift"] = 16] = "shift";
        $mol_keyboard_code[$mol_keyboard_code["ctrl"] = 17] = "ctrl";
        $mol_keyboard_code[$mol_keyboard_code["alt"] = 18] = "alt";
        $mol_keyboard_code[$mol_keyboard_code["pause"] = 19] = "pause";
        $mol_keyboard_code[$mol_keyboard_code["capsLock"] = 20] = "capsLock";
        $mol_keyboard_code[$mol_keyboard_code["escape"] = 27] = "escape";
        $mol_keyboard_code[$mol_keyboard_code["space"] = 32] = "space";
        $mol_keyboard_code[$mol_keyboard_code["pageUp"] = 33] = "pageUp";
        $mol_keyboard_code[$mol_keyboard_code["pageDown"] = 34] = "pageDown";
        $mol_keyboard_code[$mol_keyboard_code["end"] = 35] = "end";
        $mol_keyboard_code[$mol_keyboard_code["home"] = 36] = "home";
        $mol_keyboard_code[$mol_keyboard_code["left"] = 37] = "left";
        $mol_keyboard_code[$mol_keyboard_code["up"] = 38] = "up";
        $mol_keyboard_code[$mol_keyboard_code["right"] = 39] = "right";
        $mol_keyboard_code[$mol_keyboard_code["down"] = 40] = "down";
        $mol_keyboard_code[$mol_keyboard_code["insert"] = 45] = "insert";
        $mol_keyboard_code[$mol_keyboard_code["delete"] = 46] = "delete";
        $mol_keyboard_code[$mol_keyboard_code["key0"] = 48] = "key0";
        $mol_keyboard_code[$mol_keyboard_code["key1"] = 49] = "key1";
        $mol_keyboard_code[$mol_keyboard_code["key2"] = 50] = "key2";
        $mol_keyboard_code[$mol_keyboard_code["key3"] = 51] = "key3";
        $mol_keyboard_code[$mol_keyboard_code["key4"] = 52] = "key4";
        $mol_keyboard_code[$mol_keyboard_code["key5"] = 53] = "key5";
        $mol_keyboard_code[$mol_keyboard_code["key6"] = 54] = "key6";
        $mol_keyboard_code[$mol_keyboard_code["key7"] = 55] = "key7";
        $mol_keyboard_code[$mol_keyboard_code["key8"] = 56] = "key8";
        $mol_keyboard_code[$mol_keyboard_code["key9"] = 57] = "key9";
        $mol_keyboard_code[$mol_keyboard_code["A"] = 65] = "A";
        $mol_keyboard_code[$mol_keyboard_code["B"] = 66] = "B";
        $mol_keyboard_code[$mol_keyboard_code["C"] = 67] = "C";
        $mol_keyboard_code[$mol_keyboard_code["D"] = 68] = "D";
        $mol_keyboard_code[$mol_keyboard_code["E"] = 69] = "E";
        $mol_keyboard_code[$mol_keyboard_code["F"] = 70] = "F";
        $mol_keyboard_code[$mol_keyboard_code["G"] = 71] = "G";
        $mol_keyboard_code[$mol_keyboard_code["H"] = 72] = "H";
        $mol_keyboard_code[$mol_keyboard_code["I"] = 73] = "I";
        $mol_keyboard_code[$mol_keyboard_code["J"] = 74] = "J";
        $mol_keyboard_code[$mol_keyboard_code["K"] = 75] = "K";
        $mol_keyboard_code[$mol_keyboard_code["L"] = 76] = "L";
        $mol_keyboard_code[$mol_keyboard_code["M"] = 77] = "M";
        $mol_keyboard_code[$mol_keyboard_code["N"] = 78] = "N";
        $mol_keyboard_code[$mol_keyboard_code["O"] = 79] = "O";
        $mol_keyboard_code[$mol_keyboard_code["P"] = 80] = "P";
        $mol_keyboard_code[$mol_keyboard_code["Q"] = 81] = "Q";
        $mol_keyboard_code[$mol_keyboard_code["R"] = 82] = "R";
        $mol_keyboard_code[$mol_keyboard_code["S"] = 83] = "S";
        $mol_keyboard_code[$mol_keyboard_code["T"] = 84] = "T";
        $mol_keyboard_code[$mol_keyboard_code["U"] = 85] = "U";
        $mol_keyboard_code[$mol_keyboard_code["V"] = 86] = "V";
        $mol_keyboard_code[$mol_keyboard_code["W"] = 87] = "W";
        $mol_keyboard_code[$mol_keyboard_code["X"] = 88] = "X";
        $mol_keyboard_code[$mol_keyboard_code["Y"] = 89] = "Y";
        $mol_keyboard_code[$mol_keyboard_code["Z"] = 90] = "Z";
        $mol_keyboard_code[$mol_keyboard_code["metaLeft"] = 91] = "metaLeft";
        $mol_keyboard_code[$mol_keyboard_code["metaRight"] = 92] = "metaRight";
        $mol_keyboard_code[$mol_keyboard_code["select"] = 93] = "select";
        $mol_keyboard_code[$mol_keyboard_code["numpad0"] = 96] = "numpad0";
        $mol_keyboard_code[$mol_keyboard_code["numpad1"] = 97] = "numpad1";
        $mol_keyboard_code[$mol_keyboard_code["numpad2"] = 98] = "numpad2";
        $mol_keyboard_code[$mol_keyboard_code["numpad3"] = 99] = "numpad3";
        $mol_keyboard_code[$mol_keyboard_code["numpad4"] = 100] = "numpad4";
        $mol_keyboard_code[$mol_keyboard_code["numpad5"] = 101] = "numpad5";
        $mol_keyboard_code[$mol_keyboard_code["numpad6"] = 102] = "numpad6";
        $mol_keyboard_code[$mol_keyboard_code["numpad7"] = 103] = "numpad7";
        $mol_keyboard_code[$mol_keyboard_code["numpad8"] = 104] = "numpad8";
        $mol_keyboard_code[$mol_keyboard_code["numpad9"] = 105] = "numpad9";
        $mol_keyboard_code[$mol_keyboard_code["multiply"] = 106] = "multiply";
        $mol_keyboard_code[$mol_keyboard_code["add"] = 107] = "add";
        $mol_keyboard_code[$mol_keyboard_code["subtract"] = 109] = "subtract";
        $mol_keyboard_code[$mol_keyboard_code["decimal"] = 110] = "decimal";
        $mol_keyboard_code[$mol_keyboard_code["divide"] = 111] = "divide";
        $mol_keyboard_code[$mol_keyboard_code["F1"] = 112] = "F1";
        $mol_keyboard_code[$mol_keyboard_code["F2"] = 113] = "F2";
        $mol_keyboard_code[$mol_keyboard_code["F3"] = 114] = "F3";
        $mol_keyboard_code[$mol_keyboard_code["F4"] = 115] = "F4";
        $mol_keyboard_code[$mol_keyboard_code["F5"] = 116] = "F5";
        $mol_keyboard_code[$mol_keyboard_code["F6"] = 117] = "F6";
        $mol_keyboard_code[$mol_keyboard_code["F7"] = 118] = "F7";
        $mol_keyboard_code[$mol_keyboard_code["F8"] = 119] = "F8";
        $mol_keyboard_code[$mol_keyboard_code["F9"] = 120] = "F9";
        $mol_keyboard_code[$mol_keyboard_code["F10"] = 121] = "F10";
        $mol_keyboard_code[$mol_keyboard_code["F11"] = 122] = "F11";
        $mol_keyboard_code[$mol_keyboard_code["F12"] = 123] = "F12";
        $mol_keyboard_code[$mol_keyboard_code["numLock"] = 144] = "numLock";
        $mol_keyboard_code[$mol_keyboard_code["scrollLock"] = 145] = "scrollLock";
        $mol_keyboard_code[$mol_keyboard_code["semicolon"] = 186] = "semicolon";
        $mol_keyboard_code[$mol_keyboard_code["equals"] = 187] = "equals";
        $mol_keyboard_code[$mol_keyboard_code["comma"] = 188] = "comma";
        $mol_keyboard_code[$mol_keyboard_code["dash"] = 189] = "dash";
        $mol_keyboard_code[$mol_keyboard_code["period"] = 190] = "period";
        $mol_keyboard_code[$mol_keyboard_code["forwardSlash"] = 191] = "forwardSlash";
        $mol_keyboard_code[$mol_keyboard_code["graveAccent"] = 192] = "graveAccent";
        $mol_keyboard_code[$mol_keyboard_code["bracketOpen"] = 219] = "bracketOpen";
        $mol_keyboard_code[$mol_keyboard_code["slashBack"] = 220] = "slashBack";
        $mol_keyboard_code[$mol_keyboard_code["slashBackLeft"] = 226] = "slashBackLeft";
        $mol_keyboard_code[$mol_keyboard_code["bracketClose"] = 221] = "bracketClose";
        $mol_keyboard_code[$mol_keyboard_code["quoteSingle"] = 222] = "quoteSingle";
    })($mol_keyboard_code = $.$mol_keyboard_code || ($.$mol_keyboard_code = {}));
})($ || ($ = {}));
//mol/keyboard/code.ts
;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        class $mol_hotkey extends $.$mol_hotkey {
            key() {
                return super.key();
            }
            keydown(event) {
                if (!event)
                    return;
                if (event.defaultPrevented)
                    return;
                let name = $mol_keyboard_code[event.keyCode];
                if (this.mod_ctrl() !== event.ctrlKey)
                    return;
                if (this.mod_alt() !== event.altKey)
                    return;
                if (this.mod_shift() !== event.shiftKey)
                    return;
                const handle = this.key()[name];
                if (handle)
                    handle(event);
            }
        }
        $$.$mol_hotkey = $mol_hotkey;
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));
//mol/hotkey/hotkey.view.ts
;
"use strict";
var $;
(function ($) {
    class $mol_string extends $mol_view {
        dom_name() {
            return "input";
        }
        enabled() {
            return true;
        }
        minimal_height() {
            return 40;
        }
        autocomplete() {
            return false;
        }
        selection(val) {
            if (val !== undefined)
                return val;
            return [];
        }
        auto() {
            return [
                this.selection_watcher()
            ];
        }
        field() {
            return {
                ...super.field(),
                disabled: this.disabled(),
                value: this.value_changed(),
                placeholder: this.hint(),
                spellcheck: this.spellcheck(),
                autocomplete: this.autocomplete_native(),
                selectionEnd: this.selection_end(),
                selectionStart: this.selection_start()
            };
        }
        attr() {
            return {
                ...super.attr(),
                maxlength: this.length_max(),
                type: this.type()
            };
        }
        event() {
            return {
                ...super.event(),
                input: (event) => this.event_change(event),
                keydown: (event) => this.event_key_press(event)
            };
        }
        plugins() {
            return [
                this.Submit()
            ];
        }
        selection_watcher() {
            return null;
        }
        disabled() {
            return false;
        }
        value(val) {
            if (val !== undefined)
                return val;
            return "";
        }
        value_changed(val) {
            return this.value(val);
        }
        hint() {
            return " ";
        }
        spellcheck() {
            return false;
        }
        autocomplete_native() {
            return "";
        }
        selection_end() {
            return 0;
        }
        selection_start() {
            return 0;
        }
        length_max() {
            return Infinity;
        }
        type(val) {
            if (val !== undefined)
                return val;
            return "text";
        }
        event_change(event) {
            if (event !== undefined)
                return event;
            return null;
        }
        event_key_press(event) {
            if (event !== undefined)
                return event;
            return null;
        }
        submit(event) {
            if (event !== undefined)
                return event;
            return null;
        }
        Submit() {
            const obj = new this.$.$mol_hotkey();
            obj.key = () => ({
                enter: (event) => this.submit(event)
            });
            return obj;
        }
    }
    __decorate([
        $mol_mem
    ], $mol_string.prototype, "selection", null);
    __decorate([
        $mol_mem
    ], $mol_string.prototype, "value", null);
    __decorate([
        $mol_mem
    ], $mol_string.prototype, "type", null);
    __decorate([
        $mol_mem
    ], $mol_string.prototype, "event_change", null);
    __decorate([
        $mol_mem
    ], $mol_string.prototype, "event_key_press", null);
    __decorate([
        $mol_mem
    ], $mol_string.prototype, "submit", null);
    __decorate([
        $mol_mem
    ], $mol_string.prototype, "Submit", null);
    $.$mol_string = $mol_string;
})($ || ($ = {}));
//mol/string/-view.tree/string.view.tree.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("mol/gap/gap.css", ":root {\n\t--mol_gap_block: .75rem;\n\t--mol_gap_text: .5rem .75rem;\n\t--mol_gap_round: .25rem;\n\t--mol_gap_space: .25rem;\n\t--mol_gap_blur: .5rem;\n}\n");
})($ || ($ = {}));
//mol/gap/-css/gap.css.ts
;
"use strict";
var $;
(function ($) {
    const { vary } = $mol_style_func;
    $.$mol_gap = {
        block: vary('--mol_gap_block'),
        text: vary('--mol_gap_text'),
        round: vary('--mol_gap_round'),
        space: vary('--mol_gap_space'),
        blur: vary('--mol_gap_blur'),
    };
})($ || ($ = {}));
//mol/gap/gap.ts
;
"use strict";
var $;
(function ($) {
    class $mol_dom_listener extends $mol_object {
        _node;
        _event;
        _handler;
        _config;
        constructor(_node, _event, _handler, _config = { passive: true }) {
            super();
            this._node = _node;
            this._event = _event;
            this._handler = _handler;
            this._config = _config;
            this._node.addEventListener(this._event, this._handler, this._config);
        }
        destructor() {
            this._node.removeEventListener(this._event, this._handler, this._config);
            super.destructor();
        }
    }
    $.$mol_dom_listener = $mol_dom_listener;
})($ || ($ = {}));
//mol/dom/listener/listener.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("mol/string/string.view.css", "[mol_string] {\n\tbox-sizing: border-box;\n\toutline-offset: 0;\n\tborder: none;\n\tborder-radius: var(--mol_gap_round);\n\twhite-space: nowrap;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\tpadding: var(--mol_gap_text);\n\ttext-align: left;\n\tposition: relative;\n\tz-index: 0;\n\tfont: inherit;\n\tflex: 1 1 auto;\n\tbackground: var(--mol_theme_hover);\n\tmin-width: 0;\n\tcolor: var(--mol_theme_control);\n}\n\n[mol_string]:disabled {\n\tbackground-color: transparent;\n\tcolor: var(--mol_theme_text);\n}\n\n[mol_string]:placeholder-shown {\n\tbackground: var(--mol_theme_field);\n\tbox-shadow: inset 0 0 0 1px var(--mol_theme_line);\n}\n\n[mol_string]:focus {\n\toutline: none;\n\tz-index: 1;\n\tcolor: var(--mol_theme_text);\n\tbackground: var(--mol_theme_field);\n\tbox-shadow: inset 0 0 0 1px var(--mol_theme_focus);\n}\n\n[mol_string]:not(:placeholder-shown):not(:focus):enabled:hover {\n\tbackground: var(--mol_theme_hover);\n}\n\n[mol_string]::-ms-clear {\n\tdisplay: none;\n}\n");
})($ || ($ = {}));
//mol/string/-css/string.view.css.ts
;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        class $mol_string extends $.$mol_string {
            event_change(next) {
                if (!next)
                    return;
                this.value(next.target.value);
                this.selection_change(next);
            }
            disabled() {
                return !this.enabled();
            }
            autocomplete_native() {
                return this.autocomplete() ? 'on' : 'off';
            }
            selection_watcher() {
                return new $mol_dom_listener(this.$.$mol_dom_context.document, 'selectionchange', event => this.selection_change(event));
            }
            selection_change(event) {
                const el = this.dom_node();
                this.selection([
                    el.selectionStart,
                    el.selectionEnd,
                ]);
            }
            selection_start() {
                return this.selection()[0];
            }
            selection_end() {
                return this.selection()[1];
            }
        }
        __decorate([
            $mol_mem
        ], $mol_string.prototype, "selection_watcher", null);
        $$.$mol_string = $mol_string;
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));
//mol/string/string.view.ts
;
"use strict";
var $;
(function ($) {
    class $mol_speck extends $mol_view {
        attr() {
            return {
                ...super.attr(),
                mol_theme: "$mol_theme_accent"
            };
        }
        style() {
            return {
                ...super.style(),
                minHeight: "1em"
            };
        }
        sub() {
            return [
                this.value()
            ];
        }
        value() {
            return null;
        }
    }
    $.$mol_speck = $mol_speck;
})($ || ($ = {}));
//mol/speck/-view.tree/speck.view.tree.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("mol/speck/speck.view.css", "[mol_speck] {\n\tfont-size: .75rem;\n\tborder-radius: 1rem;\n\tmargin: -.75em .5em;\n\talign-self: flex-start;\n\tmin-height: 1em;\n\tmin-width: .5em;\n\tvertical-align: sub;\n\tpadding: .25em .5em;\n\tposition: absolute;\n\tz-index: 2;\n    text-align: center;\n    line-height: 1;\n    display: inline-block;\n\ttext-shadow: 1px 1px 0 black;\n}\n");
})($ || ($ = {}));
//mol/speck/-css/speck.view.css.ts
;
"use strict";
var $;
(function ($) {
    class $mol_button extends $mol_view {
        enabled() {
            return true;
        }
        minimal_height() {
            return 40;
        }
        minimal_width() {
            return 40;
        }
        click(event) {
            if (event !== undefined)
                return event;
            return null;
        }
        event_click(event) {
            if (event !== undefined)
                return event;
            return null;
        }
        event() {
            return {
                ...super.event(),
                click: (event) => this.event_activate(event),
                keydown: (event) => this.event_key_press(event)
            };
        }
        attr() {
            return {
                ...super.attr(),
                disabled: this.disabled(),
                role: "button",
                tabindex: this.tab_index(),
                title: this.hint_or_error()
            };
        }
        sub() {
            return [
                this.title()
            ];
        }
        Speck() {
            const obj = new this.$.$mol_speck();
            return obj;
        }
        event_activate(event) {
            if (event !== undefined)
                return event;
            return null;
        }
        event_key_press(event) {
            if (event !== undefined)
                return event;
            return null;
        }
        disabled() {
            return false;
        }
        tab_index() {
            return 0;
        }
        hint() {
            return "";
        }
        hint_or_error() {
            return this.hint();
        }
    }
    __decorate([
        $mol_mem
    ], $mol_button.prototype, "click", null);
    __decorate([
        $mol_mem
    ], $mol_button.prototype, "event_click", null);
    __decorate([
        $mol_mem
    ], $mol_button.prototype, "Speck", null);
    __decorate([
        $mol_mem
    ], $mol_button.prototype, "event_activate", null);
    __decorate([
        $mol_mem
    ], $mol_button.prototype, "event_key_press", null);
    $.$mol_button = $mol_button;
})($ || ($ = {}));
//mol/button/-view.tree/button.view.tree.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("mol/button/button.view.css", "[mol_button] {\n\tborder: none;\n\tfont: inherit;\n\tdisplay: inline-flex;\n\tflex-shrink: 0;\n\ttext-decoration: inherit;\n\tcursor: inherit;\n\tposition: relative;\n\tbox-sizing: border-box;\n\tword-break: normal;\n\tcursor: default;\n\tuser-select: none;\n\tborder-radius: var(--mol_gap_round);\n}\n[mol_button]:focus {\n\toutline: none;\n}\n");
})($ || ($ = {}));
//mol/button/-css/button.view.css.ts
;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        class $mol_button extends $.$mol_button {
            status(next = null) { return next; }
            disabled() {
                return !this.enabled();
            }
            event_activate(next) {
                if (!next)
                    return;
                if (!this.enabled())
                    return;
                try {
                    this.event_click(next);
                    this.click(next);
                    this.status(null);
                }
                catch (error) {
                    this.status(error);
                }
            }
            event_key_press(event) {
                if (event.keyCode === $mol_keyboard_code.enter) {
                    return this.event_activate(event);
                }
            }
            tab_index() {
                return this.enabled() ? super.tab_index() : -1;
            }
            error() {
                try {
                    this.status();
                    return '';
                }
                catch (error) {
                    if (error instanceof Promise) {
                        return $mol_fail_hidden(error);
                    }
                    return String(error.message ?? error);
                }
            }
            hint_or_error() {
                return this.error() || super.hint_or_error();
            }
            sub_visible() {
                return [
                    ...this.error() ? [this.Speck()] : [],
                    ...this.sub(),
                ];
            }
        }
        __decorate([
            $mol_mem
        ], $mol_button.prototype, "status", null);
        $$.$mol_button = $mol_button;
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));
//mol/button/button.view.ts
;
"use strict";
//mol/type/result/result.ts
;
"use strict";
//mol/type/error/error.ts
;
"use strict";
//mol/type/override/override.ts
;
"use strict";
//mol/style/properties/properties.ts
;
"use strict";
//mol/style/pseudo/class.ts
;
"use strict";
//mol/style/pseudo/element.ts
;
"use strict";
//mol/style/guard/guard.ts
;
"use strict";
var $;
(function ($) {
    function $mol_style_sheet(Component, config0) {
        let rules = [];
        const block = $mol_dom_qname($mol_ambient({}).$mol_func_name(Component));
        const kebab = (name) => name.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase());
        const make_class = (prefix, path, config) => {
            const props = [];
            const selector = (prefix, path) => {
                if (path.length === 0)
                    return prefix || `[${block}]`;
                return `${prefix ? prefix + ' ' : ''}[${block}_${path.join('_')}]`;
            };
            for (const key of Object.keys(config).reverse()) {
                if (/^[a-z]/.test(key)) {
                    const addProp = (keys, val) => {
                        if (Array.isArray(val)) {
                            if (val[0] && [Array, Object].includes(val[0].constructor)) {
                                val = val.map(v => {
                                    return Object.entries(v).map(([n, a]) => {
                                        if (a === true)
                                            return kebab(n);
                                        if (a === false)
                                            return null;
                                        return String(a);
                                    }).filter(Boolean).join(' ');
                                }).join(',');
                            }
                            else {
                                val = val.join(' ');
                            }
                            props.push(`\t${keys.join('-')}: ${val};\n`);
                        }
                        else if (val.constructor === Object) {
                            for (let suffix in val) {
                                addProp([...keys, kebab(suffix)], val[suffix]);
                            }
                        }
                        else {
                            props.push(`\t${keys.join('-')}: ${val};\n`);
                        }
                    };
                    addProp([kebab(key)], config[key]);
                }
                else if (/^[A-Z]/.test(key)) {
                    make_class(prefix, [...path, key.toLowerCase()], config[key]);
                }
                else if (key[0] === '$') {
                    make_class(selector(prefix, path) + ' [' + $mol_dom_qname(key) + ']', [], config[key]);
                }
                else if (key === '>') {
                    const types = config[key];
                    for (let type in types) {
                        make_class(selector(prefix, path) + ' > [' + $mol_dom_qname(type) + ']', [], types[type]);
                    }
                }
                else if (key === '@') {
                    const attrs = config[key];
                    for (let name in attrs) {
                        for (let val in attrs[name]) {
                            make_class(selector(prefix, path) + '[' + name + '=' + JSON.stringify(val) + ']', [], attrs[name][val]);
                        }
                    }
                }
                else if (key === '@media') {
                    const media = config[key];
                    for (let query in media) {
                        rules.push('}\n');
                        make_class(prefix, path, media[query]);
                        rules.push(`${key} ${query} {\n`);
                    }
                }
                else {
                    make_class(selector(prefix, path) + key, [], config[key]);
                }
            }
            if (props.length) {
                rules.push(`${selector(prefix, path)} {\n${props.reverse().join('')}}\n`);
            }
        };
        make_class('', [], config0);
        return rules.reverse().join('');
    }
    $.$mol_style_sheet = $mol_style_sheet;
})($ || ($ = {}));
//mol/style/sheet/sheet.ts
;
"use strict";
var $;
(function ($) {
    function $mol_style_define(Component, config) {
        return $mol_style_attach(Component.name, $mol_style_sheet(Component, config));
    }
    $.$mol_style_define = $mol_style_define;
})($ || ($ = {}));
//mol/style/define/define.ts
;
"use strict";
var $;
(function ($) {
    class $mol_link extends $mol_view {
        dom_name() {
            return "a";
        }
        attr() {
            return {
                ...super.attr(),
                href: this.uri(),
                title: this.hint(),
                target: this.target(),
                download: this.file_name(),
                mol_link_current: this.current()
            };
        }
        sub() {
            return [
                this.title()
            ];
        }
        arg() {
            return {};
        }
        event() {
            return {
                ...super.event(),
                click: (event) => this.click(event)
            };
        }
        uri() {
            return "";
        }
        hint() {
            return "";
        }
        target() {
            return "_self";
        }
        file_name() {
            return "";
        }
        current() {
            return false;
        }
        event_click(event) {
            if (event !== undefined)
                return event;
            return null;
        }
        click(event) {
            return this.event_click(event);
        }
    }
    __decorate([
        $mol_mem
    ], $mol_link.prototype, "event_click", null);
    $.$mol_link = $mol_link;
})($ || ($ = {}));
//mol/link/-view.tree/link.view.tree.ts
;
"use strict";
var $;
(function ($) {
    class $mol_state_arg extends $mol_object {
        prefix;
        static href(next) {
            if (next === undefined) {
                next = $mol_dom_context.location.href;
            }
            else if (!/^about:srcdoc/.test(next)) {
                new $mol_after_frame(() => {
                    const next = this.href();
                    const prev = $mol_dom_context.location.href;
                    if (next === prev)
                        return;
                    const history = $mol_dom_context.history;
                    history.replaceState(history.state, $mol_dom_context.document.title, next);
                });
            }
            if ($mol_dom_context.parent !== $mol_dom_context.self) {
                $mol_dom_context.parent.postMessage(['hashchange', next], '*');
            }
            return next;
        }
        static href_normal() {
            return this.link({});
        }
        static href_absolute() {
            return new URL(this.href(), $mol_dom_context.location.href).toString();
        }
        static dict(next) {
            var href = this.href(next && this.make_link(next)).split(/#!?/)[1] || '';
            var chunks = href.split(this.separator);
            var params = {};
            chunks.forEach(chunk => {
                if (!chunk)
                    return;
                var vals = chunk.split('=').map(decodeURIComponent);
                params[vals.shift()] = vals.join('=');
            });
            return params;
        }
        static dict_cut(except) {
            const dict = this.dict();
            const cut = {};
            for (const key in dict) {
                if (except.indexOf(key) >= 0)
                    continue;
                cut[key] = dict[key];
            }
            return cut;
        }
        static value(key, next) {
            const nextDict = (next === void 0) ? void 0 : { ...this.dict(), [key]: next };
            const next2 = this.dict(nextDict)[key];
            return (next2 == null) ? null : next2;
        }
        static link(next) {
            return this.make_link({
                ...this.dict_cut(Object.keys(next)),
                ...next,
            });
        }
        static prolog = '!';
        static separator = '/';
        static make_link(next) {
            const chunks = [];
            for (let key in next) {
                if (null == next[key])
                    continue;
                const val = next[key];
                chunks.push([key].concat(val ? [val] : []).map(this.encode).join('='));
            }
            return new URL('#' + this.prolog + chunks.join(this.separator), this.href_absolute()).toString();
        }
        static encode(str) {
            return encodeURIComponent(str).replace(/\(/g, '%28').replace(/\)/g, '%29');
        }
        constructor(prefix = '') {
            super();
            this.prefix = prefix;
        }
        value(key, next) {
            return this.constructor.value(this.prefix + key, next);
        }
        sub(postfix) {
            return new this.constructor(this.prefix + postfix + '.');
        }
        link(next) {
            var prefix = this.prefix;
            var dict = {};
            for (var key in next) {
                dict[prefix + key] = next[key];
            }
            return this.constructor.link(dict);
        }
    }
    __decorate([
        $mol_mem
    ], $mol_state_arg, "href", null);
    __decorate([
        $mol_mem
    ], $mol_state_arg, "href_normal", null);
    __decorate([
        $mol_mem
    ], $mol_state_arg, "href_absolute", null);
    __decorate([
        $mol_mem
    ], $mol_state_arg, "dict", null);
    __decorate([
        $mol_mem_key
    ], $mol_state_arg, "dict_cut", null);
    __decorate([
        $mol_mem_key
    ], $mol_state_arg, "value", null);
    __decorate([
        $mol_mem_key
    ], $mol_state_arg, "make_link", null);
    $.$mol_state_arg = $mol_state_arg;
    const $mol_state_arg_change = (event) => {
        $mol_state_arg.href($mol_dom_context.location.href);
    };
    self.addEventListener('hashchange', $mol_state_arg_change);
})($ || ($ = {}));
//mol/state/arg/arg.web.ts
;
"use strict";
var $;
(function ($) {
    const { rem } = $mol_style_unit;
    $mol_style_define($mol_link, {
        textDecoration: 'none',
        color: $mol_theme.control,
        stroke: 'currentcolor',
        cursor: 'pointer',
        padding: $mol_gap.text,
        boxSizing: 'border-box',
        position: 'relative',
        minWidth: rem(2.5),
        gap: $mol_gap.space,
        border: {
            radius: $mol_gap.round,
        },
        ':hover': {
            background: {
                color: $mol_theme.hover,
            },
        },
        ':focus': {
            outline: 'none',
            background: {
                color: $mol_theme.hover,
            }
        },
        ':focus-within': {
            outline: 'none',
            background: {
                color: $mol_theme.hover,
            }
        },
        '@': {
            mol_link_current: {
                'true': {
                    color: $mol_theme.focus,
                    textShadow: '0 0',
                }
            }
        },
    });
})($ || ($ = {}));
//mol/link/link.view.css.ts
;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        class $mol_link extends $.$mol_link {
            uri() {
                const arg = this.arg();
                const uri = new this.$.$mol_state_arg(this.state_key()).link(arg);
                if (uri !== this.$.$mol_state_arg.href())
                    return uri;
                const arg2 = {};
                for (let i in arg)
                    arg2[i] = null;
                return new this.$.$mol_state_arg(this.state_key()).link(arg2);
            }
            uri_native() {
                const base = this.$.$mol_state_arg.href();
                return new URL(this.uri(), base);
            }
            current() {
                const base = this.$.$mol_state_arg.href_normal();
                const target = this.uri_native().toString();
                if (base === target)
                    return true;
                const args = this.arg();
                const keys = Object.keys(args).filter(key => args[key] != null);
                if (keys.length === 0)
                    return false;
                for (const key of keys) {
                    if (this.$.$mol_state_arg.value(key) !== args[key])
                        return false;
                }
                return true;
            }
            file_name() {
                return null;
            }
            minimal_height() {
                return Math.max(super.minimal_height(), 24);
            }
            target() {
                return (this.uri_native().origin === $mol_dom_context.location.origin) ? '_self' : '_blank';
            }
        }
        __decorate([
            $mol_mem
        ], $mol_link.prototype, "uri", null);
        __decorate([
            $mol_mem
        ], $mol_link.prototype, "uri_native", null);
        __decorate([
            $mol_mem
        ], $mol_link.prototype, "current", null);
        $$.$mol_link = $mol_link;
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));
//mol/link/link.view.ts
;
"use strict";
var $;
(function ($) {
    class $mol_button_typed extends $mol_button {
    }
    $.$mol_button_typed = $mol_button_typed;
})($ || ($ = {}));
//mol/button/typed/-view.tree/typed.view.tree.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("mol/button/typed/typed.view.css", "[mol_button_typed] {\n\talign-content: center;\n\talign-items: center;\n\tpadding: var(--mol_gap_text);\n\tborder-radius: var(--mol_gap_round);\n\tgap: var(--mol_gap_space);\n}\n\n[mol_button_typed][disabled] {\n\tcolor: var(--mol_theme_text);\n\tpointer-events: none;\n}\n\n[mol_button_typed]:hover ,\n[mol_button_typed]:focus {\n\tcursor: pointer;\n\tbackground-color: var(--mol_theme_hover);\n}\n");
})($ || ($ = {}));
//mol/button/typed/-css/typed.view.css.ts
;
"use strict";
var $;
(function ($) {
    class $mol_button_minor extends $mol_button_typed {
    }
    $.$mol_button_minor = $mol_button_minor;
})($ || ($ = {}));
//mol/button/minor/-view.tree/minor.view.tree.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("mol/button/minor/minor.view.css", "[mol_button_minor] {\n\tcolor: var(--mol_theme_control);\n}\n");
})($ || ($ = {}));
//mol/button/minor/-css/minor.view.css.ts
;
"use strict";
var $;
(function ($) {
    class $mol_check extends $mol_button_minor {
        attr() {
            return {
                ...super.attr(),
                mol_check_checked: this.checked(),
                "aria-checked": this.checked(),
                role: "checkbox"
            };
        }
        sub() {
            return [
                this.Icon(),
                this.label()
            ];
        }
        checked(val) {
            if (val !== undefined)
                return val;
            return false;
        }
        Icon() {
            return null;
        }
        title() {
            return "";
        }
        Title() {
            const obj = new this.$.$mol_view();
            obj.sub = () => [
                this.title()
            ];
            return obj;
        }
        label() {
            return [
                this.Title()
            ];
        }
    }
    __decorate([
        $mol_mem
    ], $mol_check.prototype, "checked", null);
    __decorate([
        $mol_mem
    ], $mol_check.prototype, "Title", null);
    $.$mol_check = $mol_check;
})($ || ($ = {}));
//mol/check/-view.tree/check.view.tree.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("mol/check/check.css", "[mol_check] {\n\tflex: 0 0 auto;\n\tjustify-content: flex-start;\n\talign-content: center;\n\talign-items: flex-start;\n\tborder: none;\n\tfont-weight: inherit;\n\tbox-shadow: none;\n\ttext-align: left;\n\tpadding: var(--mol_gap_text);\n\tdisplay: inline-flex;\n\tflex-wrap: nowrap;\n}\n");
})($ || ($ = {}));
//mol/check/-css/check.css.ts
;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        class $mol_check extends $.$mol_check {
            click(next) {
                if (next?.defaultPrevented)
                    return;
                this.checked(!this.checked());
                if (next)
                    next.preventDefault();
            }
            sub() {
                return [
                    ...$mol_maybe(this.Icon()),
                    ...this.label(),
                ];
            }
            label() {
                return this.title() ? super.label() : [];
            }
        }
        $$.$mol_check = $mol_check;
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));
//mol/check/check.view.ts
;
"use strict";
var $;
(function ($) {
    class $mol_scroll extends $mol_view {
        minimal_height() {
            return 0;
        }
        _event_scroll_timer(val) {
            if (val !== undefined)
                return val;
            return null;
        }
        field() {
            return {
                ...super.field(),
                scrollTop: this.scroll_top(),
                scrollLeft: this.scroll_left(),
                tabIndex: this.tabindex()
            };
        }
        event() {
            return {
                ...super.event(),
                scroll: (event) => this.event_scroll(event)
            };
        }
        scroll_top(val) {
            if (val !== undefined)
                return val;
            return 0;
        }
        scroll_left(val) {
            if (val !== undefined)
                return val;
            return 0;
        }
        tabindex() {
            return -1;
        }
        event_scroll(event) {
            if (event !== undefined)
                return event;
            return null;
        }
    }
    __decorate([
        $mol_mem
    ], $mol_scroll.prototype, "_event_scroll_timer", null);
    __decorate([
        $mol_mem
    ], $mol_scroll.prototype, "scroll_top", null);
    __decorate([
        $mol_mem
    ], $mol_scroll.prototype, "scroll_left", null);
    __decorate([
        $mol_mem
    ], $mol_scroll.prototype, "event_scroll", null);
    $.$mol_scroll = $mol_scroll;
})($ || ($ = {}));
//mol/scroll/-view.tree/scroll.view.tree.ts
;
"use strict";
var $;
(function ($) {
    class $mol_state_session extends $mol_object {
        static 'native()';
        static native() {
            if (this['native()'])
                return this['native()'];
            check: try {
                const native = $mol_dom_context.sessionStorage;
                if (!native)
                    break check;
                native.setItem('', '');
                native.removeItem('');
                return this['native()'] = native;
            }
            catch (error) {
                console.warn(error);
            }
            return this['native()'] = {
                getItem(key) {
                    return this[':' + key];
                },
                setItem(key, value) {
                    this[':' + key] = value;
                },
                removeItem(key) {
                    this[':' + key] = void 0;
                }
            };
        }
        static value(key, next) {
            if (next === void 0)
                return JSON.parse(this.native().getItem(key) || 'null');
            if (next === null)
                this.native().removeItem(key);
            else
                this.native().setItem(key, JSON.stringify(next));
            return next;
        }
        prefix() { return ''; }
        value(key, next) {
            return $mol_state_session.value(this.prefix() + '.' + key, next);
        }
    }
    __decorate([
        $mol_mem_key
    ], $mol_state_session, "value", null);
    $.$mol_state_session = $mol_state_session;
})($ || ($ = {}));
//mol/state/session/session.ts
;
"use strict";
var $;
(function ($) {
    class $mol_after_timeout extends $mol_object2 {
        delay;
        task;
        id;
        constructor(delay, task) {
            super();
            this.delay = delay;
            this.task = task;
            this.id = setTimeout(task, delay);
        }
        destructor() {
            clearTimeout(this.id);
        }
    }
    $.$mol_after_timeout = $mol_after_timeout;
})($ || ($ = {}));
//mol/after/timeout/timeout.ts
;
"use strict";
var $;
(function ($) {
    class $mol_print extends $mol_object {
        static before() {
            return new $mol_dom_listener(this.$.$mol_dom_context, 'beforeprint', () => {
                this.active(true);
            });
        }
        static after() {
            return new $mol_dom_listener(this.$.$mol_dom_context, 'afterprint', () => {
                this.active(false);
            });
        }
        static active(next) {
            this.before();
            this.after();
            return next || false;
        }
    }
    __decorate([
        $mol_mem
    ], $mol_print, "before", null);
    __decorate([
        $mol_mem
    ], $mol_print, "after", null);
    __decorate([
        $mol_mem
    ], $mol_print, "active", null);
    $.$mol_print = $mol_print;
})($ || ($ = {}));
//mol/print/print.ts
;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        const { per, rem, px } = $mol_style_unit;
        $mol_style_define($mol_scroll, {
            overflow: 'auto',
        });
        $mol_style_define($mol_scroll, {
            display: 'flex',
            overflow: 'overlay',
            flex: {
                direction: 'column',
                grow: 1,
                shrink: 1,
                basis: 0,
            },
            outline: 'none',
            alignSelf: 'stretch',
            boxSizing: 'border-box',
            willChange: 'scroll-position',
            maxHeight: per(100),
            maxWidth: per(100),
            webkitOverflowScrolling: 'touch',
            contain: 'content',
            '>': {
                $mol_view: {
                    transform: 'translateZ(0)',
                },
            },
            scrollbar: {
                color: [$mol_theme.line, 'transparent'],
            },
            '::-webkit-scrollbar': {
                width: rem(.25),
                height: rem(.25),
            },
            '::-webkit-scrollbar-corner': {
                background: {
                    color: $mol_theme.line,
                },
            },
            '::-webkit-scrollbar-track': {
                background: {
                    color: 'transparent',
                },
            },
            '::-webkit-scrollbar-thumb': {
                background: {
                    color: $mol_theme.line,
                },
                border: {
                    radius: $mol_gap.round,
                },
            },
            '@media': {
                'print': {
                    overflow: 'visible',
                    contain: 'none',
                    maxHeight: 'unset',
                },
            },
        });
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));
//mol/scroll/scroll.view.css.ts
;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        class $mol_scroll extends $.$mol_scroll {
            scroll_top(next) {
                return $mol_state_session.value(`${this}.scroll_top()`, next) || 0;
            }
            scroll_left(next) {
                return $mol_state_session.value(`${this}.scroll_left()`, next) || 0;
            }
            _event_scroll_timer(next) {
                return next;
            }
            event_scroll(next) {
                this._event_scroll_timer()?.destructor();
                const el = this.dom_node();
                this._event_scroll_timer(new $mol_after_timeout(200, () => {
                    this.scroll_top(Math.max(0, el.scrollTop));
                    this.scroll_left(Math.max(0, el.scrollLeft));
                }));
            }
            minimal_height() {
                return this.$.$mol_print.active() ? null : 0;
            }
            minimal_width() {
                return this.$.$mol_print.active() ? null : 0;
            }
        }
        __decorate([
            $mol_mem
        ], $mol_scroll.prototype, "scroll_top", null);
        __decorate([
            $mol_mem
        ], $mol_scroll.prototype, "scroll_left", null);
        __decorate([
            $mol_memo.method
        ], $mol_scroll.prototype, "_event_scroll_timer", null);
        $$.$mol_scroll = $mol_scroll;
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));
//mol/scroll/scroll.view.ts
;
"use strict";
var $;
(function ($) {
    class $mol_list extends $mol_view {
        render_visible_only() {
            return true;
        }
        render_over() {
            return 0;
        }
        sub() {
            return this.rows();
        }
        Empty() {
            const obj = new this.$.$mol_view();
            return obj;
        }
        Gap_before() {
            const obj = new this.$.$mol_view();
            obj.style = () => ({
                paddingTop: this.gap_before()
            });
            return obj;
        }
        Gap_after() {
            const obj = new this.$.$mol_view();
            obj.style = () => ({
                paddingTop: this.gap_after()
            });
            return obj;
        }
        view_window() {
            return [
                0,
                0
            ];
        }
        rows() {
            return [];
        }
        gap_before() {
            return 0;
        }
        gap_after() {
            return 0;
        }
    }
    __decorate([
        $mol_mem
    ], $mol_list.prototype, "Empty", null);
    __decorate([
        $mol_mem
    ], $mol_list.prototype, "Gap_before", null);
    __decorate([
        $mol_mem
    ], $mol_list.prototype, "Gap_after", null);
    $.$mol_list = $mol_list;
})($ || ($ = {}));
//mol/list/-view.tree/list.view.tree.ts
;
"use strict";
var $;
(function ($) {
    function $mol_support_css_overflow_anchor() {
        return this.$mol_dom_context.CSS?.supports('overflow-anchor:auto') ?? false;
    }
    $.$mol_support_css_overflow_anchor = $mol_support_css_overflow_anchor;
})($ || ($ = {}));
//mol/support/css/css.ts
;
"use strict";
var $;
(function ($) {
    function $mol_wire_probe(task, next) {
        const warm = $mol_wire_fiber.warm;
        try {
            $mol_wire_fiber.warm = false;
            return task();
        }
        finally {
            $mol_wire_fiber.warm = warm;
        }
    }
    $.$mol_wire_probe = $mol_wire_probe;
})($ || ($ = {}));
//mol/wire/probe/probe.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_mem_cached = $mol_wire_probe;
})($ || ($ = {}));
//mol/mem/cached/cached.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("mol/list/list.view.css", "[mol_list] {\n\twill-change: contents;\n\tdisplay: flex;\n\tflex-direction: column;\n\tflex-shrink: 0;\n\tmax-width: 100%;\n\t/* display: flex;\n\talign-items: stretch;\n\talign-content: stretch; */\n\ttransition: none;\n\tmin-height: .5rem;\n}\n\n[mol_list_gap_before] ,\n[mol_list_gap_after] {\n\tdisplay: block !important;\n\tflex: none;\n\ttransition: none;\n\toverflow-anchor: none;\n}\n \n[mol_list] > * {\n\tdisplay: flex;\n}\n");
})($ || ($ = {}));
//mol/list/-css/list.view.css.ts
;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        class $mol_list extends $.$mol_list {
            sub() {
                const rows = this.rows();
                return (rows.length === 0) ? [this.Empty()] : rows;
            }
            render_visible_only() {
                return this.$.$mol_support_css_overflow_anchor();
            }
            view_window(next) {
                const kids = this.sub();
                if (kids.length < 3)
                    return [0, kids.length];
                if (this.$.$mol_print.active())
                    return [0, kids.length];
                const rect = this.view_rect();
                if (next)
                    return next;
                let [min, max] = $mol_mem_cached(() => this.view_window()) ?? [0, 0];
                let max2 = max = Math.min(max, kids.length);
                let min2 = min = Math.max(0, Math.min(min, max - 1));
                const anchoring = this.render_visible_only();
                const window_height = this.$.$mol_window.size().height + 40;
                const over = Math.ceil(window_height * this.render_over());
                const limit_top = -over;
                const limit_bottom = window_height + over;
                const gap_before = $mol_mem_cached(() => this.gap_before()) ?? 0;
                const gap_after = $mol_mem_cached(() => this.gap_after()) ?? 0;
                let top = Math.ceil(rect?.top ?? 0) + gap_before;
                let bottom = Math.ceil(rect?.bottom ?? 0) - gap_after;
                if (top <= limit_top && bottom >= limit_bottom) {
                    return [min2, max2];
                }
                if (anchoring && ((bottom < limit_top) || (top > limit_bottom))) {
                    min = 0;
                    top = Math.ceil(rect?.top ?? 0);
                    while (min < (kids.length - 1)) {
                        const height = kids[min].minimal_height();
                        if (top + height >= limit_top)
                            break;
                        top += height;
                        ++min;
                    }
                    min2 = min;
                    max2 = max = min;
                    bottom = top;
                }
                let top2 = top;
                let bottom2 = bottom;
                if (anchoring && (top <= limit_top) && (bottom2 < limit_bottom)) {
                    min2 = max;
                    top2 = bottom;
                }
                if ((bottom >= limit_bottom) && (top2 >= limit_top)) {
                    max2 = min;
                    bottom2 = top;
                }
                while (bottom2 < limit_bottom && max2 < kids.length) {
                    bottom2 += kids[max2].minimal_height();
                    ++max2;
                }
                while (anchoring && ((top2 >= limit_top) && (min2 > 0))) {
                    --min2;
                    top2 -= kids[min2].minimal_height();
                }
                return [min2, max2];
            }
            gap_before() {
                const skipped = this.sub().slice(0, this.view_window()[0]);
                return Math.max(0, skipped.reduce((sum, view) => sum + view.minimal_height(), 0));
            }
            gap_after() {
                const skipped = this.sub().slice(this.view_window()[1]);
                return Math.max(0, skipped.reduce((sum, view) => sum + view.minimal_height(), 0));
            }
            sub_visible() {
                return [
                    ...this.gap_before() ? [this.Gap_before()] : [],
                    ...this.sub().slice(...this.view_window()),
                    ...this.gap_after() ? [this.Gap_after()] : [],
                ];
            }
            minimal_height() {
                return this.sub().reduce((sum, view) => {
                    try {
                        return sum + view.minimal_height();
                    }
                    catch (error) {
                        $mol_fail_log(error);
                        return sum;
                    }
                }, 0);
            }
            force_render(path) {
                const kids = this.rows();
                const index = kids.findIndex(item => path.has(item));
                if (index >= 0) {
                    const win = this.view_window();
                    if (index < win[0] || index >= win[1]) {
                        this.view_window([index, index + 1]);
                    }
                    kids[index].force_render(path);
                }
            }
        }
        __decorate([
            $mol_mem
        ], $mol_list.prototype, "sub", null);
        __decorate([
            $mol_mem
        ], $mol_list.prototype, "view_window", null);
        __decorate([
            $mol_mem
        ], $mol_list.prototype, "gap_before", null);
        __decorate([
            $mol_mem
        ], $mol_list.prototype, "gap_after", null);
        __decorate([
            $mol_mem
        ], $mol_list.prototype, "sub_visible", null);
        __decorate([
            $mol_mem
        ], $mol_list.prototype, "minimal_height", null);
        $$.$mol_list = $mol_list;
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));
//mol/list/list.view.ts
;
"use strict";
var $;
(function ($) {
    class $mol_bar extends $mol_view {
    }
    $.$mol_bar = $mol_bar;
})($ || ($ = {}));
//mol/bar/-view.tree/bar.view.tree.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("mol/bar/bar.view.css", "[mol_bar] {\n\tdisplay: flex;\n\tbox-shadow: inset 0 0 0 1px var(--mol_theme_line);\n\tborder-radius: var(--mol_gap_round);\n}\n\n[mol_bar] > * {\n\tborder-radius: 0;\n}\n\n[mol_bar] > *:first-child {\n\tborder-top-left-radius: var(--mol_gap_round);\n\tborder-bottom-left-radius: var(--mol_gap_round);\n}\n\n[mol_bar] > *:last-child {\n\tborder-top-right-radius: var(--mol_gap_round);\n\tborder-bottom-right-radius: var(--mol_gap_round);\n}\n");
})($ || ($ = {}));
//mol/bar/-css/bar.view.css.ts
;
"use strict";
var $;
(function ($) {
    class $hyoo_todomvc extends $mol_scroll {
        title() {
            return "Todos";
        }
        sub() {
            return [
                this.Page()
            ];
        }
        Task_row(id) {
            const obj = new this.$.$hyoo_todomvc_task_row();
            obj.completed = (val) => this.task_completed(id, val);
            obj.title = (val) => this.task_title(id, val);
            obj.drop = (event) => this.task_drop(id, event);
            return obj;
        }
        Title() {
            const obj = new this.$.$mol_view();
            obj.minimal_height = () => 176;
            obj.sub = () => [
                this.title()
            ];
            return obj;
        }
        head_complete_enabled() {
            return false;
        }
        completed_all(val) {
            if (val !== undefined)
                return val;
            return false;
        }
        Head_complete() {
            const obj = new this.$.$mol_check();
            obj.enabled = () => this.head_complete_enabled();
            obj.checked = (val) => this.completed_all(val);
            obj.title = () => "❯";
            return obj;
        }
        task_title_new(val) {
            if (val !== undefined)
                return val;
            return "";
        }
        add(event) {
            if (event !== undefined)
                return event;
            return null;
        }
        Add() {
            const obj = new this.$.$hyoo_todomvc_add();
            obj.value = (val) => this.task_title_new(val);
            obj.done = (event) => this.add(event);
            return obj;
        }
        Head_content() {
            return [
                this.Head_complete(),
                this.Add()
            ];
        }
        Head() {
            const obj = new this.$.$mol_view();
            obj.minimal_height = () => 64;
            obj.sub = () => this.Head_content();
            return obj;
        }
        task_rows() {
            return [];
        }
        List() {
            const obj = new this.$.$mol_list();
            obj.rows = () => this.task_rows();
            return obj;
        }
        pending_message() {
            return "0 items left ";
        }
        Pending() {
            const obj = new this.$.$mol_view();
            obj.sub = () => [
                this.pending_message()
            ];
            return obj;
        }
        filter_all_label() {
            return "All";
        }
        Filter_all() {
            const obj = new this.$.$mol_link();
            obj.sub = () => [
                this.filter_all_label()
            ];
            obj.arg = () => ({
                completed: null
            });
            return obj;
        }
        filter_active_label() {
            return "Active";
        }
        Filter_active() {
            const obj = new this.$.$mol_link();
            obj.sub = () => [
                this.filter_active_label()
            ];
            obj.arg = () => ({
                completed: "false"
            });
            return obj;
        }
        filter_completed_label() {
            return "Completed";
        }
        Filter_completed() {
            const obj = new this.$.$mol_link();
            obj.sub = () => [
                this.filter_completed_label()
            ];
            obj.arg = () => ({
                completed: "true"
            });
            return obj;
        }
        filterOptions() {
            return [
                this.Filter_all(),
                this.Filter_active(),
                this.Filter_completed()
            ];
        }
        Filter() {
            const obj = new this.$.$mol_bar();
            obj.sub = () => this.filterOptions();
            return obj;
        }
        sweep_enabled() {
            return true;
        }
        sweep(event) {
            if (event !== undefined)
                return event;
            return null;
        }
        sweep_label() {
            return "Clear completed";
        }
        Sweep() {
            const obj = new this.$.$mol_button_minor();
            obj.enabled = () => this.sweep_enabled();
            obj.click = (event) => this.sweep(event);
            obj.sub = () => [
                this.sweep_label()
            ];
            return obj;
        }
        foot_content() {
            return [
                this.Pending(),
                this.Filter(),
                this.Sweep()
            ];
        }
        Foot() {
            const obj = new this.$.$mol_view();
            obj.sub = () => this.foot_content();
            return obj;
        }
        panels() {
            return [
                this.Head(),
                this.List(),
                this.Foot()
            ];
        }
        Panel() {
            const obj = new this.$.$mol_list();
            obj.rows = () => this.panels();
            return obj;
        }
        Page() {
            const obj = new this.$.$mol_list();
            obj.rows = () => [
                this.Title(),
                this.Panel()
            ];
            return obj;
        }
        task_completed(id, val) {
            if (val !== undefined)
                return val;
            return false;
        }
        task_title(id, val) {
            if (val !== undefined)
                return val;
            return "";
        }
        task_drop(id, event) {
            if (event !== undefined)
                return event;
            return null;
        }
    }
    __decorate([
        $mol_mem_key
    ], $hyoo_todomvc.prototype, "Task_row", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Title", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "completed_all", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Head_complete", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "task_title_new", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "add", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Add", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Head", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "List", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Pending", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Filter_all", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Filter_active", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Filter_completed", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Filter", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "sweep", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Sweep", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Foot", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Panel", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc.prototype, "Page", null);
    __decorate([
        $mol_mem_key
    ], $hyoo_todomvc.prototype, "task_completed", null);
    __decorate([
        $mol_mem_key
    ], $hyoo_todomvc.prototype, "task_title", null);
    __decorate([
        $mol_mem_key
    ], $hyoo_todomvc.prototype, "task_drop", null);
    $.$hyoo_todomvc = $hyoo_todomvc;
    class $hyoo_todomvc_add extends $mol_string {
        hint() {
            return "What needs to be done?";
        }
        event() {
            return {
                ...super.event(),
                keydown: (event) => this.press(event)
            };
        }
        done(event) {
            if (event !== undefined)
                return event;
            return null;
        }
        press(event) {
            if (event !== undefined)
                return event;
            return null;
        }
    }
    __decorate([
        $mol_mem
    ], $hyoo_todomvc_add.prototype, "done", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc_add.prototype, "press", null);
    $.$hyoo_todomvc_add = $hyoo_todomvc_add;
    class $hyoo_todomvc_task_row extends $mol_view {
        minimal_height() {
            return 64;
        }
        sub() {
            return [
                this.Complete(),
                this.Title(),
                this.Drop()
            ];
        }
        attr() {
            return {
                ...super.attr(),
                hyoo_todomvc_task_row_completed: this.completed()
            };
        }
        completed(val) {
            if (val !== undefined)
                return val;
            return false;
        }
        Complete() {
            const obj = new this.$.$mol_check();
            obj.checked = (val) => this.completed(val);
            return obj;
        }
        title_hint() {
            return "Task title";
        }
        title(val) {
            if (val !== undefined)
                return val;
            return "";
        }
        Title() {
            const obj = new this.$.$mol_string();
            obj.hint = () => this.title_hint();
            obj.value = (val) => this.title(val);
            return obj;
        }
        drop(event) {
            if (event !== undefined)
                return event;
            return null;
        }
        Drop() {
            const obj = new this.$.$mol_button_typed();
            obj.sub = () => [
                "✖"
            ];
            obj.click = (event) => this.drop(event);
            return obj;
        }
    }
    __decorate([
        $mol_mem
    ], $hyoo_todomvc_task_row.prototype, "completed", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc_task_row.prototype, "Complete", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc_task_row.prototype, "title", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc_task_row.prototype, "Title", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc_task_row.prototype, "drop", null);
    __decorate([
        $mol_mem
    ], $hyoo_todomvc_task_row.prototype, "Drop", null);
    $.$hyoo_todomvc_task_row = $hyoo_todomvc_task_row;
})($ || ($ = {}));
//hyoo/todomvc/-view.tree/todomvc.view.tree.ts
;
"use strict";
var $;
(function ($) {
    class $mol_state_local extends $mol_object {
        static 'native()';
        static native() {
            if (this['native()'])
                return this['native()'];
            check: try {
                const native = $mol_dom_context.localStorage;
                if (!native)
                    break check;
                native.setItem('', '');
                native.removeItem('');
                return this['native()'] = native;
            }
            catch (error) {
                console.warn(error);
            }
            return this['native()'] = {
                getItem(key) {
                    return this[':' + key];
                },
                setItem(key, value) {
                    this[':' + key] = value;
                },
                removeItem(key) {
                    this[':' + key] = void 0;
                }
            };
        }
        static changes(next) { return next; }
        static value(key, next) {
            this.changes();
            if (next === void 0)
                return JSON.parse(this.native().getItem(key) || 'null');
            if (next === null)
                this.native().removeItem(key);
            else
                this.native().setItem(key, JSON.stringify(next));
            return next;
        }
        prefix() { return ''; }
        value(key, next) {
            return $mol_state_local.value(this.prefix() + '.' + key, next);
        }
    }
    __decorate([
        $mol_mem
    ], $mol_state_local, "changes", null);
    __decorate([
        $mol_mem_key
    ], $mol_state_local, "value", null);
    $.$mol_state_local = $mol_state_local;
})($ || ($ = {}));
//mol/state/local/local.ts
;
"use strict";
var $;
(function ($) {
    self.addEventListener('storage', event => $.$mol_state_local.changes(event));
})($ || ($ = {}));
//mol/state/local/local.web.ts
;
"use strict";
var $;
(function ($) {
    $mol_style_attach("hyoo/todomvc/todomvc.css", "[hyoo_todomvc] {\n\talign-self: stretch;\n\twidth: 100%;\n\tmargin: 0;\n\ttransition: none;\n}\n\n[hyoo_todomvc] [mol_string] ,\n[hyoo_todomvc] [mol_string]:focus ,\n[hyoo_todomvc] [mol_string]:hover ,\n[hyoo_todomvc] [mol_button] ,\n[hyoo_todomvc] [mol_button]:focus ,\n[hyoo_todomvc] [mol_button]:hover ,\n[hyoo_todomvc] [mol_link] ,\n[hyoo_todomvc] [mol_link]:focus ,\n[hyoo_todomvc] [mol_link]:hover {\n\tbox-shadow: none;\n\tbackground-color: transparent;\n}\n\n[hyoo_todomvc] [mol_link_current] {\n\tcolor: black;\n}\n\n[hyoo_todomvc] [mol_link]:not([mol_link_current]):hover ,\n[hyoo_todomvc] [mol_link]:not([mol_link_current]):focus {\n\ttext-decoration: underline;\n}\n\n[hyoo_todomvc_head_complete] {\n\tflex: 0 0 4rem;\n\ttransform: rotate( 90deg );\n\talign-items: center;\n\topacity: .5;\n\tpadding: 0;\n\tjustify-content: center;\n}\n[hyoo_todomvc_head_complete]:disabled {\n\tvisibility: hidden;\n}\n[hyoo_todomvc_head_complete][mol_check_checked] {\n\topacity: 1;\n}\n\n[hyoo_todomvc_add] {\n\tpadding: 0;\n\tflex: 1 1 auto;\n}\n\n[hyoo_todomvc_list] {\n\tfont-size: 1.5rem;\n\ttransition: none;\n}\n\n[hyoo_todomvc_page] {\n\tflex: 1 1 auto;\n\ttransition: none;\n}\n\n[hyoo_todomvc_panel] {\n\tbox-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);\n\twidth: 38rem;\n\t--mol_theme_back: white;\n\t--mol_theme_text: black;\n\tbackground-color: var(--mol_theme_back);\n\tdisplay: flex;\n\tflex-direction: column;\n\tmargin: 0 auto 2rem;\n\ttransition: none;\n}\n\n[hyoo_todomvc_head] {\n\tfont-size: 1.5rem;\n\tpadding: 0;\n\tdisplay: flex;\n\theight: 4rem;\n}\n\n[hyoo_todomvc_title] {\n\tword-break: normal;\n\tdisplay: block;\n\tpadding: .25rem;\n\tfont-size: 7rem;\n\tfont-weight: 100;\n\ttext-align: center;\n\tcolor: rgba(275, 147, 147, 0.2);\n\ttext-rendering: optimizeLegibility;\n\ttext-transform: lowercase;\n\tline-height: 1.5;\n}\n\n[hyoo_todomvc_task_row] {\n\tdisplay: flex;\n\tbackground-color: white;\n\tbox-shadow: 0 -1px 0 0 #ededed;\n\theight: 4rem;\n}\n\n[hyoo_todomvc_task_row_complete] {\n\tflex: 0 0 4rem;\n\tpadding: 1rem;\n\tbackground: no-repeat center center url('hyoo/todomvc/todomvc_active.svg');\n}\n[hyoo_todomvc_task_row_complete][mol_check_checked] {\n\tbackground: no-repeat center center url('hyoo/todomvc/todomvc_completed.svg');\n}\n\n[hyoo_todomvc_task_row_title] {\n\tpadding: 0;\n\tflex: 1 1 auto;\n}\n\n[hyoo_todomvc_task_row_completed] [hyoo_todomvc_task_row_title] {\n\tcolor: #d9d9d9;\n\ttext-decoration: line-through;\n}\n\n[hyoo_todomvc_task_row_drop] {\n\tfont-size: 1.25rem;\n\tflex:  0 04rem;\n\tpadding: 1.25rem;\n}\n[hyoo_todomvc_task_row]:not(:hover) [hyoo_todomvc_task_row_drop]:not(:focus) {\n\topacity: 0;\n\tcolor: #cc9a9a;\n}\n\n[hyoo_todomvc_foot] {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\talign-items: baseline;\n\tpadding: .5rem 1rem;\n\tcolor: #777;\n\tfont-size: .85rem;\n\tborder-top: 1px solid #ededed;\n\tbox-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);\n}\n\n[hyoo_todomvc_pending] {\n\tpadding: .25rem;\n\tflex: 0 1 6rem;\n}\n\n[hyoo_todomvc_filter] {\n\tflex: 1 100 auto;\n\tdisplay: flex;\n\tjustify-content: center;\n\tmargin: .25rem;\n\tbox-shadow: none;\n}\n\n[hyoo_todomvc_sweep] {\n\tflex: 0 1 auto;\n\tpadding: .25rem;\n}\n[hyoo_todomvc_sweep][disabled] {\n\tvisibility: hidden;\n}\n\n[hyoo_todomvc_sweep]:hover ,\n[hyoo_todomvc_sweep]:focus {\n\ttext-decoration: underline;\n}\n");
})($ || ($ = {}));
//hyoo/todomvc/-css/todomvc.css.ts
;
"use strict";
var $;
(function ($) {
    var $$;
    (function ($$) {
        class $hyoo_todomvc_add extends $.$hyoo_todomvc_add {
            press(next) {
                switch (next.keyCode) {
                    case $mol_keyboard_code.enter: return this.done(next);
                }
            }
        }
        $$.$hyoo_todomvc_add = $hyoo_todomvc_add;
        class $hyoo_todomvc extends $.$hyoo_todomvc {
            task_ids(next) {
                return this.$.$mol_state_local.value(this.state_key('mol-todos'), next) || [];
            }
            arg_completed() {
                return this.$.$mol_state_arg.value(this.state_key('completed'));
            }
            groups_completed() {
                var groups = { 'true': [], 'false': [] };
                for (let id of this.task_ids()) {
                    var task = this.task(id);
                    groups[String(task.completed)].push(id);
                }
                return groups;
            }
            task_ids_filtered() {
                var completed = this.arg_completed();
                if (completed) {
                    return this.groups_completed()[completed] || [];
                }
                else {
                    return this.task_ids();
                }
            }
            completed_all(next) {
                if (next === void 0)
                    return this.groups_completed()['false'].length === 0;
                for (let id of this.groups_completed()[String(!next)]) {
                    var task = this.task(id);
                    this.task(id, { title: task.title, completed: next });
                }
                return next;
            }
            head_complete_enabled() {
                return this.task_ids().length > 0;
            }
            pending_message() {
                let count = this.groups_completed()['false'].length;
                return (count === 1) ? '1 item left' : `${count} items left`;
            }
            new_id() {
                return Math.max(1, 1 + Math.max(...this.task_ids()));
            }
            add(next) {
                var title = this.task_title_new();
                if (!title)
                    return;
                var id = this.new_id();
                var task = { completed: false, title };
                this.task(id, task);
                this.task_ids([...this.task_ids(), id]);
                this.task_title_new('');
            }
            task_rows() {
                return this.task_ids_filtered().map(id => this.Task_row(id));
            }
            task(id, next) {
                const key = this.state_key(`mol-todos-${id}`);
                if (next === void 0) {
                    return this.$.$mol_state_local.value(key) || { title: '', completed: false };
                }
                this.$.$mol_state_local.value(key, next);
                return next || null;
            }
            task_completed(id, next) {
                return this.task(id, next === undefined ? undefined : { ...this.task(id), completed: next }).completed ?? false;
            }
            task_title(id, next) {
                return this.task(id, next === undefined ? undefined : { ...this.task(id), title: next }).title ?? '';
            }
            task_drop(id, next) {
                this.task(id, null);
                this.task_ids(this.task_ids().filter(id2 => id !== id2));
            }
            sweep() {
                this.task_ids(this.task_ids().filter(id => {
                    if (!this.task(id).completed)
                        return true;
                    this.task(id, null);
                    return false;
                }));
            }
            panels() {
                return [
                    this.Head(),
                    this.List(),
                    ...this.foot_visible() ? [this.Foot()] : [],
                ];
            }
            foot_visible() {
                return this.task_ids().length > 0;
            }
            sweep_enabled() {
                return this.groups_completed()['true'].length > 0;
            }
        }
        __decorate([
            $mol_mem
        ], $hyoo_todomvc.prototype, "groups_completed", null);
        __decorate([
            $mol_mem
        ], $hyoo_todomvc.prototype, "task_ids_filtered", null);
        __decorate([
            $mol_mem
        ], $hyoo_todomvc.prototype, "completed_all", null);
        __decorate([
            $mol_mem
        ], $hyoo_todomvc.prototype, "pending_message", null);
        __decorate([
            $mol_mem
        ], $hyoo_todomvc.prototype, "new_id", null);
        __decorate([
            $mol_mem
        ], $hyoo_todomvc.prototype, "task_rows", null);
        __decorate([
            $mol_mem_key
        ], $hyoo_todomvc.prototype, "task_completed", null);
        __decorate([
            $mol_mem_key
        ], $hyoo_todomvc.prototype, "task_title", null);
        $$.$hyoo_todomvc = $hyoo_todomvc;
    })($$ = $.$$ || ($.$$ = {}));
})($ || ($ = {}));
//hyoo/todomvc/todomvc.view.ts
;
var $node = $node || {} ; $node[ "/hyoo/todomvc/todomvc_active.svg" ] = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAtMTggMTAwIDEzNSI+DQoJPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9Im5vbmUiICBzdHJva2U9IiNlZGVkZWQiIHN0cm9rZS13aWR0aD0iMyIvPg0KPC9zdmc+"

;
var $node = $node || {} ; $node[ "/hyoo/todomvc/todomvc_completed.svg" ] = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAtMTggMTAwIDEzNSI+DQoJPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2JkZGFkNSIgc3Ryb2tlLXdpZHRoPSIzIi8+DQoJPHBhdGggZmlsbD0iJTIzNWRjMmFmIiBkPSJNNzIgMjVMNDIgNzEgMjcgNTZsLTQgNCAyMCAyMCAzNC01MnoiLz4NCjwvc3ZnPg0K"


//# sourceMappingURL=web.js.map
