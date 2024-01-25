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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoItemComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let TodoItemComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-todo-item',
            standalone: true,
            imports: [forms_1.FormsModule],
            templateUrl: './todo-item.component.html',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _todo_decorators;
    let _todo_initializers = [];
    let _remove_decorators;
    let _remove_initializers = [];
    let _inputRef_decorators;
    let _inputRef_initializers = [];
    var TodoItemComponent = _classThis = class {
        constructor() {
            this.todo = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _todo_initializers, void 0));
            this.remove = __runInitializers(this, _remove_initializers, new core_1.EventEmitter());
            this.inputRef = __runInitializers(this, _inputRef_initializers, void 0);
            this.title = '';
            this.isEditing = false;
        }
        toggleTodo() {
            this.todo.completed = !this.todo.completed;
        }
        removeTodo() {
            this.remove.emit(this.todo);
        }
        startEdit() {
            this.isEditing = true;
        }
        handleBlur(e) {
            this.isEditing = false;
        }
        handleFocus(e) {
            this.title = this.todo.title;
        }
        updateTodo() {
            if (!this.title) {
                this.remove.emit(this.todo);
            }
            else {
                this.todo.title = this.title;
            }
            this.isEditing = false;
        }
        ngAfterViewChecked() {
            var _a;
            if (this.isEditing) {
                (_a = this.inputRef) === null || _a === void 0 ? void 0 : _a.nativeElement.focus();
            }
        }
    };
    __setFunctionName(_classThis, "TodoItemComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _todo_decorators = [(0, core_1.Input)({ required: true })];
        _remove_decorators = [(0, core_1.Output)()];
        _inputRef_decorators = [(0, core_1.ViewChild)('todoInputRef')];
        __esDecorate(null, null, _todo_decorators, { kind: "field", name: "todo", static: false, private: false, access: { has: obj => "todo" in obj, get: obj => obj.todo, set: (obj, value) => { obj.todo = value; } }, metadata: _metadata }, _todo_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _remove_decorators, { kind: "field", name: "remove", static: false, private: false, access: { has: obj => "remove" in obj, get: obj => obj.remove, set: (obj, value) => { obj.remove = value; } }, metadata: _metadata }, _remove_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _inputRef_decorators, { kind: "field", name: "inputRef", static: false, private: false, access: { has: obj => "inputRef" in obj, get: obj => obj.inputRef, set: (obj, value) => { obj.inputRef = value; } }, metadata: _metadata }, _inputRef_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TodoItemComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TodoItemComponent = _classThis;
})();
exports.TodoItemComponent = TodoItemComponent;
