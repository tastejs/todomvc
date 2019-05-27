(function() {
	'use strict';
	const spyne = window.spyne;
	const Todo = window.Todo;
	const TodosModel = window.TodosModel;
	// config file for window and route channels
	const spyneAppConfig = {
		channels: {
			WINDOW: {
				events: ['beforeunload', 'change', 'click'],
			},

			ROUTE: {
				type: 'hash',
				routes: {
					routePath: {
						routeName: 'hashVal',
						home: ''
					},
				},
			},
		},
	};

	// intialize the app
	 let Spyne = new spyne.SpyneApp(spyneAppConfig);

	class App extends spyne.ViewStream {
		constructor(props = {}) {
			// create main view and set el as .todoapp
			props.el = document.querySelector('.todoapp');
			super(props);
		}

		// listen to these elements from this view
		// using the 'local' flag will only broadcast these items to this view
		broadcastEvents() {
			return [
				['.new-todo', 'keyup', 'local'],
				['#toggle-all', 'click'],
				['button.clear-completed', 'click'],
			];
		}

		// listen to these channel actions and bind to these methods
		addActionListeners() {

			let filterNewTodo = spyne.ChannelPayloadFilter ('.new-todo', {
				event: (evt) =>  evt.key === 'Enter',
				el:    (e) => e.value.length>=0
			});

			return [
				['CHANNEL_ROUTE_.*', 'onRouteChanged'],
				['CHANNEL_UI_KEYUP_EVENT', 'addTodo', filterNewTodo],
				['CHANNEL_MODEL_STATE_EVENT', 'onUpdateUI'],
				['CHANNEL_MODEL_INIT_TODOS_EVENT', 'onTodosInit'],
				['CHANNEL_MODEL_TODO_REMOVED_EVENT', 'onUpdateUI'],
			];
		}

		onRouteChanged(p) {
			const selectedClass =  p.props().routeData.hashVal;
			this.props.el$('ul.todo-list').setClass(`todo-list ${selectedClass}`);
			this.onUpdateMenu(selectedClass);
		}

		onUpdateMenu(route) {
			this.props.el$('footer ul li a').setActiveItem('selected', `[data-route=${route}]`);
		}

		onTodosInit(p) {
			const {payload} = p;
			const addTodo = data => this.appendView(new Todo({data}), '.todo-list');
			payload.forEach(addTodo);
			this.onUpdateFooter(p);
		}

		addTodo(item) {
			let props = item.props();
			let title = props.el.value;
			let completed = false;
			let data = {title, completed};
			this.appendView(new Todo({data}), '.todo-list');
			this.clearInput();
		}

		onUpdateUI(channelEvt) {
			let props = channelEvt.props();
			this.onUpdateToggleBtn(props);
			this.onUpdateCheckBoxes(props);
		}

		onUpdateToggleBtn(p) {
			let {toggleAllCheck} = p;
			this.props.el$('#toggle-all').el.checked = toggleAllCheck;
		}

		onUpdateCheckBoxes(p) {
			let {allCompleted} = p;
			this.props.el$('#toggle-all').el.checked = allCompleted;
			this.onUpdateFooter(p);
		}

		onUpdateFooter(p) {
			let {todosLen, todosCompletedLen} = p;
			let todosIncompleteLen = todosLen - todosCompletedLen;
			const itemsStr = todosIncompleteLen === 1 ? ' item left' : ' items left';
			this.props.el$('.main').toggleClass('hide-elements', todosLen === 0);
			this.props.el$('.footer').toggleClass('hide-elements', todosLen === 0);
			this.props.el$('.clear-completed').toggleClass('hide-elements', todosCompletedLen <= 0);
			this.counterText.el.innerHTML = `<strong>${todosIncompleteLen}</strong>${itemsStr}`;
		}

		clearInput() {
			this.props.el$('.new-todo').el.value = '';
		}

		// add needed channels after the view has been rendered
		onRendered() {
			this.counterText = this.props.el$('footer span.todo-count');
			this.addChannel('CHANNEL_UI');
			this.addChannel('CHANNEL_ROUTE');
			this.addChannel('CHANNEL_MODEL');

		}
	}

	// create new channel for the model
	Spyne.registerChannel(new TodosModel('CHANNEL_MODEL'));
	new App();
})();
