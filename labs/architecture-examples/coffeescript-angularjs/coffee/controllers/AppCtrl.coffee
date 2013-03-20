'use strict'


angular.module('controller.AppCtrl', [])

	.controller 'AppCtrl', ($scope, $location, filterFilter, storage) ->

		$location.path '/' unless $location.path()

		angular.extend $scope, {

			location: $location

			list: storage.get()

			editedTodo: null

			totalCount: ->
				@list.length

			completedCount: ->
				filterFilter(@list, completed: true).length

			remainingCount: ->
				@totalCount() - @completedCount()

			addItem: (title) ->
				return unless title

				@list.push {title, completed: false}

				@draft = ''

			removeItem: (item) ->
				@list.splice(ind, 1) for val, ind in @list when val is item

			editItem: (item) ->
				@editedTodo = item

			doneEditing: (item) ->
				@removeItem item unless item.title

				@editedTodo = null

			markAll: (hasChecked) ->
				for item in @list
					item.completed = hasChecked

			clearCompleteditems: ->
				@list = filterFilter @list, completed: false

		}

		$scope.$watch 'remainingCount()', (value) ->
			$scope.allChecked = !value

		$scope.$watch 'list',
			(value) -> storage.put value
			true

		$scope.$watch 'location.path()', (value) ->
			$scope.statusFilter = switch value
				when '/active'    then completed: false
				when '/completed' then completed: true
				else null
