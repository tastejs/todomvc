/// <reference path="../node_modules/backendless/libs/backendless.d.ts" />

(function () {
	var APP_ID:string = '12263E91-25F9-BD60-FFC4-F1DC7F5CFF00';
	var JS_SECRET_KEY:string = '3AF97D1C-0429-FF22-FFD3-96AC22C03E00';
	var APP_VERSION:string = 'v1';

	//initialize Backendless
	Backendless.initApp(APP_ID, JS_SECRET_KEY, APP_VERSION);
})();
