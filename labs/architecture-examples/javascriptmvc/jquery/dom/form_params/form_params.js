/**
 *  @add jQuery.fn
 */
steal("jquery/dom").then(function( $ ) {
	var keyBreaker = /[^\[\]]+/g,
		convertValue = function( value ) {
			if ( $.isNumeric( value )) {
				return parseFloat( value );
			} else if ( value === 'true') {
				return true;
			} else if ( value === 'false' ) {
				return false;
			} else if ( value === '' ) {
				return undefined;
			}
			return value;
		}, 
		nestData = function( elem, type, data, parts, value, seen ) {
			var name = parts.shift();

			if ( parts.length ) {
				if ( ! data[ name ] ) {
					data[ name ] = {};
				}
				// Recursive call
				nestData( elem, type, data[ name ], parts, value, seen );
			} else {

				// Handle same name case, as well as "last checkbox checked"
				// case
				if ( name in seen && type != "radio" && ! $.isArray( data[ name ] )) {
					if ( name in data ) {
						data[ name ] = [ data[name] ];
					} else {
						data[ name ] = [];
					}
				} else {
					seen[ name ] = true;
				}

				// Finally, assign data
				if ( ( type == "radio" || type == "checkbox" ) && ! elem.is(":checked") ) {
					return
				}

				if ( ! data[ name ] ) {
					data[ name ] = value;
				} else {
					data[ name ].push( value );
				}
				

			}

		};
		
	$.fn.extend({
		/**
		 * @parent dom
		 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/form_params/form_params.js
		 * @plugin jquery/dom/form_params
		 * @test jquery/dom/form_params/qunit.html
		 * 
		 * Returns an object of name-value pairs that represents values in a form.  
		 * It is able to nest values whose element's name has square brackets.
		 * 
		 * When convert is set to true strings that represent numbers and booleans will
		 * be converted and empty string will not be added to the object. 
		 * 
		 * Example html:
		 * @codestart html
		 * &lt;form>
		 *   &lt;input name="foo[bar]" value='2'/>
		 *   &lt;input name="foo[ced]" value='4'/>
		 * &lt;form/>
		 * @codeend
		 * Example code:
		 * 
		 *     $('form').formParams() //-> { foo:{bar:'2', ced: '4'} }
		 * 
		 * 
		 * @demo jquery/dom/form_params/form_params.html
		 * 
		 * @param {Object} [params] If an object is passed, the form will be repopulated
		 * with the values of the object based on the name of the inputs within
		 * the form
		 * @param {Boolean} [convert=false] True if strings that look like numbers 
		 * and booleans should be converted and if empty string should not be added 
		 * to the result. Defaults to false.
		 * @return {Object} An object of name-value pairs.
		 */
		formParams: function( params ) {

			var convert;

			// Quick way to determine if something is a boolean
			if ( !! params === params ) {
				convert = params;
				params = null;
			}

			if ( params ) {
				return this.setParams( params );
			} else {
				return this.getParams( convert );
			}
		},
		setParams: function( params ) {

			// Find all the inputs
			this.find("[name]").each(function() {
				
				var value = params[ $(this).attr("name") ],
					$this;
				
				// Don't do all this work if there's no value
				if ( value !== undefined ) {
					$this = $(this);
					
					// Nested these if statements for performance
					if ( $this.is(":radio") ) {
						if ( $this.val() == value ) {
							$this.attr("checked", true);
						}
					} else if ( $this.is(":checkbox") ) {
						// Convert single value to an array to reduce
						// complexity
						value = $.isArray( value ) ? value : [value];
						if ( $.inArray( $this.val(), value ) > -1) {
							$this.attr("checked", true);
						}
					} else {
						$this.val( value );
					}
				}
			});
		},
		getParams: function( convert ) {
			var data = {},
				// This is used to keep track of the checkbox names that we've
				// already seen, so we know that we should return an array if
				// we see it multiple times. Fixes last checkbox checked bug.
				seen = {},
				current;


			this.find("[name]").each(function() {
				var $this    = $(this),
					type     = $this.attr("type"),
					name     = $this.attr("name"),
					value    = $this.val(),
					parts;

				// Don't accumulate submit buttons and nameless elements
				if ( type == "submit" || ! name ) {
					return;
				}

				// Figure out name parts
				parts = name.match( keyBreaker );
				if ( ! parts.length ) {
					parts = [name];
				}

				// Convert the value
				if ( convert ) {
					value = convertValue( value );
				}

				// Assign data recursively
				nestData( $this, type, data, parts, value, seen );

			});

			return data;
		}
	});

});
