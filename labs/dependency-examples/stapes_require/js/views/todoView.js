'use strict';
define(['Stapes'], function(Stapes) {
	var todoView = Stapes.create(),
		todoTmpl,
		ENTER_KEY_KEYCODE = 13;

	function bindEventHandlers() {
		$('#new-todo').on('keyup', function(e) {
			var todoVal = $.trim($(this).val());

			if (e.which === ENTER_KEY_KEYCODE && todoVal !== '') {
				e.preventDefault();
				todoView.emit('todoadd', todoVal);
			}
		});

		$('#todo-list').on('click', '.destroy', function() {
			todoView.emit('tododelete', $(this).parents('li').data('id'));
		});

		$('#todo-list').on('click', 'input.toggle', function(e) {
			var event = $(e.target).is(':checked') ? 'todocompleted' : 'todouncompleted';
			todoView.emit(event, $(this).parents('li').data('id'));
		});

		$('#todo-list').on('dblclick', 'label', function(e) {
			todoView.emit('edittodo', $(this).closest('li').data('id'));
		});

		$('#todo-list').on('keyup focusout', 'input.edit', function(e) {
			if (e.type === 'keyup') {
				if (e.which === ENTER_KEY_KEYCODE) {
					e.preventDefault();
				} else {
					return false;
				}
			}

			todoView.emit('todoedit', {
				id : $(this).parents('li').data('id'),
				title : $.trim($(this).val())
			});
		});

		$('#clear-completed').on('click', function() {
			todoView.emit('clearcompleted');
		});

		$('#toggle-all').on('click', function() {
			var isChecked = $(this).is(':checked');
			todoView.emit( isChecked ? 'completedall' : 'uncompletedall', isChecked);
		});

		window.onhashchange = function() {
			todoView.emit('statechange', todoView.getState());
		};
	}

	function loadTemplates() {
		todoTmpl = Handlebars.compile( $('#todo-template').html() );
	}

	todoView.extend({
		'clearInput': function() {
			$('#new-todo').val('');
		},

		'getState': function() {
			return window.location.hash.replace('#/', '') || 'all';
		},

		'hide': function() {
			$('#main, #footer').hide();
		},

		'init': function() {
			bindEventHandlers();
			loadTemplates();
			this.emit('ready');
		},

		'makeEditable' : function(id) {
			// Zepto is a little quirky here and both doesn't accept filter()
			// and $('#todo-list li[data-id=' + id + ']') :(
			var $item;

		 	$('#todo-list li').each(function() {
				if ($(this).data('id') === id) $item = $(this);
			});

			$item.addClass('editing').find('input.edit').focus();
		},

		'render': function(todos) {
			var html = todoTmpl({ 'todos' : todos });
			$('#todo-list').html( html );
		},

		'setActiveRoute': function(route) {
			// 'all' doesnt have a href="#/all"
			route = (route === 'all') ? '' : route;
			$('#filters a').removeClass('selected').filter('[href="#/' + route + '"]').addClass('selected');
		},

		'show': function() {
			$('#main, footer').show();
		},

		'showClearCompleted': function(completed) {
			var bool = completed > 0;
			$('#clear-completed').toggle(bool);
			$('#clear-completed').html('Clear completed (' + completed + ')');
		},

		'showLeft': function(left) {
			var word = (left === 1) ? 'item' : 'items';
			$('#todo-count').html('<strong>' + left + '</strong> ' + word + ' left');
			$("#toggle-all").get(0).checked = (left === 0);
		}
	});

	return todoView;
});
