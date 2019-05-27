const Channel = window.spyne.Channel;
const ChannelPayloadFilter = window.spyne.ChannelPayloadFilter;

window.TodosModel = class TodosModel extends Channel {
	constructor(name, props = {}) {
		props.sendCachedPayload = true;
		super(name, props);
		this.STORAGE_KEY = 'todos-spyne';
		this.localStorageObj = this.getStorageItems();
	}

	onRegistered() {
		this.sendChannelPayload('CHANNEL_MODEL_INIT_TODOS_EVENT', this.localStorageObj);
		this.addLifecycleChannel();
		this.addWindowChannels();
		window.setTimeout(this.onWindowUpdate.bind(this), 5);
	}

	addLifecycleChannel() {
		this.getChannel('CHANNEL_LIFECYCLE').
				subscribe(this.onWindowUpdate.bind(this));
	}

	addWindowChannels() {
		const beforeBrowserClosesPayloadFilter = new ChannelPayloadFilter( '',
			{action: 'CHANNEL_WINDOW_BEFOREUNLOAD_EVENT'});

		this.getChannel('CHANNEL_WINDOW', beforeBrowserClosesPayloadFilter)
		.subscribe(this.onMapItemsToLocalstorage.bind(this));



		const documentClickedPayloadFilter = new  ChannelPayloadFilter('', {
			action: (str) =>  ['CHANNEL_WINDOW_CLICK_EVENT',
				                 'CHANNEL_WINDOW_CHANGE_EVENT',
				                 'CHANNEL_MODEL_CLICK_EVENT'].indexOf(str)>=0
		});

			this.getChannel('CHANNEL_WINDOW', documentClickedPayloadFilter)
			.subscribe(this.onWindowUpdate.bind(this));

	}

	onWindowUpdate(e) {
			let windowAction = e !== undefined ? e.action : 'CHANNEL_MODEL_STATE_EVENT';
			let action = windowAction === 'CHANNEL_WINDOW_CLICK_EVENT' ? 'CHANNEL_MODEL_CLICK_EVENT' : 'CHANNEL_MODEL_STATE_EVENT';
			let todosLen = document.querySelectorAll('.todo-list li').length;
			let todosCompletedLen = document.querySelectorAll('.todo-list li.completed').length;
			let todosAreEmpty = todosLen <= 0;
			let allCompleted = todosLen === todosCompletedLen;
			let toggleAllCheck = allCompleted === true ? todosAreEmpty !== true : document.querySelector('#toggle-all').checked;
			this.sendChannelPayload(action, {
				todosLen,
				todosCompletedLen,
				allCompleted,
				toggleAllCheck,
				todosAreEmpty
			});

	}


	onMapItemsToLocalstorage(p){
		let data = this.createLocalStorageDataFromTodosEl(p);
		this.setStorage(data);
	}

	createLocalStorageDataFromTodosEl() {
		const getDataFromEl = (acc, el) => {
			let title = String(el.innerText).replace(/\n/gm, '');
			let completed = el.querySelector('div input.toggle').checked;
			acc.push({title, completed});
			return acc;
		};
		let todoListElArr = Array.from(document.querySelectorAll('.todo-list li'));
		return todoListElArr.reduce(getDataFromEl, []);
	}

	addRegisteredActions() {
		return [
			'CHANNEL_MODEL_INIT_TODOS_EVENT',
			'CHANNEL_MODEL_CLICK_EVENT',
			'CHANNEL_MODEL_STATE_EVENT'
		];
	}

	getStorageItems() {
		return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) ||
				this.setStorage();
	}

	setStorage(obj = []) {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(obj));
		return obj;
	}
};
