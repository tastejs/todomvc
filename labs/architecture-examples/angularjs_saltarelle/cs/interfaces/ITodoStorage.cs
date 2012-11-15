using System.Collections.Generic;

namespace todo
{
    public interface ITodoStorage
    {
        List<TodoItem> todos { get; set; }
    }
}
