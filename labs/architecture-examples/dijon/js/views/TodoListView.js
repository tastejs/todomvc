/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 13:39
 */
( function(ns){
    ns.views.TodoListView = function(){
        var _template = Handlebars.compile( $('#todo-template').html() );
        var $toggleAll = $('#toggle-all');
        var $todoList = $('#todo-list');
        var $main = $('#main');
        var $count = $('#todo-count');
        return {
            system : undefined, //inject
            enterKey : undefined,
            setup : function(){
                var self = this;
                $todoList.on( 'change', '.toggle', function() {
                    var id = $( this ).closest('li').data('id');
                    self.system.notify( 'TodoListView:toggleDoneOfTodo', id );
                } );
                $todoList.on( 'dblclick', '.view', function() {
                    $(this)
                        .closest('li')
                        .addClass('editing')
                        .find('.edit')
                        .focus();
                } );
                $todoList.on( 'keypress', '.edit', function(e) {
                    if ( e.keyCode === self.enterKey ) {
                        console.log( e.target );
                        e.target.blur();
                    }
                } );
                $todoList.on( 'blur', '.edit', function() {
                    var id = $( this ).closest('li').data('id');
                    var val = $(this).removeClass('editing').val();
                    self.system.notify( 'TodoListView:setTitleOfTodo', id, val );
                 } );
                $todoList.on( 'click', '.destroy', function() {
                    var id = $( this ).closest('li').data('id');
                    self.system.notify( 'TodoListView:removeTodo', id );
                } );

                $toggleAll.on( 'change', function() {
                    var isChecked = !!$(this).attr('checked');
                    self.system.notify( 'TodoListView:setDoneForAllTodos', isChecked );
                } );

            },

            render : function( todosList ){
                $todoList.html( _template( todosList ) );
                $main.toggle( !!todosList.length );
            }
        }
    }
}( dijondemo ))