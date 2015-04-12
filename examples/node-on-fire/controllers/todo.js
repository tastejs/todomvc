'use strict';

var fire = require('fire');
var app = fire.app('todomvc');

function TodoController($scope, list, $routeParams) {
	$scope.status = $routeParams.status || '';
	$scope.list = list;

	$scope.completeAllItems = function() {
		var completed = true;

		if(!$scope.numberOfUncompletedItems()) {
			completed = false;
		}

		return list.updateItems({completed: !completed}, {completed: completed});
	};

	$scope.createItem = function(name) {
		name = name.trim();

		if(name.length) {
			return list.createItem({name: name}).then(function() {
				$scope.name = '';
			});
		}
	};

	$scope.deleteItem = function(item) {
		return list.removeItem(item);
	};

	$scope.toggleItem = function(item) {
		return item.save();
	};

	$scope.removeCompletedItems = function() {
		return list.removeItems({completed: true});
	};

	$scope.editItem = function(item) {
		$scope.editingItem = item;
	};

	$scope.saveItem = function(item) {
		$scope.editingItem = null;
		item.name = item.name.trim();

		if(!item.name.length) {
			return list.removeItem(item);
		}
		else {
			return item.save();
		}
	};

	$scope.cancelEditingItem = function(item) {
		$scope.editingItem = null;
		return item.cancel();
	};

	$scope.numberOfCompletedItems = function() {
		return list.items.filter(function(item) {
			return item.completed;
		}).length;
	};

	$scope.numberOfUncompletedItems = function() {
		return (list.items.length - $scope.numberOfCompletedItems());
	};
}
app.controller('/', TodoController);
app.controller('/:status', TodoController);

TodoController.prototype.resolve = function() {
	return {
		list: function(TodoListModel, _StorageService) {
			if(_StorageService.get('list')) {
				return TodoListModel.findOne({id: _StorageService.get('list')});
			}
			else {
				return TodoListModel.create({}).then(function(list) {
					_StorageService.set('list', list.id);
					return list;
				});
			}
		}
	};
};
