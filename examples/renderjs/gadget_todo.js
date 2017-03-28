/*global window, rJS, Handlebars, RSVP, Boolean, promiseEventListener */
/*jshint unused:false */
(function(window, rJS, RSVP, Handlebars, Boolean, promiseEventListener) {
	'use strict';

	/////////////////////////////
	// parameters
	/////////////////////////////
	var SELECTED = 'selected';
	var HREF = 'href';
	var ARR = [];
	var JIO_ID = 'data-jio-id';
	var UL = 'ul';
	var LI = 'li';
	var A = 'a';
	var LABEL = 'label';
	var DIV = 'div';
	var DIVI = 'div input';
	var DIVPI = 'div + input';
	var VIEW = 'view';
	var STR = '';
	var TODO = 'todo-item';
	var COMPLETED = ' completed';
	var FILTERS = '.filters a';
	var EDITING = ' editing';
	var HIDDEN = 'hidden';
	var ITEM = ' item left';
	var ITEMS = ' items left';
	var INPUT_SELECTOR = '.new-todo';
	var ALL = '.toggle-all';
	var MAIN = '.main';
	var FOOT = '.footer';
	var COUNT = '.todo-count';
	var SPACE = ' ';
	var LIST = '.todo-list';
	var EDIT = 'edit';
	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;
	var DONE = 'completed';
	var CLEAR = '.clear-completed';

  /////////////////////////////
	// methods
	/////////////////////////////
	function getId(element, traverse) {
		switch (traverse) {
			case 2:
				return element.parentElement.parentElement.getAttribute(JIO_ID);
			case 1:
				return element.parentElement.getAttribute(JIO_ID);
		}
	}

	function getAllChecked(list) {
		return list.reduce(function(pass, item) {
			if (pass === false) {
				return false;
			}
			if (item.completed) {
				return true;
			}
			return false;
		}, true);
	}

	function getElems(element, traverse, target) {
		switch (traverse) {
			case 2:
				return element.parentElement
                      .parentElement.querySelectorAll(target);
			case 0:
				return element.querySelectorAll(target);
		}
	}

	function getElem(element, target) {
		return element.querySelector(target);
	}

	function makeList(nodeList) {
		return ARR.slice.call(nodeList);
	}

	function setTodo(node, item, template) {
		var faux_list = document.createElement(UL);
		faux_list.innerHTML = template(item);
		node.appendChild(faux_list.firstElementChild);
	}

	function setSelectedClass(element) {
		makeList(getElems(element, 2, A))
			.forEach(function(link) {
				link.classList.remove(SELECTED);
				if (link.getAttribute(HREF) === element.getAttribute(HREF)) {
					link.classList.add(SELECTED);
				}
			});
	}

	function removeFromList(list, id) {
		list.forEach(function(item, index, array) {
			if (array[index].id === id) {
				array.splice(index, 1);
			}
		});
	}

	function getObj(list, id) {
		return list.map(function(item) {
			if (item.id === id) {
				return item;
			}
		});
	}

	function setItemClass(o) {
		return TODO +
      (o.completed ? COMPLETED : STR) +
        (o.editing ? EDITING : STR);
	}

	function setHidden(root, hide) {
		return root + (hide ? (SPACE + HIDDEN) : STR);
	}

	function setSelector(id) {
		return 'li[' + JIO_ID + '="' + id + '"] .edit';
	}

	// let's go
	rJS(window)

    /////////////////////////////
		// state
		/////////////////////////////
		.setState({
			create: false,
			update: false,
			clear_input: false,
			editing_jio_id: '',
			query: ''
		})

    /////////////////////////////
		// ready
		/////////////////////////////
		.ready(function() {
			var gadget = this;

      // initialize the router and set the model on the main gadget for 
			// easier reference. Set templates, then render first DOM.
			return new RSVP.Queue()
				.push(function() {
					return gadget.getDeclaredGadget('model');
				})
				.push(function(response) {
					var div = document.createElement(DIV);
					gadget.element.appendChild(div);
					gadget.property_dict = {
						'model': response
					};
					return gadget.declareGadget('gadget_router.html', {
						scope: 'router',
						sandbox: 'public',
						element: div
					});
				})
				.push(function() {
					gadget.template_dict = {
						'list_template': Handlebars.compile(
							document.getElementById('list_template').innerHTML
						),
						'item_template': Handlebars.compile(
							document.getElementById('item_template').innerHTML
						)
					};
					return gadget.changeState({
						'create': true
					});
				});
		})

		/////////////////////////////
		// published methods
		/////////////////////////////

    // router calls to update the DOM land here
		.allowPublicAcquisition('setQuery', function(param_list) {
			this.changeState({
				'query': param_list[0],
				'update': true
			});
		})
 
		/////////////////////////////
		// published methods
		/////////////////////////////
		.declareMethod("storeItem", function(item, jio_id) {
			var gadget = this;
			var model = gadget.property_dict.model;
			if (!item) {
				return;
			}
			return new RSVP.Queue()
				.push(function() {
					if (jio_id) {
						return model.putTodo(jio_id, item);
					}
					return model.postTodo(item);
				})
				.push(function() {
					return gadget.changeState({
						'clear_input': true,
						'update': true
					});
				});
		})
 
		/////////////////////////////
		// onStateChange
		/////////////////////////////
		.onStateChange(function(modification_dict) {
			var gadget = this;
			var state = gadget.state;
			var dict = gadget.property_dict;
			var temp = gadget.template_dict;
			var element = gadget.element;

      // fetch counter dict and todos
			return new RSVP.Queue()
				.push(function() {
					return RSVP.all([
						dict.model.getTodoCountDict(),
						dict.model.getTodos(gadget.state.query)
					]);
				})
				.push(function(response_list) {
					var count_dict = response_list[0];
					var todo_list = response_list[1];
					var plural = todo_list.length === 1 ? ITEM : ITEMS;
					var focus_selector = INPUT_SELECTOR;
					var edit_value = STR;
					var input_value = STR;
					var toggle_all = getElem(element, ALL);
					var all_checked = false;
					var count_content = count_dict.active.toString() + plural;
					var all_completed = count_dict.active === count_dict.total;

          // tick all
					if (toggle_all) {
						toggle_all.checked =
              all_checked =
                getAllChecked(todo_list);
					}

					// keep focus on todo being edited
					if (state.editing_jio_id) {
						focus_selector = setSelector(state.editing_jio_id);
					}

          // set todo being edited
					todo_list.forEach(function(todo) {
						if (todo.id === state.editing_jio_id) {
							todo.editing = true;
							edit_value = todo.title;
						} else {
							todo.editing = false;
						}
					});

          // clear input
          if (!modification_dict.hasOwnProperty('clear_input') &&
						getElem(element, INPUT_SELECTOR)) {
						input_value = getElem(element, INPUT_SELECTOR).value;
					}

          // set initial DOM
					if (modification_dict.hasOwnProperty('create')) {
						getElem(element, '.handlebars').innerHTML =
							temp.list_template({
								'todo_exists': count_dict.total >= 1,
								'todo_count': count_content,
								'all_completed': all_completed,
								'all_checked': getAllChecked(todo_list)
							});
						dict.list = getElem(element, LIST);
						todo_list.forEach(function(item) {
							setTodo(dict.list, item, temp.item_template);
						});
					}

					// Update DOM
					if (modification_dict.hasOwnProperty('update') &&
              dict.list)
          {
						makeList(getElems(dict.list, 0, LI))
              .forEach(function(li) {
                var jio_id = li.getAttribute(JIO_ID);
                var obj = getObj(todo_list, jio_id).filter(Boolean).pop();
                if (obj === undefined) {
                  if (!gadget.state.query) {
                    li.parentElement.removeChild(li);
                  } else {
                    li.classList.add(HIDDEN);
                  }
                } else {
                  li.classList.remove(HIDDEN);
                  li.className = setItemClass(obj);
                  getElem(li, LABEL).textContent = obj.title;
                  getElem(li, DIV).className = setHidden(VIEW, obj.edit);
                  getElem(li, DIVI).checked = obj.completed;
                  getElem(li, DIVPI).className = setHidden(EDIT, !obj.editing);
                }
                removeFromList(todo_list, jio_id);
                return;
            });

						// new items
						todo_list.forEach(function(item) {
							setTodo(dict.list, item, temp.item_template);
						});

            // clear completed
						if (all_completed) {
							getElem(element, CLEAR).classList.add(HIDDEN);
						} else {
							getElem(element, CLEAR).classList.remove(HIDDEN);
						}

            // counter
						if (count_dict.total === 0) {
							getElem(element, MAIN).classList.add(HIDDEN);
							getElem(element, FOOT).classList.add(HIDDEN);
						} else {
							getElem(element, MAIN).classList.remove(HIDDEN);
							getElem(element, FOOT).classList.remove(HIDDEN);
						}
						getElem(element, COUNT).textContent = count_content;
					}

					// if editing, set focus and input value
					if (edit_value) {
						getElem(element, focus_selector).focus();
						getElem(element, focus_selector).value = edit_value;
					}

					// set filter
					makeList(getElems(element, 0, FILTERS))
            .forEach(function(filter) {
              filter.classList.remove(SELECTED);
              if (filter.getAttribute(HREF) === window.location.hash) {
                filter.classList.add(SELECTED);
              }
						});

					// set todo input value
					getElem(element, INPUT_SELECTOR).value = input_value;
					gadget.state.update = false;
					gadget.state.clear_input = false;
					return;
				});
		})

		/////////////////////////////
		// onEvent
		/////////////////////////////

    // new todo
		.onEvent('submit', function(event) {
			return this.storeItem(event.target.elements[0].value.trim());
		}, false, true)
	
    // edit todo
		.onEvent('dblclick', function(event) {
			var gadget = this;
			var dict = gadget.property_dict;
			var target = event.target;
			var jio_id = getId(event.target, 2);
			var input = target.parentElement.nextElementSibling;

      if (target.className !== 'todo-label') {
        return;
      }

      return new RSVP.Queue()
        .push(function() {
          return gadget.changeState({
            'update': true,
            'editing_jio_id': jio_id
          });
        })
        .push(function() {
          dict.defer = new RSVP.defer();

          // ESC resolves the defer and prevents storing
          return RSVP.any([
            dict.defer.promise,
            promiseEventListener(input, 'blur', true)
          ]);
        })
        .push(function(event) {
          var target;

          // defer was here
          if (!event) {
            input.blur();
            return;
          }

          target = event.target;
          if (target.value === '') {
            return dict.model.removeOne(getId(target, 1));
          }
          return gadget.storeItem({
            'title': target.value.trim()
          }, jio_id);
        })
        .push(function() {
          return gadget.changeState({
            'update': true,
            'editing_jio_id': ''
          });
        });
		}, false, false)

    // key inputs
		.onEvent('keydown', function(event) {
			var gadget = this;
			var dict = gadget.property_dict;
			var target = event.target;
			var item;
			var jio_id;

			if (target.className !== EDIT) {
				return;
			}

			if (event.keyCode === ESCAPE_KEY) {
				return new RSVP.Queue()
					.push(function() {
						return gadget.changeState({
							'update': true,
							'editing_jio_id': STR
						});
					})
					.push(function() {
						if (dict.defer) {
							dict.defer.resolve();
						}
					});
			}

			if (event.keyCode === ENTER_KEY) {
				item = target.value.trim();
				if (item) {
					jio_id = getId(target, 1);
					return new RSVP.Queue()
						.push(function() {
							return dict.model.changeTitle(jio_id, item);
						})
						.push(function() {
							return gadget.changeState({
								'update': true,
								'editing_jio_id': STR
							});
						});
				}
				return gadget.changeState({
					'update': true,
					'editing_jio_id': STR
				});
			}
		}, false, false)

		// clickediclick
		.onEvent('click', function(event) {
			var gadget = this;
			return new RSVP.Queue()
				.push(function() {
					var model = gadget.property_dict.model;
					var target = event.target;
					var item = target.parentElement.parentElement;

          switch (target.className) {
						case 'toggle':
							return model.toggleOne(
								getId(target, 2), !item.classList.contains(DONE)
							);
						case 'toggle-all':
							return model.toggleAll(target.checked);
						case 'destroy':
							return model.removeOne(item.getAttribute(JIO_ID));
						case 'clear-completed':
							return model.removeCompleted();

            // filters and exiting edit todo via click
						default:
							if (target.getAttribute(HREF)) {
								setSelectedClass(target);
							}
							if (gadget.state.editing_jio_id &&
								target.className !== EDIT)
              {
								document.activeElement.blur();
								return true;
							}
					}
				})
				.push(function(response) {
					if (response) {
						return gadget.changeState({
							'update': true,
							'editing_jio_id': ''
						});
					}
				});
		}, false, false);

}(window, rJS, RSVP, Handlebars, Boolean, promiseEventListener));
