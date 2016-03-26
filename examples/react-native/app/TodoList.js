import React, { View, Text, StyleSheet } from 'react-native'
import Todo from './Todo'

let TodoList = ({ type, todos, _deleteTodo, _toggleComplete }) => {

  let getVisibleTodos = (todos, type) => {
    switch (type) {
      case 'All':
        return todos
      case 'Complete':
        return todos.filter(t => t.complete)
      case 'Active':
        return todos.filter(t => !t.complete)
    }
  }

  todos = getVisibleTodos(todos, type)

  todos = todos.map((todo, i) => {
            return (
              <Todo 
                key={i}
                _deleteTodo={_deleteTodo}
                _toggleComplete={_toggleComplete}
                todo={todo} />
            )
          })

  return (
    <View>
      {todos}
    </View>
  )
}

export default TodoList