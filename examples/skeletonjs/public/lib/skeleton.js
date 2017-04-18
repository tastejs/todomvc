var Skeleton = (function() {

/*********
   Model
 *********/
function Model(attributes) {

	// Make sure initialized
	if(!(this instanceof Model)) {
		return new Model(attributes);
	}

	if(!(attributes && attributes.defaults)) {
		throw new Error('A "defaults" field must be passed') ;
	}

	// model class
	function model(options) {

		let _attrs = Object.assign({}, attributes.defaults) || {};

		this.get = function(attr) {
			return _attrs[attr] || null;
		}

		this.set = function() {
			if(arguments.length === 2) {
				_attrs[arguments[0]] = arguments[1];
			}
			else if(arguments.length === 1) {
				let obj = arguments[0];
				for(let key in obj) {
					_attrs[key] = obj[key];
				}
			}
			else {
				throw new Error('Error on setting a value');
			}
		}

		// get json representation of the model
		this.toJSON = function() {
			return _attrs;
		}

		// set attributes
		for(let opt in options) {
			this.set(opt, options[opt]);
		}

		// call init
		if(attributes && attributes.init) {
			attributes.init.call(this);
		}

	}

	// set additional methods to model
	for(let attr in attributes) {
		if(attr !== 'init' && attr !== 'defaults') {
			model.prototype[attr] = attributes[attr];
		}
	}

	return model;
}


/**********
    View
 **********/
 function List(attributes) {

 	// Make sure initialized
	if(!(this instanceof List)) {
		return new List(attributes);
	}

 	const re = /{{\s*((\w+\.?\w+?)*\s*\|?\s*\w+)\s*}}/g; 
 	const re_exp = /{{\s*(\w+)*\s*\?\s*\w+\s*:\s*\w+\s*}}/g; 
 	const re_loop = /{{\s*#\s*((\w+\.?\w+?)*\s*\|?\s*\w+)\s*}}/g;

 	let _index = 0;
 	
 	let _listeners = { // Each array contains functions to run
 		push: [],
 		remove: [],
 		filter: [],
 		sort: [],
 		pushAll: [],
 		removeAll: [],
 		edit: []
 	};

 	let _customFilters = {
 		upper(txt) {
 			return txt.toUpperCase();
 		},
 		lower(txt) {
 			return txt.toLowerCase();
 		},
 		capitalize(txt) {
 			return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
 		},
 		currency(txt) {
 			return '$' + txt;
 		},
 		json(txt) {
 			try {
				txt = JSON.stringify(txt);
			}
			catch(e) {
				throw new Error('The argument passed can not be stringified to a json string');
			}
			return txt;		
 		}
 	}; 

 	let _model = attributes && attributes.model;
 	let _element = document.getElementById(attributes && attributes.element);
 	let _template;

 	let temp = attributes && attributes.template;
 	if(typeof(temp) === 'string') {
 		_template = temp;
 	}
 	else if(typeof(temp) === 'object') {
 		if(!temp.templateId) {
 			throw new Error('Template must be a string, or an object with "templateId" field');
 		}
 		else {
 			_template = document.getElementById(temp.templateId).innerHTML;
 		}
 	}

 	if(!_model) {
 		throw new Error('A model must be supplied');
 	}
 	if(!_element) {
 		throw new Error('An element must be supplied, provided by its id');
 	}
 	if(!_template) {
 		throw new Error('A template id or string must be supplied');
 	}

 	let self = this;

 	let _collection = {}; // {index: model}

 	// get collection of model types
 	this.getCollection = function() {
 		return Object.keys(_collection).map(index => _collection[index]);
 	}

 	// get collection of objects
 	this.models = function() {
 		return Object.keys(_collection).map(index => _collection[index].toJSON());
 	}

 	// append array of objects that
 	// represent models to the list
 	this.pushAll = function(models) {
 		models.forEach(model => {
 			model.index = _generateIndex();
 			_collection[model.index] = new _model(model);
 		});
 		_element.innerHTML += _renderTemplate();
 		_notifyListeners('pushAll', this.models());
 	}

 	// push to end of the list
 	this.push = function(model) {
		_addModel(model, 'push');
 	}

 	// push to begining of the list
 	this.unshift = function(model) {
 		_addModel(model, 'unshift');
 	}

 	// remove single model and return it
 	this.remove = function(index) {
 		if(!_collection[index]) {
 			return;
 		}
 		let model = _collection[index];
 		delete _collection[index];
 		_removeModelAndRender(index);
 		_notifyListeners('remove', model);
 		return model;
 	}

 	// get max index
 	this.lastIndex = function() {
 		if(this.size() === 0) {
 			return -1;
 		}
 		return _index-1;
 	}

 	// get min index
 	this.firstIndex = function() {
 		let indexes = Object.keys(_collection);
 		if(!indexes.length)
 			return -1;
 		return Math.min.apply(null, indexes);
 	}

 	// clear list and notify listeners
 	this.removeAll = function() {
 		_collection = {};
 		_element.innerHTML = '';
 		_notifyListeners('removeAll');
 	}

 	// get model object by index
 	this.get = function(index) {
  		if(!_collection[index]) {
  			return null;
  		}
  		return _collection[index].toJSON();
 	}

 	// get number of models in the list
 	this.size = function() {
 		return Object.keys(_collection).length;
 	}

 	// filter models and render
 	this.filter = function(cbk) {
 		let coll = this.models().filter(cbk);
 		_element.innerHTML = _renderTemplate(coll);
 		_notifyListeners('filter', coll);
 		return coll;
 	}

 	// sort models and render
 	this.sort = function(sorter) {
 		sorter = sorter || function(a,b){return a.index - b.index;};
 		let sorted = this.models().sort(sorter);
 		let sortedCollection = {};
 		sorted.forEach(model => {
 			sortedCollection[model.index] = _collection[model.index];
 		});
 		_collection = sortedCollection;
 		_element.innerHTML = _renderTemplate(sorted); // render
 		_notifyListeners('sort', sorted);
 		return sorted;
 	}

 	// go over models
 	this.forEach = function(cbk) {
 		this.models().forEach(cbk);
 	}

 	// edit a field in the model and replace it in the list
 	this.edit = function(index, options) {
 		if(!options) {
 			return;
 		}
 		let model = _collection[index];
 		for(let key in options) {
 			model.set(key, options[key]);
 		}
 		let modelJSON = model.toJSON();
 		let html = _renderLoop(_renderModel(modelJSON), modelJSON);
 		let newEl = _htmlToElement(html);
 		_replaceModel(index, newEl); // render
 		_notifyListeners('edit', modelJSON);
 	}

 	// add filter to be used by pipe in the template
 	this.addFilter = function(filterName, filterCbk) {
 		if(typeof(filterName) !== 'string') {
 			throw new Error('Filter name must be a string');
 		}
 		if(typeof(filterCbk) !== 'function') {
 			throw new Error('Filter callback must be a function');
 		}
 		_customFilters[filterName] = filterCbk;
 	}

 	// subscribe to event
 	this.subscribe = function() {
 		if(arguments.length === 1 && typeof(arguments[0]) === 'function') {
 			let listener = arguments[0];
 			_listeners['push'].push(listener);
 			_listeners['remove'].push(listener);
 			return () => { // unsubscription
 				unsubscribe('push', listener);
 				unsubscribe('remove', listener);
 			}
 		}
 		else if(arguments.length === 2) {
 			let type = arguments[0];
 			let listener = arguments[1];
 			if(Array.isArray(type)) {
 				type.forEach(t => {
	 	 			if(_listeners[t]) {
	 					_listeners[t].push(listener);		
	 				}	
	 				else {
	 					throw new Error('type ' + t + ' is not a possible type. possible types: "push", "remove", "filter", "sort", "edit", "pushAll", "removeAll"');
	 				}	
 				});
 				return () => type.forEach(t => unsubscribe(t, listener)) // unsubscription
 			}
 			else {
	 			if(_listeners[type]) {
	 				_listeners[type].push(listener);
		 			return () => unsubscribe(type, listener) // unsubscription
	 			}
 				throw new Error('type ' + type + ' is not a possible type. possible types: "push", "remove", "filter", "sort", "edit", "pushAll", "removeAll"');	
 			}
 		}
 		else {
 			throw new Error('You should pass a callback function or a type "push" or "remove" and a callback to subscribe');
 		}
 		// Give a way to unsubscribe
 		function unsubscribe(type, listener) {
			for(let i=0; i<_listeners[type].length; i++) {
				if(_listeners[type][i] === listener) {
					_listeners[type].splice(i,1);
					break;
				}
			}
		}
 	}

 	/****************************
 	    List Private Functions
 	 ***************************/
 	function _notifyListeners(type, param) {
 		if(!type) {
 			_listeners.push.forEach(listener => listener(param));
 			_listeners.remove.forEach(listener => listener(param));
 		}
 		else if(_listeners[type]) {
 			_listeners[type].forEach(listener => listener(param));
 		}
 		else {
 			throw new Error('The type passed is not a possible type');
 		}
 	}

 	function _addModel(model, method) {
  		if(!(model instanceof _model)) {
 			model = new _model(model);
 		}
 		let index = _generateIndex();
 		model.set('index', index);
 		let modelJSON = model.toJSON();
 		_collection[index] = model;
 		_updateSingleModelView(modelJSON, method);
 		_notifyListeners('push', modelJSON);
 	}

 	function _replaceModel(index, newEl) {
 		let attr = '[data-id="' + index + '"]';
 		let el = _element.querySelector(attr);
 		if(!el) {
 			throw new Error('Make sure your you set a "data-id" attribute to each model');
 		}
 		_element.replaceChild(newEl, el);
 	}

 	function _updateSingleModelView(model, method) {
 		let el = _htmlToElement(_renderLoop(_renderModel(model), model));
 		if(method === 'push') {
 			_element.appendChild(el);
 		}
 		else if(method === 'unshift') {
 			_element.insertBefore(el, _element.childNodes[0]);
 		}
 		else {
 			throw new Error('unknown method passed to "_updateSingleModelView"');
 		}
 	}

 	function _removeModelAndRender(index) {
 		let attr = '[data-id="' + index + '"]';
 		let el = _element.querySelector(attr);
 		if(!el) {
 			return;
 		}
 		el.remove();
 	}

 	function _renderTemplate(coll) {
 		let collection = coll || self.models();
 		let templateString = '';
 		collection.forEach(model => {
 			templateString += _renderLoop(_renderModel(model), model);
 		});
 		return templateString;
 	}

 	function _renderLoop(template, model) {
 		let el;
 		if(typeof(template) === 'string') {
 			el = _htmlToElement(template);
 		}
 		let domElements = el.querySelectorAll('[data-loop]');
 		if(!domElements || !domElements.length) // no data-loop
 			return template;
 		Array.prototype.slice.call(domElements).forEach((dElement,i) => {
	 		let attr = dElement.getAttribute('data-loop').trim();
	 		let arr = model[attr];
	 		if(!arr) { // no attribute in model
	 			throw new Error(attr + ' attribute does not appear in model');
	 		}
	 		if(!Array.isArray(arr)) {
	 			throw new Error(attr + '\'s value must be an array');
	 		}
	 		let dElementHtml = _elementToHtml(dElement);
	 		let temp = '';
	 		arr.forEach(obj => {
		 		temp += dElementHtml.replace(re_loop, (str,g) => {
		 			if(g.indexOf('|') !== -1) {
		 				return _filterize(obj, g);
		 			}
		 			return _resolveNestedObject(obj, g);
		 		});
	 		});
	 		template = template.replace(dElementHtml, temp);
	 	});
 		return template;
 	}

 	function _renderModel(model) {
 		let temp = _template;
 		temp = temp.replace(re, (str,g) => {
 			if(g.indexOf('|') !== -1) {
 				return _filterize(model, g);
 			}
 			return _resolveNestedObject(model, g);
 		});
 		temp = _evaluateChecked(model, temp);
 		return temp;
 	}

 	function _filterize(model, g) {
		let parts = g.split('|');
		let txt = parts[0].trim();
		let filter = parts[1].trim();
		let txtToRender = _resolveNestedObject(model, txt); // resolve nested object
		if(!txtToRender) {
			throw new Error('Please check the expression "' + txt + '" you passed in the template');
		}
		if(_customFilters[filter]) {
			return _customFilters[filter](txtToRender);
		}
		throw new Error('The filter you are using does not exist. Please use "addFilter" function to create it.');
 	}

 	function _evaluateChecked(model, template) {
 		let element = _htmlToElement(template);
 		let checked = element.querySelectorAll('[data-checked]');
 		if(!checked || !checked.length) {
 			return template;
 		}
 		Array.prototype.slice.call(checked).forEach(el => {
 			let expression = el.getAttribute('data-checked').trim();
 			let isChecked = model[expression] ? true : false;
 			if(isChecked) {
 				el.setAttribute('checked', 'checked');
 			}
 			else {
 				if(el.getAttribute('checked')) {
 					el.removeAttribute('checked');
 				}
 			}
 		});
 		return _elementToHtml(element);
 	}

 	function _resolveNestedObject(model, input) {
 		if(input === 'this')
 			return model;
		let nestedObjectArray = input.split('.');
		if(nestedObjectArray.length === 1) {
			return model[input];
		}
		else {
			let txtToRender = model[nestedObjectArray[0].trim()];
			for(var i=1; i<nestedObjectArray.length; i++) {
				txtToRender = txtToRender[nestedObjectArray[i].trim()];
			}
			return txtToRender;
		}
 	}

 	function _generateIndex() {
 		return _index++;
 	}

 	function _elementToHtml(el) {
 		let div = document.createElement('div');
 		div.appendChild(el);
 		return div.innerHTML;
 	}

 	function _htmlToElement(html) {
		let div = document.createElement('div');
		div.innerHTML = html;
		return div.firstElementChild;
	}

 }

 /*******************
 	Skeleton Router
  *******************/
function Router() {

	if(!(this instanceof Router)) {
		return new Router();
	}

	if(!window)
		throw new Error('I only run on the browser!');
	window.onpopstate = function() {
		return pathUpdated();
	}

	var params = {};
	var handlers = {};	

	var pathUpdated = function() {
		var handler;
		var match = 0;
		var path = location.pathname;
		var parts = path.split('/').slice(1);

		for(route in handlers) {
			if(match == 1)
				break;
			
			handler = handlers[route];
			route = route.split(',');
			if(route.length != parts.length) {
				continue;
			}
			for(var i=0; i<route.length; i++) {
				var r = route[i];
				if(r[0] == ':') {
					match = 1;
					params[r.slice(1)] = parts[i];
				}
				else {
					if(r == parts[i]) {
						match = 1;
						continue;
					}
					else {
						match = 0;
						params = {};
						handler = null;
						break;
					}
				}
			}
		}

		if(!handler)
			throw new Error('No handler set for this route!');
		handler(params);
		return params = {};
	}

	this.path = function(destination, handler) {
		handlers[destination.split('/').slice(1)] = handler;
	}

	this.visit = function(destination) {
		history.pushState(null,null,destination);
		return pathUpdated();
	}

}

/***************************************
    Skeleton Storage Helper Functions
 ***************************************/
function _stringifyValue(value) {
	try {
		value = JSON.stringify(value);
		return value;	
	}
	catch(e) {
		return value;
	}	
}

function _parseValue(value) {
	try {
		value = JSON.parse(value);
		return value;	
	}
	catch(e) {
		return value;
	}	
}

/***********************
    Skeleton Storage
 ***********************/
let storage = {
	save() {
	 	if(window.localStorage) {
	 		if(arguments.length === 2) {
	 			let key = arguments[0];
	 			let value = arguments[1];
	 			if(typeof(key) !== 'string') {
	 				throw new Error('First item must be a string');
	 			}
	 			value = _stringifyValue(value);
	 			window.localStorage.setItem(key, value);
	 		}
	 		else if(arguments.length === 1 && typeof(arguments[0]) === 'object') {
	 			let pairs = arguments[0];
	 			for(let key in pairs) {
	 				let value = pairs[key];
	 				value = _stringifyValue(value);
	 				window.localStorage.setItem(key, value);
	 			}
	 		}
	 		else {
	 			throw new Error('Method save must get key an value, or an object of keys and values');
	 		}
	 	}
	 },

	fetch(key) {
	 	if(window.localStorage) {
	 		let value = window.localStorage.getItem(key);
	 		if(!value) {
	 			return null;
	 		}
	 		return _parseValue(value);
	 	}
	 },

	clear() {
	 	if(window.localStorage) {
	 		window.localStorage.clear();
	 	}
	}
}

/*************************
    Skeleton Form/Input
 ************************/
let inputObservables = {}; // {id: element}
let formObservables = {}; // {name: observablesObject}

function input(id, cbk, evt='keyup') {
	let el = document.getElementById(id);
	if(!el) {
		throw new Error(`The id '${id}' does not match any dom element`);
	}
	if(el.nodeName !== 'INPUT' && el.nodeName !== 'TEXTAREA') {
		throw new Error(`The id '${id}' must match an input or textarea element`);
	}
	inputObservables[id] = el;
	if(cbk) {
		el.addEventListener(evt, cbk);
	}
}
input.get = (id) => {
	let el = inputObservables[id];
	if(!el) {
		throw new Error(`The id '${id}' was not set to be cached. Please use the 'input' function first`);
	}
	return el.value;
}

input.set = (id, val) => {
	let el = inputObservables[id];
	if(!el) {
		throw new Error(`The id '${id}' was not set to be cached. Please use the 'input' function first`);
	}
	el.value = val;
}

input.clear = (id) => {
	if(id) {
		inputObservables[id].value = '';
	}
	else {
		Object.keys(inputObservables).forEach(id => input.set(id, ''));
	}
}

function form(options) {
	if(!options.name) {
		throw new Error('Skeleton.form must recieve a "name" field with the form\'s name');
	}
	let name = options.name;
	let form = document.querySelector(`form[name='${name}']`);
	if(!form) {
		throw new Error('No form element with name ' + name);
	}
	let formObj = {};
	formObj.name = options.name;
	let inputs = options.inputs;
	if(inputs) {
		for(let key in inputs) {
			let id = inputs[key];
			let el = form.querySelector(`#${id}`);
			if(!el) {
				throw new Error('No element with id ' + id);
			}
			if(el.nodeName !== 'INPUT' && el.nodeName !== 'TEXTAREA') {
				throw new Error(`The id '${id}' must match an input or textarea element`);
			}
			formObj[key] = el;
		}
	}
	if(!options.submit) {
		throw new Error('"submit" button id or event key code and input field must be supplied');
	}
	if(!options.onSubmit) {
		throw new Error('"onSubmit" method must be supplied');
	}
	formObservables[name] = formObj; // set form to form observables
	if(options.submit.input && options.submit.keyCode) {
		let inputField = options.submit.input;
		let keyCode = options.submit.keyCode;
		if(!inputField) {
			throw new Error('Please supply input element to trigger submit event on by its field');
		}
		if(!keyCode) {
			throw new Error('Please supply keyCode to fire event on');
		}
		formObservables[name][inputField].addEventListener('keydown', (e) => {
			if(e.keyCode === keyCode) {
				e.preventDefault();
				options.onSubmit.call(formObservables[name], e);
			}
		});
	}
	else {
		let submitButton = document.getElementById(options.submit);
		if(!submitButton) {
			throw new Error('Id passed as submit button id does not exist');
		}
		submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			options.onSubmit.call(formObservables[name], e);
		});
	}
}

form.clear = (name) => {
	let obs = formObservables[name];
	if(!obs) {
		throw new Error(`The name ${name} is not recognized as a form name`);
	}
	for(let key in obs) {
		let el = obs[key];
		if(el.nodeName && (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA')) {
			el.value = '';
		}
	}
}

/********************
    Skeleton Bind
 ********************/
function bind(textNodeId) {
	let txtNode = document.getElementById(textNodeId);
	if(!txtNode) {
		throw new Error(textNodeId + ' id does not match any element');
	}
	return {
		to() {
			let ids = Array.prototype.slice.call(arguments);
			let inputElements = ids.map(inputElementId => {
				let inputNode = document.getElementById(inputElementId);
				if(!inputNode || !(inputNode.nodeName === 'INPUT' || inputNode.nodeName === 'TEXTAREA')) {
					throw new Error(inputElementId + ' id does not match any element or the element it matches is not input or textarea element');
				}	
				return inputNode;
			});
			return {
				exec(cbkFunc, evt='keyup') {
					for(let i=0; i<inputElements.length; i++) {
						let inputNode = inputElements[i];
						inputNode.addEventListener(evt, (e) => {
							let values = inputElements.map(el => {
								let value = el.value;
								if(!value) {
									return '';
								}
								return value;
							});
							txtNode.textContent = cbkFunc.apply(null, values);
						});
					}
				}
			}
		}
	}
}

/************
    Return
 ************/
return {
	Model,
	List,
	Router,
	storage,
	form, 
	input,
	bind
}

})();

