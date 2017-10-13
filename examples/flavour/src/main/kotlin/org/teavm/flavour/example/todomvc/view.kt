package org.teavm.flavour.example.todomvc

import org.teavm.flavour.routing.Path
import org.teavm.flavour.routing.PathSet
import org.teavm.flavour.routing.Route
import org.teavm.flavour.routing.Routing
import org.teavm.flavour.templates.BindTemplate
import org.teavm.flavour.widgets.ApplicationTemplate
import org.teavm.flavour.widgets.RouteBinder
import org.teavm.jso.dom.html.HTMLDocument
import java.util.function.Consumer

@BindTemplate("templates/todo.html")
class TodoView(private val dataSource: TodoDataSource) : ApplicationTemplate(), TodoRoute {
    private val allTodos = mutableListOf<Todo>()
    private var todoFilter: (Todo) -> Boolean = { true }

    init {
        reload()
    }

    val todos: List<Todo> get() = allTodos

    val filteredTodos get() = allTodos.filter(todoFilter)

    var newTodo = ""

    var editedTodo: Todo? = null
        get
        private set

    private var titleBackup = ""

    var saving = false
        get
        private set

    var filterType = TodoFilterType.ALL
        get
        private set

    val remainingCount get() = todos.count { !it.completed }

    val completedCount get() = todos.count { it.completed }

    val allChecked get() = todos.all { it.completed }

    fun markAll(mark: Boolean) = todos.forEach { it.completed = mark }

    fun addTodo() {
        if (newTodo.isBlank()) return
        dataSource.save(Todo().apply { title = newTodo })
        newTodo = ""
        reload()
    }

    fun editTodo(todo: Todo) {
        editedTodo = todo
        titleBackup = todo.title
    }

    fun revertEdits(todo: Todo) {
        if (editedTodo == null) return
        todo.title = titleBackup
        editedTodo = null
        reload()
    }

    fun saveEdits(todo: Todo) {
        val editedTodo = this.editedTodo ?: return
        todo.title = editedTodo.title.trim()
        this.editedTodo = null
        if (editedTodo.title.isNotBlank()) {
            dataSource.save(todo)
        }
        else {
            dataSource.delete(todo)
        }
        reload()
    }

    fun removeTodo(todo: Todo) {
        dataSource.delete(todo)
        reload()
    }

    fun clearCompletedTodos() {
        dataSource.clearCompleted()
        reload()
    }

    override fun all() {
        todoFilter = { true }
        filterType = TodoFilterType.ALL
    }

    override fun active() {
        todoFilter = { !it.completed }
        filterType = TodoFilterType.ACTIVE
    }

    override fun completed() {
        todoFilter = { it.completed }
        filterType = TodoFilterType.COMPLETED
    }

    fun route(c: Consumer<String>) = Routing.build(TodoRoute::class.java, c)

    private fun reload() {
        allTodos.clear()
        allTodos += dataSource.fetch()
    }

    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            val view = TodoView(LocalStorageTodoDataSource())
            RouteBinder()
                .withDefault(TodoRoute::class.java) { it.all() }
                .add(view)
                .update()
            view.bind(HTMLDocument.current().body)
        }
    }
}

@PathSet
interface TodoRoute : Route {
    @Path("/")
    fun all()

    @Path("/active")
    fun active()

    @Path("/completed")
    fun completed()
}
