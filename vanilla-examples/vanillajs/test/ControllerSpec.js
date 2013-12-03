/*global app, jasmine, describe, it, beforeEach, expect */

describe('controller', function () {
    'use strict';

    var subject, model, view;

    var setUpModel = function (todos) {
        model.read.andCallFake(function (query, callback) {
            callback = callback || query;
            callback(todos);
        });

        model.getCount.andReturn({
            active: todos.filter(function (todo) {
                    return !todo.completed;
                }).length,
            completed: todos.filter(function (todo) {
                    return !!todo.completed;
                }).length,
            total: todos.length
        });

        model.remove.andCallFake(function (id, callback) {
            callback();
        });

        model.create.andCallFake(function (title, callback) {
            callback();
        });
    };

    var createViewStub = function () {
        var eventRegistry = {};
        return {
            render: jasmine.createSpy('render'),
            bind: function (event, handler) {
                    eventRegistry[event] = handler;
                },
            trigger: function (event, parameter) {
                eventRegistry[event](parameter);
            }
        };
    };

    beforeEach(function () {
        model = jasmine.createSpyObj('model', ['read', 'getCount', 'remove', 'create']);
        view = createViewStub();
        subject = new app.Controller(model, view);
    });

    it('should show entries on start-up', function () {
        setUpModel([]);

        subject.setView('');

        expect(view.render).toHaveBeenCalledWith('showEntries', []);
    });

    it('should show all entries', function () {
        var todo = {title: 'my todo'};
        setUpModel([todo]);

        subject.showAll();

        expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });

    it('should show active entries', function () {
        var todo = {title: 'my todo', completed: false};
        setUpModel([todo]);

        subject.showActive();

        expect(model.read).toHaveBeenCalledWith({completed: 0}, jasmine.any(Function));
        expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });

    it('should show completed entries', function () {
        var todo = {title: 'my todo', completed: true};
        setUpModel([todo]);

        subject.showCompleted();

        expect(model.read).toHaveBeenCalledWith({completed: 1}, jasmine.any(Function));
        expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });

    it('should show the content block when todos exists', function () {
        setUpModel([{title: 'my todo', completed: true}]);

        subject.setView('');

        expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
            visible: true
        });
    });

    it('should hide the content block when no todos exists', function () {
        setUpModel([]);

        subject.setView('');

        expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
            visible: false
        });
    });

    it('should check the toggle all button, if all todos are completed', function () {
        setUpModel([{title: 'my todo', completed: true}]);

        subject.setView('');

        expect(view.render).toHaveBeenCalledWith('toggleAll', {
            checked: true
        });
    });

    it('should set the "clear completed" button', function () {
        var todo = {id: 42, title: 'my todo', completed: true};
        setUpModel([todo]);

        subject.setView('');

        expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
            completed: 1,
            visible: true
        });
    });

    it('should highlight "All" filter by default', function () {
        setUpModel([]);

        subject.setView('');

        expect(view.render).toHaveBeenCalledWith('setFilter', '');
    });

    it('should highlight "Active" filter when switching to active view', function () {
        setUpModel([]);

        subject.setView('active');

        expect(view.render).toHaveBeenCalledWith('setFilter', 'active');
    });

    describe('new todo', function () {
        it('should add a new todo to the model', function () {
            setUpModel([]);

            subject.setView('');

            view.trigger('newTodo', 'a new todo');

            expect(model.create).toHaveBeenCalledWith('a new todo', jasmine.any(Function));
        });

        it('should add a new todo to the view', function () {
            setUpModel([]);

            subject.setView('');

            view.render.reset();
            model.read.reset();
            model.read.andCallFake(function (callback) {
                callback([{
                    title: 'a new todo',
                    completed: false
                }]);
            });

            view.trigger('newTodo', 'a new todo');

            expect(model.read).toHaveBeenCalled();

            expect(view.render).toHaveBeenCalledWith('showEntries', [{
                title: 'a new todo',
                completed: false
            }]);
        });

        it('should clear the input field when a new todo is added', function () {
            setUpModel([]);

            subject.setView('');

            view.trigger('newTodo', 'a new todo');

            expect(view.render).toHaveBeenCalledWith('clearNewTodo');
        });
    });

    describe('element removal', function () {
        it('should remove an entry from model', function () {
            var todo = {id: 42, title: 'my todo', completed: true};
            setUpModel([todo]);

            subject.setView('');
            subject.removeItem(42);

            expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
        });

        it('should remove an entry from the view', function () {
            var todo = {id: 42, title: 'my todo', completed: true};
            setUpModel([todo]);

            subject.setView('');
            subject.removeItem(42);

            expect(view.render).toHaveBeenCalledWith('removeItem', 42);
        });

        it('should update the element count', function () {
            var todo = {id: 42, title: 'my todo', completed: true};
            setUpModel([todo]);

            subject.setView('');
            subject.removeItem(42);

            expect(view.render).toHaveBeenCalledWith('updateElementCount', 0);
        });
    });
});
