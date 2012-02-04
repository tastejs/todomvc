/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 14:39
 */
( function( ns ){
    ns.models.TodosModel = function(){
        var _list = [];
        return {
            system : undefined, //inject,
            getTodo : function( id ){
                return _list[ this.getIndex( id ) ];
            },
            getIndex : function( id ){
                var list = _list;
                for( var i in _list ){

                    var todo = _list[ i ];
                    if( todo.id == id ) {
                        return i;
                    }
                }

                return -1;
            },
            notifyOfListUpdate : function(){
                var list = this.getList();
                this.system.notify( 'TodosModel:todosListUpdated', list );
            },
            setList : function( list ){
                _list = list || [];
                this.system.notify( 'TodosModel:todosListUpdated', list );
            },
            getList : function(){
                return _list;
            },
            add : function( vo ){
                _list.push( vo );
                this.notifyOfListUpdate();
            },
            toggleDone : function( id ){
                var todo = this.getTodo( id );
                todo.done = ! todo.done;
                this.notifyOfListUpdate();
            },
            setTitle : function( id, title ){
                this.getTodo( id ).title = title;
                this.notifyOfListUpdate();
            },
            remove : function( id ){
                _list.splice( this.getIndex( id ), 1 );
                this. notifyOfListUpdate();
            },
            setDoneForAll : function( done ){
                for( var i in _list ){
                    _list[ i ].done = done;
                }
                this.notifyOfListUpdate();
            },
            removeAllDone : function(){
                for( var i = _list.length - 1, n = 0; i >= n; i-- ){
                    if( _list[ i ].done ){
                        _list.splice( i, 1 );
                    }
                }
                this.notifyOfListUpdate();
            },
            getNumTotal : function(){
                return _list.length;
            },
            getNumActive : function(){
                var count = 0;
                for( var i in _list ){
                    if( ! _list[ i ].done ){
                        count++;
                    }
                }
                return count;
            }

        }
    }
}( dijondemo ) );