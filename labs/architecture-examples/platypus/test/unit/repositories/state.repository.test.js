/*global describe, it, beforeEach, plat, todoapp, mock, expect*/
(function () {
	'use strict';
    
    describe('State Repository Test', function() {
        mock.$localStorage();
        
        var StateRepository = plat.acquire(todoapp.repositories.StateRepository);
        
        it('getState', function() {
            expect(StateRepository.getState('id')).toBe(JSON.stringify(STORAGE_ITEM));
        });
        
        it('setState', function() {
            StateRepository.setState('id', 'foo');
            
            expect(StateRepository.getState('id')).toBe(JSON.stringify(SET_STORAGE_ITEM));
        });
        
        mock.reset();
    });
    
})();
