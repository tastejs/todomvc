(function (window) {
	'use strict';
	var $ = window.$;
	var RenderModel = window.RenderModel;
	var MultitabModel = window.MultitabModel;

	// Your starting point. Enjoy the ride!
	var listTmpl = $('#listTmpl').html();
	var counterTmpl = $('#couterTmpl').html();

	// The Models are relationship with Mutex
	var route = new MultitabModel();

	var conter = new RenderModel({
			tmpl: counterTmpl,
			data: {
					num: 0
				},
			el: '.todo-count',
			onreset: function () {
				$(this.el).html('');
			}
		});
	// RenderModel is a Rendering Model
	var allList = new RenderModel({
		data: JSON.parse(window.localStorage.getItem('todo-abstract.js')) || {
			list: []
		},
		el: '#todo-list',
		onreset: function () {
					var activeList = this.data.list.filter(function (item) {
							return !item.finished;
						});

					if (this.data.list.length) {
						$('.main,.footer').show();
					}else {
						$('.main,.footer').hide();
					}

					if (this.data.list.length - activeList.length) {
						$('.clear-completed').show();
					}else {
						$('.clear-completed').hide();
					}

					if (activeList.length) {
						$('.toggle-all').prop('checked', false);
					}else {
						$('.toggle-all').prop('checked', true);
					}

					conter.data.num = activeList.length;
					conter.refresh();

					window.localStorage.setItem('todo-abstract.js', JSON.stringify(this.data));
				},

		tmpl: listTmpl,
		events: function () {
				var self = this;
				var input = $('.new-todo');

				input.on('keydown', function (e) {
					var text = input.val();
					if (e.keyCode === 13 && text.trim()) {
						self.data.list = self.data.list.concat({
								name: text,
								finished: false
							});

						input.val('');

						route.refresh();
					}
				});

				$(this.el).on('click', '.destroy', function () {
						var index = $(this).closest('li').data('index');

						self.data.list.splice(index, 1);

						route.refresh();
					});

				$(this.el).on('click', '.toggle', function () {
						var index = $(this).closest('li').data('index');

						self.data.list[index].finished  = !self.data.list[index].finished;

						route.refresh();
					});

				$('.clear-completed').on('click', function () {
						var activeList = self.data.list.filter(function (item) {
								return !item.finished;
							});

						self.data.list = activeList;

						route.refresh();
					});

				$('.toggle-all').on('click', function () {
						var isAllChecked = $(this).prop('checked') ? true : false;

						self.data.list.map(function (item) {
								item.finished = isAllChecked;
							});

						route.refresh();
					});

				$(this.el).on('dblclick', 'li', function () {
						$(this).addClass('editing');
						$(this).find('.edit').focus();
					});

				$(this.el).on('click', '.edit', function (e) {
						e.stopPropagation();
					});

				var lastKeyCode;
				$(this.el).on('focus', '.edit', function () {
						lastKeyCode = null;
					});

				$(this.el).on('keydown', '.edit', function (e) {
							var index = $(this).closest('li').data('index');
							var text = $(this).val();

							lastKeyCode = e.keyCode;
							if (e.keyCode === 13 && text.trim()) {
								self.data.list[index].name = text;

								route.refresh();
							}else if (e.keyCode === 27) {
								route.refresh();
							}
						});

				$(window).on('click', function () {
						var editing = $('.editing');
						if (editing.length) {
							var index = editing.data('index');
							var text = editing.find('.edit').val();

							if (text.trim()) {
								self.data.list[index].name = text;

								route.refresh();
							}

							$('.editing').removeClass('editing');
						}
					});

				$(this.el).on('blur', '.editing', function () {
						var editing = $(this);

						if (editing.length && lastKeyCode !== 27) {
							var index = editing.data('index');
							var text = editing.find('.edit').val();

							if (text.trim()) {
								self.data.list[index].name = text;

								route.refresh();
							}

							$('.editing').removeClass('editing');
						}
					});

			}
	});



	// activeList is another RenderModel extending from allList
	var activeList = allList.extend({
			processData: function (data) {
					var activeList = data.list.filter(function (item) {
							return !item.finished;
						});

					return {
							list: activeList
						};
				}
		});

	// completedList is another RenderModel extending from allList
	var completedList = allList.extend({
		processData: function (data) {
					var activeList = data.list.filter(function (item) {
							return item.finished;
						});

					return {
							list: activeList
						};
				}
	});

	// Telling the relationships between Models

	route.add('#all', allList);
	route.add('#active', activeList);
	route.add('#completed', completedList);

	route.init(window.location.hash.replace('/', ''));

	$(window).on('hashchange', function () {
			route.switchTo('#' + (window.location.hash.replace('#/', '') || 'all'));
		});

	// Starting App
	route.rock();

})(window);
