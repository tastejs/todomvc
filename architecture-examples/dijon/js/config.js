/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 15:23
 */

var dijondemo = {};

( function( ns ){
    ns.views = {};
    ns.models = {};
    ns.controllers = {};
    ns.services = {};
    ns.utils = {};
    ns.Config = function(){
        return{
            system : undefined, //inject
            setup : function(){

                this.system.autoMapOutlets = true;

                //values
                this.system.mapValue( 'enterKey', 13 );
                this.system.mapValue( 'uuidUtil', ns.utils.Utils );
                this.system.mapValue( 'pluralizeUtil', ns.utils.Utils );

                //models
                this.system.mapSingleton( 'todosModel', ns.models.TodosModel );

                //services
                this.system.mapSingleton( 'storageService', ns.services.LocalStorageService );

                //controllers
                this.system.mapSingleton( 'todosController', ns.controllers.TodosController );

                //views
                this.system.mapSingleton( 'footerView', ns.views.FooterView );

                this.system.mapSingleton( 'formView', ns.views.TodoFormView );

                this.system.mapSingleton( 'listView', ns.views.TodoListView );

                //handlers
                this.system.mapHandler( 'TodoFormView:addTodo', 'todosModel', 'add' );
                this.system.mapHandler( 'TodoListView:toggleDoneOfTodo', 'todosModel', 'toggleDone' );
                this.system.mapHandler( 'TodoListView:setTitleOfTodo', 'todosModel', 'setTitle' );
                this.system.mapHandler( 'TodoListView:removeTodo', 'todosModel', 'remove' );
                this.system.mapHandler( 'TodoListView:setDoneForAllTodos', 'todosModel', 'setDoneForAll')
                this.system.mapHandler( 'TodoListView:removeAllDoneTodos', 'todosModel', 'removeAllDone' );
                this.system.mapHandler( 'StorageService:retrieveCompleted', 'todosModel', 'setList' );
                this.system.mapHandler( 'FooterView:retrieveTodoCounts', 'todosController', 'retrieveCounts' );
                this.system.mapHandler( 'TodosController:todoCountsRetrieved', 'footerView', 'updateCounts' );
                this.system.mapHandler( 'TodosModel:todosListUpdated', 'listView', 'render' );
                this.system.mapHandler( 'TodosModel:todosListUpdated', 'footerView', 'render' );
                this.system.mapHandler( 'TodosModel:todosListUpdated', 'storageService', 'store' );
                this.system.mapHandler( 'App:startup', 'storageService', 'retrieve' );
                this.system.mapHandler( 'App:startupComplete', 'formView', 'render' );
                this.system.mapHandler( 'App:startupComplete', 'storageService', 'retrieve' );

            }
        }
    }
}( dijondemo ) );