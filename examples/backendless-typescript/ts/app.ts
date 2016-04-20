/// <reference path="../node_modules/backendless/libs/backendless.d.ts" />
/// <reference path="./app-view.ts" />

var ENTER_KEY:number = 13;
var ESC_KEY:number = 27;

class AppUser extends Backendless.User {
    name:string;
    password:string;
}

(function () {


    //check if logged user is valid
    Backendless.UserService.isValidLogin(new Backendless.Async(startApp, onLoginNotValid));

    function onLoginNotValid():void {
        //if current user login is not valid we need to logout the user and create a new one
        Backendless.UserService.logout(new Backendless.Async(function () {
            //if current user is not exist or is not valid, we need to register and login a new Backendless user
            createAndLoginUser();
        }));
    }

    function createAndLoginUser():void {
        //create a new Backendless user
        var user:AppUser = <AppUser>(new Backendless.User());

        // create a random and uniq user name
        var userName:string = user.name = guid();

        // create a random user password
        var userPass:string = user.password = guid();

        //register a new user
        Backendless.UserService.register(user, new Backendless.Async(function () {
            //login new created user and keep it logged, event if you refreshed browser page the user stay logged
            Backendless.UserService.login(userName, userPass, true, new Backendless.Async(startApp));
        }));
    }

    //just generate random "username" and "password" for a new Backendless User
    function guid():string {
        return s4() + s4() + s4() + s4() + '-' + (new Date()).getTime();
    }

    function s4():string {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    //main entry point
    function startApp():void {
        new AppView();
    }
})();
