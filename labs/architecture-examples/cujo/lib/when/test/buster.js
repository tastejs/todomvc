(function() {

var tests, config;

tests = ['test/*.js'];
config = {};

config['node'] = {
	environment: 'node',
	rootPath: '../',
	tests: tests
};

config['browser'] = {
	environment: 'browser',
	rootPath: '../',
	tests: tests,
	sources: [ 'when.js', 'apply.js', 'delay.js', 'timeout.js', 'cancelable.js' ]
};

if(typeof module != 'undefined') {
	module.exports = config;
}

})();
