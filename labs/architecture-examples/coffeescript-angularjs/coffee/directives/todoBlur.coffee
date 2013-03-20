'use strict'


angular.module('directive.todoBlur', [])

	.directive 'todoBlur', ->
		(scope, elem, attrs) ->
			elem.bind 'blur', ->
				scope.$apply attrs.todoBlur
