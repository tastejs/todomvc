function require( path ){ return $node[ path ] };
"use strict";
var $;
(function ($_1) {
    let $$;
    (function ($$) {
        let $;
    })($$ = $_1.$$ || ($_1.$$ = {}));
    function $mol_test(set) {
        for (let name in set) {
            const code = set[name];
            const test = (typeof code === 'string') ? new Function('', code) : code;
            $_1.$mol_test_all.push(test);
        }
        $mol_test_schedule();
    }
    $_1.$mol_test = $mol_test;
    $_1.$mol_test_mocks = [];
    $_1.$mol_test_all = [];
    async function $mol_test_run() {
        for (var test of $_1.$mol_test_all) {
            let context = Object.create($$);
            for (let mock of $_1.$mol_test_mocks)
                await mock(context);
            await test(context);
        }
        $_1.$mol_ambient({}).$mol_log3_done({
            place: '$mol_test',
            message: 'Completed',
            count: $_1.$mol_test_all.length,
        });
    }
    $_1.$mol_test_run = $mol_test_run;
    let scheduled = false;
    function $mol_test_schedule() {
        if (scheduled)
            return;
        scheduled = true;
        setTimeout(() => {
            scheduled = false;
            $mol_test_run();
        }, 0);
    }
    $_1.$mol_test_schedule = $mol_test_schedule;
    $_1.$mol_test_mocks.push(context => {
        let seed = 0;
        context.Math = Object.create(Math);
        context.Math.random = () => Math.sin(seed++);
        const forbidden = ['XMLHttpRequest', 'fetch'];
        for (let api of forbidden) {
            context[api] = new Proxy(function () { }, {
                get() {
                    $_1.$mol_fail_hidden(new Error(`${api} is forbidden in tests`));
                },
                apply() {
                    $_1.$mol_fail_hidden(new Error(`${api} is forbidden in tests`));
                },
            });
        }
    });
    $mol_test({
        'mocked Math.random'($) {
            console.assert($.Math.random() === 0);
            console.assert($.Math.random() === Math.sin(1));
        },
        'forbidden XMLHttpRequest'($) {
            try {
                console.assert(void new $.XMLHttpRequest);
            }
            catch (error) {
                console.assert(error.message === 'XMLHttpRequest is forbidden in tests');
            }
        },
        'forbidden fetch'($) {
            try {
                console.assert(void $.fetch(''));
            }
            catch (error) {
                console.assert(error.message === 'fetch is forbidden in tests');
            }
        },
    });
})($ || ($ = {}));
//test.test.js.map
;
"use strict";
//assert.test.js.map
;
"use strict";
//assert.js.map
;
"use strict";
//deep.test.js.map
;
"use strict";
//deep.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'Make empty div'() {
            $.$mol_assert_equal(($.$mol_jsx("div", null)).outerHTML, '<div></div>');
        },
        'Define native field'() {
            const dom = $.$mol_jsx("input", { value: '123' });
            $.$mol_assert_equal(dom.outerHTML, '<input value="123">');
            $.$mol_assert_equal(dom.value, '123');
        },
        'Define classes'() {
            const dom = $.$mol_jsx("div", { classList: ['foo bar'] });
            $.$mol_assert_equal(dom.outerHTML, '<div class="foo bar"></div>');
        },
        'Define styles'() {
            const dom = $.$mol_jsx("div", { style: { color: 'red' } });
            $.$mol_assert_equal(dom.outerHTML, '<div style="color: red;"></div>');
        },
        'Define dataset'() {
            const dom = $.$mol_jsx("div", { dataset: { foo: 'bar' } });
            $.$mol_assert_equal(dom.outerHTML, '<div data-foo="bar"></div>');
        },
        'Define attributes'() {
            const dom = $.$mol_jsx("div", { lang: "ru", hidden: true });
            $.$mol_assert_equal(dom.outerHTML, '<div lang="ru" hidden=""></div>');
        },
        'Define child nodes'() {
            const dom = $.$mol_jsx("div", null,
                "hello",
                $.$mol_jsx("strong", null, "world"),
                "!");
            $.$mol_assert_equal(dom.outerHTML, '<div>hello<strong>world</strong>!</div>');
        },
        'Function as component'() {
            const Button = ({ hint }, target) => {
                return $.$mol_jsx("button", { title: hint }, target());
            };
            const dom = $.$mol_jsx(Button, { id: "/foo", hint: "click me" }, () => 'hey!');
            $.$mol_assert_equal(dom.outerHTML, '<button title="click me" id="/foo">hey!</button>');
        },
        'Nested guid generation'() {
            const Foo = () => {
                return $.$mol_jsx("div", null,
                    $.$mol_jsx(Bar, { id: "/bar" },
                        $.$mol_jsx("img", { id: "/icon" })));
            };
            const Bar = (props, icon) => {
                return $.$mol_jsx("span", null, icon);
            };
            const dom = $.$mol_jsx(Foo, { id: "/foo" });
            $.$mol_assert_equal(dom.outerHTML, '<div id="/foo"><span id="/foo/bar"><img id="/foo/icon"></span></div>');
        },
        'Fail on non unique ids'() {
            const App = () => {
                return $.$mol_jsx("div", null,
                    $.$mol_jsx("span", { id: "/bar" }),
                    $.$mol_jsx("span", { id: "/bar" }));
            };
            $.$mol_assert_fail(() => $.$mol_jsx(App, { id: "/foo" }), 'JSX already has tag with id "/bar"');
        },
    });
})($ || ($ = {}));
//jsx.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_jsx_prefix = '';
    $.$mol_jsx_booked = null;
    $.$mol_jsx_document = {
        getElementById: () => null,
        createElement: (name) => $.$mol_dom_context.document.createElement(name)
    };
    function $mol_jsx(Elem, props, ...childNodes) {
        const id = props && props.id || '';
        if ($.$mol_jsx_booked) {
            if ($.$mol_jsx_booked.has(id)) {
                $.$mol_fail(new Error(`JSX already has tag with id ${JSON.stringify(id)}`));
            }
            else {
                $.$mol_jsx_booked.add(id);
            }
        }
        const guid = $.$mol_jsx_prefix + id;
        let node = guid && $.$mol_jsx_document.getElementById(guid);
        if (typeof Elem !== 'string') {
            if (Elem.prototype) {
                const view = node && node[Elem] || new Elem;
                Object.assign(view, props);
                view[Symbol.toStringTag] = guid;
                view.childNodes = childNodes;
                if (!view.ownerDocument)
                    view.ownerDocument = $.$mol_jsx_document;
                node = view.valueOf();
                node[Elem] = view;
                return node;
            }
            else {
                const prefix = $.$mol_jsx_prefix;
                const booked = $.$mol_jsx_booked;
                try {
                    $.$mol_jsx_prefix = guid;
                    $.$mol_jsx_booked = new Set;
                    return Elem(props, ...childNodes);
                }
                finally {
                    $.$mol_jsx_prefix = prefix;
                    $.$mol_jsx_booked = booked;
                }
            }
        }
        if (!node)
            node = $.$mol_jsx_document.createElement(Elem);
        $.$mol_dom_render_children(node, [].concat(...childNodes));
        for (const key in props) {
            if (typeof props[key] === 'string') {
                node.setAttribute(key, props[key]);
            }
            else if (props[key] && props[key]['constructor'] === Object) {
                if (typeof node[key] === 'object') {
                    Object.assign(node[key], props[key]);
                    continue;
                }
            }
            node[key] = props[key];
        }
        if (guid)
            node.id = guid;
        return node;
    }
    $.$mol_jsx = $mol_jsx;
})($ || ($ = {}));
//jsx.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'nulls & undefineds'() {
            $.$mol_assert_ok($.$mol_compare_deep(null, null));
            $.$mol_assert_ok($.$mol_compare_deep(undefined, undefined));
            $.$mol_assert_not($.$mol_compare_deep(undefined, null));
            $.$mol_assert_not($.$mol_compare_deep({}, null));
        },
        'number'() {
            $.$mol_assert_ok($.$mol_compare_deep(1, 1));
            $.$mol_assert_ok($.$mol_compare_deep(Number.NaN, Number.NaN));
            $.$mol_assert_not($.$mol_compare_deep(1, 2));
        },
        'Number'() {
            $.$mol_assert_ok($.$mol_compare_deep(Object(1), Object(1)));
            $.$mol_assert_ok($.$mol_compare_deep(Object(Number.NaN), Object(Number.NaN)));
            $.$mol_assert_not($.$mol_compare_deep(Object(1), Object(2)));
        },
        'empty POJOs'() {
            $.$mol_assert_ok($.$mol_compare_deep({}, {}));
        },
        'different POJOs'() {
            $.$mol_assert_not($.$mol_compare_deep({ a: 1 }, { b: 2 }));
        },
        'different POJOs with same keys but different values'() {
            $.$mol_assert_not($.$mol_compare_deep({ a: 1 }, { a: 2 }));
        },
        'different POJOs with different keys but same values'() {
            $.$mol_assert_not($.$mol_compare_deep({}, { a: undefined }));
        },
        'Array'() {
            $.$mol_assert_ok($.$mol_compare_deep([], []));
            $.$mol_assert_ok($.$mol_compare_deep([1, [2]], [1, [2]]));
            $.$mol_assert_not($.$mol_compare_deep([1, 2], [1, 3]));
            $.$mol_assert_not($.$mol_compare_deep([1, 2,], [1, 3, undefined]));
        },
        'same POJO trees'() {
            $.$mol_assert_ok($.$mol_compare_deep({ a: { b: 1 } }, { a: { b: 1 } }));
        },
        'different classes with same values'() {
            class Obj {
                constructor() {
                    this.foo = 1;
                }
            }
            const a = new Obj;
            const b = new class extends Obj {
            };
            $.$mol_assert_not($.$mol_compare_deep(a, b));
        },
        'same POJOs with cyclic reference'() {
            const a = { foo: {} };
            a['self'] = a;
            const b = { foo: {} };
            b['self'] = b;
            $.$mol_assert_ok($.$mol_compare_deep(a, b));
        },
        'empty Element'() {
            $.$mol_assert_ok($.$mol_compare_deep($.$mol_jsx("div", null), $.$mol_jsx("div", null)));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx("div", null), $.$mol_jsx("span", null)));
        },
        'Element with attributes'() {
            $.$mol_assert_ok($.$mol_compare_deep($.$mol_jsx("div", { dir: "rtl" }), $.$mol_jsx("div", { dir: "rtl" })));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx("div", { dir: "rtl" }), $.$mol_jsx("div", null)));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx("div", { dir: "rtl" }), $.$mol_jsx("div", { dir: "ltr" })));
        },
        'Element with styles'() {
            $.$mol_assert_ok($.$mol_compare_deep($.$mol_jsx("div", { style: { color: 'red' } }), $.$mol_jsx("div", { style: { color: 'red' } })));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx("div", { style: { color: 'red' } }), $.$mol_jsx("div", { style: {} })));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx("div", { style: { color: 'red' } }), $.$mol_jsx("div", { style: { color: 'blue' } })));
        },
        'Element with content'() {
            $.$mol_assert_ok($.$mol_compare_deep($.$mol_jsx("div", null,
                "foo",
                $.$mol_jsx("br", null)), $.$mol_jsx("div", null,
                "foo",
                $.$mol_jsx("br", null))));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx("div", null,
                "foo",
                $.$mol_jsx("br", null)), $.$mol_jsx("div", null,
                "bar",
                $.$mol_jsx("br", null))));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx("div", null,
                "foo",
                $.$mol_jsx("br", null)), $.$mol_jsx("div", null,
                "foo",
                $.$mol_jsx("hr", null))));
        },
        'Element with handlers'() {
            $.$mol_assert_ok($.$mol_compare_deep($.$mol_jsx("div", { onclick: () => 1 }), $.$mol_jsx("div", { onclick: () => 1 })));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx("div", { onclick: () => 1 }), $.$mol_jsx("div", { onclick: () => 2 })));
        },
        'Date'() {
            $.$mol_assert_ok($.$mol_compare_deep(new Date(12345), new Date(12345)));
            $.$mol_assert_not($.$mol_compare_deep(new Date(12345), new Date(12346)));
        },
        'RegExp'() {
            $.$mol_assert_ok($.$mol_compare_deep(/\x22/mig, /\x22/mig));
            $.$mol_assert_not($.$mol_compare_deep(/\x22/mig, /\x21/mig));
            $.$mol_assert_not($.$mol_compare_deep(/\x22/mig, /\x22/mg));
        },
        'Map'() {
            $.$mol_assert_ok($.$mol_compare_deep(new Map, new Map));
            $.$mol_assert_ok($.$mol_compare_deep(new Map([[[1], [2]]]), new Map([[[1], [2]]])));
            $.$mol_assert_not($.$mol_compare_deep(new Map([[1, 2]]), new Map([[1, 3]])));
        },
        'Set'() {
            $.$mol_assert_ok($.$mol_compare_deep(new Set, new Set));
            $.$mol_assert_ok($.$mol_compare_deep(new Set([1, [2]]), new Set([1, [2]])));
            $.$mol_assert_not($.$mol_compare_deep(new Set([1]), new Set([2])));
        },
        'Uint8Array'() {
            $.$mol_assert_ok($.$mol_compare_deep(new Uint8Array, new Uint8Array));
            $.$mol_assert_ok($.$mol_compare_deep(new Uint8Array([0]), new Uint8Array([0])));
            $.$mol_assert_not($.$mol_compare_deep(new Uint8Array([0]), new Uint8Array([1])));
        },
    });
})($ || ($ = {}));
//deep.test.js.map
;
"use strict";
var $;
(function ($) {
    const a_stack = [];
    const b_stack = [];
    let cache = null;
    function $mol_compare_deep(a, b) {
        if (Object.is(a, b))
            return true;
        const a_type = typeof a;
        const b_type = typeof b;
        if (a_type !== b_type)
            return false;
        if (a_type === 'function')
            return String(a) === String(b);
        if (a_type !== 'object')
            return false;
        if (!a || !b)
            return false;
        if (a instanceof Error)
            return false;
        if (a['constructor'] !== b['constructor'])
            return false;
        if (a instanceof RegExp)
            return Object.is(String(a), String(b));
        const ref = a_stack.indexOf(a);
        if (ref >= 0) {
            return Object.is(b_stack[ref], b);
        }
        if (!cache)
            cache = new WeakMap;
        let a_cache = cache.get(a);
        if (a_cache) {
            const b_cache = a_cache.get(b);
            if (typeof b_cache === 'boolean')
                return b_cache;
        }
        else {
            a_cache = new WeakMap();
            cache.set(a, a_cache);
        }
        a_stack.push(a);
        b_stack.push(b);
        let result;
        try {
            if (a[Symbol.iterator]) {
                const a_iter = a[Symbol.iterator]();
                const b_iter = b[Symbol.iterator]();
                while (true) {
                    const a_next = a_iter.next();
                    const b_next = b_iter.next();
                    if (a_next.done !== a_next.done)
                        return result = false;
                    if (a_next.done)
                        break;
                    if (!$mol_compare_deep(a_next.value, b_next.value))
                        return result = false;
                }
                return result = true;
            }
            let count = 0;
            for (let key in a) {
                try {
                    if (!$mol_compare_deep(a[key], b[key]))
                        return result = false;
                }
                catch (error) {
                    $.$mol_fail_hidden(new $.$mol_error_mix(`Failed ${JSON.stringify(key)} fields comparison of ${a} and ${b}`, error));
                }
                ++count;
            }
            for (let key in b) {
                --count;
                if (count < 0)
                    return result = false;
            }
            const a_val = a['valueOf']();
            if (Object.is(a_val, a))
                return result = true;
            const b_val = b['valueOf']();
            if (!Object.is(a_val, b_val))
                return result = false;
            return result = true;
        }
        finally {
            a_stack.pop();
            b_stack.pop();
            if (a_stack.length === 0) {
                cache = null;
            }
            else {
                a_cache.set(b, result);
            }
        }
    }
    $.$mol_compare_deep = $mol_compare_deep;
})($ || ($ = {}));
//deep.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'must be false'() {
            $.$mol_assert_not(0);
        },
        'must be true'() {
            $.$mol_assert_ok(1);
        },
        'two must be equal'() {
            $.$mol_assert_equal(2, 2);
        },
        'three must be equal'() {
            $.$mol_assert_equal(2, 2, 2);
        },
        'two must be unique'() {
            $.$mol_assert_unique([3], [3]);
        },
        'three must be unique'() {
            $.$mol_assert_unique([3], [3], [3]);
        },
        'two must be alike'() {
            $.$mol_assert_like([3], [3]);
        },
        'three must be alike'() {
            $.$mol_assert_like([3], [3], [3]);
        },
    });
})($ || ($ = {}));
//assert.test.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_assert_ok(value) {
        if (value)
            return;
        $.$mol_fail(new Error(`${value} ≠ true`));
    }
    $.$mol_assert_ok = $mol_assert_ok;
    function $mol_assert_not(value) {
        if (!value)
            return;
        $.$mol_fail(new Error(`${value} ≠ false`));
    }
    $.$mol_assert_not = $mol_assert_not;
    function $mol_assert_fail(handler, ErrorRight) {
        const fail = $.$mol_fail;
        try {
            $.$mol_fail = $.$mol_fail_hidden;
            handler();
        }
        catch (error) {
            if (!ErrorRight)
                return error;
            if (typeof ErrorRight === 'string') {
                if (error.message !== ErrorRight)
                    throw error;
            }
            else {
                if (!(error instanceof ErrorRight))
                    throw error;
            }
            return error;
        }
        finally {
            $.$mol_fail = fail;
        }
        $.$mol_fail(new Error('Not failed'));
    }
    $.$mol_assert_fail = $mol_assert_fail;
    function $mol_assert_equal(...args) {
        for (let i = 0; i < args.length; ++i) {
            for (let j = 0; j < args.length; ++j) {
                if (i === j)
                    continue;
                if (Number.isNaN(args[i]) && Number.isNaN(args[j]))
                    continue;
                if (args[i] !== args[j])
                    $.$mol_fail(new Error(`Not equal\n${args[i]}\n${args[j]}`));
            }
        }
    }
    $.$mol_assert_equal = $mol_assert_equal;
    function $mol_assert_unique(...args) {
        for (let i = 0; i < args.length; ++i) {
            for (let j = 0; j < args.length; ++j) {
                if (i === j)
                    continue;
                if (args[i] === args[j] || (Number.isNaN(args[i]) && Number.isNaN(args[j]))) {
                    $.$mol_fail(new Error(`args[${i}] = args[${j}] = ${args[i]}`));
                }
            }
        }
    }
    $.$mol_assert_unique = $mol_assert_unique;
    function $mol_assert_like(head, ...tail) {
        for (let value of tail) {
            if ($.$mol_compare_deep(value, head)) {
                head = value;
            }
            else {
                const print = (val) => {
                    if (!val)
                        return val;
                    if (typeof val !== 'object')
                        return val;
                    if ('outerHTML' in val)
                        return val.outerHTML;
                    return JSON.stringify(val);
                };
                return $.$mol_fail(new Error(`Not like\n${print(head)}\n---\n${print(value)}`));
            }
        }
    }
    $.$mol_assert_like = $mol_assert_like;
})($ || ($ = {}));
//assert.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'get'() {
            const proxy = $.$mol_delegate({}, () => ({ foo: 777 }));
            $.$mol_assert_equal(proxy.foo, 777);
        },
        'has'() {
            const proxy = $.$mol_delegate({}, () => ({ foo: 777 }));
            $.$mol_assert_equal('foo' in proxy, true);
        },
        'set'() {
            const target = { foo: 777 };
            const proxy = $.$mol_delegate({}, () => target);
            proxy.foo = 123;
            $.$mol_assert_equal(target.foo, 123);
        },
        'getOwnPropertyDescriptor'() {
            const proxy = $.$mol_delegate({}, () => ({ foo: 777 }));
            $.$mol_assert_like(Object.getOwnPropertyDescriptor(proxy, 'foo'), {
                value: 777,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        },
        'ownKeys'() {
            const proxy = $.$mol_delegate({}, () => ({ foo: 777, [Symbol.toStringTag]: 'bar' }));
            $.$mol_assert_like(Reflect.ownKeys(proxy), ['foo', Symbol.toStringTag]);
        },
        'getPrototypeOf'() {
            class Foo {
            }
            const proxy = $.$mol_delegate({}, () => new Foo);
            $.$mol_assert_equal(Object.getPrototypeOf(proxy), Foo.prototype);
        },
        'setPrototypeOf'() {
            class Foo {
            }
            const target = {};
            const proxy = $.$mol_delegate({}, () => target);
            Object.setPrototypeOf(proxy, Foo.prototype);
            $.$mol_assert_equal(Object.getPrototypeOf(target), Foo.prototype);
        },
        'instanceof'() {
            class Foo {
            }
            const proxy = $.$mol_delegate({}, () => new Foo);
            $.$mol_assert_ok(proxy instanceof Foo);
            $.$mol_assert_ok(proxy instanceof $.$mol_delegate);
        },
        'autobind'() {
            class Foo {
            }
            const proxy = $.$mol_delegate({}, () => new Foo);
            $.$mol_assert_ok(proxy.valueOf() instanceof Foo);
            $.$mol_assert_not(proxy.valueOf() instanceof $.$mol_delegate);
        },
    });
})($ || ($ = {}));
//delegate.test.js.map
;
"use strict";
//writable.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_after_mock_queue = [];
    function $mol_after_mock_warp() {
        const queue = $.$mol_after_mock_queue.splice(0);
        for (const task of queue)
            task();
    }
    $.$mol_after_mock_warp = $mol_after_mock_warp;
    class $mol_after_mock_commmon extends $.$mol_object2 {
        constructor(task) {
            super();
            this.task = task;
            this.promise = Promise.resolve();
            this.cancelled = false;
            $.$mol_after_mock_queue.push(task);
        }
        destructor() {
            const index = $.$mol_after_mock_queue.indexOf(this.task);
            if (index >= 0)
                $.$mol_after_mock_queue.splice(index, 1);
        }
    }
    $.$mol_after_mock_commmon = $mol_after_mock_commmon;
    class $mol_after_mock_timeout extends $mol_after_mock_commmon {
        constructor(delay, task) {
            super(task);
            this.delay = delay;
        }
    }
    $.$mol_after_mock_timeout = $mol_after_mock_timeout;
})($ || ($ = {}));
//mock.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test_mocks.push($ => {
        $.$mol_after_tick = $_1.$mol_after_mock_commmon;
    });
})($ || ($ = {}));
//tick.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'init with overload'() {
            class X extends $.$mol_object {
                foo() {
                    return 1;
                }
            }
            var x = X.make({
                foo: () => 2,
            });
            $.$mol_assert_equal(x.foo(), 2);
        },
    });
})($ || ($ = {}));
//object.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test_mocks.push($ => {
        $.$mol_log3_come = () => { };
        $.$mol_log3_done = () => { };
        $.$mol_log3_fail = () => { };
        $.$mol_log3_warn = () => { };
        $.$mol_log3_rise = () => { };
        $.$mol_log3_area = () => () => { };
    });
})($ || ($ = {}));
//log3.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'run callback'() {
            class Plus1 extends $.$mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return task.call(this, ...args) + 1;
                    };
                }
            }
            $.$mol_assert_equal(Plus1.run(() => 2), 3);
        },
        'wrap function'() {
            class Plus1 extends $.$mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return task.call(this, ...args) + 1;
                    };
                }
            }
            const obj = {
                level: 2,
                pow: Plus1.func(function (a) {
                    return a ** this.level;
                })
            };
            $.$mol_assert_equal(obj.pow(2), 5);
        },
        'decorate field getter'() {
            class Plus1 extends $.$mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return Plus1.last = (task.call(this, ...args) || 0) + 1;
                    };
                }
            }
            Plus1.last = 0;
            class Foo {
                static get two() {
                    return 1;
                }
                static set two(next) { }
            }
            __decorate([
                Plus1.field
            ], Foo, "two", null);
            $.$mol_assert_equal(Foo.two, 2);
            Foo.two = 3;
            $.$mol_assert_equal(Plus1.last, 2);
            $.$mol_assert_equal(Foo.two, 2);
        },
        'decorate instance method'() {
            class Plus1 extends $.$mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return task.call(this, ...args) + 1;
                    };
                }
            }
            class Foo1 {
                constructor() {
                    this.level = 2;
                }
                pow(a) {
                    return a ** this.level;
                }
            }
            __decorate([
                Plus1.method
            ], Foo1.prototype, "pow", null);
            const Foo2 = Foo1;
            const foo = new Foo2;
            $.$mol_assert_equal(foo.pow(2), 5);
        },
        'decorate static method'() {
            class Plus1 extends $.$mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return task.call(this, ...args) + 1;
                    };
                }
            }
            class Foo {
                static pow(a) {
                    return a ** this.level;
                }
            }
            Foo.level = 2;
            __decorate([
                Plus1.method
            ], Foo, "pow", null);
            $.$mol_assert_equal(Foo.pow(2), 5);
        },
        'decorate class'() {
            class BarInc extends $.$mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        const foo = task.call(this, ...args);
                        foo.bar++;
                        return foo;
                    };
                }
            }
            let Foo = class Foo {
                constructor(bar) {
                    this.bar = bar;
                }
            };
            Foo = __decorate([
                BarInc.class
            ], Foo);
            $.$mol_assert_equal(new Foo(2).bar, 3);
        },
    });
})($ || ($ = {}));
//wrapper.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test_mocks.push($ => {
        $.$mol_after_frame = $_1.$mol_after_mock_commmon;
    });
})($ || ($ = {}));
//frame.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'objects by reference'() {
            $.$mol_assert_equal($.$mol_compare_any({}, {}), false);
        },
        'primitives by value'() {
            $.$mol_assert_equal($.$mol_compare_any('a', 'a'), true);
        },
        'NaN by value'() {
            $.$mol_assert_equal($.$mol_compare_any(Number.NaN, Number.NaN), true);
        },
        'NaN not equal zero'() {
            $.$mol_assert_equal($.$mol_compare_any(Number.NaN, 0), false);
        },
    });
})($ || ($ = {}));
//any.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'return source when same object'() {
            const target = {};
            $.$mol_assert_equal($.$mol_conform(target, target), target);
        },
        'return target when some is not object'() {
            const obj = { a: 1 };
            $.$mol_assert_equal($.$mol_conform(true, obj), true);
            $.$mol_assert_equal($.$mol_conform(obj, true), obj);
        },
        'return target when some is null'() {
            const obj = { a: 1 };
            $.$mol_assert_equal($.$mol_conform(null, obj), null);
            $.$mol_assert_equal($.$mol_conform(obj, null), obj);
        },
        'return target when some is undefined'() {
            const obj = { a: 1 };
            $.$mol_assert_equal($.$mol_conform(undefined, obj), undefined);
            $.$mol_assert_equal($.$mol_conform(obj, undefined), obj);
        },
        'return target when different keys count'() {
            const target = [1, 2, 3];
            const source = [1, 2, 3, undefined];
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, target);
            $.$mol_assert_equal(result.join(','), '1,2,3');
        },
        'return source when array values are strong equal'() {
            const source = [1, 2, 3];
            $.$mol_assert_equal($.$mol_conform([1, 2, 3], source), source);
        },
        'return source when object values are strong equal'() {
            const source = { a: 1, b: 2 };
            $.$mol_assert_equal($.$mol_conform({ a: 1, b: 2 }, source), source);
        },
        'return target when some values are not equal'() {
            const target = [1, 2, 3];
            const source = [1, 2, 5];
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, target);
            $.$mol_assert_equal(result.join(','), '1,2,3');
        },
        'return source when values are deep equal'() {
            const source = { foo: { bar: 1 } };
            $.$mol_assert_equal($.$mol_conform({ foo: { bar: 1 } }, source), source);
        },
        'return target with equal values from source and not equal from target'() {
            const source = { foo: { xxx: 1 }, bar: { xxx: 2 } };
            const target = { foo: { xxx: 1 }, bar: { xxx: 3 } };
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, target);
            $.$mol_assert_equal(result.foo, source.foo);
            $.$mol_assert_equal(result.bar, target.bar);
        },
        'return target when equal but with different class'() {
            const target = { '0': 1 };
            $.$mol_assert_equal($.$mol_conform(target, [1]), target);
        },
        'return target when conformer for class is not defined'() {
            const Obj = class {
            };
            const source = new Obj;
            const target = new Obj;
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, target);
        },
        'return target when has cyclic reference'() {
            const source = { foo: {} };
            source['self'] = source;
            const target = { foo: {} };
            target['self'] = target;
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, target);
            $.$mol_assert_equal(result['self'], target);
            $.$mol_assert_equal(result.foo, source.foo);
        },
        'return source when equal dates'() {
            const source = new Date(12345);
            const target = new Date(12345);
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, source);
        },
        'return source when equal regular expressions'() {
            const source = /\x22/mig;
            const target = /\x22/mig;
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, source);
        },
        'return cached value if already conformed'() {
            const source = { foo: { xxx: 1 }, bar: { xxx: 3 } };
            const target = { foo: { xxx: 2 }, bar: { xxx: 3 } };
            const result = $.$mol_conform(target, source);
            target.foo.xxx = 1;
            $.$mol_assert_equal($.$mol_conform(target.foo, source.foo), target.foo);
        },
        'skip readlony fields'() {
            const source = { foo: {}, bar: {} };
            const target = { foo: {}, bar: {} };
            Object.defineProperty(target, 'bar', { value: {}, writable: false });
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, target);
            $.$mol_assert_equal(result.foo, source.foo);
            $.$mol_assert_equal(result.bar, target.bar);
        },
        'object with NaN'() {
            const source = { foo: Number.NaN };
            const target = { foo: Number.NaN };
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, source);
        },
        'array with NaN'() {
            const source = [Number.NaN];
            const target = [Number.NaN];
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, source);
        },
    });
})($ || ($ = {}));
//conform.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'trim array'() {
            const array = [undefined, null, 0, false, null, undefined, undefined];
            const correct = [undefined, null, 0, false, null];
            $.$mol_array_trim(array);
            $.$mol_assert_like(array, correct);
        }
    });
})($ || ($ = {}));
//trim.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test_mocks.push(async ($) => {
        await $_1.$mol_fiber_warp();
        $_1.$mol_fiber.deadline = Date.now() + 100;
    });
    $_1.$mol_test({
        'sync to async': async ($) => {
            const sum = $_1.$mol_fiber_async((a, b) => a + b);
            const res = await sum(1, 2);
            $_1.$mol_assert_equal(res, 3);
        },
    });
})($ || ($ = {}));
//fiber.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test({
        'Value has js-path name'() {
            class App extends $_1.$mol_object2 {
                static get title() { return new $_1.$mol_object2; }
            }
            __decorate([
                $_1.$mol_atom2_field
            ], App, "title", null);
            $_1.$mol_assert_equal(`${App.title}`, 'App.title');
        },
        'Simple property'() {
            class App extends $_1.$mol_object2 {
            }
            App.value = 1;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "value", void 0);
            $_1.$mol_assert_equal(App.value, 1);
            App.value = 2;
            $_1.$mol_assert_equal(App.value, 2);
        },
        'Instant actualization'($) {
            class Source extends $_1.$mol_object2 {
                constructor() {
                    super(...arguments);
                    this.value = 1;
                }
                get $() { return $; }
                destructor() { }
            }
            __decorate([
                $_1.$mol_atom2_field
            ], Source.prototype, "value", void 0);
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static get source() { return Source.create(); }
                static get value() { return this.source.value + 1; }
            }
            __decorate([
                $_1.$mol_atom2_field
            ], App, "source", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "value", null);
            $_1.$mol_assert_equal(App.value, 2);
            App.source.value = 2;
            $_1.$mol_assert_equal(App.value, 3);
        },
        'Access to cached value'($) {
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static get value() { return 1; }
            }
            __decorate([
                $_1.$mol_atom2_field
            ], App, "value", null);
            $_1.$mol_assert_equal($_1.$mol_atom2_value(() => App.value), undefined);
            $_1.$mol_assert_equal(App.value, 1);
            $_1.$mol_assert_equal($_1.$mol_atom2_value(() => App.value), 1);
        },
        'Do not recalc slaves on equal changes'($) {
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static get result() { return this.first[0] + this.counter++; }
            }
            App.first = [1];
            App.counter = 0;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            $_1.$mol_assert_equal(App.result, 1);
            App.first = [1];
            $_1.$mol_assert_equal(App.result, 1);
        },
        'Do not recalc grand slave on equal direct slave result '($) {
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static get second() { return Math.abs(this.first); }
                static get result() { return this.second + ++this.counter; }
            }
            App.first = 1;
            App.counter = 0;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "second", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            $_1.$mol_assert_equal(App.result, 2);
            App.first = -1;
            $_1.$mol_assert_equal(App.result, 2);
        },
        'Recalc when [not changed master] changes [following master]'($) {
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static get second() {
                    this.third = this.first;
                    return 0;
                }
                static get result() { return this.second + this.third + ++this.counter; }
            }
            App.first = 1;
            App.third = 0;
            App.counter = 0;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "second", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "third", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            $_1.$mol_assert_equal(App.result, 2);
            App.first = 5;
            $_1.$mol_assert_equal(App.result, 7);
        },
        'Branch switching'($) {
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static get second() { return 2; }
                static get result() {
                    return (this.condition ? this.first : this.second) + this.counter++;
                }
            }
            App.first = 1;
            App.condition = true;
            App.counter = 0;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "second", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "condition", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            $_1.$mol_assert_equal(App.result, 1);
            App.condition = false;
            $_1.$mol_assert_equal(App.result, 3);
            App.first = 10;
            $_1.$mol_assert_equal(App.result, 3);
        },
        'Forbidden self invalidation'($) {
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static get second() { return this.first + 1; }
                static get result() {
                    this.second;
                    return this.first++;
                }
            }
            App.first = 1;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "second", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            $_1.$mol_assert_fail(() => App.result);
        },
        'Side effect inside computation'($) {
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static increase() { return ++this.first; }
                static get result() {
                    return this.increase() + 1;
                }
            }
            App.first = 1;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", void 0);
            __decorate([
                $_1.$mol_fiber.method
            ], App, "increase", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            $_1.$mol_assert_equal(App.result, 3);
        },
        'Forbidden cyclic dependency'($) {
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static get first() { return this.second - 1; }
                static get second() { return this.first + 1; }
            }
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "second", null);
            $_1.$mol_assert_fail(() => App.first);
        },
        'Forget sub fibers on complete'($) {
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static count() { return this.counter++; }
                static get result() { return this.count() + this.data; }
            }
            App.counter = 0;
            App.data = 1;
            __decorate([
                $_1.$mol_fiber.method
            ], App, "count", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "data", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            $_1.$mol_assert_equal(App.result, 1);
            App.data = 2;
            $_1.$mol_assert_equal(App.result, 3);
        },
        async 'Automatic destroy owned value on self destruction'($) {
            let counter = 0;
            class Having extends $_1.$mol_object2 {
                destructor() { counter++; }
            }
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static get having() { return Having.create(); }
                static get result() {
                    if (this.condition)
                        this.having;
                    return 0;
                }
            }
            App.condition = true;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "having", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "condition", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            App.result;
            App.condition = false;
            App.result;
            $_1.$mol_assert_equal(counter, 0);
            await $_1.$mol_fiber_warp();
            $_1.$mol_assert_equal(counter, 1);
        },
        async 'Do not destroy putted value'($) {
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static get target() {
                    return this.condition ? this.source : 0;
                }
            }
            App.condition = true;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "source", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "condition", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "target", null);
            App.source = 1;
            $_1.$mol_assert_equal(App.target, 1);
            App.condition = false;
            $_1.$mol_assert_equal(App.target, 0);
            await $_1.$mol_fiber_warp();
            App.condition = true;
            $_1.$mol_assert_equal(App.target, 1);
        },
        'Restore after error'($) {
            class App extends $_1.$mol_object2 {
                static get $() { return $; }
                static get broken() {
                    if (this.condition)
                        $_1.$mol_fail(new Error('test error'));
                    return 1;
                }
                static get result() { return this.broken; }
            }
            App.condition = false;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "condition", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "broken", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            $_1.$mol_assert_equal(App.result, 1);
            App.condition = true;
            $_1.$mol_assert_fail(() => App.result);
            App.condition = false;
            $_1.$mol_assert_equal(App.result, 1);
        },
        async 'auto fresh only when alive'($) {
            let state = 1;
            const monitor = new $.$mol_atom2;
            monitor.$ = $;
            monitor.calculate = () => {
                new $.$mol_after_frame($_1.$mol_atom2.current.fresh);
                return state;
            };
            $_1.$mol_assert_equal(monitor.get(), 1);
            state = 2;
            $_1.$mol_assert_equal(monitor.get(), 1);
            $.$mol_after_mock_warp();
            $_1.$mol_assert_equal(monitor.get(), 2);
            state = 3;
            $_1.$mol_assert_equal(monitor.get(), 2);
            monitor.destructor();
            $_1.$mol_assert_equal(monitor.value, undefined);
            $.$mol_after_mock_warp();
            await $.$mol_fiber_warp();
            $_1.$mol_assert_equal(monitor.value, undefined);
        },
    });
})($ || ($ = {}));
//atom2.test.js.map
;
"use strict";
//param.test.js.map
;
"use strict";
//result.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test({
        'Property method'($) {
            class App extends $_1.$mol_object2 {
                static value(next = 1) { return next + 1; }
            }
            App.$ = $;
            __decorate([
                $_1.$mol_mem
            ], App, "value", null);
            $_1.$mol_assert_equal(App.value(), 2);
            App.value(2);
            $_1.$mol_assert_equal(App.value(), 3);
        },
        'auto sync of properties'($) {
            class X extends $_1.$mol_object2 {
                foo(next) {
                    return next || 1;
                }
                bar() {
                    return this.foo() + 1;
                }
                xxx() {
                    return this.bar() + 1;
                }
            }
            __decorate([
                $_1.$mol_mem
            ], X.prototype, "foo", null);
            __decorate([
                $_1.$mol_mem
            ], X.prototype, "bar", null);
            __decorate([
                $_1.$mol_mem
            ], X.prototype, "xxx", null);
            const x = new X;
            x.$ = $;
            $_1.$mol_assert_equal(x.bar(), 2);
            $_1.$mol_assert_equal(x.xxx(), 3);
            x.foo(5);
            $_1.$mol_assert_equal(x.xxx(), 7);
        },
        async 'must be deferred destroyed when no longer referenced'($) {
            let foo;
            let foo_destroyed = false;
            class B extends $_1.$mol_object2 {
                showing(next) {
                    if (next === void 0)
                        return true;
                    return next;
                }
                foo() {
                    return foo = new class extends $_1.$mol_object {
                        destructor() {
                            foo_destroyed = true;
                        }
                    };
                }
                bar() {
                    return this.showing() ? this.foo() : null;
                }
            }
            __decorate([
                $_1.$mol_mem
            ], B.prototype, "showing", null);
            __decorate([
                $_1.$mol_mem
            ], B.prototype, "foo", null);
            __decorate([
                $_1.$mol_mem
            ], B.prototype, "bar", null);
            var b = new B;
            b.$ = $;
            var bar = b.bar();
            $_1.$mol_assert_ok(bar);
            b.showing(false);
            b.bar();
            await $_1.$mol_fiber_warp();
            $_1.$mol_assert_ok(foo_destroyed);
            $_1.$mol_assert_not(b.bar());
            b.showing(true);
            $_1.$mol_defer.run();
            $_1.$mol_assert_unique(b.bar(), bar);
        },
        async 'wait for data'($) {
            class Test extends $_1.$mol_object2 {
                source() {
                    return $_1.$mol_fiber_sync(() => new Promise(done => done('Jin')))();
                }
                middle() {
                    return this.source();
                }
                target() {
                    return this.middle();
                }
            }
            __decorate([
                $_1.$mol_mem
            ], Test.prototype, "source", null);
            __decorate([
                $_1.$mol_mem
            ], Test.prototype, "middle", null);
            __decorate([
                $_1.$mol_mem
            ], Test.prototype, "target", null);
            const t = new Test;
            t.$ = $;
            $_1.$mol_assert_fail(() => t.target().valueOf(), Promise);
            await $_1.$mol_fiber_warp();
            $_1.$mol_assert_equal(t.target(), 'Jin');
        },
    });
})($ || ($ = {}));
//mem.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'number'() {
            const dict = new $.$mol_dict();
            $.$mol_assert_equal(dict.get(123), undefined);
            $.$mol_assert_equal(dict.has(123), false);
            dict.set(123, 321);
            $.$mol_assert_equal(dict.get(123), 321);
            $.$mol_assert_equal(dict.has(123), true);
            dict.delete(123);
            $.$mol_assert_equal(dict.get(123), undefined);
            $.$mol_assert_equal(dict.has(123), false);
        },
        'pojo as key'() {
            const dict = new $.$mol_dict();
            $.$mol_assert_equal(dict.get({ foo: 123 }), undefined);
            $.$mol_assert_equal(dict.has({ foo: 123 }), false);
            dict.set({ foo: 123 }, 321);
            $.$mol_assert_equal(dict.get({ foo: 123 }), 321);
            $.$mol_assert_equal(dict.has({ foo: 123 }), true);
            dict.delete({ foo: 123 });
            $.$mol_assert_equal(dict.get({ foo: 123 }), undefined);
            $.$mol_assert_equal(dict.has({ foo: 123 }), false);
        },
        'array as key'() {
            const dict = new $.$mol_dict();
            $.$mol_assert_equal(dict.get([123]), undefined);
            $.$mol_assert_equal(dict.has([123]), false);
            dict.set([123], 321);
            $.$mol_assert_equal(dict.get([123]), 321);
            $.$mol_assert_equal(dict.has([123]), true);
            dict.delete([123]);
            $.$mol_assert_equal(dict.get([123]), undefined);
            $.$mol_assert_equal(dict.has([123]), false);
        },
        'html element as key'() {
            const el = $.$mol_jsx("div", null);
            const dict = new $.$mol_dict();
            $.$mol_assert_equal(dict.get(el), undefined);
            $.$mol_assert_equal(dict.has(el), false);
            dict.set(el, 321);
            $.$mol_assert_equal(dict.get(el), 321);
            $.$mol_assert_equal(dict.has(el), true);
            $.$mol_assert_equal(dict.get($.$mol_jsx("div", null)), undefined);
            $.$mol_assert_equal(dict.has($.$mol_jsx("div", null)), false);
            dict.delete(el);
            $.$mol_assert_equal(dict.get(el), undefined);
            $.$mol_assert_equal(dict.has(el), false);
        },
        'for-of key restore'() {
            const dict = new $.$mol_dict([[123, 321]]);
            const keys = [];
            const vals = [];
            for (const [key, val] of dict) {
                keys.push(key);
                vals.push(val);
            }
            $.$mol_assert_equal(keys.length, 1);
            $.$mol_assert_equal(keys[0], 123);
            $.$mol_assert_equal(vals.length, 1);
            $.$mol_assert_equal(vals[0], 321);
        },
        'forEach key restore'() {
            const dict = new $.$mol_dict([[123, 321]]);
            const keys = [];
            const vals = [];
            dict.forEach((val, key) => {
                keys.push(key);
                vals.push(val);
            });
            $.$mol_assert_equal(keys.length, 1);
            $.$mol_assert_equal(keys[0], 123);
            $.$mol_assert_equal(vals.length, 1);
            $.$mol_assert_equal(vals[0], 321);
        },
    });
})($ || ($ = {}));
//dict.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test({
        'keyed reactive properties'($) {
            $_1.$mol_fiber_warp();
            class Fib extends $_1.$mol_object2 {
                static value(index, next) {
                    if (next)
                        return next;
                    if (index < 2)
                        return 1;
                    return this.value(index - 1) + this.value(index - 2);
                }
            }
            Fib.$ = $;
            __decorate([
                $_1.$mol_mem_key
            ], Fib, "value", null);
            $_1.$mol_assert_equal(Fib.value(10), 89);
            Fib.value(1, 2);
            $_1.$mol_assert_equal(Fib.value(10), 144);
        },
        'cached property with simple key'($) {
            class X extends $_1.$mol_object2 {
                foo(id, next) {
                    if (next == null)
                        return new Number(123);
                    return new Number(next);
                }
            }
            __decorate([
                $_1.$mol_mem_key
            ], X.prototype, "foo", null);
            const x = new X;
            x.$ = $;
            $_1.$mol_assert_equal(x.foo(0).valueOf(), 123);
            $_1.$mol_assert_equal(x.foo(0), x.foo(0));
            $_1.$mol_assert_unique(x.foo(0), x.foo(1));
            x.foo(0, 321);
            $_1.$mol_assert_equal(x.foo(0).valueOf(), 321);
            x.foo(0, null);
            $_1.$mol_assert_equal(x.foo(0).valueOf(), 123);
        },
        'cached property with complex key'($) {
            class X extends $_1.$mol_object2 {
                foo(ids) {
                    return Math.random();
                }
            }
            __decorate([
                $_1.$mol_mem_key
            ], X.prototype, "foo", null);
            const x = new X;
            x.$ = $;
            $_1.$mol_assert_equal(x.foo([0, 1]), x.foo([0, 1]));
            $_1.$mol_assert_unique(x.foo([0, 1]), x.foo([0, 2]));
        },
    });
})($ || ($ = {}));
//key.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'const returns stored value'() {
            const foo = { bar: $.$mol_const(Math.random()) };
            $.$mol_assert_equal(foo.bar(), foo.bar());
            $.$mol_assert_equal(foo.bar(), foo.bar['()']);
        },
    });
})($ || ($ = {}));
//const.test.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_atom2_field(proto, name, descr) {
        if (!descr)
            descr = Object.getOwnPropertyDescriptor(proto, name);
        const get = descr ? (descr.get || $.$mol_const(descr.value)) : (() => undefined);
        const set = descr && descr.set || function (next) { get_cache(this).put(next); };
        const store = new WeakMap();
        Object.defineProperty(proto, name + "@", {
            get: function () {
                return store.get(this);
            }
        });
        const get_cache = (host) => {
            let cache = store.get(host);
            if (!cache) {
                cache = new $.$mol_atom2;
                cache.calculate = get.bind(host);
                cache[Symbol.toStringTag] = `${host}.${name}`;
                cache.abort = () => {
                    store.delete(host);
                    cache.forget();
                    return true;
                };
                $.$mol_owning_catch(host, cache);
                store.set(host, cache);
            }
            return cache;
        };
        return {
            get() {
                return get_cache(this).get();
            },
            set,
        };
    }
    $.$mol_atom2_field = $mol_atom2_field;
})($ || ($ = {}));
//field.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test({
        async 'Autorun'($) {
            class App extends $_1.$mol_object2 {
                static get init() {
                    ++this.counter;
                    return this.state;
                }
            }
            App.$ = $;
            App.state = 1;
            App.counter = 0;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "state", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "init", null);
            const autorun = $_1.$mol_atom2_autorun(() => App.init);
            autorun.$ = $;
            try {
                await $_1.$mol_fiber_warp();
                $_1.$mol_assert_equal(App.counter, 1);
                App.state = 2;
                $_1.$mol_assert_equal(App.counter, 1);
                await $_1.$mol_fiber_warp();
                $_1.$mol_assert_equal(App.counter, 2);
                App.state = 3;
            }
            finally {
                autorun.destructor();
            }
            App.state = 4;
            await $_1.$mol_fiber_warp();
            $_1.$mol_assert_equal(App.counter, 2);
        },
    });
})($ || ($ = {}));
//autorun.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test_mocks.push($ => {
        $.$mol_after_timeout = $_1.$mol_after_mock_timeout;
    });
})($ || ($ = {}));
//timeout.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'memoize field'() {
            class Foo {
                static get two() {
                    return ++this.one;
                }
                static set two(next) { }
            }
            Foo.one = 1;
            __decorate([
                $.$mol_memo.field
            ], Foo, "two", null);
            $.$mol_assert_equal(Foo.two, 2);
            $.$mol_assert_equal(Foo.two, 2);
            Foo.two = 3;
            $.$mol_assert_equal(Foo.two, 3);
            $.$mol_assert_equal(Foo.two, 3);
        },
    });
})($ || ($ = {}));
//memo.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test({
        'FQN of anon function'($) {
            const $$ = Object.assign($, { $mol_func_name_test: (() => () => { })() });
            $_1.$mol_assert_equal($$.$mol_func_name_test.name, '');
            $_1.$mol_assert_equal($$.$mol_func_name($$.$mol_func_name_test), '$mol_func_name_test');
            $_1.$mol_assert_equal($$.$mol_func_name_test.name, '$mol_func_name_test');
        },
    });
})($ || ($ = {}));
//name.test.js.map
;
"use strict";
//extract.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test({
        'id auto generation'($) {
            class $mol_view_test_item extends $_1.$mol_view {
            }
            class $mol_view_test_block extends $_1.$mol_view {
                element(id) {
                    return new $mol_view_test_item();
                }
            }
            $mol_view_test_block.$ = $;
            __decorate([
                $_1.$mol_mem_key
            ], $mol_view_test_block.prototype, "element", null);
            var x = $mol_view_test_block.Root(0);
            $_1.$mol_assert_equal(x.dom_node().id, '$mol_view_test_block.Root(0)');
            $_1.$mol_assert_equal(x.element(0).dom_node().id, '$mol_view_test_block.Root(0).element(0)');
        },
        'caching ref to dom node'($) {
            var x = new class extends $_1.$mol_view {
            };
            x.$ = $;
            $_1.$mol_assert_equal(x.dom_node(), x.dom_node());
        },
        'content render'($) {
            class $mol_view_test extends $_1.$mol_view {
                sub() {
                    return ['lol', 5];
                }
            }
            var x = new $mol_view_test();
            x.$ = $;
            var node = x.dom_tree();
            $_1.$mol_assert_equal(node.innerHTML, 'lol5');
        },
        'bem attributes generation'($) {
            class $mol_view_test_item extends $_1.$mol_view {
            }
            class $mol_view_test_block extends $_1.$mol_view {
                Element(id) {
                    return new $mol_view_test_item();
                }
            }
            __decorate([
                $_1.$mol_mem_key
            ], $mol_view_test_block.prototype, "Element", null);
            var x = new $mol_view_test_block();
            x.$ = $;
            $_1.$mol_assert_equal(x.dom_node().getAttribute('mol_view_test_block'), '');
            $_1.$mol_assert_equal(x.dom_node().getAttribute('mol_view'), '');
            $_1.$mol_assert_equal(x.Element(0).dom_node().getAttribute('mol_view_test_block_element'), '');
            $_1.$mol_assert_equal(x.Element(0).dom_node().getAttribute('mol_view_test_item'), '');
            $_1.$mol_assert_equal(x.Element(0).dom_node().getAttribute('mol_view'), '');
        },
        'render custom attributes'($) {
            class $mol_view_test extends $_1.$mol_view {
                attr() {
                    return {
                        'href': '#haha',
                        'required': true,
                        'hidden': false,
                    };
                }
            }
            var x = new $mol_view_test();
            x.$ = $;
            var node = x.dom_tree();
            $_1.$mol_assert_equal(node.getAttribute('href'), '#haha');
            $_1.$mol_assert_equal(node.getAttribute('required'), 'true');
            $_1.$mol_assert_equal(node.getAttribute('hidden'), null);
        },
        'render custom fields'($) {
            class $mol_view_test extends $_1.$mol_view {
                field() {
                    return {
                        'hidden': true
                    };
                }
            }
            var x = new $mol_view_test();
            x.$ = $;
            var node = x.dom_tree();
            $_1.$mol_assert_equal(node.hidden, true);
        },
        'attach event handlers'($) {
            var clicked = false;
            class $mol_view_test extends $_1.$mol_view {
                event() {
                    return {
                        'click': (next) => this.event_click(next)
                    };
                }
                event_click(next) {
                    clicked = true;
                }
            }
            var x = new $mol_view_test();
            x.$ = $;
            var node = x.dom_node();
            node.click();
            $_1.$mol_assert_ok(clicked);
        },
    });
})($ || ($ = {}));
//view.test.js.map
;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $_1.$mol_test({
            'handle clicks by default'($) {
                let clicked = false;
                const clicker = $$.$mol_button.make({
                    $,
                    event_click: (event) => { clicked = true; },
                });
                const element = clicker.dom_tree();
                const event = $_1.$mol_dom_context.document.createEvent('mouseevent');
                event.initEvent('click', true, true);
                element.dispatchEvent(event);
                $_1.$mol_assert_ok(clicked);
            },
            'no handle clicks if disabled'($) {
                let clicked = false;
                const clicker = $$.$mol_button.make({
                    $,
                    event_click: (event) => { clicked = true; },
                    enabled: () => false,
                });
                const element = clicker.dom_tree();
                const event = $_1.$mol_dom_context.document.createEvent('mouseevent');
                event.initEvent('click', true, true);
                element.dispatchEvent(event);
                $_1.$mol_assert_not(clicked);
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));
//button.test.js.map
;
"use strict";
var $;
(function ($) {
    class $mol_style_sheet_test1 extends $.$mol_view {
        Item() { return new $.$mol_view; }
    }
    $.$mol_style_sheet_test1 = $mol_style_sheet_test1;
    class $mol_style_sheet_test2 extends $.$mol_view {
        List() { return new $mol_style_sheet_test1; }
    }
    $.$mol_style_sheet_test2 = $mol_style_sheet_test2;
    $.$mol_test({
        'component block styles'() {
            class $mol_style_sheet_test extends $.$mol_view {
            }
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                display: 'block',
                zIndex: 1,
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tdisplay: block;\n\tz-index: 1;\n}\n');
        },
        'various units'() {
            class $mol_style_sheet_test extends $.$mol_view {
            }
            const { px, per } = $.$mol_style_unit;
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                width: per(50),
                height: px(50),
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\twidth: 50%;\n\theight: 50px;\n}\n');
        },
        'various functions'() {
            class $mol_style_sheet_test extends $.$mol_view {
            }
            const { calc } = $.$mol_style_func;
            const { px, per } = $.$mol_style_unit;
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                width: calc(`${per(100)} - ${px(1)}`),
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\twidth: calc(100% - 1px);\n}\n');
        },
        'property groups'() {
            class $mol_style_sheet_test extends $.$mol_view {
            }
            const { px } = $.$mol_style_unit;
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                flex: {
                    grow: 5
                }
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tflex-grow: 5;\n}\n');
        },
        'property shorthand'() {
            class $mol_style_sheet_test extends $.$mol_view {
            }
            const { px } = $.$mol_style_unit;
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                padding: [px(5), 'auto']
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tpadding: 5px auto;\n}\n');
        },
        'sequenced values'() {
            class $mol_style_sheet_test extends $.$mol_view {
            }
            const { url } = $.$mol_style_func;
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                background: {
                    image: [[url('foo')], [url('bar')]],
                },
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tbackground-image: url("foo"),url("bar");\n}\n');
        },
        'sequenced structs'() {
            class $mol_style_sheet_test extends $.$mol_view {
            }
            const { rem } = $.$mol_style_unit;
            const { hsla } = $.$mol_style_func;
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                box: {
                    shadow: [
                        {
                            inset: true,
                            x: 0,
                            y: 0,
                            blur: rem(.5),
                            spread: 0,
                            color: 'red',
                        },
                        {
                            inset: false,
                            x: 0,
                            y: 0,
                            blur: rem(.5),
                            spread: 0,
                            color: 'blue',
                        },
                    ],
                },
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test] {\n\tbox-shadow: inset 0 0 0.5rem 0 red,0 0 0.5rem 0 blue;\n}\n');
        },
        'component block styles with pseudo class'() {
            class $mol_style_sheet_test extends $.$mol_view {
            }
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                ':focus': {
                    color: 'red',
                    display: 'block',
                },
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test]:focus {\n\tcolor: red;\n\tdisplay: block;\n}\n');
        },
        'component block styles with pseudo element'() {
            class $mol_style_sheet_test extends $.$mol_view {
            }
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                '::first-line': {
                    color: 'red',
                    display: 'block',
                },
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test]::first-line {\n\tcolor: red;\n\tdisplay: block;\n}\n');
        },
        'component block styles with media query'() {
            class $mol_style_sheet_test extends $.$mol_view {
            }
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                '@media': {
                    'print': {
                        color: 'red',
                        display: 'block',
                    },
                },
            });
            $.$mol_assert_equal(sheet, '@media print {\n[mol_style_sheet_test] {\n\tcolor: red;\n\tdisplay: block;\n}\n}\n');
        },
        'component block styles with attribute value'() {
            class $mol_style_sheet_test extends $.$mol_view {
                attr() {
                    return {
                        mol_theme: '$mol_theme_dark'
                    };
                }
            }
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                '@': {
                    mol_theme: {
                        '$mol_theme_dark': {
                            color: 'red',
                            display: 'block',
                        },
                    },
                },
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test][mol_theme="$mol_theme_dark"] {\n\tcolor: red;\n\tdisplay: block;\n}\n');
        },
        'component element styles'() {
            class $mol_style_sheet_test extends $.$mol_view {
                Item() { return new $.$mol_view; }
            }
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                Item: {
                    color: 'red',
                    display: 'block',
                },
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test_item] {\n\tcolor: red;\n\tdisplay: block;\n}\n');
        },
        'component element of element styles'() {
            const sheet = $.$mol_style_sheet($mol_style_sheet_test2, {
                List: {
                    Item: {
                        color: 'red',
                        display: 'block',
                    },
                },
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test2_list_item] {\n\tcolor: red;\n\tdisplay: block;\n}\n');
        },
        'component element styles with block attribute value'() {
            class $mol_style_sheet_test extends $.$mol_view {
                Item() { return new $.$mol_view; }
                attr() {
                    return {
                        mol_theme: '$mol_theme_dark'
                    };
                }
            }
            const sheet = $.$mol_style_sheet($mol_style_sheet_test, {
                '@': {
                    mol_theme: {
                        '$mol_theme_dark': {
                            Item: {
                                color: 'red',
                            },
                        },
                    },
                },
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test][mol_theme="$mol_theme_dark"] [mol_style_sheet_test_item] {\n\tcolor: red;\n}\n');
        },
        'inner component styles by class'() {
            const sheet = $.$mol_style_sheet($mol_style_sheet_test2, {
                $mol_style_sheet_test1: {
                    color: 'red',
                    display: 'block',
                },
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test2] [mol_style_sheet_test1] {\n\tcolor: red;\n\tdisplay: block;\n}\n');
        },
        'child component styles by class'() {
            const sheet = $.$mol_style_sheet($mol_style_sheet_test2, {
                '>': {
                    $mol_style_sheet_test1: {
                        color: 'red',
                        display: 'block',
                    },
                },
            });
            $.$mol_assert_equal(sheet, '[mol_style_sheet_test2] > [mol_style_sheet_test1] {\n\tcolor: red;\n\tdisplay: block;\n}\n');
        },
    });
})($ || ($ = {}));
//sheet.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test_mocks.push(context => {
        class $mol_state_arg_mock extends $_1.$mol_state_arg {
            static href(next) { return next || ''; }
        }
        $mol_state_arg_mock.$ = context;
        __decorate([
            $_1.$mol_mem
        ], $mol_state_arg_mock, "href", null);
        context.$mol_state_arg = $mol_state_arg_mock;
    });
    $_1.$mol_test({
        'args as dictionary'($) {
            $.$mol_state_arg.href('#foo=bar/xxx');
            $_1.$mol_assert_like($.$mol_state_arg.dict(), { foo: 'bar', xxx: '' });
            $.$mol_state_arg.dict({ foo: null, yyy: '', lol: '123' });
            $_1.$mol_assert_equal($.$mol_state_arg.href().replace(/.*#/, '#'), '#yyy/lol=123');
        },
        'one value from args'($) {
            $.$mol_state_arg.href('#foo=bar/xxx');
            $_1.$mol_assert_equal($.$mol_state_arg.value('foo'), 'bar');
            $_1.$mol_assert_equal($.$mol_state_arg.value('xxx'), '');
            $.$mol_state_arg.value('foo', 'lol');
            $_1.$mol_assert_equal($.$mol_state_arg.href().replace(/.*#/, '#'), '#foo=lol/xxx');
            $.$mol_state_arg.value('foo', '');
            $_1.$mol_assert_equal($.$mol_state_arg.href().replace(/.*#/, '#'), '#foo/xxx');
            $.$mol_state_arg.value('foo', null);
            $_1.$mol_assert_equal($.$mol_state_arg.href().replace(/.*#/, '#'), '#xxx');
        },
        'nested args'($) {
            const base = new $.$mol_state_arg('nested.');
            class Nested extends $_1.$mol_state_arg {
                constructor(prefix) {
                    super(base.prefix + prefix);
                }
            }
            Nested.value = (key, next) => base.value(key, next);
            $.$mol_state_arg.href('#foo=bar/nested.xxx=123');
            $_1.$mol_assert_equal(Nested.value('foo'), null);
            $_1.$mol_assert_equal(Nested.value('xxx'), '123');
            Nested.value('foo', 'lol');
            $_1.$mol_assert_equal($.$mol_state_arg.href().replace(/.*#/, '#'), '#foo=bar/nested.xxx=123/nested.foo=lol');
        },
    });
})($ || ($ = {}));
//arg.web.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'all cases of using maybe'() {
            $.$mol_assert_equal($.$mol_maybe(0)[0], 0);
            $.$mol_assert_equal($.$mol_maybe(false)[0], false);
            $.$mol_assert_equal($.$mol_maybe(null)[0], void 0);
            $.$mol_assert_equal($.$mol_maybe(void 0)[0], void 0);
            $.$mol_assert_equal($.$mol_maybe(void 0).map(v => v.toString())[0], void 0);
            $.$mol_assert_equal($.$mol_maybe(0).map(v => v.toString())[0], '0');
        },
    });
})($ || ($ = {}));
//maybe.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'null by default'() {
            const key = String(Math.random());
            $.$mol_assert_equal($.$mol_state_session.value(key), null);
        },
        'storing'() {
            const key = String(Math.random());
            $.$mol_state_session.value(key, '$mol_state_session_test');
            $.$mol_assert_equal($.$mol_state_session.value(key), '$mol_state_session_test');
            $.$mol_state_session.value(key, null);
            $.$mol_assert_equal($.$mol_state_session.value(key), null);
        },
    });
})($ || ($ = {}));
//session.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test_mocks.push(context => {
        class $mol_state_local_mock extends $.$mol_state_local {
            static value(key, next = this.state[key], force) {
                return this.state[key] = (next || null);
            }
        }
        $mol_state_local_mock.state = {};
        __decorate([
            $.$mol_mem_key
        ], $mol_state_local_mock, "value", null);
        context.$mol_state_local = $mol_state_local_mock;
    });
})($ || ($ = {}));
//local.mock.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'local get set delete'() {
            var key = '$mol_state_local_test:' + Math.random();
            $.$mol_assert_equal($.$mol_state_local.value(key), null);
            $.$mol_state_local.value(key, 123);
            $.$mol_assert_equal($.$mol_state_local.value(key), 123);
            $.$mol_state_local.value(key, null);
            $.$mol_assert_equal($.$mol_state_local.value(key), null);
        },
    });
})($ || ($ = {}));
//local.test.js.map
;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $_1.$mol_test({
            'task add'($) {
                const app = $$.$hyoo_todomvc.make({ $ });
                const rows = app.task_rows();
                const title = Math.random().toString(16).slice(2);
                app.Add().value(title);
                app.Add().done();
                $_1.$mol_assert_equal(app.task_rows()[0].title(), title);
                $_1.$mol_assert_equal(app.task_rows()[0].completed(), false);
                $_1.$mol_assert_like(app.task_rows().slice(1), rows);
                $_1.$mol_assert_equal(app.Add().value(), '');
            },
            'task rename'($) {
                const title = Math.random().toString(16).slice(2);
                save: {
                    const app = $$.$hyoo_todomvc.make({ $ });
                    app.Add().value('test title');
                    app.Add().done();
                    app.task_rows()[0].Title().value(title);
                }
                load: {
                    const app = $$.$hyoo_todomvc.make({ $ });
                    $_1.$mol_assert_equal(app.task_rows()[0].Title().value(), title);
                }
            },
            'task toggle'($) {
                save: {
                    const app = $$.$hyoo_todomvc.make({ $ });
                    app.Add().value('test title');
                    app.Add().done();
                    $_1.$mol_assert_equal(app.task_rows()[0].Complete().checked(), false);
                    app.task_rows()[0].Complete().click();
                }
                toggle: {
                    const app = $$.$hyoo_todomvc.make({ $ });
                    $_1.$mol_assert_equal(app.task_rows()[0].Complete().checked(), true);
                    app.task_rows()[0].Complete().click();
                }
                load: {
                    const app = $$.$hyoo_todomvc.make({ $ });
                    $_1.$mol_assert_equal(app.task_rows()[0].Complete().checked(), false);
                }
            },
            'task delete'($) {
                const app = $$.$hyoo_todomvc.make({ $ });
                app.Add().value('test title');
                app.Add().done();
                const top = app.task_rows()[0];
                top.Drop().click();
                $_1.$mol_assert_not(app.task_rows().includes(top));
            },
            'navigation'($) {
                const app = $$.$hyoo_todomvc.make({ $ });
                app.Add().value('test title');
                app.Add().done();
                const task1 = app.task_rows()[0];
                app.Add().value('test title 2');
                app.Add().done();
                const task2 = app.task_rows()[1];
                task2.Complete().click();
                $_1.$mol_assert_ok(app.task_rows().includes(task1));
                $_1.$mol_assert_ok(app.task_rows().includes(task2));
                $.$mol_state_arg.href(app.Filter_completed().uri());
                $_1.$mol_assert_not(app.task_rows().includes(task1));
                $_1.$mol_assert_ok(app.task_rows().includes(task2));
                $.$mol_state_arg.href(app.Filter_active().uri());
                $_1.$mol_assert_ok(app.task_rows().includes(task1));
                $_1.$mol_assert_not(app.task_rows().includes(task2));
                $.$mol_state_arg.href(app.Filter_all().uri());
                $_1.$mol_assert_ok(app.task_rows().includes(task1));
                $_1.$mol_assert_ok(app.task_rows().includes(task2));
            },
            'clear completed'($) {
                const app = $$.$hyoo_todomvc.make({ $ });
                app.Add().value('test title');
                app.Add().done();
                const task1 = app.task_rows()[0];
                app.Add().value('test title 2');
                app.Add().done();
                const task2 = app.task_rows()[1];
                task2.Complete().click();
                $_1.$mol_assert_ok(app.task_rows().includes(task1));
                $_1.$mol_assert_ok(app.task_rows().includes(task2));
                app.Sweep().click();
                $_1.$mol_assert_ok(app.task_rows().includes(task1));
                $_1.$mol_assert_not(app.task_rows().includes(task2));
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));
//todomvc.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'Attach to document'() {
            const doc = $.$mol_dom_parse('<html><body id="/foo"></body></html>');
            $.$mol_jsx_attach(doc, () => $.$mol_jsx("body", { id: "/foo" }, "bar"));
            $.$mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">bar</body></html>');
        },
    });
})($ || ($ = {}));
//attach.test.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_jsx_attach(next, action) {
        const prev = $.$mol_jsx_document;
        try {
            $.$mol_jsx_document = next;
            return action();
        }
        finally {
            $.$mol_jsx_document = prev;
        }
    }
    $.$mol_jsx_attach = $mol_jsx_attach;
})($ || ($ = {}));
//attach.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test({
        'Class as component'() {
            class Foo extends $_1.$mol_jsx_view {
                constructor() {
                    super(...arguments);
                    this.title = '';
                }
                render() {
                    return $_1.$mol_jsx("div", null,
                        this.title,
                        " ",
                        this.childNodes.join('-'));
                }
            }
            const dom = $_1.$mol_jsx(Foo, { id: "/foo", title: "bar" },
                "xxx",
                123);
            $_1.$mol_assert_equal(dom.outerHTML, '<div id="/foo">bar xxx-123</div>');
        },
        'View by element'() {
            class Br extends $_1.$mol_jsx_view {
                render() {
                    view = this;
                    return $_1.$mol_jsx("br", { id: "/foo" });
                }
            }
            let view;
            $_1.$mol_assert_equal(Br.of($_1.$mol_jsx(Br, null)), view);
        },
        'Attached view rerender'() {
            const doc = $_1.$mol_dom_parse('<html><body id="/foo"></body></html>');
            class Title extends $_1.$mol_jsx_view {
                constructor() {
                    super(...arguments);
                    this.value = 'foo';
                }
                render() {
                    return $_1.$mol_jsx("div", null, this.value);
                }
            }
            const dom = $_1.$mol_jsx_attach(doc, () => $_1.$mol_jsx(Title, { id: "/foo" }));
            const title = Title.of(dom);
            $_1.$mol_assert_equal(title.ownerDocument, doc);
            $_1.$mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">foo</body></html>');
            title.value = 'bar';
            title.valueOf();
            $_1.$mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">bar</body></html>');
        },
        async 'Reactive attached view'($) {
            const doc = $_1.$mol_dom_parse('<html><body id="/foo"></body></html>');
            class Task extends $_1.$mol_object2 {
                title(next) { return next || 'foo'; }
            }
            __decorate([
                $_1.$mol_mem
            ], Task.prototype, "title", null);
            class App extends $_1.$mol_jsx_view {
                task() { return new Task; }
                valueOf() {
                    return super.valueOf();
                }
                render() {
                    return $_1.$mol_jsx("div", null, this.task().title());
                }
            }
            __decorate([
                $_1.$mol_mem
            ], App.prototype, "task", null);
            __decorate([
                $_1.$mol_mem
            ], App.prototype, "valueOf", null);
            const task = new Task;
            task.$ = $;
            const autorun = $.$mol_atom2_autorun(() => $_1.$mol_jsx_attach(doc, () => $_1.$mol_jsx(App, { "$": $, id: "/foo", task: () => task })));
            autorun.$ = $;
            await $_1.$mol_fiber_warp();
            $_1.$mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">foo</body></html>');
            task.title('bar');
            await $_1.$mol_fiber_warp();
            $_1.$mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">bar</body></html>');
        },
    });
})($ || ($ = {}));
//view.test.js.map
;
"use strict";
var $;
(function ($) {
    class $mol_jsx_view extends $.$mol_object2 {
        static of(node) {
            return node[this];
        }
        valueOf() {
            const prefix = $.$mol_jsx_prefix;
            const booked = $.$mol_jsx_booked;
            const document = $.$mol_jsx_document;
            try {
                $.$mol_jsx_prefix = this[Symbol.toStringTag];
                $.$mol_jsx_booked = new Set;
                $.$mol_jsx_document = this.ownerDocument;
                return this.render();
            }
            finally {
                $.$mol_jsx_prefix = prefix;
                $.$mol_jsx_booked = booked;
                $.$mol_jsx_document = document;
            }
        }
        render() {
            return $.$mol_fail(new Error('dom_tree() not implemented'));
        }
    }
    $.$mol_jsx_view = $mol_jsx_view;
})($ || ($ = {}));
//view.js.map
;
"use strict";
//equals.test.js.map
;
"use strict";
//equals.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'equal paths'() {
            const diff = $.$mol_diff_path([1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]);
            $.$mol_assert_like(diff, {
                prefix: [1, 2, 3, 4],
                suffix: [[], [], []],
            });
        },
        'different suffix'() {
            const diff = $.$mol_diff_path([1, 2, 3, 4], [1, 2, 3, 5], [1, 2, 5, 4]);
            $.$mol_assert_like(diff, {
                prefix: [1, 2],
                suffix: [[3, 4], [3, 5], [5, 4]],
            });
        },
        'one contains other'() {
            const diff = $.$mol_diff_path([1, 2, 3, 4], [1, 2], [1, 2, 3]);
            $.$mol_assert_like(diff, {
                prefix: [1, 2],
                suffix: [[3, 4], [], [3]],
            });
        },
        'fully different'() {
            const diff = $.$mol_diff_path([1, 2], [3, 4], [5, 6]);
            $.$mol_assert_like(diff, {
                prefix: [],
                suffix: [[1, 2], [3, 4], [5, 6]],
            });
        },
    });
})($ || ($ = {}));
//path.test.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_diff_path(...paths) {
        const limit = Math.min(...paths.map(path => path.length));
        lookup: for (var i = 0; i < limit; ++i) {
            const first = paths[0][i];
            for (let j = 1; j < paths.length; ++j) {
                if (paths[j][i] !== first)
                    break lookup;
            }
        }
        return {
            prefix: paths[0].slice(0, i),
            suffix: paths.map(path => path.slice(i)),
        };
    }
    $.$mol_diff_path = $mol_diff_path;
})($ || ($ = {}));
//path.js.map
;
"use strict";
var $;
(function ($) {
    class $mol_error_mix extends Error {
        constructor(message, ...errors) {
            super(message);
            this.errors = errors;
            if (errors.length) {
                const stacks = [...errors.map(error => error.message), this.stack];
                const diff = $.$mol_diff_path(...stacks.map(stack => {
                    if (!stack)
                        return [];
                    return stack.split('\n').reverse();
                }));
                const head = diff.prefix.reverse().join('\n');
                const tails = diff.suffix.map(path => path.reverse().map(line => line.replace(/^(?!\s+at)/, '\tat (.) ')).join('\n')).join('\n\tat (.) -----\n');
                this.stack = `Error: ${this.constructor.name}\n\tat (.) /"""\\\n${tails}\n\tat (.) \\___/\n${head}`;
                this.message += errors.map(error => '\n' + error.message).join('');
            }
        }
        toJSON() {
            return this.message;
        }
    }
    $.$mol_error_mix = $mol_error_mix;
})($ || ($ = {}));
//mix.js.map
;
"use strict";
var $;
(function ($_1) {
    var $$;
    (function ($$) {
        $_1.$mol_test({
            'simple props'($) {
                const app = $_1.$mol_view_tree_test_simple.make({ $ });
                $_1.$mol_assert_equal(app.some(), 1);
                $_1.$mol_assert_equal(app.bool(), true);
                $_1.$mol_assert_equal(app.str(), 'test');
                $_1.$mol_assert_ok(Array.isArray(app.arr()));
                $_1.$mol_assert_ok(Array.isArray(app.arr_string()));
            },
            'default value'($) {
                const app = $_1.$mol_view_tree_test_binding.make({ $ });
                $_1.$mol_assert_equal(app.value(), '123');
            },
            'both binding'($) {
                const app = $_1.$mol_view_tree_test_binding.make({ $ });
                $_1.$mol_assert_ok(app.value() !== 1);
                app.value(1);
                $_1.$mol_assert_equal(app.value(), 1);
            },
            'left binding'($) {
                const app = $_1.$mol_view_tree_test_binding.make({ $ });
                $_1.$mol_assert_not(app.head_complete_enabled());
                $_1.$mol_assert_not(app.enabled());
            },
            'sub component'($) {
                const app = $_1.$mol_view_tree_test_binding_right.make({ $ });
                $_1.$mol_assert_ok(app.Test() instanceof $_1.$mol_view_tree_test_binding_right_test);
            },
            'right binding - change owner property'($) {
                const app = $_1.$mol_view_tree_test_binding_right.make({ $ });
                const val = 123;
                $_1.$mol_assert_ok(app.outer_width() !== val);
                $_1.$mol_assert_ok(app.Test().width() !== val);
                app.outer_width(val);
                $_1.$mol_assert_equal(app.outer_width(), val);
                $_1.$mol_assert_equal(app.Test().width(), val);
            },
            'right binding - change part property'($) {
                const app = $_1.$mol_view_tree_test_binding_right.make({ $ });
                const val = 123;
                $_1.$mol_assert_ok(app.outer_width() !== val);
                $_1.$mol_assert_ok(app.Test().width() !== val);
                app.Test().width(val);
                $_1.$mol_assert_equal(app.Test().width(), val);
                $_1.$mol_assert_equal(app.outer_width(), val);
            },
            'attributes merging'($) {
                const app = $_1.$mol_view_tree_test_attributes.make({ $ });
                $_1.$mol_assert_like(app.some(), { a: 1, b: 2 });
            },
            'subcomponent indexed'($) {
                const app = $_1.$mol_view_tree_test_attributes_subcomponent.make({ $ });
                const val = 123;
                app.page = (index) => index;
                $_1.$mol_assert_equal(app.Page(val).Sub(), val);
            },
        });
    })($$ = $_1.$$ || ($_1.$$ = {}));
})($ || ($ = {}));
//tree.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test({
        'tree parsing'() {
            $_1.$mol_assert_equal($_1.$mol_tree.fromString("foo\nbar\n").sub.length, 2);
            $_1.$mol_assert_equal($_1.$mol_tree.fromString("foo\nbar\n").sub[1].type, "bar");
            $_1.$mol_assert_equal($_1.$mol_tree.fromString("foo\n\n\n").sub.length, 1);
            $_1.$mol_assert_equal($_1.$mol_tree.fromString("=foo\n\\bar\n").sub.length, 2);
            $_1.$mol_assert_equal($_1.$mol_tree.fromString("=foo\n\\bar\n").sub[1].data, "bar");
            $_1.$mol_assert_equal($_1.$mol_tree.fromString("foo bar \\pol").sub[0].sub[0].sub[0].data, "pol");
            $_1.$mol_assert_equal($_1.$mol_tree.fromString("foo bar\n\t\\pol\n\t\\men").sub[0].sub[0].sub[1].data, "men");
            $_1.$mol_assert_equal($_1.$mol_tree.fromString('foo bar \\text\n').toString(), 'foo bar \\text\n');
        },
        'inserting'() {
            $_1.$mol_assert_equal($_1.$mol_tree.fromString('a b c d').insert(new $_1.$mol_tree, 'a', 'b', 'c').toString(), 'a b \\\n');
            $_1.$mol_assert_equal($_1.$mol_tree.fromString('a b').insert(new $_1.$mol_tree, 'a', 'b', 'c', 'd').toString(), 'a b c \\\n');
            $_1.$mol_assert_equal($_1.$mol_tree.fromString('a b c d').insert(new $_1.$mol_tree, 0, 0, 0).toString(), 'a b \\\n');
            $_1.$mol_assert_equal($_1.$mol_tree.fromString('a b').insert(new $_1.$mol_tree, 0, 0, 0, 0).toString(), 'a b \\\n\t\\\n');
            $_1.$mol_assert_equal($_1.$mol_tree.fromString('a b c d').insert(new $_1.$mol_tree, null, null, null).toString(), 'a b \\\n');
            $_1.$mol_assert_equal($_1.$mol_tree.fromString('a b').insert(new $_1.$mol_tree, null, null, null, null).toString(), 'a b \\\n\t\\\n');
        },
        'fromJSON'() {
            $_1.$mol_assert_equal($_1.$mol_tree.fromJSON([]).toString(), '/\n');
            $_1.$mol_assert_equal($_1.$mol_tree.fromJSON([false, true]).toString(), '/\n\tfalse\n\ttrue\n');
            $_1.$mol_assert_equal($_1.$mol_tree.fromJSON([0, 1, 2.3]).toString(), '/\n\t0\n\t1\n\t2.3\n');
            $_1.$mol_assert_equal($_1.$mol_tree.fromJSON(['', 'foo', 'bar\nbaz']).toString(), '/\n\t\\\n\t\\foo\n\t\\\n\t\t\\bar\n\t\t\\baz\n');
            $_1.$mol_assert_equal($_1.$mol_tree.fromJSON({ 'foo': false, 'bar\nbaz': 'lol' }).toString(), '*\n\tfoo false\n\t\\\n\t\t\\bar\n\t\t\\baz\n\t\t\\lol\n');
        },
        'toJSON'() {
            $_1.$mol_assert_equal(JSON.stringify($_1.$mol_tree.fromString('/\n').sub[0]), '[]');
            $_1.$mol_assert_equal(JSON.stringify($_1.$mol_tree.fromString('/\n\tfalse\n\ttrue\n').sub[0]), '[false,true]');
            $_1.$mol_assert_equal(JSON.stringify($_1.$mol_tree.fromString('/\n\t0\n\t1\n\t2.3\n').sub[0]), '[0,1,2.3]');
            $_1.$mol_assert_equal(JSON.stringify($_1.$mol_tree.fromString('/\n\t\\\n\t\\foo\n\t\\\n\t\t\\bar\n\t\t\\baz\n').sub[0]), '["","foo","bar\\nbaz"]');
            $_1.$mol_assert_equal(JSON.stringify($_1.$mol_tree.fromString('*\n\tfoo false\n\t\\\n\t\t\\bar\n\t\t\\baz\n\t\t\\lol\n').sub[0]), '{"foo":false,"bar\\nbaz":"lol"}');
        },
        'hack'() {
            const res = $_1.$mol_tree.fromString(`foo bar xxx`).hack({
                '': (tree, context) => [tree.hack(context)],
                'bar': (tree, context) => [tree.hack(context).clone({ type: '777' })],
            });
            $_1.$mol_assert_equal(res.toString(), new $_1.$mol_tree({ type: 'foo 777 xxx' }).toString());
        },
        'errors handling'($) {
            const errors = [];
            class Tree extends $_1.$mol_tree {
            }
            Tree.$ = $.$mol_ambient({
                $mol_fail: error => errors.push(error.message)
            });
            Tree.fromString(`
				\t \tfoo
				bar \\data
			`, 'test');
            $_1.$mol_assert_like(errors, ['Syntax error at test:2\n \tfoo']);
        },
    });
})($ || ($ = {}));
//tree.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'encode utf8 string'() {
            const str = 'Hello, ΧΨΩЫ';
            const encoded = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 206, 167, 206, 168, 206, 169, 208, 171]);
            $.$mol_assert_like($.$mol_charset_encode(str), encoded);
        },
    });
})($ || ($ = {}));
//encode.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'decode utf8 string'() {
            const str = 'Hello, ΧΨΩЫ';
            const encoded = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 206, 167, 206, 168, 206, 169, 208, 171]);
            $.$mol_assert_equal($.$mol_charset_decode(encoded), str);
            $.$mol_assert_equal($.$mol_charset_decode(encoded, 'utf8'), str);
        },
        'decode empty string'() {
            const encoded = new Uint8Array([]);
            $.$mol_assert_equal($.$mol_charset_decode(encoded), '');
        },
    });
})($ || ($ = {}));
//decode.test.js.map

//# sourceMappingURL=web.test.js.map
