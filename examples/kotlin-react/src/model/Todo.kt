package model

import kotlin.js.Date


data class Todo (
    val id: Double = guid(),
    val title: String,
    var completed: Boolean = false
)

enum class TodoFilter {
    ANY, COMPLETED, PENDING;

    fun filter(todo: Todo): Boolean {
        return when (this) {
            TodoFilter.ANY -> true
            TodoFilter.COMPLETED -> todo.completed
            TodoFilter.PENDING -> !todo.completed
        }
    }
}


fun guid(): Double {
    return Date().getTime()
}

