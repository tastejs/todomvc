'use strict';

describe('footerPresenter', function(){
    it('shows the number of active tasks', function (){
        assertCount({active: [], completed: []}, 'load', '0 items left')
        assertCount({active: [1], completed: []}, 'load', '1 item left')
        assertCount({active: [1,2,3], completed: []}, 'load', '3 items left')
        assertCount({active: [1,3], completed: [2]}, 'load', '2 items left')
    });

    it("toggles the footer visibility", function(){
        assertFooterDisplay({active: [], completed: []}, 'none')
        assertFooterDisplay({active: [1], completed: []}, 'block')
        assertFooterDisplay({active: [1], completed: [1]}, 'block')
        assertFooterDisplay({active: [], completed: [1]}, 'block')
    });

    it("toggles the clear button visibility", function(){
        assertClearCompeatedDisplay({active: [], completed: []}, 'none')
        assertClearCompeatedDisplay({active: [1], completed: []}, 'none')
        assertClearCompeatedDisplay({active: [1], completed: [1]}, 'inline-block')
        assertClearCompeatedDisplay({active: [], completed: [1]}, 'inline-block')
    });

    function assertClearCompeatedDisplay(items, expected){
        var expectedText = "Clear completed ("+ items.completed.length +")"
        assertFooter(items, function(element, model) {
            model.trigger('load');
            assert.equal($("#clear-completed", element).css('display'), expected);
            assert.equal($("#clear-completed", element).text(), expectedText);
        });
    }

    function assertFooterDisplay(items, expected){
        assertFooter(items, function(element, model) {
            model.trigger('load');
            assert.equal($(element).css('display'), expected);
        });
    }

    function assertCount(items, trigger, expectedCount){
        assertFooter(items, function(element, model) {
            model.trigger('load');
            assert.equal($('#todo-count', element).text(), expectedCount);
        });
    }

    function assertFooter(items, callback) {
        var model = $.observable({
            items: function(filter) { return items[filter]; }
        });

        loadPresenter(model, function(element) { callback(element, model); });
    }

    function loadPresenter(model, callback) {
        var body = (
            '<footer>' +
                '<span id="todo-count"></span>' +
                '<button id="clear-completed"></button>' +
            '</footer>'
            ), template;

        callback(footerPresenter(body, {model: model}));
    }
});
