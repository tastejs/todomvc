package org.teavm.flavour.example.todomvc

import org.teavm.flavour.json.JSON
import org.teavm.flavour.json.tree.Node
import org.teavm.jso.browser.Window

class LocalStorageTodoDataSource : TodoDataSource {
    private val localStorage = Window.current().localStorage
    private var list: TodoList? = null

    override fun fetch(): List<Todo> {
        val list = this.list ?: let {
            val item = localStorage.getItem(ITEM_NAME) ?: return emptyList()
            JSON.deserialize(Node.parse(item), TodoList::class.java).also { list = it }
        }
        return list.data
    }

    override fun save(todo: Todo) {
        val list = getOrCreateList()
        val index = list.data.indexOf(todo)
        if (index < 0) {
            list.data += todo
        }
        updateLocalStorage(list)
    }

    override fun delete(todo: Todo) {
        val list = getOrCreateList()
        list.data -= todo
        updateLocalStorage(list)
    }

    override fun clearCompleted() {
        val list = getOrCreateList()
        list.data.removeAll { it.completed }
        updateLocalStorage(list)
    }

    private fun getOrCreateList(): TodoList = list ?: TodoList().also { list = it }

    private fun updateLocalStorage(list: TodoList) {
        localStorage.setItem(ITEM_NAME, JSON.serialize(list).stringify())
    }

    companion object {
        val ITEM_NAME = "todos"
    }
}

class TodoList {
    val data = mutableListOf<Todo>()
}
