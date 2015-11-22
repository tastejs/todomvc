/*global angular */

/**
 * Services that persists and retrieves jobs from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */
angular.module('tasker')
	.factory('jobStorage', function ($http, $injector) {
		'use strict';

		// Detect if an API backend is present. If so, return the API module, else
		// hand off the localStorage adapter
		return $http.get('/api')
			.then(function () {
				return $injector.get('api');
			}, function () {
				return $injector.get('localStorage');
			});
	})

	.factory('api', function ($resource) {
		'use strict';

		var store = {
			jobs: [],

			api: $resource('/api/jobs/:id', null,
				{
					update: { method:'PUT' }
				}
			),

			clearCompleted: function () {
				var originalJobs = store.jobs.slice(0);

				var incompleteJobs = store.jobs.filter(function (job) {
					return !job.completed;
				});

				angular.copy(incompleteJobs, store.jobs);

				return store.api.delete(function () {
					}, function error() {
						angular.copy(originalJobs, store.jobs);
					});
			},

			delete: function (job) {
				var originalJobs = store.jobs.slice(0);

				store.jobs.splice(store.jobs.indexOf(job), 1);
				return store.api.delete({ id: job.id },
					function () {
					}, function error() {
						angular.copy(originalJobs, store.jobs);
					});
			},

			get: function () {
				return store.api.query(function (resp) {
					angular.copy(resp, store.jobs);
				});
			},

			insert: function (job) {
				var originalJobs = store.jobs.slice(0);

				return store.api.save(job,
					function success(resp) {
						job.id = resp.id;
						store.jobs.push(job);
					}, function error() {
						angular.copy(originalJobs, store.jobs);
					})
					.$promise;
			},

			put: function (job) {
				return store.api.update({ id: job.id }, job)
					.$promise;
			}
		};

		return store;
	})

	.factory('localStorage', function ($q) {
		'use strict';

		var STORAGE_ID = 'jobs-angularjs';

		var store = {
			jobs: [],

			_getFromLocalStorage: function () {
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},

			_saveToLocalStorage: function (jobs) {
				localStorage.setItem(STORAGE_ID, JSON.stringify(jobs));
			},

			clearCompleted: function () {
				var deferred = $q.defer();

				var incompleteJobs = store.jobs.filter(function (job) {
					return !job.completed;
				});

				angular.copy(incompleteJobs, store.jobs);

				store._saveToLocalStorage(store.jobs);
				deferred.resolve(store.jobs);

				return deferred.promise;
			},

			delete: function (job) {
				var deferred = $q.defer();

				store.jobs.splice(store.jobs.indexOf(job), 1);

				store._saveToLocalStorage(store.jobs);
				deferred.resolve(store.jobs);

				return deferred.promise;
			},

			get: function () {
				var deferred = $q.defer();

				angular.copy(store._getFromLocalStorage(), store.jobs);
				deferred.resolve(store.jobs);

				return deferred.promise;
			},

			insert: function (job) {
				var deferred = $q.defer();

				store.jobs.push(job);

				store._saveToLocalStorage(store.jobs);
				deferred.resolve(store.jobs);

				return deferred.promise;
			},

			put: function (job, index) {
				var deferred = $q.defer();

				store.jobs[index] = job;

				store._saveToLocalStorage(store.jobs);
				deferred.resolve(store.jobs);

				return deferred.promise;
			}
		};

		return store;
	});
