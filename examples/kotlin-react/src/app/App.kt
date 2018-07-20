package app

import components.headerInput
import components.info
import components.todoBar
import components.todoList
import kotlinx.html.InputType
import kotlinx.html.id
import kotlinx.html.js.onChangeFunction
import kotlinx.html.title
import model.Todo
import model.TodoFilter
import org.w3c.dom.HTMLInputElement
import org.w3c.dom.get
import org.w3c.dom.set
import react.*
import react.dom.input
import react.dom.label
import react.dom.section
import utils.translate
import kotlin.browser.document
import kotlin.browser.localStorage

object AppOptions {
    var language = "no-language"
    var localStorageKey = "todos-koltin-react"
}

class App : RComponent<App.Props, App.State>() {

    override fun componentWillMount() {
        console.log("component will mount app")
        setState {
            todos = loadTodos()
        }
    }

    override fun RBuilder.render() {

        val currentFilter = when (props.route) {
            "pending" -> TodoFilter.PENDING
            "completed" -> TodoFilter.COMPLETED
            else -> TodoFilter.ANY
        }

        section("todoapp") {
            headerInput(::createTodo)


            if (state.todos.isNotEmpty()) {

                val allChecked = isAllCompleted()

                section("main") {
                    input(InputType.checkBox, classes = "toggle-all") {
                        attrs {
                            id = "toggle-all"
                            checked = allChecked

                            onChangeFunction = {event ->
                                val isChecked = (event.currentTarget as HTMLInputElement).checked

                                setAllStatus(isChecked)
                            }
                        }
                    }
                    label {
                        attrs["htmlFor"] = "toggle-all"
                        attrs.title = "Mark all as complete".translate()
                    }

                    todoList(::removeTodo, ::updateTodo, state.todos, currentFilter)
                }

                todoBar(pendingCount = countPending(),
                        anyCompleted = state.todos.any { todo -> todo.completed },
                        clearCompleted = ::clearCompleted,
                        currentFilter = currentFilter,
                        updateFilter = ::updateFilter)
            }

        }
        info()
    }


    private fun loadTodos(): List<Todo> {
        val storedTodosJSON = localStorage[AppOptions.localStorageKey]

        return if (storedTodosJSON != null) {
            JSON.parse<Array<Todo>>(storedTodosJSON).map {
                Todo(it.id, it.title, it.completed)
            }.toList()
        } else {
            emptyList()
        }
    }

    private fun updateFilter(newFilter: TodoFilter) {
        document.location!!.href = "#?route=${newFilter.name.toLowerCase()}"
    }

    private fun countPending() = pendingTodos().size

    private fun removeTodo(todo: Todo) {
        console.log("removeTodo [${todo.id}] ${todo.title}")
        saveTodos(state.todos - todo)
    }

    private fun createTodo(todo: Todo) {
        console.log("createTodo [${todo.id}] ${todo.title}")
        saveTodos(state.todos + todo)
    }

    private fun updateTodo(todo: Todo) {
        console.log("updateTodo [${todo.id}] ${todo.title}")

        val newTodos = state.todos.map { oldTodo ->
            if (todo.id == oldTodo.id) {
                todo
            } else {
                oldTodo
            }
        }
        saveTodos(newTodos)
    }

    private fun setAllStatus(newStatus: Boolean) {
        saveTodos(state.todos.map { todo -> todo.copy(completed = newStatus) })
    }

    private fun saveTodos(updatedTodos: List<Todo>) {
        console.log("saving: ${updatedTodos.toTypedArray()}")

        storeTodos(updatedTodos)

        setState {
            todos = updatedTodos
        }
    }

    private fun storeTodos(todos: List<Todo>) {
        localStorage.setItem(AppOptions.localStorageKey, JSON.stringify(todos.toTypedArray()))
    }

    private fun clearCompleted() {
        saveTodos(pendingTodos())
    }

    private fun isAllCompleted(): Boolean {
        return state.todos.fold(true) { allCompleted, todo ->
            allCompleted && todo.completed
        }
    }

    private fun pendingTodos() : List<Todo> {
        return state.todos.filter { todo -> !todo.completed }
    }

    class State(var todos: List<Todo>) : RState

    class Props(var route: String) : RProps

}

fun RBuilder.app(route: String) = child(App::class) {
    attrs.route = route
}
