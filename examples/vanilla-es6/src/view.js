import {qs, qsa, $on, $parent, $delegate} from './helpers'

let _itemId = (element) => parseInt($parent(element, 'li').dataset.id, 10)

function _setFilter(currentPage){
	qs('.filters .selected').className = ''
	qs(`.filters [href="#/${currentPage}"]`).className = 'selected'
}

function _elementComplete(id, completed){
	var listItem = qs(`[data-id="${id}"]`)
	if (!listItem) return

	listItem.className = completed ? 'completed' : ''

	// In case it was toggled from an event and not by clicking the checkbox
	qs('input', listItem).checked = completed
}

function _editItem(id, title) {
	var listItem = qs(`[data-id="${id}"]`)
	if (!listItem) return

	listItem.className += 'editing'

	var input = document.createElement('input')
	input.className = 'edit'

	listItem.appendChild(input)
	input.focus()
	input.value = title
}

/**
 * View that abstracts away the browser's DOM completely.
 * It has two simple entry points:
 *
 *   - bind(eventName, handler)
 *     Takes a todo application event and registers the handler
 *   - render(command, parameterObject)
 *     Renders the given command with the options
 */
export default class View {
	constructor(template) {
		this.template = template

		this.ENTER_KEY = 13
		this.ESCAPE_KEY = 27

		this.$todoList = qs('.todo-list')
		this.$todoItemCounter = qs('.todo-count')
		this.$clearCompleted = qs('.clear-completed')
		this.$main = qs('.main')
		this.$footer = qs('.footer')
		this.$toggleAll = qs('.toggle-all')
		this.$newTodo = qs('.new-todo')

		this.viewCommands = {
			showEntries: (parameter) => this.$todoList.innerHTML = this.template.show(parameter),
			removeItem: (parameter) => this._removeItem(parameter),
			updateElementCount: (parameter) => this.$todoItemCounter.innerHTML = this.template.itemCounter(parameter),
			clearCompletedButton: (parameter) => this._clearCompletedButton(parameter.completed, parameter.visible),
			contentBlockVisibility: (parameter) => this.$main.style.display = this.$footer.style.display = parameter.visible ? 'block' : 'none',
			toggleAll: (parameter) => this.$toggleAll.checked = parameter.checked,
			setFilter: (parameter) => _setFilter(parameter),
			clearNewTodo: (parameter) => this.$newTodo.value = '',
			elementComplete: (parameter) => _elementComplete(parameter.id, parameter.completed),
			editItem: (parameter) => _editItem(parameter.id, parameter.title),
			editItemDone: (parameter) => this._editItemDone(parameter.id, parameter.title),
		}
	}

	_removeItem(id) {
		var elem = qs(`[data-id="${id}"]`)

		if (elem) {
			this.$todoList.removeChild(elem)
		}
	}

	_clearCompletedButton(completedCount, visible) {
		this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount)
		this.$clearCompleted.style.display = visible ? 'block' : 'none'
	}

	_editItemDone(id, title) {
		var listItem = qs(`[data-id="${id}"]`)
		if (!listItem) return

		var input = qs('input.edit', listItem)
		listItem.removeChild(input)

		listItem.className = listItem.className.replace('editing', '')

		qsa('label', listItem).forEach(function (label) {
			label.textContent = title
		})
	}

	render(viewCmd, parameter) {
		this.viewCommands[viewCmd](parameter)
	}

	_bindItemEditDone(handler) {
		var that = this

		$delegate(that.$todoList, 'li .edit', 'blur', function () {
			if (!this.dataset.iscanceled) {
				handler({
					id: _itemId(this),
					title: this.value
				})
			}
		})

		$delegate(that.$todoList, 'li .edit', 'keypress', function (event) {
			if (event.keyCode === that.ENTER_KEY) {
				// Remove the cursor from the input when you hit enter just like if it
				// were a real form
				this.blur()
			}
		})
	}

	_bindItemEditCancel(handler) {
		var that = this
		$delegate(that.$todoList, 'li .edit', 'keyup', function (event) {
			if (event.keyCode === that.ESCAPE_KEY) {
				this.dataset.iscanceled = true
				this.blur()

				handler({id: _itemId(this)})
			}
		})
	}

	bind(event, handler) {
		if (event === 'newTodo') {
			$on(this.$newTodo, 'change', () => handler(this.$newTodo.value))
		} else if (event === 'removeCompleted') {
			$on(this.$clearCompleted, 'click', handler)
		} else if (event === 'toggleAll') {
			$on(this.$toggleAll, 'click', function(){
				handler({completed: this.checked})
			})
		} else if (event === 'itemEdit') {
			$delegate(this.$todoList, 'li label', 'dblclick', function(){
				handler({id: _itemId(this)})
			})
		} else if (event === 'itemRemove') {
			$delegate(this.$todoList, '.destroy', 'click', function(){
				handler({id: _itemId(this)})
			})
		} else if (event === 'itemToggle') {
			$delegate(this.$todoList, '.toggle', 'click', function(){
				handler({
					id: _itemId(this),
					completed: this.checked
				})
			})
		} else if (event === 'itemEditDone') {
			this._bindItemEditDone(handler)
		} else if (event === 'itemEditCancel') {
			this._bindItemEditCancel(handler)
		}
	}
}
