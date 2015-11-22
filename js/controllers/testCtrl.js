angular.module('tasker')
  .controller('TestCtrl', [
    '$scope',
    'appStorage',
    function JobCtrl($scope, appStorage) {
      var EMPLOYER_ID = 'demo-employer';  // temp hack

      function init () {
        // load all data variables asynchronously
        appStorage.getAllJobs().then(function (jobs) {
          $scope.jobs = jobs;
        });
        appStorage.getAllApplicants().then(function (applicants) {
          $scope.applicants = applicants;
        });

        // local bindings
        $scope.testNewVars = {};
        $scope.testNewSubmit = scopeTestNewSubmit;
        $scope.testJobDelete = scopeTestJobDelete;
        $scope.employerId = EMPLOYER_ID;
      }

      function scopeTestNewSubmit () {
        $scope.testNewVars.employer = EMPLOYER_ID;
        $scope.testNewVars.date = $scope.testNewVars.date ?
          $scope.testNewVars.date.getTime() : Date.now();

        appStorage.addJob($scope.testNewVars);
        $scope.testNewVars = {};
      }

      function scopeTestJobDelete (e, jobObj) {
        e.preventDefault();
        appStorage.cancelJob(jobObj);
      }

      init();
    }
  ]);
