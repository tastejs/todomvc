var hashMatch = require('./');
var router = require('wayfarer')({qs: false});

router.default('/');

router.route('/', function () {
  console.log('root route');
  
  setTimeout(function () {
    window.location.hash = '/wat';
  }, 2000);
});

router.route('/wat', function () {
  console.log('wat');
  
  setTimeout(function () {
    window.location.hash = '/wee';
  }, 2000);
});

router.route('/wee', function () {
  console.log('weeeeeing');
});

router.match(hashMatch(window.location.hash));

window.addEventListener('hashchange', function (e) {
  router.match(hashMatch(window.location.hash));
});