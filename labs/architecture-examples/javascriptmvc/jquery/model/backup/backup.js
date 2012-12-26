//allows you to backup and restore a model instance
steal('jquery/model').then(function($){
var isArray = $.isArray,
	propCount = function(obj){
		var count = 0;
		for(var prop in obj) count++;
		return count;
	},
	same = function(a, b, deep){
		var aType = typeof a,
			aArray = isArray(a);
		if(deep === -1){
			return aType === 'object' || a === b;
		}
		if(aType !== typeof  b || aArray !== isArray(b)){
			return false;
		}
		if(a === b){
			return true;
		}
		if(aArray){
			if(a.length !== b.length){
				return false;
			}
			for(var i =0; i < a.length; i ++){
				if(!same(a[i],b[i])){
					return false;
				}
			};
			return true;
		} else if(aType === "object" || aType === 'function'){
			var count = 0;
			for(var prop in a){
				if(!same(a[prop],b[prop], deep === false ? -1 : undefined )){
					return false;
				}
				count++;
			}
			return count === propCount(b)
		} 
		return false;
	},
	flatProps = function(a){
		var obj = {};
		for(var prop in a){
			if(typeof a[prop] !== 'object' || a[prop] === null){
				obj[prop] = a[prop]
			}
		}
		return obj;
	};
/**
@page jquerymx.model.backup Backup / Restore
@parent jQuery.Model
@plugin jquery/model/backup
@test jquery/model/backup/qunit.html
@download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/model/backup/backup.js

You can backup and restore instance data with the jquery/model/backup
plugin.

To backup a model instance call [jQuery.Model.prototype.backup backup] like:

@codestart
var recipe = new Recipe({name: "cheese"});
recipe.backup()
@codeend

You can check if the instance is dirty with [jQuery.Model.prototype.isDirty isDirty]:

@codestart
recipe.name = 'blah'
recipe.isDirty() //-> true
@codeend

Finally, you can restore the original attributes with 
[jQuery.Model.prototype.backup backup].

@codestart
recipe.restore();
recipe.name //-> "cheese"
@codeend

See this in action:

@demo jquery/model/backup/backup.html
 */

	$.extend($.Model.prototype,{
		/**
		 * @function jQuery.Model.prototype.backup
		 * @parent jquerymx.model.backup
		 * Backs up an instance of a model, so it can be restored later.
		 * The plugin also adds an [jQuery.Model.prototype.isDirty isDirty]
		 * method for checking if it is dirty.
		 */
		backup: function() {
			this._backupStore = this.serialize();
			return this;
		},

	   /**
	    * @function jQuery.Model.prototype.isDirty
	    * @plugin jquery/model/backup
	    * @parent jquerymx.model.backup
	    * Returns if the instance needs to be saved.  This will go
	    * through associations too.
	    * @return {Boolean} true if there are changes, false if otherwise
	    */
	   isDirty: function(checkAssociations) {
			// check if it serializes the same
			if(!this._backupStore){
				return false;
			} else {
				return !same(this.serialize(), this._backupStore, !!checkAssociations);
			}
		},
		/**
		 * @function jQuery.Model.prototype.restore
		 * @parent jquery.model.backup
		 * restores this instance to its backup data.
		 * @return {model} the instance (for chaining)
		 */
		restore: function(restoreAssociations) {
			var props = restoreAssociations ? this._backupStore : flatProps(this._backupStore)
			this.attrs(props);   
			
			return this;
		}
	   
   })
})


