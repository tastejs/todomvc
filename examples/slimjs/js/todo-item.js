/**
 *
 * Add Todo
 *
 */
Slim.tag('add-todo', class extends Slim {

	get template() { return `<input slim-id="inpAdd" class="new-todo" placeholder="What needs to be done?" autofocus>`}

	onAfterRender() {
		this.inpAdd.onkeyup = e => {
			if (e.which === 13) {
				document.querySelector('todo-list').addItem(this.inpAdd.value)
				this.inpAdd.value = ''
			}
		}
	}

})


/**
 *
 * Todo List
 *
 *
 */
Slim.tag('todo-list', class extends Slim {

	get template() {
		return `
<ul class="todo-list">
	<todo-item slim-repeat="items"></todo-item>
</ul>`
	}

	onBeforeCreated() {
		this.items = []
	}

	addItem(value) {
		this.items.push(value)
		this.update()
	}

	removeItem(value) {
		let i = this.items.indexOf(value)
		if (i >= 0) {
			this.items.splice(i, 1)
			this.update()
		}
	}


})


/**
 *
 *
 * Todo Item
 *
 *
 *
 */
Slim.tag('todo-item', class extends Slim {

	get template() {
		return `
<li class="[[getCompleteClass(complete)]]">
<div>
	<input slim-id="inpToggle" class="toggle" type="checkbox" />
	<label bind>[[data]]</label>
	<button slim-id="inpDestroy" class="destroy"></button>
</div>
</li>`
	}

	getCompleteClass(value) {
		if (value) {
			return 'completed'
		} else {
			return ''
		}
	}

	onAfterRender() {
		this.inpToggle.onchange = () => {
			this.complete = !!this.inpToggle.checked
		}

		this.inpDestroy.onclick = () => {
			document.querySelector('todo-list').removeItem(this.data)
		}
	}



})

