/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 14:36
 */
( function( ns ){
    ns.controllers.TodosController = function(){
        return {
            system : undefined, //inject
            todosModel : undefined, //inject
            storageService : undefined,

            retrieveDataFromService : function(){
                this.storageService.retrieve();
            },

            updateModelFromService : function( list ){
                this.todosModel.setList( list );
            },

            saveDataWithService : function( ){
                this.storageService.store( todosModel.getList() );
            },

            retrieveCounts : function(){
                this.system.notify( 'TodosController:todoCountsRetrieved', this.todosModel.getNumTotal(), this.todosModel.getNumActive() );
            }
        }
    }
}( dijondemo ) );