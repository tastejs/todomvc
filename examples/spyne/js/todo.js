const spyne = window.spyne;
window.Todo = class Todo extends spyne.ViewStream {
	constructor(props = {}) {
		props.tagName = 'li';

		// send rendering and disposing events to CHANNEL_LIFECYCLE
		props.sendLifecyleEvents = true;
		props.template = document.querySelector('.todo-tmpl');
		props.class = 'todos';
		props.dataset = props.data;
		super(props);
	}

	// broadcast events locally from these elements
	broadcastEvents() {
		return [
			['div', 'dblClick', 'local'],
			['input.edit', 'keyup', 'local'],
			['input.edit', 'blur', 'local'],
			['input.toggle', 'change', 'local'],
			['button.destroy', 'click', 'local'],

		];
	}

	// listen to these channel actions and bind to these methods
	addActionListeners() {
		return [
			['CHANNEL_UI_CHANGE_EVENT', 'onCompletedUpdate'],
			['CHANNEL_UI_CLICK_EVENT', 'onUIClick'],
			['CHANNEL_UI_KEYUP_EVENT', 'onKeyPressed'],
			['CHANNEL_UI_DBLCLICK_EVENT', 'onEditOpen'],
			['CHANNEL_UI_BLUR_EVENT', 'onEditBlurEvent'],
			['CHANNEL_MODEL_CLICKED_EVENT', 'onEditClose'],
		];
	}

	onUIClick(item) {
		const methodsHash = {
			'destroy-item': this.disposeViewStream.bind(this),
			'completed-item': this.onCompletedUpdate.bind(this),
			'completed-all': this.onCompletedAll.bind(this),
			'destroy-all': this.onCompletedDestroyAll.bind(this),
			'title-dbclick-item': this.onEditSave.bind(this),
		};
		const fn = methodsHash[item.props().type];
		fn(item);
	}

	onKeyPressed(item) {
		const keyPressed = item.event.key;
		if (keyPressed === 'Enter') {
			const titleText = item.srcElement.el.value;
			this.onEditSave(titleText);
		} else if (keyPressed === 'Escape') {
			this.props.el$('input.edit').el.value = this.props.titleEl.el.textContent;
			item.event.preventDefault();
			this.onEditChangeState(false);
		}
	}

	onEditOpen() {
		this.onEditChangeState(true);
	}

	onEditClose() {
		this.onEditChangeState(false);
	}

	onEditBlurEvent(p) {
		let val = p.event.target.value;
		this.onEditSave(val);
	}

	onEditChangeState(bool = true) {
		this.props.el$.toggleClass('editing', bool);
		if (bool === true) {
			this.props.el$('input.edit').el.focus();
		}
	}

	onEditSave(txt) {
		if (txt==='') {
			this.disposeViewStream();
		} else {
			this.props.titleEl.el.textContent = txt;
			this.onEditChangeState(false);
		}
	}

	onCompletedAll(item) {
		this.props.checkBox.el.checked = item.srcElement.el.checked;
		this.toggleCompletedState(item);
	}

	onCompletedUpdate() {
		this.toggleCompletedState();
	}

	onCompletedDestroyAll() {
		if (this.props.checkBox.el.checked === true) {
			this.disposeViewStream();
		}
	}

	onCompletedInit() {
		this.props.el$('input.toggle').el.checked = this.props.data.completed;
	}

	toggleCompletedState() {
		this.props.el$.toggleClass('completed', this.props.checkBox.el.checked);
	}

	onRendered() {
		this.props.el$.toggleClass('completed', this.props.data.completed);
		this.props.checkBox = this.props.el$('input.toggle');
		this.props.titleEl = this.props.el$('div label');
		this.onCompletedInit();
		this.addChannel('CHANNEL_UI');
		this.addChannel('CHANNEL_MODEL');
	}
};
