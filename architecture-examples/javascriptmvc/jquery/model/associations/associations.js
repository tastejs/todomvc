steal.plugins('jquery/model').then(function($){
/**
@page jquery.model.associations Associations
@parent jQuery.Model
@download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/model/associations/associations.js
@test jquery/model/associations/qunit.html
@plugin jquery/model/associations

For efficiency, you often want to get data for related 
records at the same time. The jquery.model.assocations.js 
plugin lets you do this.

Lets say we wanted to list tasks for contacts. When we request our contacts, 
the JSON data will come back like:

@codestart
[
 {'id': 1,
  'name' : 'Justin Meyer',
  'birthday': '1982-10-20',
  'tasks' : [
    {'id': 1, 
     'title': "write up model layer", 
     'due': "2010-10-5" },
    {'id': 1, 
     'title': "document models", 
     'due': "2010-10-8"}]},
  ...
]
@codeend

We want to be able to do something like:

@codestart
var tasks = contact.attr("tasks");

tasks[0].due //-> date
@codeend

Basically, we want <code>attr("tasks")</code> to
return a list of task instances.

Associations let you do this.  Here's how:

First, create a Task model:

@codestart
$.Model.extend("Task",{
  convert : {
    date : function(date){ ... }
  },
  attributes : {
    due : 'date'
  }
},{
  weeksPastDue : function(){
    return Math.round( (new Date() - this.due) /
          (1000*60*60*24*7 ) );
  }
})
@codeend

Then create a Contact model that 'hasMany' tasks:

@codestart
$.Model.extend("Contact",{
  associations : {
    hasMany : "Task"
  },
  ...
},{
  ...
});
@codeend

Here's a demo of this in action:

@demo jquery/model/associations/associations.html

You can customize associations with
the [jQuery.Model.static.belongsTo belongsTo]
and [jQuery.Model.static.belongsTo hasMany] methods.
 */


	//overwrite model's setup to provide associations
	
	var oldSetup = $.Model.setup,
		associate = function(hasMany, Class, type){
			hasMany = hasMany || [];
			hasMany = typeof hasMany == 'string' ? [hasMany] : hasMany;
			for(var i=0; i < hasMany.length;i++){
				Class[type].call(Class, hasMany[i])
			}
		};
	// this provides associations on the has many
	$.Model.setup = function(){
		oldSetup.apply(this, arguments);
		associate( this.associations.hasMany, this, "hasMany");
		associate(this.associations.belongsTo, this, "belongsTo");
		delete this.associations.hasMany;
		delete this.associations.belongsTo;
	}

	
	$.Model.
	/**
	 * @function jQuery.Model.static.belongsTo
	 * @parent jquery.model.associations
	 * @plugin jquery/model/associations
	 * Use to convert values on attribute <i>name</i> to
	 * instances of model <i>type</i>.
	 * @codestart
	 * $.Model.extend("Task",{
	 *   init : function(){
	 *     this.belongsTo("Person","assignedTo");
	 *   }
	 * },{})
	 * @codeend
	 * 
	 * @param {String} type The string name of the model.
	 * @param {String} [name] The name of the property.  Defaults to the shortName of the model.
	 */
	belongsTo = function(type, name){
		name = name || $.String.camelize( type.match(/\w+$/)[0] );
		var cap = $.String.capitalize(name),
			set = function(v){
				return ( this[name] = (v == v.Class ? v : $.Class.getObject(type).wrap(v)) )
			},
			get = function(){
				return this[name];
			}
			
		set.doNotInhert = true;
		get.doNotInherit = true;
		
		if(!this.prototype["set"+cap]){
			this.prototype["set"+cap] = set;
		}
		if(!this.prototype["get"+cap]){
			this.prototype["get"+cap] = get
		}
		this.associations[name] = {
			belongsTo: type
		};
		return this;
	}
	$.Model.
	/**
	 * @function jQuery.Model.static.hasMany
	 * @parent jquery.model.associations
	 * @plugin jquery/model/associations
	 * Converts values on attribute <i>name</i> to
	 * instances of model <i>type</i>.
	*  @codestart
	 * $.Model.extend("Task",{
	 *   init : function(){
	 *     this.hasMany("Person","people");
	 *   }
	 * },{})
	 * @codeend
	 * 
	 * @param {String} type The string name of the model.
	 * @param {String} [name] The name of the property.  
	 * Defaults to the shortName of the model with an "s" at the end.
	 */
	hasMany = function(type, name){
		name = name || $.String.camelize( type.match(/\w+$/)[0] )+"s";
		
		var cap = $.String.capitalize(name)
		if(!this.prototype["set"+cap]){
			this.prototype["set"+cap] = function(v){
				// should probably check instanceof
				return this[name] = (v == v.Class ? v : $.Class.getObject(type).wrapMany(v))
			}
		}
		if(!this.prototype["get"+cap]){
			this.prototype["get"+cap] = function(){
				return this[name] || $.Class.getObject(type).wrapMany([]);
			}
		}
		this.associations[name] = {
			hasMany: type
		};
		return this;
	}



})

