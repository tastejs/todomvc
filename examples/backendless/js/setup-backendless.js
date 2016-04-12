(function() {
  var APP_ID = '12263E91-25F9-BD60-FFC4-F1DC7F5CFF00';
  var JS_SECRET_KEY = '3AF97D1C-0429-FF22-FFD3-96AC22C03E00';
  var APP_VERSION = 'v1';

  //initialize Backendless
  Backendless.initApp(APP_ID, JS_SECRET_KEY, APP_VERSION);

  //check if logged user is valid
  if (!Backendless.UserService.isValidLogin()) {
    try {
      Backendless.UserService.logout();
    } catch (e) {
    }

    //if current user is not exist or is not valid, we need to register and login a new Backendless user
    createAndLoginUser();
  }

  function createAndLoginUser() {
    //create a new Backendless user
    var user = new Backendless.User();

    // create a random and uniq user name
    var userName = user.name = guid();

    // create a random user password
    var userPass = user.password = guid();

    //register a new user
    Backendless.UserService.register(user);

    //login new created user and keep it logged, event if you refreshed browser page the user stay logged
    Backendless.UserService.login(userName, userPass, true);
  }

  function guid() {
    return s4() + s4() + s4() + s4() + '-' + (new Date()).getTime();
  }

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
})();