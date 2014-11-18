/*global dijondemo */
/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 14:39
 */
(function( ns ) {
	'use strict';

	ns.models.TodosModel = function() {
		var _list = [];
		return {
			system: undefined, //inject,
			getTodo: function( id ) {
				return _list[ this.getIndex( id ) ];
			},
			getIndex: function( id ) {
				var list = _list,
					todo,
					i;

				for ( i in _list ) {
					todo = _list[ i ];
					if ( todo.id === id ) {
						return i;
					}
				}

				return -1;
			},
			notifyOfListUpdate: function() {
				var list = this.getList();
				this.system.notify( 'TodosModel:todosListUpdated', list );
			},
			setList: function( list ) {
				_list = list || [];
				this.system.notify( 'TodosModel:todosListUpdated', list );
			},
			getList: function() {
				return _list;
			},
			add: function( vo ) {
				_list.push( vo );
				this.notifyOfListUpdate();
			},
			toggleDone: function( id ) {
				var todo = this.getTodo( id );
				todo.completed = !todo.completed;
				this.notifyOfListUpdate();
			},
			setTitle: function( id, title ) {
				this.getTodo( id ).title = title;
				this.notifyOfListUpdate();
			},
			remove: function( id ) {
				_list.splice( this.getIndex( id ), 1 );
				this.notifyOfListUpdate();
			},
			setDoneForAll: function( completed ) {
				var i;
				for ( i in _list ) {
					_list[ i ].completed = completed;
				}
				this.notifyOfListUpdate();
			},
			removeAllDone: function() {
				var i,
					n = 0;
				for ( i = _list.length - 1 ; i >= n ; i-- ) {
					if ( _list[ i ].completed ) {
						_list.splice( i, 1 );
					}
				}
				this.notifyOfListUpdate();
			},
			getNumTotal: function() {
				return _list.length;
			},
			getNumActive: function() {
				var count = 0,
					i;
				for ( i in _list ) {
					if ( !_list[ i ].completed ) {
						count++;
					}
				}
				return count;
			}
		};
	};

}( dijondemo ));
