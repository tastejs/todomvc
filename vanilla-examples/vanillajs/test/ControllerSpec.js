describe('controller', function () {
    var subject, model, view;

    var setupModel = function (todos) {
        model.read.andCallFake(function (callback) {
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
    };

    var elementify = function (ids) {
        return ids.map(function (id) {
            return '<span id="' + id + '"></span>';
        }).join('');
    };

    var fakeDOM = function () {
        var fakeContainerId = 'jasmineTestFake',
            fake = document.querySelector('#' + fakeContainerId) || document.createElement('div');

        fake.id = fakeContainerId;
        fake.style.visibility = 'hidden';

        if (!fake.parentNode) {
            document.body.appendChild(fake);
        }

        fake.innerHTML = elementify(['todo-list', 'todo-count', 'clear-completed', 'toggle-all', 'main', 'footer', 'filters']);
        fake.querySelector('#filters').innerHTML = ['', 'active', 'completed'].map(function (page) {
            return '<a href="#/' + page + '"/>';
        }).join('');
    };

    beforeEach(function () {
        fakeDOM();

        model = jasmine.createSpyObj('model', ['read', 'getCount']);
        view = jasmine.createSpyObj('view', ['render']);
        template = jasmine.createSpyObj('template', ['itemCounter', 'clearCompletedButton']);
        subject = new app.Controller(model, view, template);
    });

    it("should show entries on start-up", function () {
        setupModel([]);

        subject.init();

        expect(view.render).toHaveBeenCalledWith("showEntries", []);
    });

    it('should show all entries', function () {
        var todo = {title: 'my todo'};
        setupModel([todo]);

        subject = new app.Controller(model, view, null);

        subject.showAll();

        expect(view.render).toHaveBeenCalledWith("showEntries", [todo]);
    });
});
