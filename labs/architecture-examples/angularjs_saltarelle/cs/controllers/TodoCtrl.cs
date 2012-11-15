using System.Collections.Generic;
using ng;

namespace todo
{
    public class TodoCtrl
    {
        private List<TodoItem> todos;
        private readonly TodoScope scope;
        private readonly ITodoStorage todoStorage;
        private IFilterService filterFilter;
        private ILogService log;

        public TodoCtrl(TodoScope scope, ILocationService location, ITodoStorage todoStorage,IFilterService filterFilter, ILogService log)
        {
            this.scope = scope;
            this.todoStorage = todoStorage;
            this.filterFilter = filterFilter;
            this.log = log;

            todos = scope.todos = todoStorage.todos;

            scope.newTodo = "";
            scope.editedTodo = null;

            scope.addTodo = addTodo;
            scope.editTodo = editTodo;
            scope.doneEditing = doneEditing;
            scope.removeTodo = removeTodo;
            scope.clearDoneTodos = clearDoneTodos;
            scope.markAll = markAll;

            scope.watch("todos", onTodos, true);
            scope.watch("location.path()", onPath);

            if (location.path() == "") location.path("/");
            scope.location = location;
            log.log("TodoCtrl created");
        }

        private void onPath(object p)
        {
            log.log("TodoCtrl onPath");
            var path = p as string;
            scope.statusFilter = (path == "/active")
                                     ? new StatusFilter {completed = false}
                                     : (path == "/completed")
                                           ? new StatusFilter {completed = true}
                                           : null;
        }

        private void onTodos()
        {
            log.log("TodoCtrl onTodos");
            //log.log(filterFilter);
            //scope.remainingCount = filterFilter(this.todos, new StatusFilter { completed = false }).length;
            scope.doneCount = todos.Count - scope.remainingCount;
            scope.allChecked = scope.remainingCount > 0;
            todoStorage.todos = todos;
        }

        private void addTodo()
        {
            log.log("TodoCtrl addTodo");
            if (scope.newTodo.Length == 0)
            {
                return;
            }

            todos.Add(new TodoItem
                {
                    title = scope.newTodo,
                    completed = false
                });

            scope.newTodo = "";
        }

        private void editTodo(TodoItem todo)
        {
            log.log("TodoCtrl editTodo");
            scope.editedTodo = todo;
        }

        private void doneEditing(TodoItem todo)
        {
            log.log("TodoCtrl doneEditing");
            scope.editedTodo = null;
            if (string.IsNullOrEmpty(todo.title))
            {
                scope.removeTodo(todo);
            }
        }

        private void removeTodo(TodoItem todo)
        {
            log.log("TodoCtrl removeTodo");
            todos.Remove(todo);
        }

        private void clearDoneTodos()
        {
            log.log("TodoCtrl clearDoneTodos");
            scope.todos = todos = todos.Filter((val) => { return !val.completed; });
        }

        private void markAll(bool done)
        {
            log.log("TodoCtrl markAll");
            foreach (TodoItem todo in todos)
            {
                todo.completed = done;
            }
        }
    }
}
