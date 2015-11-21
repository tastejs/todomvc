/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the jobStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('tasker')
	.controller('JobCtrl', function JobCtrl($scope, $routeParams, $filter, store) {
		'use strict';

		var jobs = $scope.jobs = store.jobs;

		$scope.newJob = '';
		$scope.editedJob = null;

		$scope.$watch('jobs', function () {
			$scope.remainingCount = $filter('filter')(jobs, { completed: false }).length;
			$scope.completedCount = jobs.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

		// Monitor the current route for changes and adjust the filter accordingly.
		$scope.$on('$routeChangeSuccess', function () {
			var status = $scope.status = $routeParams.status || '';
			$scope.statusFilter = (status === 'active') ?
				{ completed: false } : (status === 'completed') ?
				{ completed: true } : {};
		});

		$scope.addJob = function () {
			var newJob = {
				title: $scope.newJob.trim(),
				completed: false
			};

			if (!newJob.title) {
				return;
			}

			$scope.saving = true;
			store.insert(newJob)
				.then(function success() {
					$scope.newJob = '';
				})
				.finally(function () {
					$scope.saving = false;
				});
		};

		$scope.editJob = function (job) {
			$scope.editedJob = job;
			// Clone the original job to restore it on demand.
			$scope.originalJob = angular.extend({}, job);
		};

		$scope.saveEdits = function (job, event) {
			// Blur events are automatically triggered after the form submit event.
			// This does some unfortunate logic handling to prevent saving twice.
			if (event === 'blur' && $scope.saveEvent === 'submit') {
				$scope.saveEvent = null;
				return;
			}

			$scope.saveEvent = event;

			if ($scope.reverted) {
				// Job edits were reverted-- don't save.
				$scope.reverted = null;
				return;
			}

			job.title = job.title.trim();

			if (job.title === $scope.originalJob.title) {
				$scope.editedJob = null;
				return;
			}

			store[job.title ? 'put' : 'delete'](job)
				.then(function success() {}, function error() {
					job.title = $scope.originalJob.title;
				})
				.finally(function () {
					$scope.editedJob = null;
				});
		};

		$scope.revertEdits = function (job) {
			jobs[jobs.indexOf(job)] = $scope.originalJob;
			$scope.editedJob = null;
			$scope.originalJob = null;
			$scope.reverted = true;
		};

		$scope.removeJob = function (job) {
			store.delete(job);
		};

		$scope.saveJob = function (job) {
			store.put(job);
		};

		$scope.toggleCompleted = function (job, completed) {
			if (angular.isDefined(completed)) {
				job.completed = completed;
			}
			store.put(job, jobs.indexOf(job))
				.then(function success() {}, function error() {
					job.completed = !job.completed;
				});
		};

		$scope.clearCompletedJobs = function () {
			store.clearCompleted();
		};

		$scope.markAll = function (completed) {
			jobs.forEach(function (job) {
				if (job.completed !== completed) {
					$scope.toggleCompleted(job, completed);
				}
			});
		};
	});
