package components

import kotlinx.html.InputType
import kotlinx.html.js.onBlurFunction
import kotlinx.html.js.onChangeFunction
import kotlinx.html.js.onClickFunction
import kotlinx.html.js.onKeyUpFunction
import model.Todo
import org.w3c.dom.events.Event
import react.*
import react.dom.button
import react.dom.div
import react.dom.input
import react.dom.label
import utils.Keys
import utils.value

class TodoItem : RComponent<TodoItem.Props, TodoItem.State>() {

    override fun componentWillReceiveProps(nextProps: Props) {
        state.editText = nextProps.todo.title
    }

    override fun RBuilder.render() {
        div(classes = "view") {

            input(classes = "toggle", type = InputType.checkBox) {

                attrs.onChangeFunction = {event ->
                    val c = event.currentTarget.asDynamic().checked as Boolean
                    props.updateTodo(props.todo.title, c)
                }

                ref { it?.checked = props.todo.completed }
            }
            label {
                +props.todo.title
            }
            button(classes = "destroy") {
                attrs.onClickFunction = {
                    props.removeTodo()
                }
            }
        }
        input(classes = "edit", type = InputType.text) {
            attrs {
                value = state.editText
                onChangeFunction = { event ->
                    val text = event.value
                    setState {
                        editText = text
                    }
                }
                onBlurFunction = { finishEditing(state.editText) }
                onKeyUpFunction = ::handleKeyUp

            }

            if (props.editing) {
                ref { it?.focus() }
            }
        }
    }

    private fun finishEditing(title: String) {
        if (title.isNotBlank()) {
            props.updateTodo(title, props.todo.completed)
        } else {
            props.removeTodo()
        }

        props.endEditing()
    }

    private fun handleKeyUp(keyEvent: Event) {
        val key = Keys.fromString(keyEvent.asDynamic().key as String)
        when (key) {
            Keys.Enter -> {
                finishEditing(state.editText)
            }
            Keys.Escape -> {
                props.endEditing()
            }
        }

    }

    class Props(var todo: Todo, var editing: Boolean, var removeTodo: () -> Unit, var updateTodo: (String, Boolean) -> Unit, var endEditing: () -> Unit) : RProps
    class State(var editText: String, var checked: Boolean) : RState
}

fun RBuilder.todoItem(todo: Todo, editing: Boolean, removeTodo: () -> Unit, updateTodo: (String, Boolean) -> Unit, endEditing: () -> Unit) = child(TodoItem::class) {
    attrs.todo = todo
    attrs.editing = editing
    attrs.removeTodo = removeTodo
    attrs.updateTodo = updateTodo
    attrs.endEditing = endEditing
}