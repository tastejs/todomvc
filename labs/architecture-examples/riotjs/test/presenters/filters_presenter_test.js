'use strict';

describe('FiltersPresenter', function() {
    it('calls the route', function() {
        assertLinkRoute('<a href="all">all</a>', 'all');
        assertLinkRoute('<a href="/somepage">all</a>', '/somepage');
    });

    it('sets the target', function(){
        var $body = $(
            '<div>' +
            '<a href="/first">first</a>' +
            '<a href="/last">last</a>' +
            '</div>'
            ), links = filtersPresenter($body.find('a'));

        mockRoute(function() {
            links.first().click()
            assert.equal($body.find(".selected").text(), 'first')

            links.last().click()
            assert.equal($body.find(".selected").text(), 'last')
        });
    });

    function mockRoute(callback) {
        var current, route = $.route;
        $.route = function(hash) { current = hash };
        callback(function(){ return current; });
        $.route = route;
    }

    function assertLinkRoute(element, expectedRoute) {
        mockRoute(function(currentRoute){
            element = $(element);
            filtersPresenter(element);
            element.click()
            assert.equal(currentRoute(), expectedRoute);
        });
    }
});
