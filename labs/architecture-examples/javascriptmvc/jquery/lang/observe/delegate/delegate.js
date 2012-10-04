steal('jquery/lang/observe',function(){
	
	/**
	 * @add jQuery.Observe.prototype
	 */
	
	// ** - 'this' will be the deepest item changed
	// * - 'this' will be any changes within *, but * will be the 
	//     this returned
	
	// tells if the parts part of a delegate matches the broken up props of the event
	// gives the prop to use as 'this'
	// - parts - the attribute name of the delegate split in parts ['foo','*']
	// - props - the split props of the event that happened ['foo','bar','0']
	// - returns - the attribute to delegate too ('foo.bar'), or null if not a match 
	var matches = function(parts, props){
		//check props parts are the same or 
		var len = parts.length,
			i =0,
			// keeps the matched props we will use
			matchedProps = [],
			prop;
		
		// if the event matches
		for(i; i< len; i++){
			prop =  props[i]
			// if no more props (but we should be matching them)
			// return null
			if( typeof prop !== 'string' ) {
				return null;
			} else
			// if we have a "**", match everything
			if( parts[i] == "**" ) {
				return props.join(".");
			} else 
			// a match, but we want to delegate to "*"
			if (parts[i] == "*"){
				// only do this if there is nothing after ...
				matchedProps.push(prop);
			}
			else if(  prop === parts[i]  ) {
				matchedProps.push(prop);
			} else {
				return null;
			}
		}
		return matchedProps.join(".");
	},
		// gets a change event and tries to figure out which
		// delegates to call
		delegate = function(event, prop, how, newVal, oldVal){
			// pre-split properties to save some regexp time
			var props = prop.split("."),
				delegates = $.data(this,"_observe_delegates") || [],
				delegate,
				len = delegates.length,
				attr,
				matchedAttr,
				hasMatch,
				valuesEqual;
			event.attr = prop;
			event.lastAttr = props[props.length -1 ];
			
			// for each delegate
			for(var i =0; i < len; i++){
				
				delegate = delegates[i];
				// if there is a batchNum, this means that this
				// event is part of a series of events caused by a single 
				// attrs call.  We don't want to issue the same event
				// multiple times
				// setting the batchNum happens later
				if(event.batchNum && delegate.batchNum === event.batchNum){
					continue;
				}
				
				// reset match and values tests
				hasMatch = undefined;
				valuesEqual = true;
				
				// for each attr in a delegate
				for(var a =0 ; a < delegate.attrs.length; a++){
					
					attr = delegate.attrs[a];
					
					// check if it is a match
					if(matchedAttr = matches(attr.parts, props)){
						hasMatch = matchedAttr;
					}
					// if it has a value, make sure it's the right value
					// if it's set, we should probably check that it has a 
					// value no matter what
					if(attr.value && valuesEqual /* || delegate.hasValues */){
						valuesEqual = attr.value === ""+this.attr(attr.attr)
					} else if (valuesEqual && delegate.attrs.length > 1){
						// if there are multiple attributes, each has to at
						// least have some value
						valuesEqual = this.attr(attr.attr) !== undefined
					}
				}
				
				// if there is a match and valuesEqual ... call back

				if(hasMatch && valuesEqual) {
					// how to get to the changed property from the delegate
					var from = prop.replace(hasMatch+".","");
					
					// if this event is part of a batch, set it on the delegate
					// to only send one event
					if(event.batchNum ){
						delegate.batchNum = event.batchNum
					}
					
					// if we listen to change, fire those with the same attrs
					// TODO: the attrs should probably be using from
					if(  delegate.event === 'change' ){
						arguments[1] = from;
						event.curAttr = hasMatch;
						delegate.callback.apply(this.attr(hasMatch), $.makeArray( arguments));
					} else if(delegate.event === how ){
						
						// if it's a match, callback with the location of the match
						delegate.callback.apply(this.attr(hasMatch), [event,newVal, oldVal, from]);
					} else if(delegate.event === 'set' && 
							 how == 'add' ) {
						// if we are listening to set, we should also listen to add
						delegate.callback.apply(this.attr(hasMatch), [event,newVal, oldVal, from]);
					}
				}
				
			}
		};
		
	$.extend($.Observe.prototype,{
		/**
		 * @plugin jquery/lang/observe/delegate
		 * Listen for changes in a child attribute from the parent. The child attribute
		 * does not have to exist.
		 * 
		 *     
		 *     // create an observable
		 *     var observe = $.O({
		 *       foo : {
		 *         bar : "Hello World"
		 *       }
		 *     })
		 *     
		 *     //listen to changes on a property
		 *     observe.delegate("foo.bar","change", function(ev, prop, how, newVal, oldVal){
		 *       // foo.bar has been added, set, or removed
		 *       this //-> 
		 *     });
		 * 
		 *     // change the property
		 *     observe.attr('foo.bar',"Goodbye Cruel World")
		 * 
		 * ## Types of events
		 * 
		 * Delegate lets you listen to add, set, remove, and change events on property.
		 * 
		 * __add__
		 * 
		 * An add event is fired when a new property has been added.
		 * 
		 *     var o = new $.Observe({});
		 *     o.delegate("name","add", function(ev, value){
		 *       // called once
		 *       $('#name').show()
		 *     })
		 *     o.attr('name',"Justin")
		 *     o.attr('name',"Brian");
		 *     
		 * Listening to add events is useful for 'setup' functionality (in this case
		 * showing the <code>#name</code> element.
		 * 
		 * __set__
		 * 
		 * Set events are fired when a property takes on a new value.  set events are
		 * always fired after an add.
		 * 
		 *     o.delegate("name","set", function(ev, value){
		 *       // called twice
		 *       $('#name').text(value)
		 *     })
		 *     o.attr('name',"Justin")
		 *     o.attr('name',"Brian");
		 * 
		 * __remove__
		 * 
		 * Remove events are fired after a property is removed.
		 * 
		 *     o.delegate("name","remove", function(ev){
		 *       // called once
		 *       $('#name').text(value)
		 *     })
		 *     o.attr('name',"Justin");
		 *     o.removeAttr('name');
		 * 
		 * ## Wildcards - matching multiple properties
		 * 
		 * Sometimes, you want to know when any property within some part 
		 * of an observe has changed. Delegate lets you use wildcards to 
		 * match any property name.  The following listens for any change
		 * on an attribute of the params attribute:
		 * 
		 *     var o = $.Observe({
		 *       options : {
		 *         limit : 100,
		 *         offset: 0,
		 *         params : {
		 *           parentId: 5
		 *         }
		 *       }
		 *     })
		 *     o.delegate('options.*','change', function(){
		 *       alert('1');
		 *     })
		 *     o.delegate('options.**','change', function(){
		 *       alert('2');
		 *     })
		 *     
		 *     // alerts 1
		 *     // alerts 2
		 *     o.attr('options.offset',100)
		 *     
		 *     // alerts 2
		 *     o.attr('options.params.parentId',6);
		 * 
		 * Using a single wildcard (<code>*</code>) matches single level
		 * properties.  Using a double wildcard (<code>**</code>) matches
		 * any deep property.
		 * 
		 * ## Listening on multiple properties and values
		 * 
		 * Delegate lets you listen on multiple values at once, for example, 
		 * 
		 * @param {String} selector the attributes you want to listen for changes in.
		 * @param {String} event the event name
		 * @param {Function} cb the callback handler
		 * @return {jQuery.Delegate} the delegate for chaining
		 */
		delegate :  function(selector, event, cb){
			selector = $.trim(selector);
			var delegates = $.data(this, "_observe_delegates") ||
				$.data(this, "_observe_delegates", []),
				attrs = [];
			
			// split selector by spaces
			selector.replace(/([^\s=]+)=?([^\s]+)?/g, function(whole, attr, value){
			  attrs.push({
			  	// the attribute name
				attr: attr,
				// the attribute's pre-split names (for speed)
				parts: attr.split('.'),
				// the value associated with this prop
				value: value
			  })
			}); 
			
			// delegates has pre-processed info about the event
			delegates.push({
				// the attrs name for unbinding
				selector : selector,
				// an object of attribute names and values {type: 'recipe',id: undefined}
				// undefined means a value was not defined
				attrs : attrs,
				callback : cb,
				event: event
			});
			if(delegates.length === 1){
				this.bind("change",delegate)
			}
			return this;
		},
		/**
		 * @plugin jquery/lang/observe/delegate
		 * Removes a delegate event handler.
		 * 
		 *   observe.undelegate("name","set", function(){ ... })
		 * 
		 * @param {String} selector the attribute name of the object you want to undelegate from.
		 * @param {String} event the event name
		 * @param {Function} cb the callback handler
		 * @return {jQuery.Delegate} the delegate for chaining
		 */
		undelegate : function(selector, event, cb){
			selector = $.trim(selector);
			
			var i =0,
				delegates = $.data(this, "_observe_delegates") || [],
				delegateOb;
			if(selector){
				while(i < delegates.length){
					delegateOb = delegates[i];
					if( delegateOb.callback === cb ||
						(!cb && delegateOb.selector === selector) ){
						delegates.splice(i,1)
					} else {
						i++;
					}
				}
			} else {
				// remove all delegates
				delegates = [];
			}
			if(!delegates.length){
				$.removeData(this, "_observe_delegates");
				this.unbind("change",delegate)
			}
			return this;
		}
	});
	// add helpers for testing .. 
	$.Observe.prototype.delegate.matches = matches;
})
