/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  View,
  Text,
  ScrollView,
  Component,
  StyleSheet,
  TextInput,
  TouchableHighlight
} from 'react-native';

let todoIndex = 0

import Heading from './Heading'
import Input from './Input'
import Button from './Button'
import TodoList from './TodoList'
import TabBar from './TabBar'

class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			inputValue: '',
			todos: [],
			type: 'All'
		}
	}

	_inputChange(inputValue) {
		this.setState({ inputValue })
	}

	_submitTodo() {
		if(this.state.inputValue == '') return
		let todo = { title: this.state.inputValue, todoIndex: todoIndex, complete: false }
		todoIndex ++
		this.state.todos.push(todo)
		this.setState({ todos: this.state.todos, inputValue: '' })
	}

  _deleteTodo(todoIndex) {
  	let { todos } = this.state
    todos = this.state.todos.filter((todo) => {
    	return todo.todoIndex !== todoIndex
    })
    this.setState({ todos })
  }

	_toggleComplete(todoIndex) {
		let { todos } = this.state
		todos.forEach((todo) => {
			if(todo.todoIndex === todoIndex) {
				todo.complete = !todo.complete
			} 
		})
		this.setState({ todos })
	}

	_setType(type) {
		this.setState({ type })
	}

  render() {

  	let { todos, inputValue, type } = this.state

    return (
      <View style={ styles.container }>
	      <ScrollView style={styles.content}>
	      	<Heading />
	        <Input inputValue={ inputValue } _inputChange={ (text) => this._inputChange(text) } />
          <TodoList type={type} _toggleComplete={this._toggleComplete.bind(this)} _deleteTodo={this._deleteTodo.bind(this)} todos={ todos } />
          <Button _submitTodo={ () => this._submitTodo() } />
	      </ScrollView>
	      <TabBar type={type} _setType={this._setType.bind(this)} />
      </View>
    );
  }
}

export default App

let styles = StyleSheet.create({
	container: {
		backgroundColor: 'f5f5f5',
		flex:1
	},
	content: {
		flex: 1
	}
})
