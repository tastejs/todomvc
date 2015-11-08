import View from './view'
import * as helpers from './helpers'
import Controller from './controller'
import Model from './model'
import Store from './store'
import Template from './template'

let $on = helpers.$on
var todo

let setView = () => {
  todo.controller.setView(document.location.hash)
}

class Todo {
  /**
   * Init new Todo List
   * @param  {string} The name of your list
   */
  constructor(name) {
  	this.storage = new Store(name)
  	this.model = new Model(this.storage)

  	this.template = new Template()
  	this.view = new View(this.template)

  	this.controller = new Controller(this.model, this.view)
  }
}


$on(window, 'load', () => {
	todo = new Todo('todos-vanillajs')
	setView()
})

$on(window, 'hashchange', setView)
