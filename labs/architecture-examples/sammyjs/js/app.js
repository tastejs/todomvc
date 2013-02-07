(function($) {
	var ESCAPE_KEY = 13;

	var app = $.sammy(function() {
		this.use(Sammy.Template);

		this.notFound = function(verb, path) {
			this.runRoute('get', '#/404');
		};


		this.get('#/404', function() {
			this.partial('templates/404.template', {}, function(html) {
				$('#todo-list').html(html);
			});
		});

		this.get('#/list/:id', function() {
			var list = Lists.get(this.params['id']);
			if (list) {
				this.partial('templates/todolist.template', {
					list: list,
					todos: Todos.filter('listId', list.id)
				}, function(html) {
					$('#todo-list').html(html);
				});
			} else {
				this.notFound();
			}
		});


		// events
		this.bind('run', function(e, data) {
			var context = this;

			var title = localStorage.getItem('title') || "Todos";
			$('h1').text(title);

			if(Lists._data.length <=0){
				var list = Lists.create({ name: 'My new list' });
				//app.trigger('updateLists');
			}

			$('#new-todo').keydown(function(e) {
				if (e.keyCode == ESCAPE_KEY){
					var todoContent = $(this).val();
					var todo = Todos.create({ name: todoContent, done: false, listId: parseInt($('h2').attr('data-id'), 10) });
					context.partial('templates/todo.template', todo, function(html) {
						$('#todo-list').append(html);

					});
					$(this).val('');

				}
			});




			$('.trashcan')
				.live('click', function() {
					var $this  = $(this);
					app.trigger('delete', {
						type: $this.attr('data-type'),
						id:   $this.attr('data-id')
					});
				});

			//new

		   $('.check')
			   .live('click', function() {
				   var $this  = $(this),
					   $li	  = $this.parents('li').toggleClass('done'),
					   isDone = $li.is('.done');
				   app.trigger('mark' + (isDone ? 'Done' : 'Undone'), { id: $li.attr('data-id') });
			});



			$('[contenteditable]')
				.live('focus', function() {
					// store the current value
					$.data(this, 'prevValue', $(this).text());
				})
				.live('blur', function() {
					var $this = $(this),
						// grab the, likely, modified value
						text = $.trim($this.text());
					if (!text) {
						// restore the previous value if text is empty
						$this.text($.data(this, 'prevValue'));
					} else {
						if ($this.is('h1')) {
							// it is the title
							localStorage.setItem('title', text);
						} else {
							// save it
							app.trigger('save', {
								type: $this.attr('data-type'),
								id: $this.attr('data-id'),
								name: text
							});
						}
					}
				})
				.live('keypress', function(event) {
					// save on enter
					if (event.which === 13) {
						this.blur();
						return false;
					}
				});

			if (!localStorage.getItem('initialized')) {
				// create first list and todo
				var listId = Lists.create({
					name: 'My first list'
				}).id;

				/*
				Todos.create({
					name: 'My first todo',
					done: false,
					listId: listId
				});
				*/

				localStorage.setItem('initialized', 'yup');
				this.redirect('#/list/'+listId);
			} else {
				var lastViewedOrFirstList = localStorage.getItem('lastviewed') || '#/list/' + Lists.first().id;
				this.redirect(lastViewedOrFirstList);
			}

		});

		/*save the route as the lastviewed item*/
		this.bind('route-found', function(e, data) {
			localStorage.setItem('lastviewed', document.location.hash);
		});

		this.bind('save', function(e, data) {
			var model = data.type == 'todo' ? Todos : Lists;
			model.update(data.id, { name: data.name });

		});

		/*marking the selected item as done*/
		this.bind('markDone', function(e, data) {
			Todos.update(data.id, { done: true });
		});

		/*mark the todo with the selected id as not done*/
		this.bind('markUndone', function(e, data) {
			Todos.update(data.id, { done: false });
		});

		this.bind('delete', function(e, data) {
			//if (confirm('Are you sure you want to delete this ' + data.type + '?')) {
				var model = data.type == 'list' ? Lists : Todos;
				model.destroy(data.id);

				if (data.type == 'list') {
					var list = Lists.first();
					if (list) {
						this.redirect('#/list/'+list.id);
					} else {
						// create first list and todo
						var listId = Lists.create({
							name: 'Initial list'
						}).id;
						Todos.create({
							name: 'A sample todo item',
							done: false,
							listId: listId
						});

						this.redirect('#/list/'+listId);
					}
				} else {
					// delete the todo from the view
					$('li[data-id=' + data.id + ']').remove();
				}
		});


	});

	// lists model
	Lists = Object.create(Model);
	Lists.name = 'lists-sammyjs';
	Lists.init();

	// todos model
	Todos = Object.create(Model);
	Todos.name = 'todos-sammyjs';
	Todos.init();


	$(function() { app.run(); });
})(jQuery);
