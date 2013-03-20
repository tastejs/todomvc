'use strict'


angular.module('service.storage', [])

	.factory 'storage', -> new class

		STORAGE_ID = 'todos-angularjs-coffeescript'

		allSet: localStorage?.getItem? and JSON?.parse? and JSON?.stringify?

		get: ->
			return [] unless @allSet

			JSON.parse(localStorage.getItem(STORAGE_ID) or '[]')

		put: (data) ->
			return unless @allSet

			localStorage.setItem STORAGE_ID, JSON.stringify(data)
