'use strict'


angular.module('directive.todoFocus', [])

	.directive 'todoFocus', ($timeout) ->
		(scope, elem, attrs) ->
			scope.$watch attrs.todoFocus, (newVal) ->
				return unless newVal

				$timeout (->
					elem[0].focus()
					elem[0].select()
				), 0, false
