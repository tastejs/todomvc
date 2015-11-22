angular.module('tasker')
	.service('appStorage', [
		'$rootScope',
		'$firebaseArray',
		'$firebaseObject',
		function ($rootScope, $firebaseArray, $firebaseObject) {
			var JOB_STATUS_OPEN = 'open';
			var JOB_STATUS_APPLIED = 'applied';
			var JOB_STATUS_SELECTED = 'selected';
			var JOB_STATUS_TRAVELLING = 'travelling';
			var JOB_STATUS_STARTED = 'started';
			var JOB_STATUS_FINISHED = 'finished';
			var JOB_STATUS_CLOSED = 'closed';
			var JOB_STATUS_EXPIRED = 'expired';

			var _jobs = $firebaseArray(new Firebase('https://intense-torch-8098.firebaseio.com/tt-jobs'));
			var _applicants = $firebaseObject(new Firebase('https://intense-torch-8098.firebaseio.com/tt-applicants'));
			var _employers = $firebaseObject(new Firebase('https://intense-torch-8098.firebaseio.com/tt-employers'));
			// hack binding
			// _jobs.$bindTo($rootScope, 'appJobs');
			// _applicants.$bindTo($rootScope, 'appApplicants');
			// _employers.$bindTo($rootScope, 'appEmployers');

			function addJob (job) {
				return _jobs.$add(job);
			}

			function updateJob (jobId, jobUpdates) {
				var _jobRef = $firebaseObject(new Firebase('https://intense-torch-8098.firebaseio.com/tt-jobs/' + jobId));
				_jobRef.$loaded()
					.then(function (job) {
						for (var key in jobUpdates) {
							job[key] = jobUpdates[key];
						}
						return job.$save();
					});
			}

			function cancelJob (job) {
				return _jobs.$remove(job);
			}

			function getJobById (jobId) {
				return _jobs.$loaded()
					.then(function (jobs) {
						return jobs.$getRecord(jobId);
					});
			}

			function getJobsByEmployer (employerId) {
				return _jobs.$loaded()
					.then(function (jobs) {
						return jobs.filter(function (job) {  // super inefficient hack
							return (job.employerId === employerId);
						});
					});
			}

			function getAllJobs () {
				return _jobs.$loaded();
			}

			function getAllApplicants () {
				return _applicants.$loaded();
			}

			function getApplicantById (applicantId) {
				return _applicants.$loaded()
					.then(function (applicants) {
						return applicants[applicantId];
					});
			}

			function selectApplicant (jobId, applicantId) {
				var jobUpdate = _jobs.$loaded()
					.then(function (jobs) {
						return jobs.$getRecord(jobId);
					})
					.then(function (job) {
						if (!job) {
							throw new Error('Job not found');
						}

						job.selectedApplicant = applicantId;
						job.status = JOB_STATUS_SELECTED;
						return job.$save();
					});

				var applicantUpdate = _applicants.$loaded()
					.then(function (applicants) {
						return applicants.$getRecord(applicantId);
					})
					.then(function (applicant) {
						if (!applicant) {
							throw new Error('Applicant not found');
						}
						if (!applicant.jobs) {
							applicant.jobs = [];
						}

						applicant.jobs.push(jobId);
						return applicant.$save();
					});

				return Promise.all([
					jobUpdate,
					applicantUpdate
				]);
			}

			return {
				addJob: addJob,
				updateJob: updateJob,
				cancelJob: cancelJob,
				getJobById: getJobById,
				getJobsByEmployer: getJobsByEmployer,
				getAllJobs: getAllJobs,

				getAllApplicants: getAllApplicants,
				getApplicantById: getApplicantById,
				selectApplicant: selectApplicant
			};
		}
	]);
