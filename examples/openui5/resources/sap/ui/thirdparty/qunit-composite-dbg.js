/**
 * QUnit Composite v1.0.2-pre commit 2e5299c63179a6f8b7fa9a3a34a31848708486e9
 *
 * https://github.com/JamesMGreene/qunit-composite
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * https://jquery.org/license/
 */
/*global QUnit*/// declare unusual global var for JSLint/SAPUI5 validation
(function( QUnit ) {
var iframe, hasBound,
	modules = 1,
	executingComposite = false;

function hasClass( elem, name ) {
	return ( " " + elem.className + " " ).indexOf( " " + name + " " ) > -1;
}

function addClass( elem, name ) {
	if ( !hasClass( elem, name ) ) {
		elem.className += ( elem.className ? " " : "" ) + name;
	}
}

function addEvent( elem, type, fn ) {
	if ( elem ) {
		if ( elem.addEventListener ) {
			// Standards-based browsers
			elem.addEventListener( type, fn, false );
		} else if ( elem.attachEvent ) {
			// support: IE <9
			elem.attachEvent( "on" + type, fn );
		}
	}
}


function getUrlParam( url , param) {
	param = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]" + param + "=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( url );
	if ( results == null ) {
		return "";
	} else {
	    return results[1];
	}
}

function runSuite( suite ) {
	var path;

	if ( QUnit.is( "object", suite ) ) {
		path = suite.path;
		suite = suite.name;
	} else {
		path = suite;
	}
	

	QUnit.asyncTest( suite, function() {
		iframe.setAttribute( "src", path );
		// QUnit.start is called from the child iframe's QUnit.done hook.
		var iFrameWidth = getUrlParam(path, 'sap-ui-width'),
			iFrameHeight = getUrlParam(path, 'sap-ui-height');
		if (iFrameWidth) {
			iframe.style.width = iFrameWidth;
		}
		if (iFrameHeight) {
			iframe.style.height = iFrameHeight;
		}
	});
}

function initIframe() {
	var iframeWin,
		body = document.body;

	function onIframeLoad() {
		var moduleName, testName,
			count = 0;

		if ( !iframe.src ) {
			return;
		}

		iframeWin.QUnit.moduleStart(function( data ) {
			// Capture module name for messages
			moduleName = data.name;
		});

		iframeWin.QUnit.testStart(function( data ) {
			// Capture test name for messages
			testName = data.name;
		});
		iframeWin.QUnit.testDone(function() {
			testName = undefined;
		});

		iframeWin.QUnit.log(function( data ) {
			if (testName === undefined) {
				return;
			}
			// Pass all test details through to the main page
			var message = ( moduleName ? moduleName + ": " : "" ) + testName + ": " + ( data.message || ( data.result ? "okay" : "failed" ) );
			QUnit.expect( ++count );
			QUnit.push( data.result, data.actual, data.expected, message );
		});

		// Continue the outer test when the iframe's test is done
		iframeWin.QUnit.done( QUnit.start );
	}

	iframe = document.createElement( "iframe" );
	iframe.className = "qunit-composite-suite";
	body.appendChild( iframe );

	addEvent( iframe, "load", onIframeLoad );

	iframeWin = iframe.contentWindow;
}

/**
 * @param {string} [name] Module name to group these test suites.
 * @param {Array} suites List of suites where each suite
 *  may either be a string (path to the html test page),
 *  or an object with a path and name property.
 */
QUnit.testSuites = function( name, suites ) {
	var i, suitesLen = 0;

	if ( arguments.length === 1 ) {
		suites = name;
		name = "Composition #" + modules++;
	}
	if (suites) {
		suitesLen = suites.length;
	}

	if ( !hasBound ) {
		hasBound = true;
		QUnit.begin( initIframe );

		// TODO: Would be better to use something like QUnit.once( 'moduleDone' )
		// after the last test suite.
		QUnit.moduleDone( function () {
			executingComposite = false;
		} );

		QUnit.done(function() {
			iframe.style.display = "none";
		});
	}

	QUnit.module( name, {
		setup: function () {
			executingComposite = true;
		}
	});

	for ( i = 0; i < suitesLen; i++ ) {
		runSuite( suites[ i ] );
	}
};

QUnit.testDone(function( data ) {
	if ( !executingComposite ) {
		return;
	}

	var i, len,
	    testNumber = QUnit.config.current.testNumber != null ?
				"qunit-test-output" + QUnit.config.current.testNumber :
					QUnit.config.current.id,
		id = data.testNumber != null ?
			"qunit-test-output" + data.testNumber :
			testNumber,
		current = document.getElementById( id ),
		children = current != null ? current.children : null,
		src = iframe.src;

	addEvent( current, "dblclick", function( e ) {
		var target = e && e.target ? e.target : window.event.srcElement;
		if ( target.nodeName.toLowerCase() === "span" || target.nodeName.toLowerCase() === "b" ) {
			target = target.parentNode;
		}
		if ( window.location && target.nodeName.toLowerCase() === "strong" ) {
			window.location = src;
		}
	});

	if (children) {
		// Undo QUnit's auto-expansion for bad tests
		for ( i = 0, len = children.length; i < len; i++ ) {
			if ( children[ i ].nodeName.toLowerCase() === "ol" ) {
				addClass( children[ i ], "qunit-collapsed" );
			}
		}
	}

	// Update Rerun link to point to the standalone test suite page
	if (current) {
		current.getElementsByTagName( "a" )[ 0 ].href = src;
	}
});

})(QUnit);
