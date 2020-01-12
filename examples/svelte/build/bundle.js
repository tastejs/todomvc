var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if (typeof $$scope.dirty === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    const seen_callbacks = new Set();
    function flush() {
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error(`Cannot have duplicate keys in a keyed each`);
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.18.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const STORAGE_KEY = 'todos-svelte';

    var localStorageService = {
    	read() {
    		const json = localStorage.getItem(STORAGE_KEY);
    		const persistedValue = json && JSON.parse(json);
    		return persistedValue || [];
    	},
    	write(newList) {
    		localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    		return newList;
    	}
    };

    /*jshint bitwise: false*/

    // from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
    function v4() {
    	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    		let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    		return v.toString(16);
    	});
    }

    /* jshint esnext: false */
    /* jshint esversion: 9 */

    const valid = function({ title }) {
    	return !!(title && title.trim());
    };

    const build = function({id, title = '', completed = false }) {
    	return {
    		...(id && {id}),
    		title: title && title.trim(),
    		completed
    	};
    };

    const add = function(list, changes) {
    	const todo = build({id: v4(), ...changes});
    	return [...list, todo];
    };

    const remove = function(list, id) {
    	return list.filter(todo => todo.id !== id);
    };

    const modify = function(list, id, changes) {
    	return list.map(todo => (
    		todo.id === id ? build({...todo, ...changes}) : todo
    	));
    };

    const modifyAll = function(list, changes) {
    	return list.map(todo => build({...todo, ...changes}));
    };

    const filterByUncompleted = function(list) {
    	return list.filter(todo => !todo.completed);
    };

    function createTodosStore(storageService) {
    	const persistedValue = storageService.read();
    	const store = writable(persistedValue);

    	const updateWithTransform = function(transform) {
    		return store.update(list => {
    			const newList = transform(list);
    			return storageService.write(newList);
    		});
    	};

    	return {
    		...store,
    		add: todo =>
    			updateWithTransform(list => add(list, todo)),
    		remove: id =>
    			updateWithTransform(list => remove(list, id)),
    		toggle: (id, completed) =>
    			updateWithTransform(list => modify(list, id, {completed})),
    		updateTitle: (id, title) =>
    			updateWithTransform(list => modify(list, id, {title})),
    		toggleAll: completed =>
    			updateWithTransform(list => modifyAll(list, {completed})),
    		clearAllCompleteds: () =>
    			updateWithTransform(list => filterByUncompleted(list))
    	};
    }

    function createVisibleStore(todosStore) {
    	return derived(todosStore, $todosStore => $todosStore.length > 0);
    }

    const todos = createTodosStore(localStorageService);
    const visible = createVisibleStore(todos);

    const ENTER_KEY = 13;
    const ESCAPE_KEY = 27;

    /* js/components/NewItem.svelte generated by Svelte v3.18.1 */
    const file = "js/components/NewItem.svelte";

    function create_fragment(ctx) {
    	let header;
    	let h1;
    	let t1;
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "todos";
    			t1 = space();
    			input = element("input");
    			add_location(h1, file, 30, 1, 509);
    			attr_dev(input, "class", "new-todo");
    			attr_dev(input, "autocomplete", "off");
    			attr_dev(input, "placeholder", "What needs to be done?");
    			add_location(input, file, 31, 1, 525);
    			attr_dev(header, "class", "header");
    			add_location(header, file, 29, 0, 484);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(header, t1);
    			append_dev(header, input);
    			/*input_binding*/ ctx[5](input);
    			set_input_value(input, /*title*/ ctx[1]);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    				listen_dev(input, "keydown", /*handleSubmit*/ ctx[2], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 2 && input.value !== /*title*/ ctx[1]) {
    				set_input_value(input, /*title*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			/*input_binding*/ ctx[5](null);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { todos = [] } = $$props;
    	let inputEl = null;
    	let title = "";
    	onMount(async () => inputEl.focus());

    	const addItem = function () {
    		const newItem = { title };

    		if (!valid(newItem)) {
    			return;
    		}

    		todos.add(newItem);
    		$$invalidate(1, title = null);
    	};

    	const handleSubmit = el => {
    		if (el.keyCode !== ENTER_KEY) {
    			return;
    		}

    		addItem();
    	};

    	const writable_props = ["todos"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NewItem> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(0, inputEl = $$value);
    		});
    	}

    	function input_input_handler() {
    		title = this.value;
    		$$invalidate(1, title);
    	}

    	$$self.$set = $$props => {
    		if ("todos" in $$props) $$invalidate(3, todos = $$props.todos);
    	};

    	$$self.$capture_state = () => {
    		return { todos, inputEl, title };
    	};

    	$$self.$inject_state = $$props => {
    		if ("todos" in $$props) $$invalidate(3, todos = $$props.todos);
    		if ("inputEl" in $$props) $$invalidate(0, inputEl = $$props.inputEl);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    	};

    	return [
    		inputEl,
    		title,
    		handleSubmit,
    		todos,
    		addItem,
    		input_binding,
    		input_input_handler
    	];
    }

    class NewItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { todos: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewItem",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get todos() {
    		throw new Error("<NewItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set todos(value) {
    		throw new Error("<NewItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* js/components/Todo.svelte generated by Svelte v3.18.1 */
    const file$1 = "js/components/Todo.svelte";

    function create_fragment$1(ctx) {
    	let li;
    	let div;
    	let input0;
    	let t0;
    	let label;
    	let t1_value = /*todo*/ ctx[0].title + "";
    	let t1;
    	let t2;
    	let button;
    	let t3;
    	let input1;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			input0 = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			t2 = space();
    			button = element("button");
    			t3 = space();
    			input1 = element("input");
    			attr_dev(input0, "class", "toggle");
    			attr_dev(input0, "aria-labelledby", /*labelKey*/ ctx[4]);
    			attr_dev(input0, "type", "checkbox");
    			attr_dev(input0, "data-testid", "toggle");
    			add_location(input0, file$1, 55, 2, 1181);
    			attr_dev(label, "id", /*labelKey*/ ctx[4]);
    			attr_dev(label, "data-testid", "title");
    			add_location(label, file$1, 63, 2, 1340);
    			attr_dev(button, "class", "destroy");
    			add_location(button, file$1, 64, 2, 1404);
    			attr_dev(div, "class", "view");
    			add_location(div, file$1, 54, 1, 1160);
    			attr_dev(input1, "class", "edit");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "data-testid", "edit");
    			add_location(input1, file$1, 66, 1, 1464);
    			attr_dev(li, "class", "todo");
    			attr_dev(li, "data-testid", "todo");
    			toggle_class(li, "completed", /*completed*/ ctx[3]);
    			toggle_class(li, "editing", /*editing*/ ctx[1]);
    			add_location(li, file$1, 48, 0, 1057);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, input0);
    			input0.checked = /*completed*/ ctx[3];
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, t1);
    			append_dev(div, t2);
    			append_dev(div, button);
    			append_dev(li, t3);
    			append_dev(li, input1);
    			/*input1_binding*/ ctx[14](input1);

    			dispose = [
    				listen_dev(input0, "change", /*input0_change_handler*/ ctx[13]),
    				listen_dev(input0, "click", /*handleToggle*/ ctx[5], false, false, false),
    				listen_dev(button, "click", /*handleRemove*/ ctx[6], false, false, false),
    				listen_dev(input1, "blur", /*handleSubmit*/ ctx[9], false, false, false),
    				listen_dev(input1, "keydown", /*handleKeyDown*/ ctx[8], false, false, false),
    				listen_dev(li, "dblclick", /*handleEditStart*/ ctx[7], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*completed*/ 8) {
    				input0.checked = /*completed*/ ctx[3];
    			}

    			if (dirty & /*todo*/ 1 && t1_value !== (t1_value = /*todo*/ ctx[0].title + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*completed*/ 8) {
    				toggle_class(li, "completed", /*completed*/ ctx[3]);
    			}

    			if (dirty & /*editing*/ 2) {
    				toggle_class(li, "editing", /*editing*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			/*input1_binding*/ ctx[14](null);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { todos = [] } = $$props;
    	let { todo = {} } = $$props;
    	let editing = false;
    	let editEl = null;
    	let labelKey = `todo-${todo.id}`;

    	const cancelEditing = function () {
    		handleEditEnd();
    	};

    	const handleToggle = el => todos.toggle(todo.id, el.target.checked);
    	const handleRemove = () => todos.remove(todo.id);

    	const handleEditStart = async function () {
    		$$invalidate(2, editEl.value = todo.title, editEl);
    		$$invalidate(1, editing = true);
    		await tick();
    		editEl.focus();
    	};

    	const handleEditEnd = function () {
    		$$invalidate(1, editing = false);
    	};

    	const handleKeyDown = el => {
    		switch (el.keyCode) {
    			case ESCAPE_KEY:
    				return cancelEditing();
    			case ENTER_KEY:
    				return handleSubmit();
    		}
    	};

    	const handleSubmit = function () {
    		if (!editing) {
    			return;
    		}

    		const title = editEl.value;

    		if (valid({ title })) {
    			todos.updateTitle(todo.id, title);
    		} else {
    			todos.remove(todo.id);
    		}

    		handleEditEnd();
    	};

    	const writable_props = ["todos", "todo"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Todo> was created with unknown prop '${key}'`);
    	});

    	function input0_change_handler() {
    		completed = this.checked;
    		($$invalidate(3, completed), $$invalidate(0, todo));
    	}

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(2, editEl = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("todos" in $$props) $$invalidate(10, todos = $$props.todos);
    		if ("todo" in $$props) $$invalidate(0, todo = $$props.todo);
    	};

    	$$self.$capture_state = () => {
    		return {
    			todos,
    			todo,
    			editing,
    			editEl,
    			labelKey,
    			completed
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("todos" in $$props) $$invalidate(10, todos = $$props.todos);
    		if ("todo" in $$props) $$invalidate(0, todo = $$props.todo);
    		if ("editing" in $$props) $$invalidate(1, editing = $$props.editing);
    		if ("editEl" in $$props) $$invalidate(2, editEl = $$props.editEl);
    		if ("labelKey" in $$props) $$invalidate(4, labelKey = $$props.labelKey);
    		if ("completed" in $$props) $$invalidate(3, completed = $$props.completed);
    	};

    	let completed;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*todo*/ 1) {
    			 $$invalidate(3, completed = todo.completed);
    		}
    	};

    	return [
    		todo,
    		editing,
    		editEl,
    		completed,
    		labelKey,
    		handleToggle,
    		handleRemove,
    		handleEditStart,
    		handleKeyDown,
    		handleSubmit,
    		todos,
    		cancelEditing,
    		handleEditEnd,
    		input0_change_handler,
    		input1_binding
    	];
    }

    class Todo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { todos: 10, todo: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Todo",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get todos() {
    		throw new Error("<Todo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set todos(value) {
    		throw new Error("<Todo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get todo() {
    		throw new Error("<Todo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set todo(value) {
    		throw new Error("<Todo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const ALL = 'all';
    const ACTIVE = 'active';
    const COMPLETED = 'completed';

    /* js/components/TodoList.svelte generated by Svelte v3.18.1 */
    const file$2 = "js/components/TodoList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (28:0) {#if $visible}
    function create_if_block(ctx) {
    	let section;
    	let input;
    	let t0;
    	let label;
    	let t2;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let dispose;
    	let each_value = /*filteredList*/ ctx[2];
    	const get_key = ctx => /*todo*/ ctx[10].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			label.textContent = "Mark all as complete";
    			t2 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(input, "id", "toggle-all");
    			attr_dev(input, "class", "toggle-all");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "data-testid", "toggle-all");
    			add_location(input, file$2, 29, 2, 705);
    			attr_dev(label, "for", "toggle-all");
    			add_location(label, file$2, 37, 2, 867);
    			attr_dev(ul, "class", "todo-list");
    			add_location(ul, file$2, 38, 2, 922);
    			attr_dev(section, "class", "main");
    			attr_dev(section, "data-testid", "main");
    			add_location(section, file$2, 28, 1, 661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, input);
    			input.checked = /*allCompleted*/ ctx[3];
    			append_dev(section, t0);
    			append_dev(section, label);
    			append_dev(section, t2);
    			append_dev(section, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;

    			dispose = [
    				listen_dev(input, "change", /*input_change_handler*/ ctx[9]),
    				listen_dev(input, "click", /*handleToggleAll*/ ctx[5], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*allCompleted*/ 8) {
    				input.checked = /*allCompleted*/ ctx[3];
    			}

    			const each_value = /*filteredList*/ ctx[2];
    			group_outros();
    			validate_each_keys(ctx, each_value, get_each_context, get_key);
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block, null, get_each_context);
    			check_outros();
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(28:0) {#if $visible}",
    		ctx
    	});

    	return block;
    }

    // (40:3) {#each filteredList as todo (todo.id)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let current;

    	const todo = new Todo({
    			props: {
    				todos: /*todos*/ ctx[0],
    				todo: /*todo*/ ctx[10]
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(todo.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(todo, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const todo_changes = {};
    			if (dirty & /*todos*/ 1) todo_changes.todos = /*todos*/ ctx[0];
    			if (dirty & /*filteredList*/ 4) todo_changes.todo = /*todo*/ ctx[10];
    			todo.$set(todo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(todo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(todo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(todo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(40:3) {#each filteredList as todo (todo.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$visible*/ ctx[4] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$visible*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $todos,
    		$$unsubscribe_todos = noop,
    		$$subscribe_todos = () => ($$unsubscribe_todos(), $$unsubscribe_todos = subscribe(todos, $$value => $$invalidate(7, $todos = $$value)), todos);

    	let $visible,
    		$$unsubscribe_visible = noop,
    		$$subscribe_visible = () => ($$unsubscribe_visible(), $$unsubscribe_visible = subscribe(visible, $$value => $$invalidate(4, $visible = $$value)), visible);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_todos());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_visible());
    	let { todos = [] } = $$props;
    	validate_store(todos, "todos");
    	$$subscribe_todos();
    	let { visible = true } = $$props;
    	validate_store(visible, "visible");
    	$$subscribe_visible();
    	let { filterBy = ALL } = $$props;
    	let toggleAllEl = null;
    	let filteredList = ALL;
    	const handleToggleAll = e => todos.toggleAll(e.target.checked);
    	
    	const writable_props = ["todos", "visible", "filterBy"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TodoList> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		allCompleted = this.checked;
    		($$invalidate(3, allCompleted), $$invalidate(7, $todos));
    	}

    	$$self.$set = $$props => {
    		if ("todos" in $$props) $$subscribe_todos($$invalidate(0, todos = $$props.todos));
    		if ("visible" in $$props) $$subscribe_visible($$invalidate(1, visible = $$props.visible));
    		if ("filterBy" in $$props) $$invalidate(6, filterBy = $$props.filterBy);
    	};

    	$$self.$capture_state = () => {
    		return {
    			todos,
    			visible,
    			filterBy,
    			toggleAllEl,
    			filteredList,
    			allCompleted,
    			$todos,
    			$visible
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("todos" in $$props) $$subscribe_todos($$invalidate(0, todos = $$props.todos));
    		if ("visible" in $$props) $$subscribe_visible($$invalidate(1, visible = $$props.visible));
    		if ("filterBy" in $$props) $$invalidate(6, filterBy = $$props.filterBy);
    		if ("toggleAllEl" in $$props) toggleAllEl = $$props.toggleAllEl;
    		if ("filteredList" in $$props) $$invalidate(2, filteredList = $$props.filteredList);
    		if ("allCompleted" in $$props) $$invalidate(3, allCompleted = $$props.allCompleted);
    		if ("$todos" in $$props) todos.set($todos = $$props.$todos);
    		if ("$visible" in $$props) visible.set($visible = $$props.$visible);
    	};

    	let allCompleted;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$todos*/ 128) {
    			 $$invalidate(3, allCompleted = $todos.every(todo => todo.completed));
    		}

    		if ($$self.$$.dirty & /*filterBy, $todos*/ 192) {
    			 switch (filterBy) {
    				case ACTIVE:
    					$$invalidate(2, filteredList = $todos.filter(todo => !todo.completed));
    					break;
    				case COMPLETED:
    					$$invalidate(2, filteredList = $todos.filter(todo => todo.completed));
    					break;
    				default:
    					$$invalidate(2, filteredList = $todos);
    			}
    		}
    	};

    	return [
    		todos,
    		visible,
    		filteredList,
    		allCompleted,
    		$visible,
    		handleToggleAll,
    		filterBy,
    		$todos,
    		toggleAllEl,
    		input_change_handler
    	];
    }

    class TodoList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { todos: 0, visible: 1, filterBy: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TodoList",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get todos() {
    		throw new Error("<TodoList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set todos(value) {
    		throw new Error("<TodoList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visible() {
    		throw new Error("<TodoList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<TodoList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterBy() {
    		throw new Error("<TodoList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterBy(value) {
    		throw new Error("<TodoList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* js/components/ListFooter.svelte generated by Svelte v3.18.1 */
    const file$3 = "js/components/ListFooter.svelte";

    // (19:0) {#if $visible}
    function create_if_block$1(ctx) {
    	let footer;
    	let span;
    	let strong;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let ul;
    	let li0;
    	let a0;
    	let t6;
    	let li1;
    	let a1;
    	let t8;
    	let li2;
    	let a2;
    	let t10;
    	let if_block = /*hasCompletedItems*/ ctx[4] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			span = element("span");
    			strong = element("strong");
    			t0 = text(/*remaining*/ ctx[3]);
    			t1 = space();
    			t2 = text(/*items*/ ctx[5]);
    			t3 = text(" left");
    			t4 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "All";
    			t6 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Active";
    			t8 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Completed";
    			t10 = space();
    			if (if_block) if_block.c();
    			add_location(strong, file$3, 21, 3, 556);
    			attr_dev(span, "class", "todo-count");
    			attr_dev(span, "data-testid", "todo-count");
    			add_location(span, file$3, 20, 2, 502);
    			attr_dev(a0, "href", "#/all");
    			toggle_class(a0, "selected", /*filterBy*/ ctx[2] === ALL);
    			add_location(a0, file$3, 24, 7, 638);
    			add_location(li0, file$3, 24, 3, 634);
    			attr_dev(a1, "href", "#/active");
    			toggle_class(a1, "selected", /*filterBy*/ ctx[2] === ACTIVE);
    			add_location(a1, file$3, 25, 7, 706);
    			add_location(li1, file$3, 25, 3, 702);
    			attr_dev(a2, "href", "#/completed");
    			toggle_class(a2, "selected", /*filterBy*/ ctx[2] === COMPLETED);
    			add_location(a2, file$3, 26, 7, 783);
    			add_location(li2, file$3, 26, 3, 779);
    			attr_dev(ul, "class", "filters");
    			add_location(ul, file$3, 23, 2, 610);
    			attr_dev(footer, "class", "footer");
    			attr_dev(footer, "data-testid", "footer");
    			add_location(footer, file$3, 19, 1, 455);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, span);
    			append_dev(span, strong);
    			append_dev(strong, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(footer, t4);
    			append_dev(footer, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t6);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t8);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(footer, t10);
    			if (if_block) if_block.m(footer, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*remaining*/ 8) set_data_dev(t0, /*remaining*/ ctx[3]);
    			if (dirty & /*items*/ 32) set_data_dev(t2, /*items*/ ctx[5]);

    			if (dirty & /*filterBy, ALL*/ 4) {
    				toggle_class(a0, "selected", /*filterBy*/ ctx[2] === ALL);
    			}

    			if (dirty & /*filterBy, ACTIVE*/ 4) {
    				toggle_class(a1, "selected", /*filterBy*/ ctx[2] === ACTIVE);
    			}

    			if (dirty & /*filterBy, COMPLETED*/ 4) {
    				toggle_class(a2, "selected", /*filterBy*/ ctx[2] === COMPLETED);
    			}

    			if (/*hasCompletedItems*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(footer, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(19:0) {#if $visible}",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#if hasCompletedItems}
    function create_if_block_1(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Clear completed";
    			attr_dev(button, "class", "clear-completed");
    			add_location(button, file$3, 29, 3, 899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			dispose = listen_dev(button, "click", /*handleClearCompleted*/ ctx[7], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(29:2) {#if hasCompletedItems}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*$visible*/ ctx[6] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$visible*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $todos,
    		$$unsubscribe_todos = noop,
    		$$subscribe_todos = () => ($$unsubscribe_todos(), $$unsubscribe_todos = subscribe(todos, $$value => $$invalidate(8, $todos = $$value)), todos);

    	let $visible,
    		$$unsubscribe_visible = noop,
    		$$subscribe_visible = () => ($$unsubscribe_visible(), $$unsubscribe_visible = subscribe(visible, $$value => $$invalidate(6, $visible = $$value)), visible);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_todos());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_visible());
    	let { todos = [] } = $$props;
    	validate_store(todos, "todos");
    	$$subscribe_todos();
    	let { visible = true } = $$props;
    	validate_store(visible, "visible");
    	$$subscribe_visible();
    	let { filterBy = ALL } = $$props;
    	const handleClearCompleted = () => todos.clearAllCompleteds();
    	const writable_props = ["todos", "visible", "filterBy"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ListFooter> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("todos" in $$props) $$subscribe_todos($$invalidate(0, todos = $$props.todos));
    		if ("visible" in $$props) $$subscribe_visible($$invalidate(1, visible = $$props.visible));
    		if ("filterBy" in $$props) $$invalidate(2, filterBy = $$props.filterBy);
    	};

    	$$self.$capture_state = () => {
    		return {
    			todos,
    			visible,
    			filterBy,
    			remaining,
    			$todos,
    			hasCompletedItems,
    			items,
    			$visible
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("todos" in $$props) $$subscribe_todos($$invalidate(0, todos = $$props.todos));
    		if ("visible" in $$props) $$subscribe_visible($$invalidate(1, visible = $$props.visible));
    		if ("filterBy" in $$props) $$invalidate(2, filterBy = $$props.filterBy);
    		if ("remaining" in $$props) $$invalidate(3, remaining = $$props.remaining);
    		if ("$todos" in $$props) todos.set($todos = $$props.$todos);
    		if ("hasCompletedItems" in $$props) $$invalidate(4, hasCompletedItems = $$props.hasCompletedItems);
    		if ("items" in $$props) $$invalidate(5, items = $$props.items);
    		if ("$visible" in $$props) visible.set($visible = $$props.$visible);
    	};

    	let remaining;
    	let hasCompletedItems;
    	let items;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$todos*/ 256) {
    			 $$invalidate(3, remaining = $todos.reduce((total, todo) => todo.completed ? total : total + 1, 0));
    		}

    		if ($$self.$$.dirty & /*$todos*/ 256) {
    			 $$invalidate(4, hasCompletedItems = $todos.some(todo => todo.completed));
    		}

    		if ($$self.$$.dirty & /*remaining*/ 8) {
    			 $$invalidate(5, items = remaining === 1 ? "item" : "items");
    		}
    	};

    	return [
    		todos,
    		visible,
    		filterBy,
    		remaining,
    		hasCompletedItems,
    		items,
    		$visible,
    		handleClearCompleted
    	];
    }

    class ListFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { todos: 0, visible: 1, filterBy: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListFooter",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get todos() {
    		throw new Error("<ListFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set todos(value) {
    		throw new Error("<ListFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visible() {
    		throw new Error("<ListFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<ListFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterBy() {
    		throw new Error("<ListFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterBy(value) {
    		throw new Error("<ListFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* js/components/PageFooter.svelte generated by Svelte v3.18.1 */

    const file$4 = "js/components/PageFooter.svelte";

    function create_fragment$4(ctx) {
    	let footer;
    	let p0;
    	let t1;
    	let p1;
    	let t2;
    	let a0;
    	let t4;
    	let p2;
    	let t5;
    	let a1;
    	let t7;
    	let t8;
    	let p3;
    	let t9;
    	let a2;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			p0 = element("p");
    			p0.textContent = "Double-click to edit a todo";
    			t1 = space();
    			p1 = element("p");
    			t2 = text("Written by ");
    			a0 = element("a");
    			a0.textContent = "Greg Malcolm";
    			t4 = space();
    			p2 = element("p");
    			t5 = text("The Svelte maintainers also have a nice concise implementation. It can be found ");
    			a1 = element("a");
    			a1.textContent = "here";
    			t7 = text(".");
    			t8 = space();
    			p3 = element("p");
    			t9 = text("Part of ");
    			a2 = element("a");
    			a2.textContent = "TodoMVC";
    			add_location(p0, file$4, 1, 1, 23);
    			attr_dev(a0, "href", "https://github.com/gregmalcolm");
    			add_location(a0, file$4, 2, 15, 73);
    			add_location(p1, file$4, 2, 1, 59);
    			attr_dev(a1, "href", "https://github.com/sveltejs/svelte-todomvc");
    			add_location(a1, file$4, 3, 84, 219);
    			add_location(p2, file$4, 3, 1, 136);
    			attr_dev(a2, "href", "http://todomvc.com");
    			add_location(a2, file$4, 4, 12, 298);
    			add_location(p3, file$4, 4, 1, 287);
    			attr_dev(footer, "class", "info");
    			add_location(footer, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, p0);
    			append_dev(footer, t1);
    			append_dev(footer, p1);
    			append_dev(p1, t2);
    			append_dev(p1, a0);
    			append_dev(footer, t4);
    			append_dev(footer, p2);
    			append_dev(p2, t5);
    			append_dev(p2, a1);
    			append_dev(p2, t7);
    			append_dev(footer, t8);
    			append_dev(footer, p3);
    			append_dev(p3, t9);
    			append_dev(p3, a2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class PageFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PageFooter",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var director = createCommonjsModule(function (module, exports) {
    //
    // Generated on Tue Dec 16 2014 12:13:47 GMT+0100 (CET) by Charlie Robbins, Paolo Fragomeni & the Contributors (Using Codesurgeon).
    // Version 1.2.6
    //

    (function (exports) {

    /*
     * browser.js: Browser specific functionality for director.
     *
     * (C) 2011, Charlie Robbins, Paolo Fragomeni, & the Contributors.
     * MIT LICENSE
     *
     */

    var dloc = document.location;

    function dlocHashEmpty() {
      // Non-IE browsers return '' when the address bar shows '#'; Director's logic
      // assumes both mean empty.
      return dloc.hash === '' || dloc.hash === '#';
    }

    var listener = {
      mode: 'modern',
      hash: dloc.hash,
      history: false,

      check: function () {
        var h = dloc.hash;
        if (h != this.hash) {
          this.hash = h;
          this.onHashChanged();
        }
      },

      fire: function () {
        if (this.mode === 'modern') {
          this.history === true ? window.onpopstate() : window.onhashchange();
        }
        else {
          this.onHashChanged();
        }
      },

      init: function (fn, history) {
        var self = this;
        this.history = history;

        if (!Router.listeners) {
          Router.listeners = [];
        }

        function onchange(onChangeEvent) {
          for (var i = 0, l = Router.listeners.length; i < l; i++) {
            Router.listeners[i](onChangeEvent);
          }
        }

        //note IE8 is being counted as 'modern' because it has the hashchange event
        if ('onhashchange' in window && (document.documentMode === undefined
          || document.documentMode > 7)) {
          // At least for now HTML5 history is available for 'modern' browsers only
          if (this.history === true) {
            // There is an old bug in Chrome that causes onpopstate to fire even
            // upon initial page load. Since the handler is run manually in init(),
            // this would cause Chrome to run it twise. Currently the only
            // workaround seems to be to set the handler after the initial page load
            // http://code.google.com/p/chromium/issues/detail?id=63040
            setTimeout(function() {
              window.onpopstate = onchange;
            }, 500);
          }
          else {
            window.onhashchange = onchange;
          }
          this.mode = 'modern';
        }
        else {
          //
          // IE support, based on a concept by Erik Arvidson ...
          //
          var frame = document.createElement('iframe');
          frame.id = 'state-frame';
          frame.style.display = 'none';
          document.body.appendChild(frame);
          this.writeFrame('');

          if ('onpropertychange' in document && 'attachEvent' in document) {
            document.attachEvent('onpropertychange', function () {
              if (event.propertyName === 'location') {
                self.check();
              }
            });
          }

          window.setInterval(function () { self.check(); }, 50);

          this.onHashChanged = onchange;
          this.mode = 'legacy';
        }

        Router.listeners.push(fn);

        return this.mode;
      },

      destroy: function (fn) {
        if (!Router || !Router.listeners) {
          return;
        }

        var listeners = Router.listeners;

        for (var i = listeners.length - 1; i >= 0; i--) {
          if (listeners[i] === fn) {
            listeners.splice(i, 1);
          }
        }
      },

      setHash: function (s) {
        // Mozilla always adds an entry to the history
        if (this.mode === 'legacy') {
          this.writeFrame(s);
        }

        if (this.history === true) {
          window.history.pushState({}, document.title, s);
          // Fire an onpopstate event manually since pushing does not obviously
          // trigger the pop event.
          this.fire();
        } else {
          dloc.hash = (s[0] === '/') ? s : '/' + s;
        }
        return this;
      },

      writeFrame: function (s) {
        // IE support...
        var f = document.getElementById('state-frame');
        var d = f.contentDocument || f.contentWindow.document;
        d.open();
        d.write("<script>_hash = '" + s + "'; onload = parent.listener.syncHash;<script>");
        d.close();
      },

      syncHash: function () {
        // IE support...
        var s = this._hash;
        if (s != dloc.hash) {
          dloc.hash = s;
        }
        return this;
      },

      onHashChanged: function () {}
    };

    var Router = exports.Router = function (routes) {
      if (!(this instanceof Router)) return new Router(routes);

      this.params   = {};
      this.routes   = {};
      this.methods  = ['on', 'once', 'after', 'before'];
      this.scope    = [];
      this._methods = {};

      this._insert = this.insert;
      this.insert = this.insertEx;

      this.historySupport = (window.history != null ? window.history.pushState : null) != null;

      this.configure();
      this.mount(routes || {});
    };

    Router.prototype.init = function (r) {
      var self = this
        , routeTo;
      this.handler = function(onChangeEvent) {
        var newURL = onChangeEvent && onChangeEvent.newURL || window.location.hash;
        var url = self.history === true ? self.getPath() : newURL.replace(/.*#/, '');
        self.dispatch('on', url.charAt(0) === '/' ? url : '/' + url);
      };

      listener.init(this.handler, this.history);

      if (this.history === false) {
        if (dlocHashEmpty() && r) {
          dloc.hash = r;
        } else if (!dlocHashEmpty()) {
          self.dispatch('on', '/' + dloc.hash.replace(/^(#\/|#|\/)/, ''));
        }
      }
      else {
        if (this.convert_hash_in_init) {
          // Use hash as route
          routeTo = dlocHashEmpty() && r ? r : !dlocHashEmpty() ? dloc.hash.replace(/^#/, '') : null;
          if (routeTo) {
            window.history.replaceState({}, document.title, routeTo);
          }
        }
        else {
          // Use canonical url
          routeTo = this.getPath();
        }

        // Router has been initialized, but due to the chrome bug it will not
        // yet actually route HTML5 history state changes. Thus, decide if should route.
        if (routeTo || this.run_in_init === true) {
          this.handler();
        }
      }

      return this;
    };

    Router.prototype.explode = function () {
      var v = this.history === true ? this.getPath() : dloc.hash;
      if (v.charAt(1) === '/') { v=v.slice(1); }
      return v.slice(1, v.length).split("/");
    };

    Router.prototype.setRoute = function (i, v, val) {
      var url = this.explode();

      if (typeof i === 'number' && typeof v === 'string') {
        url[i] = v;
      }
      else if (typeof val === 'string') {
        url.splice(i, v, s);
      }
      else {
        url = [i];
      }

      listener.setHash(url.join('/'));
      return url;
    };

    //
    // ### function insertEx(method, path, route, parent)
    // #### @method {string} Method to insert the specific `route`.
    // #### @path {Array} Parsed path to insert the `route` at.
    // #### @route {Array|function} Route handlers to insert.
    // #### @parent {Object} **Optional** Parent "routes" to insert into.
    // insert a callback that will only occur once per the matched route.
    //
    Router.prototype.insertEx = function(method, path, route, parent) {
      if (method === "once") {
        method = "on";
        route = function(route) {
          var once = false;
          return function() {
            if (once) return;
            once = true;
            return route.apply(this, arguments);
          };
        }(route);
      }
      return this._insert(method, path, route, parent);
    };

    Router.prototype.getRoute = function (v) {
      var ret = v;

      if (typeof v === "number") {
        ret = this.explode()[v];
      }
      else if (typeof v === "string"){
        var h = this.explode();
        ret = h.indexOf(v);
      }
      else {
        ret = this.explode();
      }

      return ret;
    };

    Router.prototype.destroy = function () {
      listener.destroy(this.handler);
      return this;
    };

    Router.prototype.getPath = function () {
      var path = window.location.pathname;
      if (path.substr(0, 1) !== '/') {
        path = '/' + path;
      }
      return path;
    };
    function _every(arr, iterator) {
      for (var i = 0; i < arr.length; i += 1) {
        if (iterator(arr[i], i, arr) === false) {
          return;
        }
      }
    }

    function _flatten(arr) {
      var flat = [];
      for (var i = 0, n = arr.length; i < n; i++) {
        flat = flat.concat(arr[i]);
      }
      return flat;
    }

    function _asyncEverySeries(arr, iterator, callback) {
      if (!arr.length) {
        return callback();
      }
      var completed = 0;
      (function iterate() {
        iterator(arr[completed], function(err) {
          if (err || err === false) {
            callback(err);
            callback = function() {};
          } else {
            completed += 1;
            if (completed === arr.length) {
              callback();
            } else {
              iterate();
            }
          }
        });
      })();
    }

    function paramifyString(str, params, mod) {
      mod = str;
      for (var param in params) {
        if (params.hasOwnProperty(param)) {
          mod = params[param](str);
          if (mod !== str) {
            break;
          }
        }
      }
      return mod === str ? "([._a-zA-Z0-9-%()]+)" : mod;
    }

    function regifyString(str, params) {
      var matches, last = 0, out = "";
      while (matches = str.substr(last).match(/[^\w\d\- %@&]*\*[^\w\d\- %@&]*/)) {
        last = matches.index + matches[0].length;
        matches[0] = matches[0].replace(/^\*/, "([_.()!\\ %@&a-zA-Z0-9-]+)");
        out += str.substr(0, matches.index) + matches[0];
      }
      str = out += str.substr(last);
      var captures = str.match(/:([^\/]+)/ig), capture, length;
      if (captures) {
        length = captures.length;
        for (var i = 0; i < length; i++) {
          capture = captures[i];
          if (capture.slice(0, 2) === "::") {
            str = capture.slice(1);
          } else {
            str = str.replace(capture, paramifyString(capture, params));
          }
        }
      }
      return str;
    }

    function terminator(routes, delimiter, start, stop) {
      var last = 0, left = 0, right = 0, start = (start || "(").toString(), stop = (stop || ")").toString(), i;
      for (i = 0; i < routes.length; i++) {
        var chunk = routes[i];
        if (chunk.indexOf(start, last) > chunk.indexOf(stop, last) || ~chunk.indexOf(start, last) && !~chunk.indexOf(stop, last) || !~chunk.indexOf(start, last) && ~chunk.indexOf(stop, last)) {
          left = chunk.indexOf(start, last);
          right = chunk.indexOf(stop, last);
          if (~left && !~right || !~left && ~right) {
            var tmp = routes.slice(0, (i || 1) + 1).join(delimiter);
            routes = [ tmp ].concat(routes.slice((i || 1) + 1));
          }
          last = (right > left ? right : left) + 1;
          i = 0;
        } else {
          last = 0;
        }
      }
      return routes;
    }

    var QUERY_SEPARATOR = /\?.*/;

    Router.prototype.configure = function(options) {
      options = options || {};
      for (var i = 0; i < this.methods.length; i++) {
        this._methods[this.methods[i]] = true;
      }
      this.recurse = options.recurse || this.recurse || false;
      this.async = options.async || false;
      this.delimiter = options.delimiter || "/";
      this.strict = typeof options.strict === "undefined" ? true : options.strict;
      this.notfound = options.notfound;
      this.resource = options.resource;
      this.history = options.html5history && this.historySupport || false;
      this.run_in_init = this.history === true && options.run_handler_in_init !== false;
      this.convert_hash_in_init = this.history === true && options.convert_hash_in_init !== false;
      this.every = {
        after: options.after || null,
        before: options.before || null,
        on: options.on || null
      };
      return this;
    };

    Router.prototype.param = function(token, matcher) {
      if (token[0] !== ":") {
        token = ":" + token;
      }
      var compiled = new RegExp(token, "g");
      this.params[token] = function(str) {
        return str.replace(compiled, matcher.source || matcher);
      };
      return this;
    };

    Router.prototype.on = Router.prototype.route = function(method, path, route) {
      var self = this;
      if (!route && typeof path == "function") {
        route = path;
        path = method;
        method = "on";
      }
      if (Array.isArray(path)) {
        return path.forEach(function(p) {
          self.on(method, p, route);
        });
      }
      if (path.source) {
        path = path.source.replace(/\\\//ig, "/");
      }
      if (Array.isArray(method)) {
        return method.forEach(function(m) {
          self.on(m.toLowerCase(), path, route);
        });
      }
      path = path.split(new RegExp(this.delimiter));
      path = terminator(path, this.delimiter);
      this.insert(method, this.scope.concat(path), route);
    };

    Router.prototype.path = function(path, routesFn) {
      var length = this.scope.length;
      if (path.source) {
        path = path.source.replace(/\\\//ig, "/");
      }
      path = path.split(new RegExp(this.delimiter));
      path = terminator(path, this.delimiter);
      this.scope = this.scope.concat(path);
      routesFn.call(this, this);
      this.scope.splice(length, path.length);
    };

    Router.prototype.dispatch = function(method, path, callback) {
      var self = this, fns = this.traverse(method, path.replace(QUERY_SEPARATOR, ""), this.routes, ""), invoked = this._invoked, after;
      this._invoked = true;
      if (!fns || fns.length === 0) {
        this.last = [];
        if (typeof this.notfound === "function") {
          this.invoke([ this.notfound ], {
            method: method,
            path: path
          }, callback);
        }
        return false;
      }
      if (this.recurse === "forward") {
        fns = fns.reverse();
      }
      function updateAndInvoke() {
        self.last = fns.after;
        self.invoke(self.runlist(fns), self, callback);
      }
      after = this.every && this.every.after ? [ this.every.after ].concat(this.last) : [ this.last ];
      if (after && after.length > 0 && invoked) {
        if (this.async) {
          this.invoke(after, this, updateAndInvoke);
        } else {
          this.invoke(after, this);
          updateAndInvoke();
        }
        return true;
      }
      updateAndInvoke();
      return true;
    };

    Router.prototype.invoke = function(fns, thisArg, callback) {
      var self = this;
      var apply;
      if (this.async) {
        apply = function(fn, next) {
          if (Array.isArray(fn)) {
            return _asyncEverySeries(fn, apply, next);
          } else if (typeof fn == "function") {
            fn.apply(thisArg, (fns.captures || []).concat(next));
          }
        };
        _asyncEverySeries(fns, apply, function() {
          if (callback) {
            callback.apply(thisArg, arguments);
          }
        });
      } else {
        apply = function(fn) {
          if (Array.isArray(fn)) {
            return _every(fn, apply);
          } else if (typeof fn === "function") {
            return fn.apply(thisArg, fns.captures || []);
          } else if (typeof fn === "string" && self.resource) {
            self.resource[fn].apply(thisArg, fns.captures || []);
          }
        };
        _every(fns, apply);
      }
    };

    Router.prototype.traverse = function(method, path, routes, regexp, filter) {
      var fns = [], current, exact, match, next;
      function filterRoutes(routes) {
        if (!filter) {
          return routes;
        }
        function deepCopy(source) {
          var result = [];
          for (var i = 0; i < source.length; i++) {
            result[i] = Array.isArray(source[i]) ? deepCopy(source[i]) : source[i];
          }
          return result;
        }
        function applyFilter(fns) {
          for (var i = fns.length - 1; i >= 0; i--) {
            if (Array.isArray(fns[i])) {
              applyFilter(fns[i]);
              if (fns[i].length === 0) {
                fns.splice(i, 1);
              }
            } else {
              if (!filter(fns[i])) {
                fns.splice(i, 1);
              }
            }
          }
        }
        var newRoutes = deepCopy(routes);
        newRoutes.matched = routes.matched;
        newRoutes.captures = routes.captures;
        newRoutes.after = routes.after.filter(filter);
        applyFilter(newRoutes);
        return newRoutes;
      }
      if (path === this.delimiter && routes[method]) {
        next = [ [ routes.before, routes[method] ].filter(Boolean) ];
        next.after = [ routes.after ].filter(Boolean);
        next.matched = true;
        next.captures = [];
        return filterRoutes(next);
      }
      for (var r in routes) {
        if (routes.hasOwnProperty(r) && (!this._methods[r] || this._methods[r] && typeof routes[r] === "object" && !Array.isArray(routes[r]))) {
          current = exact = regexp + this.delimiter + r;
          if (!this.strict) {
            exact += "[" + this.delimiter + "]?";
          }
          match = path.match(new RegExp("^" + exact));
          if (!match) {
            continue;
          }
          if (match[0] && match[0] == path && routes[r][method]) {
            next = [ [ routes[r].before, routes[r][method] ].filter(Boolean) ];
            next.after = [ routes[r].after ].filter(Boolean);
            next.matched = true;
            next.captures = match.slice(1);
            if (this.recurse && routes === this.routes) {
              next.push([ routes.before, routes.on ].filter(Boolean));
              next.after = next.after.concat([ routes.after ].filter(Boolean));
            }
            return filterRoutes(next);
          }
          next = this.traverse(method, path, routes[r], current);
          if (next.matched) {
            if (next.length > 0) {
              fns = fns.concat(next);
            }
            if (this.recurse) {
              fns.push([ routes[r].before, routes[r].on ].filter(Boolean));
              next.after = next.after.concat([ routes[r].after ].filter(Boolean));
              if (routes === this.routes) {
                fns.push([ routes["before"], routes["on"] ].filter(Boolean));
                next.after = next.after.concat([ routes["after"] ].filter(Boolean));
              }
            }
            fns.matched = true;
            fns.captures = next.captures;
            fns.after = next.after;
            return filterRoutes(fns);
          }
        }
      }
      return false;
    };

    Router.prototype.insert = function(method, path, route, parent) {
      var methodType, parentType, isArray, nested, part;
      path = path.filter(function(p) {
        return p && p.length > 0;
      });
      parent = parent || this.routes;
      part = path.shift();
      if (/\:|\*/.test(part) && !/\\d|\\w/.test(part)) {
        part = regifyString(part, this.params);
      }
      if (path.length > 0) {
        parent[part] = parent[part] || {};
        return this.insert(method, path, route, parent[part]);
      }
      if (!part && !path.length && parent === this.routes) {
        methodType = typeof parent[method];
        switch (methodType) {
         case "function":
          parent[method] = [ parent[method], route ];
          return;
         case "object":
          parent[method].push(route);
          return;
         case "undefined":
          parent[method] = route;
          return;
        }
        return;
      }
      parentType = typeof parent[part];
      isArray = Array.isArray(parent[part]);
      if (parent[part] && !isArray && parentType == "object") {
        methodType = typeof parent[part][method];
        switch (methodType) {
         case "function":
          parent[part][method] = [ parent[part][method], route ];
          return;
         case "object":
          parent[part][method].push(route);
          return;
         case "undefined":
          parent[part][method] = route;
          return;
        }
      } else if (parentType == "undefined") {
        nested = {};
        nested[method] = route;
        parent[part] = nested;
        return;
      }
      throw new Error("Invalid route context: " + parentType);
    };



    Router.prototype.extend = function(methods) {
      var self = this, len = methods.length, i;
      function extend(method) {
        self._methods[method] = true;
        self[method] = function() {
          var extra = arguments.length === 1 ? [ method, "" ] : [ method ];
          self.on.apply(self, extra.concat(Array.prototype.slice.call(arguments)));
        };
      }
      for (i = 0; i < len; i++) {
        extend(methods[i]);
      }
    };

    Router.prototype.runlist = function(fns) {
      var runlist = this.every && this.every.before ? [ this.every.before ].concat(_flatten(fns)) : _flatten(fns);
      if (this.every && this.every.on) {
        runlist.push(this.every.on);
      }
      runlist.captures = fns.captures;
      runlist.source = fns.source;
      return runlist;
    };

    Router.prototype.mount = function(routes, path) {
      if (!routes || typeof routes !== "object" || Array.isArray(routes)) {
        return;
      }
      var self = this;
      path = path || [];
      if (!Array.isArray(path)) {
        path = path.split(self.delimiter);
      }
      function insertOrMount(route, local) {
        var rename = route, parts = route.split(self.delimiter), routeType = typeof routes[route], isRoute = parts[0] === "" || !self._methods[parts[0]], event = isRoute ? "on" : rename;
        if (isRoute) {
          rename = rename.slice((rename.match(new RegExp("^" + self.delimiter)) || [ "" ])[0].length);
          parts.shift();
        }
        if (isRoute && routeType === "object" && !Array.isArray(routes[route])) {
          local = local.concat(parts);
          self.mount(routes[route], local);
          return;
        }
        if (isRoute) {
          local = local.concat(rename.split(self.delimiter));
          local = terminator(local, self.delimiter);
        }
        self.insert(event, local, routes[route]);
      }
      for (var route in routes) {
        if (routes.hasOwnProperty(route)) {
          insertOrMount(route, path.slice(0));
        }
      }
    };



    }( exports ));
    });

    /* js/components/Router.svelte generated by Svelte v3.18.1 */
    const get_default_slot_changes = dirty => ({ filterBy: dirty & /*filterBy*/ 1 });
    const get_default_slot_context = ctx => ({ filterBy: /*filterBy*/ ctx[0] });

    function create_fragment$5(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope, filterBy*/ 5) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[2], get_default_slot_context), get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, get_default_slot_changes));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let filterBy = ALL;

    	const router = new director.Router({
    			"/active": () => $$invalidate(0, filterBy = ACTIVE),
    			"/completed": () => $$invalidate(0, filterBy = COMPLETED),
    			"/.*": () => $$invalidate(0, filterBy = ALL)
    		});

    	router.init();
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("filterBy" in $$props) $$invalidate(0, filterBy = $$props.filterBy);
    	};

    	return [filterBy, router, $$scope, $$slots];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* js/components/App.svelte generated by Svelte v3.18.1 */
    const file$5 = "js/components/App.svelte";

    // (11:0) <Router let:filterBy={filterBy}>
    function create_default_slot(ctx) {
    	let section;
    	let t0;
    	let t1;
    	let t2;
    	let current;
    	const newitem = new NewItem({ props: { todos }, $$inline: true });

    	const todolist = new TodoList({
    			props: {
    				todos,
    				visible,
    				filterBy: /*filterBy*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const listfooter = new ListFooter({
    			props: {
    				todos,
    				visible,
    				filterBy: /*filterBy*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const pagefooter = new PageFooter({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(newitem.$$.fragment);
    			t0 = space();
    			create_component(todolist.$$.fragment);
    			t1 = space();
    			create_component(listfooter.$$.fragment);
    			t2 = space();
    			create_component(pagefooter.$$.fragment);
    			attr_dev(section, "class", "todoapp");
    			add_location(section, file$5, 11, 1, 324);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(newitem, section, null);
    			append_dev(section, t0);
    			mount_component(todolist, section, null);
    			append_dev(section, t1);
    			mount_component(listfooter, section, null);
    			insert_dev(target, t2, anchor);
    			mount_component(pagefooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const todolist_changes = {};
    			if (dirty & /*filterBy*/ 1) todolist_changes.filterBy = /*filterBy*/ ctx[0];
    			todolist.$set(todolist_changes);
    			const listfooter_changes = {};
    			if (dirty & /*filterBy*/ 1) listfooter_changes.filterBy = /*filterBy*/ ctx[0];
    			listfooter.$set(listfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(newitem.$$.fragment, local);
    			transition_in(todolist.$$.fragment, local);
    			transition_in(listfooter.$$.fragment, local);
    			transition_in(pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(newitem.$$.fragment, local);
    			transition_out(todolist.$$.fragment, local);
    			transition_out(listfooter.$$.fragment, local);
    			transition_out(pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(newitem);
    			destroy_component(todolist);
    			destroy_component(listfooter);
    			if (detaching) detach_dev(t2);
    			destroy_component(pagefooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(11:0) <Router let:filterBy={filterBy}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let current;

    	const router = new Router({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ filterBy }) => ({ 0: filterBy }),
    						({ filterBy }) => filterBy ? 1 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, filterBy*/ 3) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
