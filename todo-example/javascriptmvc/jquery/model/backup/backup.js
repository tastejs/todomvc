//allows you to backup and restore a model instance
steal.plugins('jquery/model').then(function(){

/**
@page jquery.model.backup Backup / Restore
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

	// a helper to iterate through the associations
	var associations = function(instance, func){
		var name, 
			res;
			
		for(name in instance.Class.associations){
			association = instance.Class.associations[name];
			if("belongsTo" in association){
				if(instance[name] && (res = func(instance[name]) ) ){
					return res;
				}
			}
			if("hasMany" in association){
				if(instance[name]){
					for(var i =0 ; i < instance[name].length; i++){
						if( (res = func(instance[name][i]) ) ){
							return res;
						}
					}
				}	
			}
		}
	}
	

	$.extend($.Model.prototype,{
		/**
		 * @function jQuery.Model.prototype.backup
		 * @plugin jquery/model/backup
		 * @parent jquery.model.backup
		 * Backs up an instance of a model, so it can be restored later.
		 * The plugin also adds an [jQuery.Model.prototype.isDirty isDirty]
		 * method for checking if it is dirty.
		 */
		backup: function() {
			associations(this, function(associated){
				associated.backup();
			})
			this._backupStore = $.extend(true, {},this.attrs());
			return this;
		},
	   
	   _backup: function() {
		   this._backupStore = $.extend(true, {},this.attrs());
	   },
	   /**
	    * @function jQuery.Model.prototype.isDirty
	    * @plugin jquery/model/backup
	    * @parent jquery.model.backup
	    * Returns if the instance needs to be saved.  This will go
	    * through associations too.
	    * @param {Boolean} [checkAssociations=false] true if associations should be checked.  Defaults to false.
	    * be checked, false if otherwise
	    * @return {Boolean} true if there are changes, false if otherwise
	    */
	   isDirty: function(checkAssociations) {
			if(!this._backupStore) return false;
			//go through attrs and compare ...
			var current = this.attrs(),
				name,
				association,
				res;
			for(name in current){
				if(current[name] !== this._backupStore[name]){
					return true;
				}
					
			}
			if( checkAssociations ){
				res = associations(this, function(associated){
					return associated.isDirty();
				})
				if(res === true){
					return true;
				}
			}
			
			return false;
		},
		/**
		 * @function jQuery.Model.prototype.restore
		 * @plugin jquery/model/backup
		 * @parent jquery.model.backup
		 * restores this instance to its backup data.
		 * @param {Boolean} [restoreAssociations=false] if true, restores associations.
		 * @return {model} the instance (for chaining)
		 */
		restore: function(restoreAssociations) {
			this.attrs(this._backupStore);   
			
			if( restoreAssociations ){
				associations(this, function(associated){
					associated.restore();
				})
			}
			return this;
		}
	   
   })
})


