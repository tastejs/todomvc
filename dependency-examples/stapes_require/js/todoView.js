define(["lib/stapes", "lib/mustache"], function(Stapes, Mustache) {
	var todoView = Stapes.create(),
		taskTmpl;

	function bindEventHandlers() {
		$("#new-todo").on('keyup', function(e) {
			if (e.which === 13 && $(this).val() !== "") {
				e.preventDefault();
				todoView.emit('taskadd', $(this).val());
			}
		});

		$("#todo-list").on('click', '.destroy', function() {
			todoView.emit('taskdelete', $(this).parents('.item').data('id'));
		});

		$("#todo-list").on('click', 'input.toggle', function(e) {
			var event = $(this).is(':checked') ? 'taskdone' : 'taskundone';
			todoView.emit(event, $(this).parents('.item').data('id'));
		});

		$("#todo-list").on('dblclick', 'li', function(e) {
			todoView.emit('edittodo', $(this).data('id'));
		});

		$("#todo-list").on('keyup', 'input.todo-input', function(e) {
			if (e.which === 13) {
				e.preventDefault();
				todoView.emit('taskedit', {
					id : $(this).parents(".item").data('id'),
					name : $(this).val()
				});
			}
		});

		$("#clear-completed").on('click', function() {
			todoView.emit('clearcompleted');
		});

		$("#toggle-all").on('click', function() {
			var isChecked = $(this).is(':checked');
			todoView.emit( isChecked ? 'doneall' : 'undoneall', isChecked === true);
		});

		window.onhashchange = function() {
			var hash = window.location.hash.replace('#/', '');

			// If we get the 'all' menu item we don't get anything in the hash,
			// so we need to do this...
			hash = (hash === "") ? "all" : hash;
			todoView.emit('statechange', hash);
		}
	}

	function loadTemplates(cb) {
		var root = "//" + window.location.host + window.location.pathname;

		$.get(root + 'templates/task.html', function(tmpl) {
			cb(function(view) {
				return Mustache.to_html(tmpl, view);
			});
		});
	}

	todoView.extend({
		"clearInput" : function() {
			$("#new-todo").val('');
		},

		"hide" : function() {
			$("#main, footer").hide();
		},

		"init" : function() {
			bindEventHandlers();

			loadTemplates(function(tmpl) {
				taskTmpl = tmpl;
				todoView.emit('ready');
			});
		},

		"render" : function(tasks) {
			var html = taskTmpl({ "tasks" : tasks });
			$("#todo-list").html( html );
		},

		"show" : function() {
			$("#main, footer").show();
		},

		"showClearCompleted" : function(completed) {
			var bool = completed > 0;
			$("#clear-completed").toggle(bool);
			$("#clear-completed").html('Clear completed (' + completed + ')');
		},

		"showLeft" : function(left) {
			var word = (left > 1) ? "items" : "item";
			$("#todo-count").html('<strong>' + left + '</strong> ' + word + ' left');
		}
	});

	return todoView;
});