/*global define */
'use strict';

define([
	'data/todos',
	'data/stats',
	'ui/new_item',
	'ui/todo_list',
	'ui/stats',
	'ui/main_selector',
	'ui/toggle_all'
], function (TodosData, StatsData, NewItemUI, TodoListUI, StatsUI, MainSelectorUI, ToggleAllUI) {
	var initialize = function () {
		StatsData.attachTo(document);
		TodosData.attachTo(document);
		NewItemUI.attachTo('#new-todo');
		MainSelectorUI.attachTo('#main');
		StatsUI.attachTo('#footer');
		ToggleAllUI.attachTo('#toggle-all');
		TodoListUI.attachTo('#todo-list');
	};

	return {
		initialize: initialize
	};
});
