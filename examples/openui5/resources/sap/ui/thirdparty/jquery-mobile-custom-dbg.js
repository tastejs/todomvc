/*
* jQuery Mobile v1.3.1
* http://jquerymobile.com
*
* Copyright 2010, 2013 jQuery Foundation, Inc. and other contributors
* Released under the MIT license.
* http://jquery.org/license
*
*/

(function ( root, doc, factory ) {
	if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define( [ "jquery" ], function ( $ ) {
			factory( $, root, doc );
			return $.mobile;
		});
	} else {
		// Browser globals
		factory( root.jQuery, root, doc );
	}
}( this, document, function ( jQuery, window, document, undefined ) {
// Script: jQuery hashchange event
// 
// *Version: 1.3, Last updated: 7/21/2010*
// 
// Project Home - http://benalman.com/projects/jquery-hashchange-plugin/
// GitHub       - http://github.com/cowboy/jquery-hashchange/
// Source       - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.js
// (Minified)   - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js (0.8kb gzipped)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// hashchange event - http://benalman.com/code/projects/jquery-hashchange/examples/hashchange/
// document.domain - http://benalman.com/code/projects/jquery-hashchange/examples/document_domain/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.2.6, 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-4, Chrome 5-6, Safari 3.2-5,
//                   Opera 9.6-10.60, iPhone 3.1, Android 1.6-2.2, BlackBerry 4.6-5.
// Unit Tests      - http://benalman.com/code/projects/jquery-hashchange/unit/
// 
// About: Known issues
// 
// While this jQuery hashchange event implementation is quite stable and
// robust, there are a few unfortunate browser bugs surrounding expected
// hashchange event-based behaviors, independent of any JavaScript
// window.onhashchange abstraction. See the following examples for more
// information:
// 
// Chrome: Back Button - http://benalman.com/code/projects/jquery-hashchange/examples/bug-chrome-back-button/
// Firefox: Remote XMLHttpRequest - http://benalman.com/code/projects/jquery-hashchange/examples/bug-firefox-remote-xhr/
// WebKit: Back Button in an Iframe - http://benalman.com/code/projects/jquery-hashchange/examples/bug-webkit-hash-iframe/
// Safari: Back Button from a different domain - http://benalman.com/code/projects/jquery-hashchange/examples/bug-safari-back-from-diff-domain/
// 
// Also note that should a browser natively support the window.onhashchange 
// event, but not report that it does, the fallback polling loop will be used.
// 
// About: Release History
// 
// 1.3   - (7/21/2010) Reorganized IE6/7 Iframe code to make it more
//         "removable" for mobile-only development. Added IE6/7 document.title
//         support. Attempted to make Iframe as hidden as possible by using
//         techniques from http://www.paciellogroup.com/blog/?p=604. Added 
//         support for the "shortcut" format $(window).hashchange( fn ) and
//         $(window).hashchange() like jQuery provides for built-in events.
//         Renamed jQuery.hashchangeDelay to <jQuery.fn.hashchange.delay> and
//         lowered its default value to 50. Added <jQuery.fn.hashchange.domain>
//         and <jQuery.fn.hashchange.src> properties plus document-domain.html
//         file to address access denied issues when setting document.domain in
//         IE6/7.
// 1.2   - (2/11/2010) Fixed a bug where coming back to a page using this plugin
//         from a page on another domain would cause an error in Safari 4. Also,
//         IE6/7 Iframe is now inserted after the body (this actually works),
//         which prevents the page from scrolling when the event is first bound.
//         Event can also now be bound before DOM ready, but it won't be usable
//         before then in IE6/7.
// 1.1   - (1/21/2010) Incorporated document.documentMode test to fix IE8 bug
//         where browser version is incorrectly reported as 8.0, despite
//         inclusion of the X-UA-Compatible IE=EmulateIE7 meta tag.
// 1.0   - (1/9/2010) Initial Release. Broke out the jQuery BBQ event.special
//         window.onhashchange functionality into a separate plugin for users
//         who want just the basic event & back button support, without all the
//         extra awesomeness that BBQ provides. This plugin will be included as
//         part of jQuery BBQ, but also be available separately.

(function( $, window, undefined ) {
  // Reused string.
  var str_hashchange = 'hashchange',
    
    // Method / object references.
    doc = document,
    fake_onhashchange,
    special = $.event.special,
    
    // Does the browser support window.onhashchange? Note that IE8 running in
    // IE7 compatibility mode reports true for 'onhashchange' in window, even
    // though the event isn't supported, so also test document.documentMode.
    doc_mode = doc.documentMode,
    supports_onhashchange = 'on' + str_hashchange in window && ( doc_mode === undefined || doc_mode > 7 );
  
  // Get location.hash (or what you'd expect location.hash to be) sans any
  // leading #. Thanks for making this necessary, Firefox!
  function get_fragment( url ) {
    url = url || location.href;
    return '#' + url.replace( /^[^#]*#?(.*)$/, '$1' );
  };
  
  // Method: jQuery.fn.hashchange
  // 
  // Bind a handler to the window.onhashchange event or trigger all bound
  // window.onhashchange event handlers. This behavior is consistent with
  // jQuery's built-in event handlers.
  // 
  // Usage:
  // 
  // > jQuery(window).hashchange( [ handler ] );
  // 
  // Arguments:
  // 
  //  handler - (Function) Optional handler to be bound to the hashchange
  //    event. This is a "shortcut" for the more verbose form:
  //    jQuery(window).bind( 'hashchange', handler ). If handler is omitted,
  //    all bound window.onhashchange event handlers will be triggered. This
  //    is a shortcut for the more verbose
  //    jQuery(window).trigger( 'hashchange' ). These forms are described in
  //    the <hashchange event> section.
  // 
  // Returns:
  // 
  //  (jQuery) The initial jQuery collection of elements.
  
  // Allow the "shortcut" format $(elem).hashchange( fn ) for binding and
  // $(elem).hashchange() for triggering, like jQuery does for built-in events.
  $.fn[ str_hashchange ] = function( fn ) {
    return fn ? this.bind( str_hashchange, fn ) : this.trigger( str_hashchange );
  };
  
  // Property: jQuery.fn.hashchange.delay
  // 
  // The numeric interval (in milliseconds) at which the <hashchange event>
  // polling loop executes. Defaults to 50.
  
  // Property: jQuery.fn.hashchange.domain
  // 
  // If you're setting document.domain in your JavaScript, and you want hash
  // history to work in IE6/7, not only must this property be set, but you must
  // also set document.domain BEFORE jQuery is loaded into the page. This
  // property is only applicable if you are supporting IE6/7 (or IE8 operating
  // in "IE7 compatibility" mode).
  // 
  // In addition, the <jQuery.fn.hashchange.src> property must be set to the
  // path of the included "document-domain.html" file, which can be renamed or
  // modified if necessary (note that the document.domain specified must be the
  // same in both your main JavaScript as well as in this file).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.domain = document.domain;
  
  // Property: jQuery.fn.hashchange.src
  // 
  // If, for some reason, you need to specify an Iframe src file (for example,
  // when setting document.domain as in <jQuery.fn.hashchange.domain>), you can
  // do so using this property. Note that when using this property, history
  // won't be recorded in IE6/7 until the Iframe src file loads. This property
  // is only applicable if you are supporting IE6/7 (or IE8 operating in "IE7
  // compatibility" mode).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.src = 'path/to/file.html';
  
  $.fn[ str_hashchange ].delay = 50;
  /*
  $.fn[ str_hashchange ].domain = null;
  $.fn[ str_hashchange ].src = null;
  */
  
  // Event: hashchange event
  // 
  // Fired when location.hash changes. In browsers that support it, the native
  // HTML5 window.onhashchange event is used, otherwise a polling loop is
  // initialized, running every <jQuery.fn.hashchange.delay> milliseconds to
  // see if the hash has changed. In IE6/7 (and IE8 operating in "IE7
  // compatibility" mode), a hidden Iframe is created to allow the back button
  // and hash-based history to work.
  // 
  // Usage as described in <jQuery.fn.hashchange>:
  // 
  // > // Bind an event handler.
  // > jQuery(window).hashchange( function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).hashchange();
  // 
  // A more verbose usage that allows for event namespacing:
  // 
  // > // Bind an event handler.
  // > jQuery(window).bind( 'hashchange', function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).trigger( 'hashchange' );
  // 
  // Additional Notes:
  // 
  // * The polling loop and Iframe are not created until at least one handler
  //   is actually bound to the 'hashchange' event.
  // * If you need the bound handler(s) to execute immediately, in cases where
  //   a location.hash exists on page load, via bookmark or page refresh for
  //   example, use jQuery(window).hashchange() or the more verbose 
  //   jQuery(window).trigger( 'hashchange' ).
  // * The event can be bound before DOM ready, but since it won't be usable
  //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
  //   to bind it inside a DOM ready handler.
  
  // Override existing $.event.special.hashchange methods (allowing this plugin
  // to be defined after jQuery BBQ in BBQ's source code).
  special[ str_hashchange ] = $.extend( special[ str_hashchange ], {
    
    // Called only when the first 'hashchange' event is bound to window.
    setup: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to create our own. And we don't want to call this
      // until the user binds to the event, just in case they never do, since it
      // will create a polling loop and possibly even a hidden Iframe.
      $( fake_onhashchange.start );
    },
    
    // Called only when the last 'hashchange' event is unbound from window.
    teardown: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to stop ours (if possible).
      $( fake_onhashchange.stop );
    }
    
  });
  
  // fake_onhashchange does all the work of triggering the window.onhashchange
  // event for browsers that don't natively support it, including creating a
  // polling loop to watch for hash changes and in IE 6/7 creating a hidden
  // Iframe to enable back and forward.
  fake_onhashchange = (function() {
    var self = {},
      timeout_id,
      
      // Remember the initial hash so it doesn't get triggered immediately.
      last_hash = get_fragment(),
      
      fn_retval = function( val ) { return val; },
      history_set = fn_retval,
      history_get = fn_retval;
    
    // Start the polling loop.
    self.start = function() {
      timeout_id || poll();
    };
    
    // Stop the polling loop.
    self.stop = function() {
      timeout_id && clearTimeout( timeout_id );
      timeout_id = undefined;
    };
    
    // This polling loop checks every $.fn.hashchange.delay milliseconds to see
    // if location.hash has changed, and triggers the 'hashchange' event on
    // window when necessary.
    function poll() {
      var hash = get_fragment(),
        history_hash = history_get( last_hash );
      
      if ( hash !== last_hash ) {
        history_set( last_hash = hash, history_hash );
        
        $(window).trigger( str_hashchange );
        
      } else if ( history_hash !== last_hash ) {
        location.href = location.href.replace( /#.*/, '' ) + history_hash;
      }
      
      timeout_id = setTimeout( poll, $.fn[ str_hashchange ].delay );
    };
    
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // vvvvvvvvvvvvvvvvvvv REMOVE IF NOT SUPPORTING IE6/7/8 vvvvvvvvvvvvvvvvvvv
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    window.attachEvent && !window.addEventListener && !supports_onhashchange && (function() {
      // Not only do IE6/7 need the "magical" Iframe treatment, but so does IE8
      // when running in "IE7 compatibility" mode.
      
      var iframe,
        iframe_src;
      
      // When the event is bound and polling starts in IE 6/7, create a hidden
      // Iframe for history handling.
      self.start = function() {
        if ( !iframe ) {
          iframe_src = $.fn[ str_hashchange ].src;
          iframe_src = iframe_src && iframe_src + get_fragment();
          
          // Create hidden Iframe. Attempt to make Iframe as hidden as possible
          // by using techniques from http://www.paciellogroup.com/blog/?p=604.
          iframe = $('<iframe tabindex="-1" title="empty"/>').hide()
            
            // When Iframe has completely loaded, initialize the history and
            // start polling.
            .one( 'load', function() {
              iframe_src || history_set( get_fragment() );
              poll();
            })
            
            // Load Iframe src if specified, otherwise nothing.
            .attr( 'src', iframe_src || 'javascript:0' )
            
            // Append Iframe after the end of the body to prevent unnecessary
            // initial page scrolling (yes, this works).
            .insertAfter( 'body' )[0].contentWindow;
          
          // Whenever `document.title` changes, update the Iframe's title to
          // prettify the back/next history menu entries. Since IE sometimes
          // errors with "Unspecified error" the very first time this is set
          // (yes, very useful) wrap this with a try/catch block.
          doc.onpropertychange = function() {
            try {
              if ( event.propertyName === 'title' ) {
                iframe.document.title = doc.title;
              }
            } catch(e) {}
          };
          
        }
      };
      
      // Override the "stop" method since an IE6/7 Iframe was created. Even
      // if there are no longer any bound event handlers, the polling loop
      // is still necessary for back/next to work at all!
      self.stop = fn_retval;
      
      // Get history by looking at the hidden Iframe's location.hash.
      history_get = function() {
        return get_fragment( iframe.location.href );
      };
      
      // Set a new history item by opening and then closing the Iframe
      // document, *then* setting its location.hash. If document.domain has
      // been set, update that as well.
      history_set = function( hash, history_hash ) {
        var iframe_doc = iframe.document,
          domain = $.fn[ str_hashchange ].domain;
        
        if ( hash !== history_hash ) {
          // Update Iframe with any initial `document.title` that might be set.
          iframe_doc.title = doc.title;
          
          // Opening the Iframe's document after it has been closed is what
          // actually adds a history entry.
          iframe_doc.open();
          
          // Set document.domain for the Iframe document as well, if necessary.
          domain && iframe_doc.write( '<script>document.domain="' + domain + '"</script>' );
          
          iframe_doc.close();
          
          // Update the Iframe's hash, for great justice.
          iframe.location.hash = hash;
        }
      };
      
    })();
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // ^^^^^^^^^^^^^^^^^^^ REMOVE IF NOT SUPPORTING IE6/7/8 ^^^^^^^^^^^^^^^^^^^
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
    return self;
  })();
  
})(jQuery,this);

(function( $ ) {
	$.mobile = {};
//SAP MODIFICATION
// To enable using the native orientation change event instead of faking the event by jQuery mobile
jQuery.mobile.orientationChangeEnabled = true;
}( jQuery ));
(function( $, window, undefined ) {
	var nsNormalizeDict = {};

	// jQuery.mobile configurable options
	$.mobile = $.extend($.mobile, {

		// Version of the jQuery Mobile Framework
		version: "1.3.1",

		// Namespace used framework-wide for data-attrs. Default is no namespace
		ns: "",

		// Define the url parameter used for referencing widget-generated sub-pages.
		// Translates to to example.html&ui-page=subpageIdentifier
		// hash segment before &ui-page= is used to make Ajax request
		subPageUrlKey: "ui-page",

		// Class assigned to page currently in view, and during transitions
		activePageClass: "ui-page-active",

		// Class used for "active" button state, from CSS framework
		activeBtnClass: "ui-btn-active",

		// Class used for "focus" form element state, from CSS framework
		focusClass: "ui-focus",

		// Automatically handle clicks and form submissions through Ajax, when same-domain
		ajaxEnabled: true,

		// Automatically load and show pages based on location.hash
		hashListeningEnabled: true,

		// disable to prevent jquery from bothering with links
		linkBindingEnabled: true,

		// Set default page transition - 'none' for no transitions
		defaultPageTransition: "fade",

		// Set maximum window width for transitions to apply - 'false' for no limit
		maxTransitionWidth: false,

		// Minimum scroll distance that will be remembered when returning to a page
		minScrollBack: 250,

		// DEPRECATED: the following property is no longer in use, but defined until 2.0 to prevent conflicts
		touchOverflowEnabled: false,

		// Set default dialog transition - 'none' for no transitions
		defaultDialogTransition: "pop",

		// Error response message - appears when an Ajax page request fails
		pageLoadErrorMessage: "Error Loading Page",

		// For error messages, which theme does the box uses?
		pageLoadErrorMessageTheme: "e",

		// replace calls to window.history.back with phonegaps navigation helper
		// where it is provided on the window object
		phonegapNavigationEnabled: false,

		//automatically initialize the DOM when it's ready
		autoInitializePage: true,

		pushStateEnabled: true,

		// allows users to opt in to ignoring content by marking a parent element as
		// data-ignored
		ignoreContentEnabled: false,

		// turn of binding to the native orientationchange due to android orientation behavior
		orientationChangeEnabled: true,

		buttonMarkup: {
			hoverDelay: 200
		},

		// define the window and the document objects
		window: $( window ),
		document: $( document ),

		// TODO might be useful upstream in jquery itself ?
		keyCode: {
			ALT: 18,
			BACKSPACE: 8,
			CAPS_LOCK: 20,
			COMMA: 188,
			COMMAND: 91,
			COMMAND_LEFT: 91, // COMMAND
			COMMAND_RIGHT: 93,
			CONTROL: 17,
			DELETE: 46,
			DOWN: 40,
			END: 35,
			ENTER: 13,
			ESCAPE: 27,
			HOME: 36,
			INSERT: 45,
			LEFT: 37,
			MENU: 93, // COMMAND_RIGHT
			NUMPAD_ADD: 107,
			NUMPAD_DECIMAL: 110,
			NUMPAD_DIVIDE: 111,
			NUMPAD_ENTER: 108,
			NUMPAD_MULTIPLY: 106,
			NUMPAD_SUBTRACT: 109,
			PAGE_DOWN: 34,
			PAGE_UP: 33,
			PERIOD: 190,
			RIGHT: 39,
			SHIFT: 16,
			SPACE: 32,
			TAB: 9,
			UP: 38,
			WINDOWS: 91 // COMMAND
		},

		// Place to store various widget extensions
		behaviors: {},

		// Scroll page vertically: scroll to 0 to hide iOS address bar, or pass a Y value
		silentScroll: function( ypos ) {
			if ( $.type( ypos ) !== "number" ) {
				ypos = $.mobile.defaultHomeScroll;
			}

			// prevent scrollstart and scrollstop events
			$.event.special.scrollstart.enabled = false;

			setTimeout( function() {
				window.scrollTo( 0, ypos );
				$.mobile.document.trigger( "silentscroll", { x: 0, y: ypos });
			}, 20 );

			setTimeout( function() {
				$.event.special.scrollstart.enabled = true;
			}, 150 );
		},

		// Expose our cache for testing purposes.
		nsNormalizeDict: nsNormalizeDict,

		// Take a data attribute property, prepend the namespace
		// and then camel case the attribute string. Add the result
		// to our nsNormalizeDict so we don't have to do this again.
		nsNormalize: function( prop ) {
			if ( !prop ) {
				return;
			}

			return nsNormalizeDict[ prop ] || ( nsNormalizeDict[ prop ] = $.camelCase( $.mobile.ns + prop ) );
		},

		// Find the closest parent with a theme class on it. Note that
		// we are not using $.fn.closest() on purpose here because this
		// method gets called quite a bit and we need it to be as fast
		// as possible.
		getInheritedTheme: function( el, defaultTheme ) {
			var e = el[ 0 ],
				ltr = "",
				re = /ui-(bar|body|overlay)-([a-z])\b/,
				c, m;

			while ( e ) {
				c = e.className || "";
				if ( c && ( m = re.exec( c ) ) && ( ltr = m[ 2 ] ) ) {
					// We found a parent with a theme class
					// on it so bail from this loop.
					break;
				}

				e = e.parentNode;
			}

			// Return the theme letter we found, if none, return the
			// specified default.

			return ltr || defaultTheme || "a";
		},

		// TODO the following $ and $.fn extensions can/probably should be moved into jquery.mobile.core.helpers
		//
		// Find the closest javascript page element to gather settings data jsperf test
		// http://jsperf.com/single-complex-selector-vs-many-complex-selectors/edit
		// possibly naive, but it shows that the parsing overhead for *just* the page selector vs
		// the page and dialog selector is negligable. This could probably be speed up by
		// doing a similar parent node traversal to the one found in the inherited theme code above
		closestPageData: function( $target ) {
			return $target
				.closest( ':jqmData(role="page"), :jqmData(role="dialog")' )
				.data( "mobile-page" );
		},

		enhanceable: function( $set ) {
			return this.haveParents( $set, "enhance" );
		},

		hijackable: function( $set ) {
			return this.haveParents( $set, "ajax" );
		},

		haveParents: function( $set, attr ) {
			if ( !$.mobile.ignoreContentEnabled ) {
				return $set;
			}

			var count = $set.length,
				$newSet = $(),
				e, $element, excluded;

			for ( var i = 0; i < count; i++ ) {
				$element = $set.eq( i );
				excluded = false;
				e = $set[ i ];

				while ( e ) {
					var c = e.getAttribute ? e.getAttribute( "data-" + $.mobile.ns + attr ) : "";

					if ( c === "false" ) {
						excluded = true;
						break;
					}

					e = e.parentNode;
				}

				if ( !excluded ) {
					$newSet = $newSet.add( $element );
				}
			}

			return $newSet;
		},

		getScreenHeight: function() {
			// Native innerHeight returns more accurate value for this across platforms,
			// jQuery version is here as a normalized fallback for platforms like Symbian
			return window.innerHeight || $.mobile.window.height();
		}
	}, $.mobile );

	// Mobile version of data and removeData and hasData methods
	// ensures all data is set and retrieved using jQuery Mobile's data namespace
	$.fn.jqmData = function( prop, value ) {
		var result;
		if ( typeof prop !== "undefined" ) {
			if ( prop ) {
				prop = $.mobile.nsNormalize( prop );
			}

			// undefined is permitted as an explicit input for the second param
			// in this case it returns the value and does not set it to undefined
			if( arguments.length < 2 || value === undefined ){
				result = this.data( prop );
			} else {
				result = this.data( prop, value );
			}
		}
		return result;
	};

	$.jqmData = function( elem, prop, value ) {
		var result;
		if ( typeof prop !== "undefined" ) {
			result = $.data( elem, prop ? $.mobile.nsNormalize( prop ) : prop, value );
		}
		return result;
	};

	$.fn.jqmRemoveData = function( prop ) {
		return this.removeData( $.mobile.nsNormalize( prop ) );
	};

	$.jqmRemoveData = function( elem, prop ) {
		return $.removeData( elem, $.mobile.nsNormalize( prop ) );
	};

	$.fn.removeWithDependents = function() {
		$.removeWithDependents( this );
	};

	$.removeWithDependents = function( elem ) {
		var $elem = $( elem );

		( $elem.jqmData( 'dependents' ) || $() ).remove();
		$elem.remove();
	};

	$.fn.addDependents = function( newDependents ) {
		$.addDependents( $( this ), newDependents );
	};

	$.addDependents = function( elem, newDependents ) {
		var dependents = $( elem ).jqmData( 'dependents' ) || $();

		$( elem ).jqmData( 'dependents', $.merge( dependents, newDependents ) );
	};

	// note that this helper doesn't attempt to handle the callback
	// or setting of an html element's text, its only purpose is
	// to return the html encoded version of the text in all cases. (thus the name)
	$.fn.getEncodedText = function() {
		return $( "<div/>" ).text( $( this ).text() ).html();
	};

	// fluent helper function for the mobile namespaced equivalent
	$.fn.jqmEnhanceable = function() {
		return $.mobile.enhanceable( this );
	};

	$.fn.jqmHijackable = function() {
		return $.mobile.hijackable( this );
	};

	// Monkey-patching Sizzle to filter the :jqmData selector
	var oldFind = $.find,
		jqmDataRE = /:jqmData\(([^)]*)\)/g;

	$.find = function( selector, context, ret, extra ) {
		selector = selector.replace( jqmDataRE, "[data-" + ( $.mobile.ns || "" ) + "$1]" );

		return oldFind.call( this, selector, context, ret, extra );
	};

	$.extend( $.find, oldFind );

	$.find.matches = function( expr, set ) {
		return $.find( expr, null, null, set );
	};

	$.find.matchesSelector = function( node, expr ) {
		return $.find( expr, null, null, [ node ] ).length > 0;
	};
})( jQuery, this );


(function( $, undefined ) {

	/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
	window.matchMedia = window.matchMedia || (function( doc, undefined ) {

		

		var bool,
			docElem = doc.documentElement,
			refNode = docElem.firstElementChild || docElem.firstChild,
			// fakeBody required for <FF4 when executed in <head>
			fakeBody = doc.createElement( "body" ),
			div = doc.createElement( "div" );

		div.id = "mq-test-1";
		div.style.cssText = "position:absolute;top:-100em";
		fakeBody.style.background = "none";
		fakeBody.appendChild(div);

		return function(q){

			div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

			docElem.insertBefore( fakeBody, refNode );
			bool = div.offsetWidth === 42;
			docElem.removeChild( fakeBody );

			return {
				matches: bool,
				media: q
			};

		};

	}( document ));

	// $.mobile.media uses matchMedia to return a boolean.
	$.mobile.media = function( q ) {
		return window.matchMedia( q ).matches;
	};

})(jQuery);

	(function( $, undefined ) {
		var support = {
			touch: "ontouchend" in document
		};
		// SAP MODIFICATION
		// => if the device API is loaded we override the touch detection
		if (window.sap && sap.ui && sap.ui.Device && sap.ui.Device.support) {
			support.touch = sap.ui.Device.support.touch
		}

		$.mobile.support = $.mobile.support || {};
		$.extend( $.support, support );
		$.extend( $.mobile.support, support );
	}( jQuery ));

	(function( $, undefined ) {
		$.extend( $.support, {
			orientation: "orientation" in window && "onorientationchange" in window
		});
	}( jQuery ));

(function( $, undefined ) {

// thx Modernizr
function propExists( prop ) {
	var uc_prop = prop.charAt( 0 ).toUpperCase() + prop.substr( 1 ),
		props = ( prop + " " + vendors.join( uc_prop + " " ) + uc_prop ).split( " " );

	for ( var v in props ) {
		if ( fbCSS[ props[ v ] ] !== undefined ) {
			return true;
		}
	}
}

var fakeBody = $( "<body>" ).prependTo( "html" ),
	fbCSS = fakeBody[ 0 ].style,
	vendors = [ "Webkit", "Moz", "O" ],
	webos = "palmGetResource" in window, //only used to rule out scrollTop
	opera = window.opera,
	operamini = window.operamini && ({}).toString.call( window.operamini ) === "[object OperaMini]",
	bb = window.blackberry && !propExists( "-webkit-transform" ); //only used to rule out box shadow, as it's filled opaque on BB 5 and lower


function validStyle( prop, value, check_vend ) {
	var div = document.createElement( 'div' ),
		uc = function( txt ) {
			return txt.charAt( 0 ).toUpperCase() + txt.substr( 1 );
		},
		vend_pref = function( vend ) {
			if( vend === "" ) {
				return "";
			} else {
				return  "-" + vend.charAt( 0 ).toLowerCase() + vend.substr( 1 ) + "-";
			}
		},
		check_style = function( vend ) {
			var vend_prop = vend_pref( vend ) + prop + ": " + value + ";",
				uc_vend = uc( vend ),
				propStyle = uc_vend + ( uc_vend === "" ? prop : uc( prop ) );

			div.setAttribute( "style", vend_prop );

			if ( !!div.style[ propStyle ] ) {
				ret = true;
			}
		},
		check_vends = check_vend ? check_vend : vendors,
		ret;

	for( var i = 0; i < check_vends.length; i++ ) {
		check_style( check_vends[i] );
	}
	return !!ret;
}

function transform3dTest() {
	var mqProp = "transform-3d",
		// Because the `translate3d` test below throws false positives in Android:
		ret = $.mobile.media( "(-" + vendors.join( "-" + mqProp + "),(-" ) + "-" + mqProp + "),(" + mqProp + ")" );

	if( ret ) {
		return !!ret;
	}

	var el = document.createElement( "div" ),
		transforms = {
			// We’re omitting Opera for the time being; MS uses unprefixed.
			'MozTransform':'-moz-transform',
			'transform':'transform'
		};

	fakeBody.append( el );

	for ( var t in transforms ) {
		if( el.style[ t ] !== undefined ){
			el.style[ t ] = 'translate3d( 100px, 1px, 1px )';
			ret = window.getComputedStyle( el ).getPropertyValue( transforms[ t ] );
		}
	}
	return ( !!ret && ret !== "none" );
}

// Test for dynamic-updating base tag support ( allows us to avoid href,src attr rewriting )
function baseTagTest() {
	var fauxBase = location.protocol + "//" + location.host + location.pathname + "ui-dir/",
		base = $( "head base" ),
		fauxEle = null,
		href = "",
		link, rebase;

	if ( !base.length ) {
		base = fauxEle = $( "<base>", { "href": fauxBase }).appendTo( "head" );
	} else {
		href = base.attr( "href" );
	}

	link = $( "<a href='testurl' />" ).prependTo( fakeBody );
	rebase = link[ 0 ].href;
	base[ 0 ].href = href || location.pathname;

	if ( fauxEle ) {
		fauxEle.remove();
	}
	return rebase.indexOf( fauxBase ) === 0;
}

// Thanks Modernizr
function cssPointerEventsTest() {
	var element = document.createElement( 'x' ),
		documentElement = document.documentElement,
		getComputedStyle = window.getComputedStyle,
		// ##### BEGIN: MODIFIED BY SAP
		computed = getComputedStyle && getComputedStyle(element, ''),
		// ##### END: MODIFIED BY SAP
		supports;

	if ( !( 'pointerEvents' in element.style ) ) {
		return false;
	}

	element.style.pointerEvents = 'auto';
	element.style.pointerEvents = 'x';
	documentElement.appendChild( element );
	// ##### BEGIN: MODIFIED BY SAP
	//supports = getComputedStyle &&
	//getComputedStyle( element, '' ).pointerEvents === 'auto';
	supports = computed && computed.pointerEvents === 'auto';
	// ##### END: MODIFIED BY SAP
	documentElement.removeChild( element );
	return !!supports;
}

function boundingRect() {
	var div = document.createElement( "div" );
	return typeof div.getBoundingClientRect !== "undefined";
}

// non-UA-based IE version check by James Padolsey, modified by jdalton - from http://gist.github.com/527683
// allows for inclusion of IE 6+, including Windows Mobile 7
$.extend( $.mobile, { browser: {} } );
$.mobile.browser.oldIE = (function() {
	var v = 3,
		div = document.createElement( "div" ),
		a = div.all || [];

	do {
		div.innerHTML = "<!--[if gt IE " + ( ++v ) + "]><br><![endif]-->";
	} while( a[0] );

	return v > 4 ? v : !v;
})();

function fixedPosition() {
	var w = window,
		ua = navigator.userAgent,
		platform = navigator.platform,
		// Rendering engine is Webkit, and capture major version
		wkmatch = ua.match( /AppleWebKit\/([0-9]+)/ ),
		wkversion = !!wkmatch && wkmatch[ 1 ],
		ffmatch = ua.match( /Fennec\/([0-9]+)/ ),
		ffversion = !!ffmatch && ffmatch[ 1 ],
		operammobilematch = ua.match( /Opera Mobi\/([0-9]+)/ ),
		omversion = !!operammobilematch && operammobilematch[ 1 ];

	if(
		// iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
		( ( platform.indexOf( "iPhone" ) > -1 || platform.indexOf( "iPad" ) > -1  || platform.indexOf( "iPod" ) > -1 ) && wkversion && wkversion < 534 ) ||
		// Opera Mini
		( w.operamini && ({}).toString.call( w.operamini ) === "[object OperaMini]" ) ||
		( operammobilematch && omversion < 7458 )	||
		//Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
		( ua.indexOf( "Android" ) > -1 && wkversion && wkversion < 533 ) ||
		// Firefox Mobile before 6.0 -
		( ffversion && ffversion < 6 ) ||
		// WebOS less than 3
		( "palmGetResource" in window && wkversion && wkversion < 534 )	||
		// MeeGo
		( ua.indexOf( "MeeGo" ) > -1 && ua.indexOf( "NokiaBrowser/8.5.0" ) > -1 ) ) {
		return false;
	}

	return true;
}

$.extend( $.support, {
	cssTransitions: "WebKitTransitionEvent" in window ||
		validStyle( 'transition', 'height 100ms linear', [ "Webkit", "Moz", "" ] ) &&
		!$.mobile.browser.oldIE && !opera,

	// Note, Chrome for iOS has an extremely quirky implementation of popstate.
	// We've chosen to take the shortest path to a bug fix here for issue #5426
	// See the following link for information about the regex chosen
	// https://developers.google.com/chrome/mobile/docs/user-agent#chrome_for_ios_user-agent
	pushState: "pushState" in history &&
		"replaceState" in history &&
		// When running inside a FF iframe, calling replaceState causes an error
		!( window.navigator.userAgent.indexOf( "Firefox" ) >= 0 && window.top !== window ) &&
		( window.navigator.userAgent.search(/CriOS/) === -1 ),

	mediaquery: $.mobile.media( "only all" ),
	cssPseudoElement: !!propExists( "content" ),
	touchOverflow: !!propExists( "overflowScrolling" ),
	cssTransform3d: transform3dTest(),
	boxShadow: !!propExists( "boxShadow" ) && !bb,
	fixedPosition: fixedPosition(),
	scrollTop: ("pageXOffset" in window ||
		"scrollTop" in document.documentElement ||
		"scrollTop" in fakeBody[ 0 ]) && !webos && !operamini,

	dynamicBaseTag: baseTagTest(),
	cssPointerEvents: cssPointerEventsTest(),
	boundingRect: boundingRect()
});

fakeBody.remove();


// $.mobile.ajaxBlacklist is used to override ajaxEnabled on platforms that have known conflicts with hash history updates (BB5, Symbian)
// or that generally work better browsing in regular http for full page refreshes (Opera Mini)
// Note: This detection below is used as a last resort.
// We recommend only using these detection methods when all other more reliable/forward-looking approaches are not possible
var nokiaLTE7_3 = (function() {

	var ua = window.navigator.userAgent;

	//The following is an attempt to match Nokia browsers that are running Symbian/s60, with webkit, version 7.3 or older
	return ua.indexOf( "Nokia" ) > -1 &&
			( ua.indexOf( "Symbian/3" ) > -1 || ua.indexOf( "Series60/5" ) > -1 ) &&
			ua.indexOf( "AppleWebKit" ) > -1 &&
			ua.match( /(BrowserNG|NokiaBrowser)\/7\.[0-3]/ );
})();

// Support conditions that must be met in order to proceed
// default enhanced qualifications are media query support OR IE 7+

$.mobile.gradeA = function() {
	return ( $.support.mediaquery || $.mobile.browser.oldIE && $.mobile.browser.oldIE >= 7 ) && ( $.support.boundingRect || $.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/) !== null );
};

$.mobile.ajaxBlacklist =
			// BlackBerry browsers, pre-webkit
			window.blackberry && !window.WebKitPoint ||
			// Opera Mini
			operamini ||
			// Symbian webkits pre 7.3
			nokiaLTE7_3;

// Lastly, this workaround is the only way we've found so far to get pre 7.3 Symbian webkit devices
// to render the stylesheets when they're referenced before this script, as we'd recommend doing.
// This simply reappends the CSS in place, which for some reason makes it apply
if ( nokiaLTE7_3 ) {
	$(function() {
		$( "head link[rel='stylesheet']" ).attr( "rel", "alternate stylesheet" ).attr( "rel", "stylesheet" );
	});
}

// For ruling out shadows via css
if ( !$.support.boxShadow ) {
	$( "html" ).addClass( "ui-mobile-nosupport-boxshadow" );
}

})( jQuery );


(function( $, undefined ) {
	var $win = $.mobile.window, self, history;

	$.event.special.navigate = self = {
		bound: false,

		pushStateEnabled: true,

		originalEventName: undefined,

		// If pushstate support is present and push state support is defined to
		// be true on the mobile namespace.
		isPushStateEnabled: function() {
			return $.support.pushState &&
				$.mobile.pushStateEnabled === true &&
				this.isHashChangeEnabled();
		},

		// !! assumes mobile namespace is present
		isHashChangeEnabled: function() {
			return $.mobile.hashListeningEnabled === true;
		},

		// TODO a lot of duplication between popstate and hashchange
		popstate: function( event ) {
			var newEvent = new $.Event( "navigate" ),
				beforeNavigate = new $.Event( "beforenavigate" ),
				state = event.originalEvent.state || {},
				href = location.href;

			$win.trigger( beforeNavigate );

			if( beforeNavigate.isDefaultPrevented() ){
				return;
			}

			if( event.historyState ){
				$.extend(state, event.historyState);
			}

			// Make sure the original event is tracked for the end
			// user to inspect incase they want to do something special
			newEvent.originalEvent = event;

			// NOTE we let the current stack unwind because any assignment to
			//      location.hash will stop the world and run this event handler. By
			//      doing this we create a similar behavior to hashchange on hash
			//      assignment
			setTimeout(function() {
				$win.trigger( newEvent, {
					state: state
				});
			}, 0);
		},

		hashchange: function( event, data ) {
			var newEvent = new $.Event( "navigate" ),
				beforeNavigate = new $.Event( "beforenavigate" );

			$win.trigger( beforeNavigate );

			if( beforeNavigate.isDefaultPrevented() ){
				return;
			}

			// Make sure the original event is tracked for the end
			// user to inspect incase they want to do something special
			newEvent.originalEvent = event;

			// Trigger the hashchange with state provided by the user
			// that altered the hash
			$win.trigger( newEvent, {
				// Users that want to fully normalize the two events
				// will need to do history management down the stack and
				// add the state to the event before this binding is fired
				// TODO consider allowing for the explicit addition of callbacks
				//      to be fired before this value is set to avoid event timing issues
				state: event.hashchangeState || {}
			});
		},

		// TODO We really only want to set this up once
		//      but I'm not clear if there's a beter way to achieve
		//      this with the jQuery special event structure
		setup: function( data, namespaces ) {
			if( self.bound ) {
				return;
			}

			self.bound = true;

			if( self.isPushStateEnabled() ) {
				self.originalEventName = "popstate";
				$win.bind( "popstate.navigate", self.popstate );
			} else if ( self.isHashChangeEnabled() ){
				self.originalEventName = "hashchange";
				$win.bind( "hashchange.navigate", self.hashchange );
			}
		}
	};
})( jQuery );



	// throttled resize event
	(function( $ ) {
		$.event.special.throttledresize = {
			setup: function() {
				$( this ).bind( "resize", handler );
			},
			teardown: function() {
				$( this ).unbind( "resize", handler );
			}
		};

		var throttle = 250,
			handler = function() {
				curr = ( new Date() ).getTime();
				diff = curr - lastCall;

				if ( diff >= throttle ) {

					lastCall = curr;
					$( this ).trigger( "throttledresize" );

				} else {

					if ( heldCall ) {
						clearTimeout( heldCall );
					}

					// Promise a held call will still execute
					heldCall = setTimeout( handler, throttle - diff );
				}
			},
			lastCall = 0,
			heldCall,
			curr,
			diff;
	})( jQuery );

(function( $, window ) {
	var win = $( window ),
		event_name = "orientationchange",
		special_event,
		get_orientation,
		last_orientation,
		initial_orientation_is_landscape,
		initial_orientation_is_default,
		portrait_map = { "0": true, "180": true };

	// It seems that some device/browser vendors use window.orientation values 0 and 180 to
	// denote the "default" orientation. For iOS devices, and most other smart-phones tested,
	// the default orientation is always "portrait", but in some Android and RIM based tablets,
	// the default orientation is "landscape". The following code attempts to use the window
	// dimensions to figure out what the current orientation is, and then makes adjustments
	// to the to the portrait_map if necessary, so that we can properly decode the
	// window.orientation value whenever get_orientation() is called.
	//
	// Note that we used to use a media query to figure out what the orientation the browser
	// thinks it is in:
	//
	//     initial_orientation_is_landscape = $.mobile.media("all and (orientation: landscape)");
	//
	// but there was an iPhone/iPod Touch bug beginning with iOS 4.2, up through iOS 5.1,
	// where the browser *ALWAYS* applied the landscape media query. This bug does not
	// happen on iPad.

	if ( $.support.orientation ) {

		// Check the window width and height to figure out what the current orientation
		// of the device is at this moment. Note that we've initialized the portrait map
		// values to 0 and 180, *AND* we purposely check for landscape so that if we guess
		// wrong, , we default to the assumption that portrait is the default orientation.
		// We use a threshold check below because on some platforms like iOS, the iPhone
		// form-factor can report a larger width than height if the user turns on the
		// developer console. The actual threshold value is somewhat arbitrary, we just
		// need to make sure it is large enough to exclude the developer console case.

		var ww = window.innerWidth || win.width(),
			wh = window.innerHeight || win.height(),
			landscape_threshold = 50;

		initial_orientation_is_landscape = ww > wh && ( ww - wh ) > landscape_threshold;


		// Now check to see if the current window.orientation is 0 or 180.
		initial_orientation_is_default = portrait_map[ window.orientation ];

		// If the initial orientation is landscape, but window.orientation reports 0 or 180, *OR*
		// if the initial orientation is portrait, but window.orientation reports 90 or -90, we
		// need to flip our portrait_map values because landscape is the default orientation for
		// this device/browser.
		if ( ( initial_orientation_is_landscape && initial_orientation_is_default ) || ( !initial_orientation_is_landscape && !initial_orientation_is_default ) ) {
			portrait_map = { "-90": true, "90": true };
		}
	}

	$.event.special.orientationchange = $.extend( {}, $.event.special.orientationchange, {
		setup: function() {
			// If the event is supported natively, return false so that jQuery
			// will bind to the event using DOM methods.
			if ( $.support.orientation && !$.event.special.orientationchange.disabled ) {
				return false;
			}

			// Get the current orientation to avoid initial double-triggering.
			last_orientation = get_orientation();

			// Because the orientationchange event doesn't exist, simulate the
			// event by testing window dimensions on resize.
			win.bind( "throttledresize", handler );
		},
		teardown: function() {
			// If the event is not supported natively, return false so that
			// jQuery will unbind the event using DOM methods.
			if ( $.support.orientation && !$.event.special.orientationchange.disabled ) {
				return false;
			}

			// Because the orientationchange event doesn't exist, unbind the
			// resize event handler.
			win.unbind( "throttledresize", handler );
		},
		add: function( handleObj ) {
			// Save a reference to the bound event handler.
			var old_handler = handleObj.handler;


			handleObj.handler = function( event ) {
				// Modify event object, adding the .orientation property.
				event.orientation = get_orientation();

				// Call the originally-bound event handler and return its result.
				return old_handler.apply( this, arguments );
			};
		}
	});

	// If the event is not supported natively, this handler will be bound to
	// the window resize event to simulate the orientationchange event.
	function handler() {
		// Get the current orientation.
		var orientation = get_orientation();

		if ( orientation !== last_orientation ) {
			// The orientation has changed, so trigger the orientationchange event.
			last_orientation = orientation;
			win.trigger( event_name );
		}
	}

	// Get the current page orientation. This method is exposed publicly, should it
	// be needed, as jQuery.event.special.orientationchange.orientation()
	$.event.special.orientationchange.orientation = get_orientation = function() {
		var isPortrait = true, elem = document.documentElement;

		// prefer window orientation to the calculation based on screensize as
		// the actual screen resize takes place before or after the orientation change event
		// has been fired depending on implementation (eg android 2.3 is before, iphone after).
		// More testing is required to determine if a more reliable method of determining the new screensize
		// is possible when orientationchange is fired. (eg, use media queries + element + opacity)
		if ( $.support.orientation ) {
			// if the window orientation registers as 0 or 180 degrees report
			// portrait, otherwise landscape
			isPortrait = portrait_map[ window.orientation ];
		} else {
			isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
		}

		return isPortrait ? "portrait" : "landscape";
	};

	$.fn[ event_name ] = function( fn ) {
		return fn ? this.bind( event_name, fn ) : this.trigger( event_name );
	};

	// jQuery < 1.8
	if ( $.attrFn ) {
		$.attrFn[ event_name ] = true;
	}

}( jQuery, this ));


// This plugin is an experiment for abstracting away the touch and mouse
// events so that developers don't have to worry about which method of input
// the device their document is loaded on supports.
//
// The idea here is to allow the developer to register listeners for the
// basic mouse events, such as mousedown, mousemove, mouseup, and click,
// and the plugin will take care of registering the correct listeners
// behind the scenes to invoke the listener at the fastest possible time
// for that device, while still retaining the order of event firing in
// the traditional mouse environment, should multiple handlers be registered
// on the same element for different events.
//
// The current version exposes the following virtual events to jQuery bind methods:
// "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel"

(function( $, window, document, undefined ) {

var dataPropertyName = "virtualMouseBindings",
	touchTargetPropertyName = "virtualTouchID",
	virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split( " " ),
	touchEventProps = "clientX clientY pageX pageY screenX screenY".split( " " ),
	mouseHookProps = $.event.mouseHooks ? $.event.mouseHooks.props : [],
	mouseEventProps = $.event.props.concat( mouseHookProps ),
	activeDocHandlers = {},
	resetTimerID = 0,
	startX = 0,
	startY = 0,
	didScroll = false,
	clickBlockList = [],
	blockMouseTriggers = false,
	blockTouchTriggers = false,
	eventCaptureSupported = "addEventListener" in document,
	$document = $( document ),
	nextTouchID = 1,
	lastTouchID = 0, threshold;

$.vmouse = {
	moveDistanceThreshold: 10,
	clickDistanceThreshold: 10,
	resetTimerDuration: 1500
};

function getNativeEvent( event ) {

	while ( event && typeof event.originalEvent !== "undefined" ) {
		event = event.originalEvent;
	}
	return event;
}

function createVirtualEvent( event, eventType ) {

	var t = event.type,
		oe, props, ne, prop, ct, touch, i, j, len;

	event = $.Event( event );
	event.type = eventType;

	oe = event.originalEvent;
	props = $.event.props;

	// addresses separation of $.event.props in to $.event.mouseHook.props and Issue 3280
	// https://github.com/jquery/jquery-mobile/issues/3280
	if ( t.search( /^(mouse|click)/ ) > -1 ) {
		props = mouseEventProps;
	}

	// copy original event properties over to the new event
	// this would happen if we could call $.event.fix instead of $.Event
	// but we don't have a way to force an event to be fixed multiple times
	if ( oe ) {
		for ( i = props.length, prop; i; ) {
			prop = props[ --i ];
			event[ prop ] = oe[ prop ];
		}
	}

	// make sure that if the mouse and click virtual events are generated
	// without a .which one is defined
	if ( t.search(/mouse(down|up)|click/) > -1 && !event.which ) {
		event.which = 1;
	}

	if ( t.search(/^touch/) !== -1 ) {
		ne = getNativeEvent( oe );
		t = ne.touches;
		ct = ne.changedTouches;
		touch = ( t && t.length ) ? t[0] : ( ( ct && ct.length ) ? ct[ 0 ] : undefined );

		if ( touch ) {
			for ( j = 0, len = touchEventProps.length; j < len; j++) {
				prop = touchEventProps[ j ];
				event[ prop ] = touch[ prop ];
			}
		}
	}

	return event;
}

function getVirtualBindingFlags( element ) {

	var flags = {},
		b, k;

	while ( element ) {

		b = $.data( element, dataPropertyName );

		for (  k in b ) {
			if ( b[ k ] ) {
				flags[ k ] = flags.hasVirtualBinding = true;
			}
		}
		element = element.parentNode;
	}
	return flags;
}

function getClosestElementWithVirtualBinding( element, eventType ) {
	var b;
	while ( element ) {

		b = $.data( element, dataPropertyName );

		if ( b && ( !eventType || b[ eventType ] ) ) {
			return element;
		}
		element = element.parentNode;
	}
	return null;
}

function enableTouchBindings() {
	blockTouchTriggers = false;
}

function disableTouchBindings() {
	blockTouchTriggers = true;
}

function enableMouseBindings() {
	lastTouchID = 0;
	clickBlockList.length = 0;
	blockMouseTriggers = false;

	// When mouse bindings are enabled, our
	// touch bindings are disabled.
	disableTouchBindings();
}

function disableMouseBindings() {
	// When mouse bindings are disabled, our
	// touch bindings are enabled.
	enableTouchBindings();
}

function startResetTimer() {
	clearResetTimer();
	resetTimerID = setTimeout( function() {
		resetTimerID = 0;
		enableMouseBindings();
	}, $.vmouse.resetTimerDuration );
}

function clearResetTimer() {
	if ( resetTimerID ) {
		clearTimeout( resetTimerID );
		resetTimerID = 0;
	}
}

function triggerVirtualEvent( eventType, event, flags ) {
	var ve;

	if ( ( flags && flags[ eventType ] ) ||
				( !flags && getClosestElementWithVirtualBinding( event.target, eventType ) ) ) {

		ve = createVirtualEvent( event, eventType );

		$( event.target).trigger( ve );
	}

	return ve;
}

function mouseEventCallback( event ) {
	var touchID = $.data( event.target, touchTargetPropertyName );

	if ( !blockMouseTriggers && ( !lastTouchID || lastTouchID !== touchID ) ){
		var ve = triggerVirtualEvent( "v" + event.type, event );
		if ( ve ) {
			if ( ve.isDefaultPrevented() ) {
				event.preventDefault();
			}
			if ( ve.isPropagationStopped() ) {
				event.stopPropagation();
			}
			if ( ve.isImmediatePropagationStopped() ) {
				event.stopImmediatePropagation();
			}
		}
	}
}

function handleTouchStart( event ) {

	var touches = getNativeEvent( event ).touches,
		target, flags;

	if ( touches && touches.length === 1 ) {

		target = event.target;
		flags = getVirtualBindingFlags( target );

		if ( flags.hasVirtualBinding ) {

			lastTouchID = nextTouchID++;
			$.data( target, touchTargetPropertyName, lastTouchID );

			clearResetTimer();

			disableMouseBindings();
			didScroll = false;

			var t = getNativeEvent( event ).touches[ 0 ];
			startX = t.pageX;
			startY = t.pageY;

			triggerVirtualEvent( "vmouseover", event, flags );
			triggerVirtualEvent( "vmousedown", event, flags );
		}
	}
}

function handleScroll( event ) {
	if ( blockTouchTriggers ) {
		return;
	}

	if ( !didScroll ) {
		triggerVirtualEvent( "vmousecancel", event, getVirtualBindingFlags( event.target ) );
	}

	didScroll = true;
	startResetTimer();
}

function handleTouchMove( event ) {
	if ( blockTouchTriggers ) {
		return;
	}

	var t = getNativeEvent( event ).touches[ 0 ],
		didCancel = didScroll,
		moveThreshold = $.vmouse.moveDistanceThreshold,
		flags = getVirtualBindingFlags( event.target );

		didScroll = didScroll ||
			( Math.abs( t.pageX - startX ) > moveThreshold ||
				Math.abs( t.pageY - startY ) > moveThreshold );


	if ( didScroll && !didCancel ) {
		triggerVirtualEvent( "vmousecancel", event, flags );
	}

	triggerVirtualEvent( "vmousemove", event, flags );
	startResetTimer();
}

function handleTouchEnd( event ) {
	if ( blockTouchTriggers ) {
		return;
	}

	disableTouchBindings();

	var flags = getVirtualBindingFlags( event.target ),
		t;
	triggerVirtualEvent( "vmouseup", event, flags );

	if ( !didScroll ) {
		// SAP MODIFICATION
		// The ve variable is removed because the next if expression is changed
		triggerVirtualEvent( "vclick", event, flags );

		// SAP MODIFICATION
		// The next line was written as: if (ve && ve.isDefaultPrevented) originally from jQuery mobile
		// We have done following changes to this line.
		//
		// 1. ve.isDefaultPrevented() replaced by $.support.touch: because calling prevent default breaks
		// some native features from the browser, for example:
		// 		On screen keyboard can't be opened on touch enabled device
		//		Focused input can't get blurred by tapping outside the input
		// Therefore we make the code within the if executed on mobile device where delayed mouse events
		// are fired.
		//
		// 2. "ve" is removed: because when event.target is detached from DOM tree, "ve" is undefined and
		// the following logic isn't executed on mobile device. If a DOM node is removed by listening to
		// "touchend" or "tap" event, the click event is still dispatched to the DOM element which appears
		// at the same position after the DOM deletion. For example, pressing the delete button in one
		// ListItem deletes two list items at the end. Therefore we need to activate the code no matter if
		// the event.target is currently detached from the DOM tree or not.
		if ($.support.touch) {
			// The target of the mouse events that follow the touchend
			// event don't necessarily match the target used during the
			// touch. This means we need to rely on coordinates for blocking
			// any click that is generated.
			t = getNativeEvent( event ).changedTouches[ 0 ];
			clickBlockList.push({
				touchID: lastTouchID,
				x: t.clientX,
				// SAP MODIFICATION
				// On mobile device, the entire UI may be shifted up after the on screen keyboard
				// is open. The Y-axis value may be different between the touch event and the delayed
				// mouse event. Therefore it's needed to take the window.scrollY which represents how
				// far the window is shifted up into the calculation of y-axis value to make sure that
				// the delayed mouse event can be correctly marked.
				y: t.clientY + window.scrollY,
				// SAP MODIFICATION
				// the touchend event target is needed by suppressing mousedown, mouseup, click event
				target: event.target
			});

			// Prevent any mouse events that follow from triggering
			// virtual event notifications.
			blockMouseTriggers = true;
		}
	}
	triggerVirtualEvent( "vmouseout", event, flags);
	didScroll = false;

	startResetTimer();
}

function hasVirtualBindings( ele ) {
	var bindings = $.data( ele, dataPropertyName ),
		k;

	if ( bindings ) {
		for ( k in bindings ) {
			if ( bindings[ k ] ) {
				return true;
			}
		}
	}
	return false;
}

function dummyMouseHandler() {}

function getSpecialEventObject( eventType ) {
	var realType = eventType.substr( 1 );

	return {
		setup: function( data, namespace ) {
			// If this is the first virtual mouse binding for this element,
			// add a bindings object to its data.

			if ( !hasVirtualBindings( this ) ) {
				$.data( this, dataPropertyName, {} );
			}

			// If setup is called, we know it is the first binding for this
			// eventType, so initialize the count for the eventType to zero.
			var bindings = $.data( this, dataPropertyName );
			bindings[ eventType ] = true;

			// If this is the first virtual mouse event for this type,
			// register a global handler on the document.

			activeDocHandlers[ eventType ] = ( activeDocHandlers[ eventType ] || 0 ) + 1;

			if ( activeDocHandlers[ eventType ] === 1 ) {
				$document.bind( realType, mouseEventCallback );
			}

			// Some browsers, like Opera Mini, won't dispatch mouse/click events
			// for elements unless they actually have handlers registered on them.
			// To get around this, we register dummy handlers on the elements.

			$( this ).bind( realType, dummyMouseHandler );

			// For now, if event capture is not supported, we rely on mouse handlers.
			if ( eventCaptureSupported ) {
				// If this is the first virtual mouse binding for the document,
				// register our touchstart handler on the document.

				activeDocHandlers[ "touchstart" ] = ( activeDocHandlers[ "touchstart" ] || 0) + 1;

				if ( activeDocHandlers[ "touchstart" ] === 1 ) {
					$document.bind( "touchstart", handleTouchStart )
						.bind( "touchend", handleTouchEnd )

						// On touch platforms, touching the screen and then dragging your finger
						// causes the window content to scroll after some distance threshold is
						// exceeded. On these platforms, a scroll prevents a click event from being
						// dispatched, and on some platforms, even the touchend is suppressed. To
						// mimic the suppression of the click event, we need to watch for a scroll
						// event. Unfortunately, some platforms like iOS don't dispatch scroll
						// events until *AFTER* the user lifts their finger (touchend). This means
						// we need to watch both scroll and touchmove events to figure out whether
						// or not a scroll happenens before the touchend event is fired.

						.bind( "touchmove", handleTouchMove );
					//TODO: investigate and find out why tapping on listitem triggers a scroll event
					// which prevents the tap event from being fired.
//						.bind( "scroll", handleScroll );
				}
			}
		},

		teardown: function( data, namespace ) {
			// If this is the last virtual binding for this eventType,
			// remove its global handler from the document.

			--activeDocHandlers[ eventType ];

			if ( !activeDocHandlers[ eventType ] ) {
				$document.unbind( realType, mouseEventCallback );
			}

			if ( eventCaptureSupported ) {
				// If this is the last virtual mouse binding in existence,
				// remove our document touchstart listener.

				--activeDocHandlers[ "touchstart" ];

				if ( !activeDocHandlers[ "touchstart" ] ) {
					$document.unbind( "touchstart", handleTouchStart )
						.unbind( "touchmove", handleTouchMove )
						.unbind( "touchend", handleTouchEnd )
						.unbind( "scroll", handleScroll );
				}
			}

			var $this = $( this ),
				bindings = $.data( this, dataPropertyName );

			// teardown may be called when an element was
			// removed from the DOM. If this is the case,
			// jQuery core may have already stripped the element
			// of any data bindings so we need to check it before
			// using it.
			if ( bindings ) {
				bindings[ eventType ] = false;
			}

			// Unregister the dummy event handler.

			$this.unbind( realType, dummyMouseHandler );

			// If this is the last virtual mouse binding on the
			// element, remove the binding data from the element.

			if ( !hasVirtualBindings( this ) ) {
				$this.removeData( dataPropertyName );
			}
		}
	};
}

// Expose our custom events to the jQuery bind/unbind mechanism.

for ( var i = 0; i < virtualEventNames.length; i++ ) {
	$.event.special[ virtualEventNames[ i ] ] = getSpecialEventObject( virtualEventNames[ i ] );
}

// Add a capture click handler to block clicks.
// Note that we require event capture support for this so if the device
// doesn't support it, we punt for now and rely solely on mouse events.
if ( eventCaptureSupported ) {
	function suppressEvent ( e ) {
		var cnt = clickBlockList.length,
			target = e.target,
			x, y, ele, i, o, touchID;

		if ( cnt ) {
			x = e.clientX;
			// SAP MODIFICATION
			// On mobile device, the entire UI may be shifted up after the on screen keyboard
			// is open. The Y-axis value may be different between the touch event and the delayed
			// mouse event. Therefore it's needed to take the window.scrollY which represents how
			// far the window is shifted up into the calculation of y-axis value to make sure that
			// the delayed mouse event can be correctly marked.
			y = e.clientY + window.scrollY;
			threshold = $.vmouse.clickDistanceThreshold;

			// The idea here is to run through the clickBlockList to see if
			// the current click event is in the proximity of one of our
			// vclick events that had preventDefault() called on it. If we find
			// one, then we block the click.
			//
			// Why do we have to rely on proximity?
			//
			// Because the target of the touch event that triggered the vclick
			// can be different from the target of the click event synthesized
			// by the browser. The target of a mouse/click event that is syntehsized
			// from a touch event seems to be implementation specific. For example,
			// some browsers will fire mouse/click events for a link that is near
			// a touch event, even though the target of the touchstart/touchend event
			// says the user touched outside the link. Also, it seems that with most
			// browsers, the target of the mouse/click event is not calculated until the
			// time it is dispatched, so if you replace an element that you touched
			// with another element, the target of the mouse/click will be the new
			// element underneath that point.
			//
			// Aside from proximity, we also check to see if the target and any
			// of its ancestors were the ones that blocked a click. This is necessary
			// because of the strange mouse/click target calculation done in the
			// Android 2.1 browser, where if you click on an element, and there is a
			// mouse/click handler on one of its ancestors, the target will be the
			// innermost child of the touched element, even if that child is no where
			// near the point of touch.

			ele = target;

			while ( ele ) {
				for ( i = 0; i < cnt; i++ ) {
					o = clickBlockList[ i ];
					touchID = 0;

					if ( ( ele === target && Math.abs( o.x - x ) < threshold && Math.abs( o.y - y ) < threshold ) ||
								$.data( ele, touchTargetPropertyName ) === o.touchID ) {
						// XXX: We may want to consider removing matches from the block list
						//      instead of waiting for the reset timer to fire.

						// SAP MODIFICATION
						// The simulated mouse events from mobile browser which are fired with 300ms delay are marked here.
						//
						// Those marked events can be suppressed in event handler to avoid handling the semantic identical
						// events twice (like touchstart and mousedown).
						//
						// One exception is made for event marked with isSynthetic which is fired from the event simulation
						if ( !e.isSynthetic ) {
							e._sapui_delayedMouseEvent = true;
						}

						// SAP MODIFICATION
						// The event is suppressed only when its target is different than the touchend event's target.
						// This ensures that only the unnecessary events are suppressed.
						if ( target === o.target ) {
							return;
						}

						e.preventDefault();
						e.stopPropagation();
						return;
					}
				}
				ele = ele.parentNode;
			}
		}
	}

	// SAP MODIFICATION
	// In the original version, only the click event is suppressed.
	// But this can't solve the issue that on screen keyboard is opened 
	// when clicking on the current page switches to an input DOM element 
	// on the same position. This keyboard opening is caused by mousedown
	// and mouseup event which have delay reach on the underneath input.
	// Thus the mousedown and mouseup events should also be suppressed.
	//
	// The mousedown, mouseup and click events are suppressed only when their
	// coordinate is proximitely the same as the coordinate of recorded touch
	// events and the mouse event's target is different than the target of the
	// touch event.
	// Do not suppress mouse and click events on Windows Phone.
	if (!(sap.ui.Device.os.windows_phone && sap.ui.Device.os.version < 10)) {
		document.addEventListener( "mousedown", suppressEvent, true );
		document.addEventListener( "mouseup", suppressEvent, true );
		document.addEventListener( "click", suppressEvent, true );
	}
}
})( jQuery, window, document );


(function( $, window, undefined ) {
	var $document = $( document );

	// add new event shortcuts
	$.each( ( "touchstart touchmove touchend " +
		"tap taphold " +
		"swipe swipeleft swiperight " +
		"scrollstart scrollstop" ).split( " " ), function( i, name ) {

		$.fn[ name ] = function( fn ) {
			return fn ? this.bind( name, fn ) : this.trigger( name );
		};

		// jQuery < 1.8
		if ( $.attrFn ) {
			$.attrFn[ name ] = true;
		}
	});

	var supportTouch = $.mobile.support.touch,
		scrollEvent = "touchmove scroll",
		touchStartEvent = supportTouch ? "touchstart" : "mousedown",
		// SAP MODIFICATION
		// touchcancel has to be used because touchcancel is fired under some condition instead of
		// touchend when runs on Windows 8 device.
		touchStopEvent = supportTouch ? "touchend touchcancel" : "mouseup",
		touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

	function triggerCustomEvent( obj, eventType, event ) {
		var originalType = event.type;
		event.type = eventType;
		$.event.dispatch.call( obj, event );
		event.type = originalType;
	}

	// also handles scrollstop
	$.event.special.scrollstart = {

		enabled: true,

		setup: function() {

			var thisObject = this,
				$this = $( thisObject ),
				scrolling,
				timer;

			function trigger( event, state ) {
				scrolling = state;
				triggerCustomEvent( thisObject, scrolling ? "scrollstart" : "scrollstop", event );
			}

			// iPhone triggers scroll after a small delay; use touchmove instead
			$this.bind( scrollEvent, function( event ) {

				if ( !$.event.special.scrollstart.enabled ) {
					return;
				}

				if ( !scrolling ) {
					trigger( event, true );
				}

				clearTimeout( timer );
				timer = setTimeout( function() {
					trigger( event, false );
				}, 50 );
			});
		}
	};

	// also handles taphold
	$.event.special.tap = {
		tapholdThreshold: 750,

		setup: function() {
			var thisObject = this,
				$this = $( thisObject );

			$this.bind( "vmousedown", function( event ) {

				if ( event.which && event.which !== 1 ) {
					return false;
				}

				var origTarget = event.target,
					origEvent = event.originalEvent,
					timer;

				function clearTapTimer() {
					clearTimeout( timer );
				}

				function clearTapHandlers() {
					clearTapTimer();

					$this.unbind( "vclick", clickHandler )
						.unbind( "vmouseup", clearTapTimer );
					$document.unbind( "vmousecancel", clearTapHandlers );
				}

				function clickHandler( event ) {
					clearTapHandlers();

					// ONLY trigger a 'tap' event if the start target is
					// the same as the stop target.
					if ( origTarget === event.target ) {
						triggerCustomEvent( thisObject, "tap", event );
					}
				}

				$this.bind( "vmouseup", clearTapTimer )
					.bind( "vclick", clickHandler );
				$document.bind( "vmousecancel", clearTapHandlers );

				timer = setTimeout( function() {
					triggerCustomEvent( thisObject, "taphold", $.Event( "taphold", { target: origTarget } ) );
				}, $.event.special.tap.tapholdThreshold );
			});
		}
	};

	// also handles swipeleft, swiperight
	$.event.special.swipe = {
		scrollSupressionThreshold: 30, // More than this horizontal displacement, and we will suppress scrolling.

		durationThreshold: 1000, // More time than this, and it isn't a swipe.

		horizontalDistanceThreshold: 30,  // Swipe horizontal displacement must be more than this.

		verticalDistanceThreshold: 75,  // Swipe vertical displacement must be less than this.

		start: function( event ) {
			var data = event.originalEvent.touches ?
					event.originalEvent.touches[ 0 ] : event;
			return {
						time: ( new Date() ).getTime(),
						coords: [ data.pageX, data.pageY ],
						origin: $( event.target )
					};
		},

		stop: function( event ) {
			var data = event.originalEvent.touches ?
					event.originalEvent.touches[ 0 ] : event;
			return {
						time: ( new Date() ).getTime(),
						coords: [ data.pageX, data.pageY ]
					};
		},

		handleSwipe: function( start, stop ) {
			if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
				Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
				Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {

				start.origin.trigger( "swipe" )
					.trigger( start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight" );
			}
		},

		setup: function() {
			var thisObject = this,
				$this = $( thisObject );

			$this.bind( touchStartEvent, function( event ) {
				// SAP MODIFICATION: mark touch events, so only the lowest UIArea within the hierarchy will create a swipe event
				if (event.isMarked("swipestartHandled")) {
					return;
				}
				event.setMarked("swipestartHandled");
				
				var start = $.event.special.swipe.start( event ),
					stop;

				function moveHandler( event ) {
					if ( !start ) {
						return;
					}

					stop = $.event.special.swipe.stop( event );

					// prevent scrolling
					// SAP MODIFICATION: skip this behavior on chrome+desktop, as it prevents text selection on non-input fields (CSN #3696977/2013)
					// NOTE: other browsers (Firefox, IE, Safari) don't stop the text selection when calling preventDefault, so we only alter the behaviour for Chrome to be as close to the original implementation of jQuery 
					if (!sap.ui.Device.system.desktop || sap.ui.Device.browser.name !== "cr") {
						if (!sap.ui.Device.os.blackberry && Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold ) {
							event.preventDefault();
						}
					}
				}

				// SAP MODIFICATION
				// Because touchcancel is used together with touchend, jQuery.fn.bind is used to replace
				// jQuery.fn.one due to the fact that jQuery.fn.one doesn't work for multiple events.
				function stopHandler( event ) {
					$this.unbind( touchMoveEvent, moveHandler )
						.unbind( touchStopEvent, stopHandler );

					if ( start && stop ) {
						$.event.special.swipe.handleSwipe( start, stop );
					}
					start = stop = undefined;
				}

				$this.bind( touchMoveEvent, moveHandler )
					.bind( touchStopEvent, stopHandler );
			});
		}
	};
	$.each({
		scrollstop: "scrollstart",
		taphold: "tap",
		swipeleft: "swipe",
		swiperight: "swipe"
	}, function( event, sourceEvent ) {

		$.event.special[ event ] = {
			setup: function() {
				$( this ).bind( sourceEvent, $.noop );
			}
		};
	});

})( jQuery, this );


}));
