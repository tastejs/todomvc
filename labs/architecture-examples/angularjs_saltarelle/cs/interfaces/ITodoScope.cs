using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using ng;

namespace todo
{
    [Serializable]
    public class StatusFilter
    {
        [ObjectLiteral]
        public StatusFilter()
        {
        }
        
        public bool completed;
    }

    public class TodoScope : IScope
    {
        public List<TodoItem> todos;
        public string newTodo;
        public TodoItem editedTodo;
        public int remainingCount;
        public int doneCount;
        public bool allChecked;
        public StatusFilter statusFilter;
        public ILocationService location;

        public Action addTodo;
        public Action clearDoneTodos;
        public Action<TodoItem> editTodo;
        public Action<TodoItem> doneEditing;
        public Action<TodoItem> removeTodo;
        public Action<bool> markAll;

        public Function watch(string watchExpression)
        {
            return null;
        }

        public Function watch(string watchExpression, Action listener)
        {
            return null;
        }

        public Function watch(string watchExpression, Action<object> listener)
        {
            return null;
        }

        public Function watch(string watchExpression, Action<object, object> listener)
        {
            return null;
        }

        public Function watch(string watchExpression, Action<object, object, IScope> listener)
        {
            return null;
        }

        public Function watch(string watchExpression, Action listener, bool objectEquality)
        {
            return null;
        }

        public Function watch(string watchExpression, Action<object> listener, bool objectEquality)
        {
            return null;
        }

        public Function watch(string watchExpression, Action<object, object> listener, bool objectEquality)
        {
            return null;
        }

        public Function watch(string watchExpression, Action<object, object, IScope> listener, bool objectEquality)
        {
            return null;
        }

        public object Apply(Func<IScope, object> exp)
        {
            return null;
        }

        public object Apply(string exp)
        {
            return null;
        }
    }
}
