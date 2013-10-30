/*global document */
(function () {
    'use strict';

    function _(id) { return document.getElementById(id.replace('#', '')); }

    if(!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    var Utils = {
        uuid: function () {
            var i, random;
            var uuid = '';

            for(i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if(i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
            }

            return uuid;
        },
        pluralize: function(count, word) {
            return count === 1 ? word : word + 's';
        },
        store: function(namespace, data) {
            if(arguments.length > 1) {
                return localStorage.setItem(namespace, JSON.stringify(data));
            }
            else {
                var store = localStorage.getItem(namespace);
                return (store && JSON.parse(store)) || [];
            }
        },

        addEvent: function(el, type, fn) {
            if(typeof addEventListener !== 'undefined') {
                el.addEventListener(type, fn, false);
            }
            else {
                el['on' + type] = fn;
            }
        },

        toggle: function(obj, show) {
            obj.style.display = (show ? '' : 'none');
        }
    };

    var App = {
        init: function () {
            this.ENTER_KEY = 13;
            this.todos = Utils.store('todos-js');
            this.cacheElements();
            this.bindEvents();
            this.render();
        },
        cacheElements: function () {
            this.main = _('#main');
            this.footer = _('#footer');
            this.newTodo = _('#new-todo');
            this.toggleAllEl = _('#toggle-all');
            this.todoList = _('#todo-list');
        },
        bindEvents: function () {
            Utils.addEvent(this.newTodo, 'keyup', this.create);
            Utils.addEvent(this.toggleAllEl, 'change', this.toggleAll);
        },
        render: function () {
            this.buildToDos(this.todoList, this.todos);
            Utils.toggle(this.main, !!this.todos.length);
            this.toggleAllEl.checked = !this.activeTodoCount();
            this.renderFooter();
            Utils.store('todos-js', this.todos);
        },
        buildToDos: function(parent, todos) {
            while(parent.lastChild) {
                parent.removeChild(parent.lastChild);
            }
            for(var i = todos.length - 1; i >= 0; i--) {
                parent.appendChild(this.buildToDo(todos[i]));
            }
        },
        buildToDo: function(todo) {
            var doc = document,
                li = doc.createElement('li'),
                div = doc.createElement('div'),
                checkbox = doc.createElement('input'),
                label = doc.createElement('label'),
                button = doc.createElement('button'),
                edit = doc.createElement('input');

            checkbox.type = 'checkbox';
            checkbox.className = 'toggle';
            Utils.addEvent(checkbox, 'change', App.toggle);

            div.className = 'view';
            label.innerHTML = todo.title;
            Utils.addEvent(label, 'dblclick', App.edit);

            button.className = 'destroy';
            Utils.addEvent(button, 'click', App.destroy);

            edit.className = 'edit';
            edit.setAttribute('value', todo.title);
            Utils.addEvent(edit, 'blur', App.update);
            Utils.addEvent(edit, 'keypress', App.blurOnEnter);

            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(button);

            if(todo.completed) {
                li.className = 'completed';
                checkbox.setAttribute('checked', 'checked');
            }
            li.setAttribute('data-id', todo.id);
            li.appendChild(div);
            li.appendChild(edit);

            return li;
        },
        renderFooter: function () {
            var todoCount = this.todos.length;
            var activeTodoCount = this.activeTodoCount();
            var footer = {
                activeTodoCount: activeTodoCount,
                activeTodoWord: Utils.pluralize(activeTodoCount, 'item'),
                completedTodos: todoCount - activeTodoCount
            };

            Utils.toggle(this.footer, !!todoCount);

            while(this.footer.lastChild) {
                this.footer.removeChild(this.footer.lastChild);
            }
            var footerContent = this.buildFooter(footer);
            for(var i = footerContent.length - 1; i >= 0; i--) {
                this.footer.appendChild(footerContent[i]);
            }

            var clearCompleted = _('#clear-completed');
            if(clearCompleted !== null) {
                Utils.addEvent(clearCompleted, 'click', this.destroyCompleted);
            }
        },
        buildFooter: function(footer) {
            var html = [],
                doc = document,
                span = doc.createElement('span'),
                strong = doc.createElement('strong');

            strong.innerHTML = footer.activeTodoCount + ' ';
            span.id = 'todo-count';
            span.appendChild(strong);
            span.innerHTML += footer.activeTodoWord + ' left';
            html[0] = span;

            if(footer.completedTodos) {
                var button = doc.createElement('button');
                button.id = 'clear-completed';
                button.innerHTML = 'Clear completed (' + footer.completedTodos + ' )';
                html[1] = button;
            }

            return html;
        },
        toggleAll: function () {
            var isChecked = this.checked;

            App.todos.forEach(function(todo) {
                todo.completed = isChecked;
            });

            App.render();
        },
        activeTodoCount: function () {
            var count = 0;

            this.todos.forEach(function(todo) {
                if(!todo.completed) {
                    count++;
                }
            });

            return count;
        },
        destroyCompleted: function () {
            var todos = App.todos;
            var l = todos.length;

            while(l--) {
                if(todos[l].completed) {
                    todos.splice(l, 1);
                }
            }

            App.render();
        },
        getTodo: function(elem, callback) {
            var id;

            while(!(id = elem.getAttribute('data-id'))) {
                elem = elem.parentNode;
            }

            this.todos.forEach(function(todo, i) {
                if(todo.id === id) {
                    callback.apply(App, [i, todo]);
                }
            });
        },
        create: function(e) {
            var val = this.value.trim();

            if(e.which !== App.ENTER_KEY || !val) {
                return;
            }

            App.todos.push({
                               id: Utils.uuid(),
                               title: val,
                               completed: false
                           });

            this.value = '';
            App.render();
        },
        toggle: function () {
            App.getTodo(this, function(i, val) {
                val.completed = !val.completed;
            });
            App.render();
        },
        edit: function () {
            var elem = this;

            while(!elem.getAttribute('data-id')) {
                elem = elem.parentNode;
            }

            elem.className += ' editing';

            var input = elem.querySelector('.edit');
            input.value = input.value.trim();
            input.focus();
        },
        blurOnEnter: function(e) {
            if(e.which === App.ENTER_KEY) {
                e.target.blur();
            }
        },
        update: function () {
            this.className.replace
                (/(?:^|\s)editing(?!\S)/g, '');
            var val = this.value.trim();

            App.getTodo(this, function(i) {
                if(val) {
                    App.todos[i].title = val;
                }
                else {
                    App.todos.splice(i, 1);
                }
                this.render();
            });
        },
        destroy: function () {
            App.getTodo(this, function(i) {
                App.todos.splice(i, 1);
                this.render();
            });
        }
    };

    App.init();
}());