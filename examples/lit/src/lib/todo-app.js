"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoApp = void 0;
const lit_1 = require("lit");
const class_map_js_1 = require("lit/directives/class-map.js");
const custom_element_js_1 = require("lit/decorators/custom-element.js");
const state_js_1 = require("lit/decorators/state.js");
const todo_css_js_1 = require("./todo.css.js");
const todos_js_1 = require("./todos.js");
require("./todo-list.js");
require("./todo-form.js");
require("./todo-footer.js");
const events_js_1 = require("./events.js");
const utils_js_1 = require("./utils.js");
let TodoApp = (() => {
    var _TodoApp_onAddTodo, _TodoApp_onDeleteTodo, _TodoApp_onEditTodo, _TodoApp_onToggleAll, _TodoApp_onClearCompleted;
    let _classDecorators = [(0, custom_element_js_1.customElement)("todo-app")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = lit_1.LitElement;
    let _instanceExtraInitializers = [];
    let _todoList_decorators;
    let _todoList_initializers = [];
    var TodoApp = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.todoList = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _todoList_initializers, new todos_js_1.Todos()));
            _TodoApp_onAddTodo.set(this, (e) => {
                this.todoList.add(e.text);
            });
            _TodoApp_onDeleteTodo.set(this, (e) => {
                this.todoList.delete(e.id);
            });
            _TodoApp_onEditTodo.set(this, (e) => {
                this.todoList.update(e.edit);
            });
            _TodoApp_onToggleAll.set(this, (_e) => {
                this.todoList.toggleAll();
            });
            _TodoApp_onClearCompleted.set(this, (_e) => {
                this.todoList.clearCompleted();
            });
            // event handlers for the app
            this.addEventListener(events_js_1.AddTodoEvent.eventName, __classPrivateFieldGet(this, _TodoApp_onAddTodo, "f"));
            this.addEventListener(events_js_1.DeleteTodoEvent.eventName, __classPrivateFieldGet(this, _TodoApp_onDeleteTodo, "f"));
            this.addEventListener(events_js_1.EditTodoEvent.eventName, __classPrivateFieldGet(this, _TodoApp_onEditTodo, "f"));
            this.addEventListener(events_js_1.ToggleAllTodoEvent.eventName, __classPrivateFieldGet(this, _TodoApp_onToggleAll, "f"));
            this.addEventListener(events_js_1.ClearCompletedEvent.eventName, __classPrivateFieldGet(this, _TodoApp_onClearCompleted, "f"));
        }
        connectedCallback() {
            super.connectedCallback();
            this.todoList.connect();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.todoList.disconnect();
        }
        render() {
            return (0, lit_1.html) `<section>
            <header class="header">
                <h1>todos</h1>
                <todo-form .todoList=${this.todoList}></todo-form>
            </header>
            <main class="main">
                <todo-list class="show-priority" .todoList=${this.todoList}></todo-list>
            </main>
            <todo-footer
                class="${(0, class_map_js_1.classMap)({
                hidden: this.todoList.all.length === 0,
            })}"
                .todoList=${this.todoList}
            ></todo-footer>
        </section>`;
        }
    };
    _TodoApp_onAddTodo = new WeakMap();
    _TodoApp_onDeleteTodo = new WeakMap();
    _TodoApp_onEditTodo = new WeakMap();
    _TodoApp_onToggleAll = new WeakMap();
    _TodoApp_onClearCompleted = new WeakMap();
    __setFunctionName(_classThis, "TodoApp");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _todoList_decorators = [(0, utils_js_1.updateOnEvent)("change"), (0, state_js_1.state)()];
        __esDecorate(null, null, _todoList_decorators, { kind: "field", name: "todoList", static: false, private: false, access: { has: obj => "todoList" in obj, get: obj => obj.todoList, set: (obj, value) => { obj.todoList = value; } }, metadata: _metadata }, _todoList_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TodoApp = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.styles = [
        todo_css_js_1.todoStyles,
        (0, lit_1.css) `
            :host {
                display: block;
                background: #fff;
                margin: 130px 0 40px 0;
                position: relative;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
            }
            h1 {
                position: absolute;
                top: -140px;
                width: 100%;
                font-size: 80px;
                font-weight: 200;
                text-align: center;
                color: #b83f45;
                -webkit-text-rendering: optimizeLegibility;
                -moz-text-rendering: optimizeLegibility;
                text-rendering: optimizeLegibility;
            }
            main {
                position: relative;
                z-index: 2;
                border-top: 1px solid #e6e6e6;
            }
            .hidden {
                display: none;
            }
            :focus {
                box-shadow: none !important;
            }
        `,
    ];
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TodoApp = _classThis;
})();
exports.TodoApp = TodoApp;
