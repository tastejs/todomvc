/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 13:38
 */
( function(ns){
    ns.views.TodoFormView = function(){
        var $newTodo = $('#new-todo');
        return {
            system : undefined, //inject
            enterKey : undefined, //inject
            uuidUtil : undefined, //inject
            setup : function(){
                var self = this;
                $newTodo.on( 'keyup', function(e) {
                    if ( e.which !== self.enterKey ) {
                        return;
                    }
                    var $input = $(this);
                    var inputVal = $input.val();
                    if ( !inputVal ) {
                        return;
                    }

                    self.system.notify( 'TodoFormView:addTodo', {
                        title: inputVal,
                        id: self.uuidUtil.uuid(),
                        done: false
                    })

                    $input.val('');
                } );
            },
            render : function(){

            }
        }
    }
}( dijondemo ))