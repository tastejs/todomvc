(function () {
    'use strict';

    var todos;
    function guid() {//from http://slavik.meltser.info/the-efficient-way-to-create-guid-uuid-in-javascript-with-explanation/
        function _p8(s) {
            var p = (Math.random().toString(16) + '000000000').substr(2,8);
            return s ? '-' + p.substr(0,4) + '-' + p.substr(4,4) : p ;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }
    function htmlEscape(str) {//from http://stackoverflow.com/questions/10216805/is-there-an-easy-way-to-convert-text-into-html-in-javascript
        return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
    function simpleTemplateEngine(templateId, data,data2) {
        var template;
        function lookup(key) {
            var ans = data[key];
            if (ans !== undefined) {
                return ans;
            }
            return data2[key] || '';
        }
        template = document.getElementById(templateId).innerHTML;
        return template.replace(/\#\w+/gi, function (match) {
            return htmlEscape(lookup(match.substring(1)));
        });
    }
    function closest(el,nodeName) { //because native 'closest' implementation is "experimental"
        while (el) {
            el = el.parentNode;
            if (el.nodeName.toUpperCase() === nodeName.toUpperCase()) {
                return el;
            }
        }
    }
    function attachBySelector(selector,eventname,handler) {
        var l = document.querySelectorAll(selector);
        for (var i = 0;i < l.length;i++) {
            l[i][eventname] = handler;
        }
    }
    function removeClass(el,className) {
        var pat = '\\b' + className + '\\b';
        var re = new RegExp(pat,'g');
        el.className = el.className.replace(re,'');
    }
    function todoIndexByEl(el) {
        var id = closest(el,'li').dataset.id;
        for (var i = 0;i < todos.length;i++) {
            if (todos[i].id === id) {
                return i;
            }
        }
    }
    function todosByComplete(value) {
        var ans = [];
        for (var i = 0;i < todos.length;i++) {
            if (todos[i].completed === value) {
                ans.push(todos[i]);
            }
        }
        return ans;
    }
    function renderTodos(filter) {
        var filteredTodos = todos;
        if (filter === 'active') {
            filteredTodos = todosByComplete(false);
        }
        if (filter === 'completed') {
            filteredTodos = todosByComplete(true);
        }
        var s = '';
        for (var i = 0;i < filteredTodos.length;i++) {
            var item = filteredTodos[i];
            var calculated = {};
            if (item.completed) {
                calculated = {
                    checked:'checked',
                    liClass:'class=completed'
                };
            }
            s += simpleTemplateEngine('todo-template',item,calculated);
        }
        document.getElementById('todo-list').innerHTML = s;
    }
    function render() {
        var filter = calcFilter();
        renderTodos(filter);
        attachTodoEventHandlers();
        renderFooter(filter);
    }
    function renderAndSave() {
        render();
        save();
    }
    function calcFilter() {
        switch (document.location.hash){
            case '#/active': return 'active';
            case '#/completed': return 'completed';
            default:return 'all';
        }
    }
    function renderFooter(filter) {
        var todoCount = todos.length;
        if (todoCount === 0) {
            document.getElementById('footer').style.display = 'none';
            document.getElementById('main').style.display = 'none';
            return; //no footer if no todos
        }
        document.getElementById('footer').style.display = 'block';
        document.getElementById('main').style.display = 'block';
        var activeTodoCount = todosByComplete(false).length;
        var completedCount = todoCount - activeTodoCount;
        var data = {
            activeTodoCount: activeTodoCount,
            activeTodoWord: (activeTodoCount === 1 ? 'item' : 'items')
        };
        data[filter + '_selected'] = 'class=selected'; //nice!
        if (completedCount === 0) {
            data.clearCompletedClass = 'style="display=none"';
        }
        var s = simpleTemplateEngine('footer-template',data,{});
        document.getElementById('footer').innerHTML = s;
        document.getElementById('toggle-all').checked = (activeTodoCount === 0);

    }
    function save() {
        localStorage.setItem('todos-mine', JSON.stringify(todos));
    }
    function load() {
        return JSON.parse(localStorage.getItem('todos-mine')) || [];
    }
    function attachTodoEventHandlers() {
        function destroy(e) {
            todos.splice(todoIndexByEl(e.target),1);
            renderAndSave();
        }
        function onDblclickLabel(e) {
            var el = e.target;
            var todo = todos[todoIndexByEl(el)];
            var li = closest(el,'li');
            li.className += ' editing';
            var input = li.querySelector('.edit');
            input.value = todo.title;
            input.focus();
        }
        function editKeyup(e) {
            var el = e.target;
            if (e.which === 13) {//enter key
                update(e);
            }

            if (e.which === 27) {//escape key
                var li = closest(el,'li');
                e.stopPropagation();
                removeClass(li,'editing');
            }
        }
        function update(e) {
            var el = e.target;
            var li = closest(el,'li');
            if (li.className.search('editing') === -1) {
                return;
            }
            var value = li.querySelector('.edit').value.trim();
            if (!value) {
                destroy(e);
                return;
            }
            todos[todoIndexByEl(el)].title = value;
            renderAndSave();
        }
        function onchange(e) {
            var todo = todos[todoIndexByEl(e.target)];
            todo.completed = !todo.completed;
            renderAndSave();
        }
        attachBySelector('#todo-list li .destroy','onclick',destroy);
        attachBySelector('#todo-list li label','ondblclick',onDblclickLabel);
        attachBySelector('#todo-list li .edit','onblur',update);
        attachBySelector('#todo-list li .toggle','onchange',onchange);
        attachBySelector('#todo-list li .edit','onkeyup',editKeyup);
    }
    function attachPageEventHandles() {
        var newTodo = document.getElementById('new-todo');
        newTodo.onkeyup = function (e) {
            var el = e.target;
            var val = el.value.trim();
            if (e.which !== 13 || !val) {
                return;
            }
            todos.push({
                id: guid(),
                title: val,
                completed: false
            });
            el.value = '';
            renderAndSave();
        };
        document.getElementById('footer').onclick = function (e) {
            var el = e.target;
            if (el.id === 'clear-completed') {
                todos = todosByComplete(false);
                renderAndSave();
            }
        };
        document.getElementById('toggle-all').onchange = function (e) {
            var isChecked = e.target.checked;
            for (var i = 0;i < todos.length;i++) {
                todos[i].completed = isChecked;
            }
            render();
        };
        window.onhashchange = render;
    }
    todos = load();
    attachPageEventHandles();
    render();
})();
