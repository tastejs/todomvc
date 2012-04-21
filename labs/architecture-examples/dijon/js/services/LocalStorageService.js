/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 13:27
 */
( function( ns ){
    dijondemo.services.LocalStorageService = function(){
        return {
            system : undefined, //inject
            store : function( data ){
                return localStorage.setItem( 'todo-jquery', JSON.stringify( data ) );
            },
            retrieve : function(){
                var data = localStorage.getItem('todo-jquery');
                var output = ( data && JSON.parse( data ) ) || [];
                this.system.notify( 'StorageService:retrieveCompleted', output );
            }
        }
    }
}( dijondemo ) )