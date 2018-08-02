"use strict";
import {R} from './r.js';
{
  const root = document.querySelector('.todoapp');
  const todos = load();
  const session = Math.random()+'';
  let keyCounter = 0;
  let AllRouteLink;

  openApp();

  function openApp() {
    App({list:todos}).to(root,'innerHTML');
    addEventListener('hashchange', routeHash);
    routeHash();
  }

  function changeHash(e) {
    e.preventDefault();
    history.replaceState(null,null,e.target.href);
    routeHash();
  }

  function App({list}) {
    return R`
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" placeholder="What needs to be done?" autofocus
          keydown=${newTodoIfEnter} 
        >
      </header>
      <section class="main">
        <input id="toggle-all" class="toggle-all" type="checkbox" click=${toggleAll}>
        <label for="toggle-all">Mark all as complete</label>
        <ul class=todo-list>
          ${TodoList(list)}
        </ul>
        ${Footer()}
      </section>
    `;
  }

  function TodoList(list) {
    const retVal = R`
      ${list.map(Todo)}
    `;
    return retVal;
  }

  function Footer() {
    return R`
      <footer class="${todos.length ? '' : 'hidden' } footer">
        <span class="todo-count">
          ${TodoCount()}
        </span>
        <ul class="filters">
          <li>
            <a href="#/" click=${changeHash}
              class="${location.hash == "#/" ? 'selected' : ''}">All</a>
          </li>
          <li>
            <a href="#/active" click=${changeHash}
              class="${location.hash == "#/active" ? 'selected' : ''}">Active</a>
          </li>
          <li>
            <a href="#/completed" click=${changeHash}
              class="${location.hash == "#/completed" ? 'selected' : ''}">Completed</a>
          </li>
        </ul>
        <button click="${clearCompleted}" class=clear-completed>Clear completed</button>
      </footer>
    `;
  }

  function takeFocus(el) {
    el.focus();
    el.selectionStart = el.selectionEnd = el.value.length;
  }

  function Todo({key,text,completed,active,editing}) {
    return R`${{key}}
      <li data-key=${key} class="${
          completed ? 'completed' : ''} ${
          active ? 'active' : ''} ${
          editing ? 'editing' : ''}">
        <div class="view">
          <input class="toggle" type="checkbox" 
            ${completed ? 'checked':''} 
            change=${e => toggleCompleted(e,key)}>
          <label touchstart=${() => editTodo(key)} dblclick=${() => editTodo(key)}>${text}</label>
          <button class="destroy" click=${() => deleteTodo(key)}></button>
        </div>
        ${editing ? R`<input class=edit value=${text}
            ${{key:Math.random()+''}}
            bond=${takeFocus}
            keydown=${keyEvent => saveTodoIfEnter(keyEvent,key)}
            blur=${e => saveTodo(e,key)}>`
          : ''
        }
      </li>
    `;
  }

  function TodoCount() {
    const activeCount = todos.filter(t => !t.completed).length;
    return R`
      <span class="todo-count">
        <strong>${activeCount}</strong>
        items left
      </span>
    `;
  }

  function routeHash() {
    switch(location.hash) {
      case "#/active":                listActive(); break;
      case "#/completed":             listCompleted(); break;
      case "#/":          default:    listAll(); break;
    }
  }

  function newKey(prefix) {
    return `key-${prefix ? prefix + '-' : ''}${session}-${keyCounter++}`;
  }

  function load() {
    return JSON.parse(localStorage.getItem('todos')) || [];
  }

  function save() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function updateList(list = todos) {
    TodoList(list);
    Footer();
  }
  
  function updateTodo(todo) {
    save();
    Todo(todo);
    TodoCount();
  }

  function addTodo(todo) {
    todos.push(todo);
    save();
    //updateList();
    routeHash();
  }

  function toggleCompleted({target},todoKey,{noRoute:noRoute = false} = {}) {
    const checked = target.checked;
    const todo = todos.find(({key}) => key == todoKey);
    todo.completed = target.checked;
    if ( ! todo.completed ) {
      todo.active = true;
    } else {
      todo.active = false;
    }
    updateTodo(todo);
    if ( !noRoute ) {
      setTimeout(routeHash,500);
    }
  }

  function deleteTodo(todoKey, {noRoute:noRoute = false} = {}) {
    const index = todos.findIndex(({key}) => key == todoKey);
    if ( index >= 0 ) {
      const todo = todos.splice(index,1); 
      save();
      if ( !noRoute ) {
        routeHash();
      }
    } else {
      throw {error: {msg:`Cannot find todo with key ${todoKey}`}};
    }
  }

  function saveTodo({target},todoKey) {
    if ( ! todoKey ) return;
    const todo = todos.find(({key}) => key == todoKey);
    if ( ! todo ) {
      return;
    }
    const text = target.value.trim();
    if ( text.length == 0 ) {
      return deleteTodo(todoKey);
    }
    todo.editing = false;
    todo.text = text;
    updateTodo(todo);
  }

  function editTodo(todoKey) {
    const todo = todos.find(({key}) => key == todoKey);
    if ( todo.editing ) return;
    todo.editing = true;
    updateTodo(todo);
  }


  function clearCompleted() {
    const completed = todos.filter(({completed}) => completed);
    completed.forEach(({key}) => deleteTodo(key,{noRoute:true}));
    routeHash();
  }

  function toggleAll({target}) {
    todos.forEach(t => toggleCompleted({target}, t.key, {noRoute:true}));
    setTimeout(routeHash,500);
  }

  function listAll() {
    updateList(todos);
  }

  function listCompleted() {
    updateList(todos.filter( t => t.completed ));
  }

  function listActive() {
    updateList(todos.filter( t => !t.completed ));
  }

  function saveTodoIfEnter(keyEvent,key) {
    if ( keyEvent.key !== 'Enter' ) {
      return;
    }
    saveTodo(keyEvent,key);
  }

  function newTodoIfEnter(keyEvent) {
    if ( keyEvent.key !== 'Enter' ) {
      return;
    }
    const {target:source} = keyEvent;
    const text = source.value.trim();
    if ( ! text ) {
      return; 
    }
    const todo = {
      key: newKey('todo'),
      text,
      active: true,
      completed: false,
      editing: false
    };
    addTodo(todo);
    source.value = '';
  }
}
