(function() {
	var todoView = Stapes.create(),
		todoTmpl,
		ENTER_KEY_KEYCODE = 13;

	function bindEventHandlers() {
		$("#new-todo").on('keyup', function(e) {
			var todoVal = $(this).val();

			if (e.which === ENTER_KEY_KEYCODE && todoVal !== "") {
				e.preventDefault();
				todoView.emit('todoadd', todoVal);
			}
		});

		$("#todo-list").on('click', '.destroy', function() {
			todoView.emit('tododelete', $(this).parents('li').data('id'));
		});

		$("#todo-list").on('click', 'input.toggle', function(e) {
			var event = $(this).is(':checked') ? 'todocompleted' : 'todouncompleted';
			todoView.emit(event, $(this).parents('li').data('id'));
		});

		$("#todo-list").on('dblclick', 'li', function(e) {
			todoView.emit('edittodo', $(this).data('id'));
		});

		$("#todo-list").on('keyup', 'input.todo-input', function(e) {
			if (e.which === 13) {
				e.preventDefault();
				todoView.emit('todoedit', {
					id : $(this).parents("li").data('id'),
					title : $(this).val()
				});
			}
		});

		$("#clear-completed").on('click', function() {
			todoView.emit('clearcompleted');
		});

		$("#toggle-all").on('click', function() {
			var isChecked = $(this).is(':checked');
			todoView.emit( isChecked ? 'completedall' : 'uncompletedall', isChecked === true);
		});

		window.onhashchange = function() {
			var hash = window.location.hash.replace('#/', '');

			// If we get the 'all' menu item we don't get anything in the hash,
			// so we need to do this...
			hash = (hash === "") ? "all" : hash;
			todoView.emit('statechange', hash);
		}
	}

	function loadTemplates() {
		todoTmpl = Handlebars.compile( $("#todo-template").html() );
	}

	todoView.extend({
		"clearInput": function() {
			$("#new-todo").val('');
		},

		"hide": function() {
			$("#main, #footer").hide();
		},

		"init": function() {
			bindEventHandlers();
			loadTemplates()
			this.emit('ready');
		},

		"render": function(todos) {
			var html = todoTmpl({ "todos" : todos });
			$("#todo-list").html( html );
		},

		"show": function() {
			$("#main, footer").show();
		},

		"showClearCompleted": function(completed) {
			var bool = completed > 0;
			$("#clear-completed").toggle(bool);
			$("#clear-completed").html('Clear completed (' + completed + ')');
		},

		"showLeft": function(left) {
			var word = (left === 1) ? "item" : "items";
			$("#todo-count").html('<strong>' + left + '</strong> ' + word + ' left');
		}
	});

	window.TodoView = todoView;
})();