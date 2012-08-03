define( [ "troopjs-core/component/widget", "troopjs-core/store/local", "jquery", "template!./item.html" ], function ListModule(Widget, store, $, template) {
	var ENTER_KEY = 13;
	var FILTER_ACTIVE = "filter-active";
	var FILTER_COMPLETED = "filter-completed";

	function filter(item, index) {
		return item === null;
	}

	return Widget.extend(function ListWidget(element, name) {
		var self = this;

		// Defer initialization
		$.Deferred(function deferredInit(deferInit) {
			// Defer get
			$.Deferred(function deferredGet(deferGet) {
				store.get(self.config.store, deferGet);
			})
			.done(function doneGet(items) {
				// Set items (empty or compacted) - then resolve
				store.set(self.config.store, items === null ? [] : $.grep(items, filter, true), deferInit);
			});
		})
		.done(function doneInit(items) {
			// Iterate each item
			$.each(items, function itemIterator(i, item) {
				// Append to self
				self.append(template, {
					"i": i,
					"item": item
				});
			});
		})
		.done(function doneInit(items) {
			self.publish("todos/change", items);
		});
	}, {
		"hub/todos/add" : function onAdd(topic, title) {
			var self = this;

			// Defer set
			$.Deferred(function deferredSet(deferSet) {
				// Defer get
				$.Deferred(function deferredGet(deferGet) {
					store.get(self.config.store, deferGet);
				})
				.done(function doneGet(items) {
					// Get the next index
					var i = items.length;

					// Create new item, store in items
					var item = items[i] = {
						"completed": false,
						"title": title
					};

					// Append new item to self
					self.append(template, {
						"i": i,
						"item": item
					});

					// Set items and resolve set
					store.set(self.config.store, items, deferSet);
				});
			})
			.done(function doneSet(items) {
				self.publish("todos/change", items);
			});
		},

		"hub/todos/mark" : function onMark(topic, value) {
			this.$element.find(":checkbox").prop("checked", value).change();
		},

		"hub/todos/clear" : function onClear(topic) {
			this.$element.find(".completed .destroy").click();
		},

		"hub:memory/todos/filter" : function onFilter(topic, filter) {
			var $element = this.$element;

			switch (filter) {
			case "/completed":
				$element
					.removeClass(FILTER_ACTIVE)
					.addClass(FILTER_COMPLETED);
				break;

			case "/active":
				$element
					.removeClass(FILTER_COMPLETED)
					.addClass(FILTER_ACTIVE);
				break;

			default:
				$element.removeClass([FILTER_ACTIVE, FILTER_COMPLETED].join(" "));
			}
		},

		"dom/action.change.click.dblclick.focusout.keyup" : $.noop,

		"dom/action/status.change" : function onStatus(topic, $event, index) {
			var self = this;
			var $target = $($event.target);
			var completed = $target.prop("checked");

			// Update UI
			$target
				.closest("li")
				.toggleClass("completed", completed)
				.toggleClass("active", !completed);

			// Defer set
			$.Deferred(function deferredSet(deferSet) {
				// Defer get
				$.Deferred(function deferredGet(deferGet) {
					store.get(self.config.store, deferGet);
				})
				.done(function doneGet(items) {
					// Update completed
					items[index].completed = completed;

					// Set items and resolve set
					store.set(self.config.store, items, deferSet);
				});
			})
			.done(function doneSet(items) {
				self.publish("todos/change", items);
			});
		},

		"dom/action/delete.click" : function onDelete(topic, $event, index) {
			var self = this;

			// Update UI
			$($event.target)
				.closest("li")
				.remove();

			// Defer set
			$.Deferred(function deferredSet(deferSet) {
				// Defer get
				$.Deferred(function deferredGet(deferGet) {
					// Get the items
					store.get(self.config.store, deferGet);
				})
				.done(function doneGet(items) {
					// Delete item
					items[index] = null;

					// Set items and resolve set
					store.set(self.config.store, items, deferSet);
				});
			})
			.done(function doneSet(items) {
				self.publish("todos/change", items);
			});
		},

		"dom/action/prepare.dblclick" : function onPrepare(topic, $event, index) {
			var self = this;

			// Get LI and update
			var $li = $($event.target)
				.closest("li")
				.addClass("editing");

			// Get INPUT and disable
			var $input = $li
				.find("input")
				.prop("disabled", true);

			// Defer get
			$.Deferred(function deferredGet(deferGet) {
				// Get items
				store.get(self.config.store, deferGet);
			})
			.done(function doneGet(items) {
				// Update input value, enable and select
				$input
					.val(items[index].title)
					.removeProp("disabled")
					.focus();
			})
			.fail(function failGet() {
				$li.removeClass("editing");
			});
		},

		"dom/action/commit.keyup" : function onCommitKeyUp(topic, $event) {
			switch($event.originalEvent.keyCode) {
			case ENTER_KEY:
				$($event.target).focusout();
			}
		},

		"dom/action/commit.focusout" : function onCommitFocusOut(topic, $event, index) {
			var self = this;
			var $target = $($event.target);
			var title = $target.val().trim();

			if (title === "") {
				$target
					.closest("li.editing")
					.removeClass("editing")
					.find(".destroy")
					.click();
			}
			else {
				// Defer set
				$.Deferred(function deferredSet(deferSet) {
					// Disable
					$target.prop("disabled", true);

					// Defer get
					$.Deferred(function deferredGet(deferGet) {
						// Get items
						store.get(self.config.store, deferGet);
					})
					.done(function doneGet(items) {
						// Update text
						items[index].title = title;

						// Set items and resolve set
						store.set(self.config.store, items, deferSet);
					});
				})
				.done(function doneSet(items) {
					// Update UI
					$target
						.closest("li")
						.removeClass("editing")
						.find("label")
						.text(title);

					self.publish("todos/change", items);
				})
				.always(function alwaysSet() {
					// Enable
					$target.removeProp("disabled");
				});
			}
		}
	});
});
