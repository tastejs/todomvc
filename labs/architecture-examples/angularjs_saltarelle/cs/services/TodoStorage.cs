using System.Collections.Generic;
using System.Html;
using System.Serialization;

namespace todo
{
    public class TodoStorage : ITodoStorage
    {
        private const string STORAGE_ID = "todos-angularjs-requirejs";

        public List<TodoItem> todos
        {
            get
            {
                var json = (string) Window.LocalStorage.GetItem(STORAGE_ID);
                return (List<TodoItem>)Json.Parse(json ?? "[]");
            }
            set
            {
                string json = Json.Stringify(todos);
                Window.LocalStorage.SetItem(STORAGE_ID, json);
            }
        }
    }
}
