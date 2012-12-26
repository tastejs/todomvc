steal('jquery/dom/cookie','jquery/model/list').then(function($){

/**
 * @class jQuery.Model.List.Cookie
 * @plugin jquery/model/list/cookie
 * @test jquery/model/list/cookie/qunit.html
 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/model/list/cookie/cookie.js
 * @parent jQuery.Model.List
 * 
 * Provides a store-able list of model instances.  The following 
 * retrieves and saves a list of contacts:
 * 
 * @codestart
 * var contacts = new Contact.List([]).retrieve("contacts");
 * 
 * // add each contact to the page
 * contacts.each(function(){
	addContact(this);
 * });
 * 
 * // when a new cookie is crated
 * $("#contact").submit(function(ev){
 * 	ev.preventDefault();
 * 	var data = $(this).formParams();
 * 	
 * 	// gives it a random id
 * 	data.id = +new Date();
 * 	var contact = new Contact(data);
 * 	
 * 	//add it to the list of contacts 
 * 	contacts.push(contact);
 * 	
 * 	//store the current list
 * 	contacts.store("contacts");
 * 	
 * 	//show the contact
 * 	addContact(contact);
 * })
 * @codeend
 * 
 * You can see this in action in the following demo.  Create a contact, then
 * refresh the page.
 * 
 * @demo jquery/model/list/cookie/cookie.html
 */
$.Model.List("jQuery.Model.List.Cookie",
/**
 * @Prototype
 */
{
	days : null,
	/**
	 * Deserializes a list of instances in the cookie with the provided name
	 * @param {String} name the name of the cookie to use.
	 * @return {jQuery.Model} returns this model instance.
	 */
	retrieve : function(name){
		// each also needs what they are referencd by ?
		var props = $.cookie( name ) || {type : null, ids : []},
			instances = [],
			Class = props.type ? $.String.getObject(props.type) :  null;
		for(var i =0; i < props.ids.length;i++){
			var identity = props.ids[i],
				instanceData = $.cookie( identity );
			instances.push( new Class(instanceData) )
		}
		this.push.apply(this,instances);
		return this;
	},
	/**
	 * Serializes and saves this list of model instances to the cookie in name.
	 * @param {String} name the name of the cookie
	 * @return {jQuery.Model} returns this model instance.
	 */
	store : function(name){
		//  go through and listen to instance updating
		var ids = [], days = this.days;
		this.each(function(i, inst){
			$.cookie(inst.identity(), $.toJSON(inst.attrs()), { expires: days });
			ids.push(inst.identity());
		});
		
		$.cookie(name, $.toJSON({
			type: this[0] && this[0].constructor.fullName,
			ids: ids
		}), { expires: this.days });
		return this;
	}
})
	
})

