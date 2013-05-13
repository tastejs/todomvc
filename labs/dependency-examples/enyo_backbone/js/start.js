/*jshint strict:false */
/*global enyo:false, ToDo:false */
// Once everything is loaded through enyo's dependency management, start the app
enyo.ready(function () {
	window.app = new ToDo.Application();
	window.app.render();
});
