/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/map", "can/util/object"], function (can) {
	var flatProps = function (a) {
		var obj = {};
		for (var prop in a) {
			if (typeof a[prop] !== 'object' || a[prop] === null || a[prop] instanceof Date) {
				obj[prop] = a[prop]
			}
		}
		return obj;
	};

	can.extend(can.Map.prototype, {

		/**
		 * @function can.Map.backup.prototype.backup backup
		 * @plugin can/map/backup
		 * @parent can.Map.backup
		 *
		 * @description Save the values of the properties of an Map.
		 *
		 * @signature `map.backup()`
		 * 
		 * `backup` backs up the current state of the properties of an Observe and marks
		 * the Observe as clean. If any of the properties change value, the original
		 * values can be restored with [can.Map.backup.prototype.restore restore].
		 * 
		 * @return {can.Map} The map, for chaining.
		 *
		 * @body
		 * 
		 * ## Example
		 *
		 * @codestart
		 * var recipe = new can.Map({
		 *   title: 'Pancake Mix',
		 *   yields: '3 batches',
		 *   ingredients: [{
		 *     ingredient: 'flour',
		 *     quantity: '6 cups'
		 *   },{
		 *     ingredient: 'baking soda',
		 *     quantity: '1 1/2 teaspoons'
		 *   },{
		 *     ingredient: 'baking powder',
		 *     quantity: '3 teaspoons'
		 *   },{
		 *     ingredient: 'salt',
		 *     quantity: '1 tablespoon'
		 *   },{
		 *     ingredient: 'sugar',
		 *     quantity: '2 tablespoons'
		 *   }]
		 * });
		 * recipe.backup();
		 * 
		 * recipe.attr('title', 'Flapjack Mix');
		 * recipe.title;     // 'Flapjack Mix'
		 * 
		 * recipe.restore();
		 * recipe.title;     // 'Pancake Mix'
		 * @codeend
		 */
		backup : function () {
			this._backupStore = this._attrs();
			return this;
		},

		/**
		 * @function can.Map.backup.prototype.isDirty isDirty
		 * @plugin can/map/backup
		 * @parent can.Map.backup
		 *
		 * @description Check whether an Observe has changed since the last time it was backed up.
		 *
		 * @signature `map.isDirty([deep])`
		 *
		 * `isDirty` checks whether any properties have changed value or whether any properties have
		 * been added or removed since the last time the Observe was backed up. If _deep_ is `true`,
		 * If the Observe has never been backed up, `isDirty` returns `undefined`.
		 * `isDirty` will include nested Observes in its checks.
		 * 
		 * @param {bool} [deep=false] whether to check nested Observes
		 * @return {bool} Whether the Observe has changed since the last time it was [can.Map.backup.prototype.backup backed up].
		 *
		 * @codestart
		 * var recipe = new can.Map({
		 *   title: 'Pancake Mix',
		 *   yields: '3 batches',
		 *   ingredients: [{
		 *     ingredient: 'flour',
		 *     quantity: '6 cups'
		 *   },{
		 *     ingredient: 'baking soda',
		 *     quantity: '1 1/2 teaspoons'
		 *   },{
		 *     ingredient: 'baking powder',
		 *     quantity: '3 teaspoons'
		 *   },{
		 *     ingredient: 'salt',
		 *     quantity: '1 tablespoon'
		 *   },{
		 *     ingredient: 'sugar',
		 *     quantity: '2 tablespoons'
		 *   }]
		 * });
		 *
		 * recipe.isDirty();     // false
		 * recipe.backup();
		 * 
		 * recipe.attr('title', 'Flapjack Mix');
		 * recipe.isDirty();     // true
		 * recipe.restore();
		 * recipe.isDirty();   // false
		 *
		 * recipe.attr('ingredients.0.quantity', '7 cups');
		 * recipe.isDirty();     // false
		 * recipe.isDirty(true); // true
		 *
		 * recipe.backup();
		 * recipe.isDirty();     // false
		 * recipe.isDirty(true); // false
		 * @codeend
		 */
		isDirty : function (checkAssociations) {
			return this._backupStore &&
				!can.Object.same(this._attrs(),
					this._backupStore,
					undefined,
					undefined,
					undefined,
					!!checkAssociations);
		},

		/**
		 * @function can.Map.backup.prototype.restore restore
		 * @plugin can/map/backup
		 * @parent can.Map.backup
		 * 
		 * @description Restore saved values of an Observe's properties.
		 *
		 * @signature `map.restore( [deep] )`
		 *
		 * `restore` sets the properties of an Observe back to what they were the last time 
		 * [can.Map.backup.prototype.backup backup] was called. If _deep_ is `true`,
		 * `restore` will also restore the properties of nested Observes.
		 * 
		 * `restore` will not remove properties that were added since the last backup, but it
		 * will re-add properties that have been removed.
		 * 
		 * @param {bool} [deep=false] whether to restore properties in nested Observes
		 * @return {can.Map} The Observe, for chaining.
		 * 
		 * 
		 * 
		 * @codestart
		 * var recipe = new can.Map({
		 *   title: 'Pancake Mix',
		 *   yields: '3 batches',
		 *   ingredients: [{
		 *     ingredient: 'flour',
		 *     quantity: '6 cups'
		 *   },{
		 *     ingredient: 'baking soda',
		 *     quantity: '1 1/2 teaspoons'
		 *   },{
		 *     ingredient: 'baking powder',
		 *     quantity: '3 teaspoons'
		 *   },{
		 *     ingredient: 'salt',
		 *     quantity: '1 tablespoon'
		 *   },{
		 *     ingredient: 'sugar',
		 *     quantity: '2 tablespoons'
		 *   }]
		 * });
		 *
		 * recipe.backup();
		 * 
		 * recipe.attr('title', 'Flapjack Mix');
		 * recipe.restore();
		 * recipe.attr('title'); // 'Pancake Mix'
		 *
		 * recipe.attr('ingredients.0.quantity', '7 cups');
		 * recipe.restore();
		 * recipe.attr('ingredients.0.quantity'); // '7 cups'
		 * recipe.restore(true);
		 * recipe.attr('ingredients.0.quantity'); // '6 cups'
		 * @codeend
		 * 
		 * ## Events
		 * When `restore` sets values or re-adds properties, the same events will be fired (including
		 * _change_, _add_, and _set_) as if the values of the properties had been set using `[can.Map.prototype.attr attr]`.
		 */
		restore : function (restoreAssociations) {
			var props = restoreAssociations ? this._backupStore : flatProps(this._backupStore)

			if (this.isDirty(restoreAssociations)) {
				this._attrs(props);
			}

			return this;
		}

	})

	return can.Map;
});