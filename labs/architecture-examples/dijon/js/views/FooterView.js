/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 14:20
 */
( function( ns ){
    ns.views.FooterView = function(){
        var $count = $('#todo-count');
        var $clearBtn = $('#clear-completed');
        var $footer = $('#todoapp').find('footer');
        return {
            system : undefined, //inject
            pluralizeUtil : undefined, //inject,
            setup : function(){
                var self = this;
                $clearBtn.on( 'click', function() {
                    self.system.notify( 'TodoListView:removeAllDoneTodos' );
                } );

            },
            render : function(){
                this.system.notify( 'FooterView:retrieveTodoCounts' );
            },
            updateCounts : function( numTodosTotal, numTodosActive ){
                var numTodosCompleted = numTodosTotal - numTodosActive;
                var countTitle = '<b>' + numTodosActive + '</b> ' + this.pluralizeUtil.pluralize( numTodosActive, 'item' ) + ' left';
                var clearTitle = 'Clear ' + numTodosCompleted + ' completed ' + this.pluralizeUtil.pluralize( numTodosCompleted, 'item' );
                // Only show the footer when there are at least one todo.
             	$footer.toggle( !!numTodosTotal );

                // Active todo count
                $count.html( countTitle );

                // Toggle clear button and update title
                $clearBtn.text( clearTitle ).toggle( !!numTodosCompleted );
            }
        }
    }
}( dijondemo ) );