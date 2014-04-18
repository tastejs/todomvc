/*global describe, it, beforeEach, plat, todoapp, mock, expect*/
(function () {
	'use strict';  
    
    describe('State Model Test', function() {
        mock.stateRepository();
        
        var State = plat.acquire(todoapp.models.State);
        
        it('getState', function() {
            expect(State.getState()).toBe('test state');
        });
        
        it('setState', function() {
            State.setState('active');
            expect(State.getState()).toBe('set test state');
        });
        
        mock.reset();
    });
    
})();
