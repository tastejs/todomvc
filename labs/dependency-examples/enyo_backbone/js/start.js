//Once everything is loaded through enyo's dependency management, start the app
enyo.ready(function () {
    app = new ToDo.Application();
    app.render();
});