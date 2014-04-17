/*global describe, it, beforeEach, plat, todoapp, mock, expect*/
(function () {
	'use strict';
    
    describe('Converters Test', function() {
        var converters = plat.acquire('converters');
        
        it('booleanToSelected', function() {
            var selected = converters.booleanToSelected(true);
            var empty = converters.booleanToSelected(false);
            
            expect(selected).toBe('selected');
            expect(empty).toBe('');
        });
        
        it('booleanToCompleted', function() {
            var completed = converters.booleanToCompleted(true);
            var empty = converters.booleanToCompleted(false);
            
            expect(completed).toBe('completed');
            expect(empty).toBe('');
        });
        
        it('booleanToState', function() {
            var completed = converters.booleanToState(true);
            var active = converters.booleanToState(false);
            
            expect(completed).toBe('completed');
            expect(active).toBe('active');
        });
        
        it('booleanToEditing', function() {
            var editing = converters.booleanToEditing(true);
            var empty = converters.booleanToEditing(false);
            
            expect(editing).toBe('editing');
            expect(empty).toBe('');
        });
        
        it('booleanToValue', function() {
            var foo = converters.booleanToValue('foo', true);
            var empty = converters.booleanToValue('foo', false);

            expect(foo).toBe('foo');
            expect(empty).toBe('');
        });
    });
})();
