package components

import kotlinx.html.js.onDoubleClickFunction
import model.Todo
import model.TodoFilter
import react.*
import react.dom.li
import react.dom.ul

class TodoList : RComponent<TodoList.Props, TodoList.State>() {

    override fun componentWillMount() {
        setState {
            editingIdx = -1
        }
    }

    override fun RBuilder.render() {
        console.log("TodoList render")

        ul(classes = "todo-list") {
            val filter = props.filter

            props.todos.filter { todo ->
                filter.filter(todo)

            }.forEachIndexed { idx, todo ->
                val isEditing = idx == state.editingIdx

                val classes = when {
                    todo.completed -> "completed"
                    isEditing -> "editing"
                    else -> ""
                }


                li(classes = classes) {
                    attrs.onDoubleClickFunction = {
                        setState {
                            editingIdx = idx
                        }
                    }

                    todoItem(
                            todo = todo,
                            editing = isEditing,
                            endEditing = ::endEditing,
                            removeTodo = { props.removeTodo(todo) },
                            updateTodo = { title, completed ->
                                props.updateTodo(todo.copy(title = title, completed = completed))
                            }
                    )
                }
            }
        }
    }

    private fun endEditing() {
        setState {
            editingIdx = -1
        }
    }

    class Props(var removeTodo: (Todo) -> Unit, var updateTodo: (Todo) -> Unit, var todos: List<Todo>, var filter: TodoFilter) : RProps
    class State(var editingIdx: Int) : RState
}

fun RBuilder.todoList(removeTodo: (Todo) -> Unit, updateTodo: (Todo) -> Unit, todos: List<Todo>, filter: TodoFilter) = child(TodoList::class) {
    attrs.todos = todos
    attrs.removeTodo = removeTodo
    attrs.updateTodo = updateTodo
    attrs.filter = filter
}