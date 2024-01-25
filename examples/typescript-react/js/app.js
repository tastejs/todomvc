"use strict";
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./interfaces.d.ts"/>
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const todoModel_1 = require("./todoModel");
const footer_1 = require("./footer");
const todoItem_1 = require("./todoItem");
const constants_1 = require("./constants");
class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nowShowing: constants_1.ALL_TODOS,
            editing: null
        };
    }
    componentDidMount() {
        var setState = this.setState;
        var router = Router({
            '/': setState.bind(this, { nowShowing: constants_1.ALL_TODOS }),
            '/active': setState.bind(this, { nowShowing: constants_1.ACTIVE_TODOS }),
            '/completed': setState.bind(this, { nowShowing: constants_1.COMPLETED_TODOS })
        });
        router.init('/');
    }
    handleNewTodoKeyDown(event) {
        if (event.keyCode !== constants_1.ENTER_KEY) {
            return;
        }
        event.preventDefault();
        var val = ReactDOM.findDOMNode(this.refs["newField"]).value.trim();
        if (val) {
            this.props.model.addTodo(val);
            ReactDOM.findDOMNode(this.refs["newField"]).value = '';
        }
    }
    toggleAll(event) {
        var target = event.target;
        var checked = target.checked;
        this.props.model.toggleAll(checked);
    }
    toggle(todoToToggle) {
        this.props.model.toggle(todoToToggle);
    }
    destroy(todo) {
        this.props.model.destroy(todo);
    }
    edit(todo) {
        this.setState({ editing: todo.id });
    }
    save(todoToSave, text) {
        this.props.model.save(todoToSave, text);
        this.setState({ editing: null });
    }
    cancel() {
        this.setState({ editing: null });
    }
    clearCompleted() {
        this.props.model.clearCompleted();
    }
    render() {
        var footer;
        var main;
        const todos = this.props.model.todos;
        var shownTodos = todos.filter((todo) => {
            switch (this.state.nowShowing) {
                case constants_1.ACTIVE_TODOS:
                    return !todo.completed;
                case constants_1.COMPLETED_TODOS:
                    return todo.completed;
                default:
                    return true;
            }
        });
        var todoItems = shownTodos.map((todo) => {
            return (<todoItem_1.TodoItem key={todo.id} todo={todo} onToggle={this.toggle.bind(this, todo)} onDestroy={this.destroy.bind(this, todo)} onEdit={this.edit.bind(this, todo)} editing={this.state.editing === todo.id} onSave={this.save.bind(this, todo)} onCancel={e => this.cancel()}/>);
        });
        // Note: It's usually better to use immutable data structures since they're
        // easier to reason about and React works very well with them. That's why
        // we use map(), filter() and reduce() everywhere instead of mutating the
        // array or todo items themselves.
        var activeTodoCount = todos.reduce(function (accum, todo) {
            return todo.completed ? accum : accum + 1;
        }, 0);
        var completedCount = todos.length - activeTodoCount;
        if (activeTodoCount || completedCount) {
            footer =
                <footer_1.TodoFooter count={activeTodoCount} completedCount={completedCount} nowShowing={this.state.nowShowing} onClearCompleted={e => this.clearCompleted()}/>;
        }
        if (todos.length) {
            main = (<section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" onChange={e => this.toggleAll(e)} checked={activeTodoCount === 0}/>
          <label htmlFor="toggle-all">
            Mark all as complete
          </label>
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>);
        }
        return (<div>
        <header className="header">
          <h1>todos</h1>
          <input ref="newField" className="new-todo" placeholder="What needs to be done?" onKeyDown={e => this.handleNewTodoKeyDown(e)} autoFocus={true}/>
        </header>
        {main}
        {footer}
      </div>);
    }
}
var model = new todoModel_1.TodoModel('react-todos');
function render() {
    ReactDOM.render(<TodoApp model={model}/>, document.getElementsByClassName('todoapp')[0]);
}
model.subscribe(render);
render();
