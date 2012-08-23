var todo = window.todo || {};

(function( window ) {
	'use strict';

	todo.TodoModel = new soma.Model.extend({
		dataFooter: null,

		init: function() {
			this.storeKey = 'todos-somajs';
			this.data = JSON.parse( this.getStore() ) || [];
			this.updateDataFooter();
		},

		updateDataFooter: function() {
			var active = this.getActiveLength();
			this.dataFooter = {
				active: active,
				itemLabel: active === 1 ? 'item' : 'items',
				completed: this.data.length - active,
				length: this.data.length
			};
		},

		addItem: function( title ) {
			this.data.push({
				id: this.uuid(),
				title: title,
				completed: false
			});
			this.update();
		},

		removeItem: function( id ) {
			this.data.splice( this.getIndexById( id ), 1 );
			this.update();
		},

		toggleItem: function( id ) {
			var item = this.data[ this.getIndexById( id ) ];
			item.completed = !item.completed;
			this.update();
		},

		updateItem: function( id, title ) {
			this.data[ this.getIndexById( id ) ].title = title;
			this.update();
		},

		toggleAll: function( toggleValue ) {
			var i;

			for ( i = 0; i < this.data.length; i++ ) {
				this.data[i].completed = toggleValue;
			}

			this.update();
		},

		clearCompleted: function() {
			var i = this.data.length;

			while ( i-- ) {
				if ( this.data[ i ].completed ) {
					this.data.splice( i, 1 );
				}
			}

			this.update();
		},

		getIndexById: function( id ) {
			var i;

			for ( i = 0; i < this.data.length; i++ ) {
				if ( this.data[ i ].id === id ) {
					return i;
				}
			}

			return -1;
		},

		getActiveLength: function() {
			var i,
				count = 0;

			for ( i = 0; i < this.data.length; i++ ) {
				if ( !this.data[ i ].completed ) {
					count++;
				}
			}

			return count;
		},

		update: function() {
			this.updateDataFooter();
			this.setStore( this.data );
			this.dispatchEvent( new todo.TodoEvent( todo.TodoEvent.RENDER ) );
		},

		getStore: function() {
			return localStorage.getItem( this.storeKey );
		},

		setStore: function() {
			localStorage.setItem( this.storeKey, JSON.stringify( this.data ) );
		},

		// https://gist.github.com/1308368
		uuid: function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b;}
	});

	todo.TodoModel.NAME = 'TodoModel';

})( window );
