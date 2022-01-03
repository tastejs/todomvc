// snapshot of MIT licensed https://thelanding.page/tag.bundle.js
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 3 | 8;
		return v.toString(16);
	});
}
const CACHE = "CACHE";
function createStore(initialState = {
}, notify = ()=>null
	, save = ()=>null
) {
	let state = {
		[CACHE]: {
		},
		...initialState
	};
	const context = {
		set: function(schema, payload, handler = defaultHandler) {
			if (typeof handler === 'function') {
				const newCache = touchCache(state[CACHE], schema);
				const newResource = handler(state[schema] || {
				}, payload);
				state = {
					...state,
					[CACHE]: newCache,
					[schema]: newResource
				};
				save(schema, state[schema]);
				notify(state);
			} else {
				console.error('No Resource Handler provided: ', schema, payload);
			}
		},
		get: function(schema) {
			return state[schema];
		}
	};
	return context;
}
function touchCache(state, schema) {
	return {
		...state,
		[schema]: uuidv4()
	};
}
function defaultHandler(state, payload) {
	return {
		...state,
		...payload
	};
}
const databaseName = 'ion';
const storeName = 'cache';
const database = new Promise(function initialize(resolve, reject) {
	const request = indexedDB.open(databaseName, 1);
	request.onupgradeneeded = function(event) {
		const database = event.target.result;
		database.createObjectStore(storeName, {
			keyPath: 'schema',
			autoIncrement: false
		});
	};
	request.onsuccess = function(event) {
		resolve(event.target.result);
	};
});
async function load(keys) {
	const db = await database;
	const transaction = db.transaction(storeName);
	const objectStore = transaction.objectStore(storeName);
	const rows = await new Promise(function loadFromDatabase(resolve, reject) {
		const rows = [];
		const read = objectStore.openCursor();
		read.onsuccess = function(event) {
			let cursor = event.target.result;
			if (cursor) {
				if (keys.includes(cursor.key)) {
					rows.push(cursor.value);
				}
				cursor.continue();
			} else {
				resolve(rows);
			}
		};
		read.onerror = reject;
	});
	return rows;
}
async function save(schema, data) {
	const db = await database;
	const record = {
		schema,
		data
	};
	const transaction = db.transaction(storeName, 'readwrite');
	const objectStore = transaction.objectStore(storeName);
	let request;
	return new Promise(function saveToDatabase(resolve, reject) {
		try {
			request = objectStore.get(schema);
			request.onsuccess = function(event) {
				const request = objectStore.put(record);
				request.onsuccess = resolve;
			};
		} catch (e) {
			const request = objectStore.add(record);
			request.onsuccess = resolve;
			request.onerror = reject;
		}
	});
}
const __default = {
	save,
	load
};
const renderEvent = new Event('render');
let selectors = [];
function observe(selector) {
	selectors = [
		...selectors,
		selector
	];
	render();
}
function disregard(selector) {
	const index = selectors.indexOf(selector);
	if (index >= 0) {
		selectors = [
			...selectors.slice(0, index),
			...selectors.slice(index + 1)
		];
	}
}
function render(_state) {
	const subscribers = getSubscribers(document);
	dispatchRender(subscribers);
}
function getSubscribers(node) {
	if (selectors.length > 0) return [
		...node.querySelectorAll(selectors.join(', '))
	];
	else return [];
}
function dispatchRender(subscribers) {
	subscribers.map((s)=>s.dispatchEvent(renderEvent)
	);
}
const config = {
	childList: true,
	subtree: true
};
function mutationObserverCallback(mutationsList, observer) {
	const subscriberCollections = [
		...mutationsList
	].map((m)=>getSubscribers(m.target)
	);
	subscriberCollections.forEach(dispatchRender);
}
const observer = new MutationObserver(mutationObserverCallback);
observer.observe(document.body, config);
function listen(type, selector, handler, scope) {
	const callback = (event)=>{
		if (event.target && event.target.matches && event.target.matches(selector)) {
			handler.call(this, event, scope);
		}
	};
	document.addEventListener(type, callback, true);
	return function unlisten() {
		document.removeEventListener(type, callback, true);
	};
}
function on(type, selector, handler) {
	const unbind = listen(type, selector, handler, this);
	if (type === 'render') {
		observe(selector);
	}
	return function unlisten() {
		if (type === 'render') {
			disregard(selector);
		}
		unbind();
	};
}
let lastState = {
};
let subscribers = [
	render
];
const notify = (state)=>{
	lastState = state;
	subscribers.map(function notifySubscriber(notify) {
		notify(state);
	});
};
const store = createStore({
}, notify, __default.save);
const ion = {
	set: store.set,
	get: store.get,
	load: function load(schema) {
		__default.load(schema).then(function restoreFromCache(rows) {
			rows.map(({ schema , data  })=>store.set(schema, data)
			);
		});
	},
	restore: function restore(schema) {
		return __default.load(schema).then(function restoreFromCache(rows) {
			const row = rows.find((x)=>x.schema === schema
			) || {
				data: {
				}
			};
			return row.data;
		});
	},
	relay: function relay(subscriber) {
		subscribers = [
			...subscribers,
			subscriber
		];
		subscriber(lastState);
	}
};
ion.on = on.bind(ion);
let virtualDOM;
const render1 = (target, html)=>{
	if (virtualDOM) {
		virtualDOM(target, html);
	} else {
		target.innerHTML = html;
	}
};
async function html(slug, callback) {
	ion.on('render', slug, (event)=>{
		const { loaded  } = get(slug);
		if (!loaded) return;
		const html = callback(event.target);
		if (html) render1(event.target, html);
	});
	const { innerHTML  } = await import('https://esm.sh/diffhtml');
	virtualDOM = innerHTML;
}
function css(slug, stylesheet) {
	const styles = `
		<style type="text/css" data-tag=${slug}>
			${stylesheet.replace(/&/gi, slug)}
		</style>
	`;
	document.body.insertAdjacentHTML("beforeend", styles);
}
function get(slug) {
	return ion.get(slug) || {
	};
}
function set(slug, payload, middleware) {
	ion.set(slug, payload, middleware);
}
function on1(slug, eventName, selector, callback) {
	ion.on(eventName, `${slug} ${selector}`, callback);
}
function restore(slug, initialState) {
	const promise = ion.restore(slug);
	promise.then((state)=>{
		set(slug, {
			...initialState,
			...state,
			loaded: true
		});
	});
	set(slug, initialState);
	return promise;
}
function tag(slug, initialState = {
}) {
	restore(slug, initialState);
	return {
		css: css.bind(null, slug),
		get: get.bind(null, slug),
		on: on1.bind(null, slug),
		html: html.bind(null, slug),
		restore: restore.bind(null, slug),
		set: set.bind(null, slug),
		slug
	};
}
export { tag as default };
