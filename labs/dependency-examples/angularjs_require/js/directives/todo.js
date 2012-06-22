/**
 * Directive that executes an expression when the element it is applied to loses focus.
 */

define(['app'], function (app) {
    app.directive('todoBlur', function() {
        return function( scope, elem, attrs ) {
            elem.bind('blur', function() {
                scope.$apply( attrs.todoBlur );
            });
        };
    });

    app.directive('todoFocus', function( $timeout ) {
        return function( scope, elem, attrs ) {
            scope.$watch( attrs.todoFocus, function( newval ) {
                if ( newval ) {
                    $timeout(function() {
                        elem[0].focus();
                        elem[0].select();
                    }, 0 );
                }
            });
        };
    });
});
