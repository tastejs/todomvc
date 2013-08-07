describe('controller', function () {
    var subject, model, view;

    beforeEach(function () {
        model = jasmine.createSpyObj('model', ['read']);
        view = jasmine.createSpyObj('view', ['render']);
        subject = new app.Controller(model, view, null);
    });

    it('should show all entries', function () {
        var theEntries = "the entries";

        model.read.andCallFake(function (callback) {
            callback(theEntries);
        });

        subject.showAll();

        expect(view.render).toHaveBeenCalledWith("showEntries", theEntries);
    });
});
