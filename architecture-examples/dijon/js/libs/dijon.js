/**
 * @author <a href="http://www.creynders.be">Camille Reynders</a>
 * @namespace
 */
var dijon = {
	/**
	 * framework version number
	 * @constant
	 * @type String
	 */
	VERSION : '0.5.0'
};//dijon


  //======================================//
 // dijon.System
//======================================//

/**
 * @class dijon.System
 * @constructor
*/
dijon.System = function(){
	/** @private */
	this._mappings = {};

	/** @private */
	this._outlets = {};

    /** @private */
    this._handlers = {};

    /**
     * When <code>true</code> injections are made only if an object has a property with the mapped outlet name.<br/>
     * <strong>Set to <code>false</code> at own risk</strong>, may have quite undesired side effects.
     * @example
     * system.strictInjections = true
     * var o = {};
     * system.mapSingleton( 'userModel', UserModel );
     * system.mapOutlet( 'userModel' );
     * system.injectInto( o );
     *
     * //o is unchanged
     *
     * system.strictInjections = false;
     * system.injectInto( o );
     *
     * //o now has a member 'userModel' which holds a reference to the singleton instance
     * //of UserModel
     * @property
     * @type Boolean
     * @default true
     */
    this.strictInjections = true;

    /**
     * Enables the automatic mapping of outlets for mapped values, singletons and classes
     * When this is true any value, singleton or class that is mapped will automatically be mapped as a global outlet
     * using the value of <code>key</code> as outlet name
     *
     * @example
     * var o = {
     *     userModel : undefined; //inject
     * }
     * system.mapSingleton( 'userModel', UserModel );
     * system.injectInto( o ):
     * //o.userModel now holds a reference to the singleton instance of UserModel
     * @property
     * @type Boolean
     * @default false
     */
    this.autoMapOutlets = false;
};//dijon.System

dijon.System.prototype = {

	/**
	 * @private
	 * @param {Class} clazz
	 */
	_createAndSetupInstance : function( key, clazz ){
		var instance = new clazz();
		this.injectInto( instance, key );
		if( "setup" in instance ) instance.setup.call( instance );
		return instance;
	},

	/**
	 * @private
	 * @param {String} key
	 * @param {Boolean} overrideRules
	 * @return {Object}
	 */
	_retrieveFromCacheOrCreate : function( key, overrideRules ){
        if( overrideRules == undefined ) overrideRules = false;
        if( this._mappings.hasOwnProperty( key ) ){
            var config = this._mappings[ key ];
            var output = null;
            if( !overrideRules && config.isSingleton ){
                if( config.object == null  ){
                    config.object = this._createAndSetupInstance( key, config.clazz );
                }
                output = config.object;
            }else{
                if( config.clazz ) output = this._createAndSetupInstance( key, config.clazz );
                else{

                }
            }
        }else{
            throw new Error( 1020 );
        }
		return output
	},


	/**
	 * defines <code>outletName</code> as an injection point in <code>targetKey</code>for the object mapped to <code>sourceKey</code>
     * @example
     * var o = {
     *     user : undefined //inject
     * }
     * system.mapValue( 'o', o );
     * system.mapSingleton( 'userModel', UserModel );
     * system.mapOutlet( 'userModel', 'o', 'user' );
     *
     * var obj = system.getInstance( 'o' );
     * //obj.user holds a reference to the singleton instance of UserModel
     *
     * @example
     * var o = {
     *      userModel : undefined //inject
     * }
     * system.mapValue( 'o', o );
     * system.mapSingleton( 'userModel', UserModel );
     * system.mapOutlet( 'userModel', 'o' );
     *
     * var obj = system.getInstance( 'o' );
     * //obj.userModel holds a reference to the singleton instance of UserModel
     *
     * @example
     *
     * var o = {
     *      userModel : undefined
     * }
     *
     * system.mapSingleton( 'userModel', UserModel );
     * system.mapOutlet( 'userModel' );
     *
     * system.injectInto( o );
     *
     * //o.userModel holds a reference to the singleton instance of userModel
     *
     * @param {String} sourceKey the key mapped to the object that will be injected
     * @param {String} [targetKey='global'] the key the outlet is assigned to.
	 * @param {String} [outletName=sourceKey] the name of the property used as an outlet.<br/>
     * @see dijon.System#unmapOutlet
	 */
	mapOutlet : function( sourceKey, targetKey, outletName ){
	    if( sourceKey == undefined ) throw new Error( 1010 );
        if( targetKey == undefined ) targetKey = "global";
        if( outletName == undefined ) outletName = sourceKey;
        if( ! this._outlets.hasOwnProperty( targetKey ) ) this._outlets[ targetKey ] = {};
		this._outlets[ targetKey ][ outletName ] = sourceKey
	},

	/**
	 * Retrieve (or create) the object mapped to <code>key</code>
     * @example
     * system.mapValue( 'foo', 'bar' );
     * var b = system.getObject( 'foo' ); //now contains 'bar'
	 * @param {Object} key
	 * @return {Object}
	 */
	getObject : function( key ){
	    if( key == undefined ) throw new Error( 1010 )
		return this._retrieveFromCacheOrCreate( key );
	},

	/**
	 * Maps <code>useValue</code> to <code>key</code>
     * @example
     * system.mapValue( 'foo', 'bar' );
     * var b = system.getObject( 'foo' ); //now contains 'bar'
	 * @param {String} key
	 * @param {Object} useValue
	 */
	mapValue : function( key, useValue ){
	    if( key == undefined ) throw new Error( 1010 );
		this._mappings[ key ]= {
            clazz : null,
            object : useValue,
            isSingleton : true
		}
        if( this.autoMapOutlets ) this.mapOutlet( key );
	},

	/**
	 * Returns whether the key is mapped to an object
     * @example
     * system.mapValue( 'foo', 'bar' );
     * var isMapped = system.hasMapping( 'foo' );
	 * @param {String} key
	 * @return {Boolean}
	 */
	hasMapping : function( key ){
	    if( key == undefined ) throw new Error( 1010 );
		return this._mappings.hasOwnProperty( key );
	},

	/**
     * Maps <code>clazz</code> as a factory to <code>key</code>
     * @example
     * var SomeClass = function(){
     * }
     * system.mapClass( 'o', SomeClass );
     *
     * var s1 = system.getInstance( 'o' );
     * var s2 = system.getInstance( 'o' );
     *
     * //s1 and s2 reference two different instances of SomeClass
     *
	 * @param {String} key
	 * @param {Function} clazz
	 */
	mapClass : function( key, clazz ){
	    if( key == undefined ) throw new Error( 1010 );
	    if( key == undefined ) throw new Error( 1010 );
		this._mappings[ key ]= {
				clazz : clazz,
				object : null,
				isSingleton : false
        }
        if( this.autoMapOutlets ) this.mapOutlet( key );
	},

    /**
     * Maps <code>clazz</code> as a singleton factory to <code>key</code>
     * @example
     * var SomeClass = function(){
     * }
     * system.mapSingleton( 'o', SomeClass );
     *
     * var s1 = system.getInstance( 'o' );
     * var s2 = system.getInstance( 'o' );
     *
     * //s1 and s2 reference the same instance of SomeClass
     *
     * @param {String} key
     * @param {Function} clazz
     */
    mapSingleton : function( key, clazz ){
        if( key == undefined ) throw new Error( 1010 );
        if( clazz == undefined ) throw new Error( 1010 );
        this._mappings[ key ] = {
            clazz : clazz,
            object : null,
            isSingleton : true
        }
        if( this.autoMapOutlets ) this.mapOutlet( key );
    },

	/**
     * Force instantiation of the object mapped to <code>key</code>, whether it was mapped as a singleton or not.
	 * @param {Class} keyOrClass
	 * @return {Object}
	 */
	instantiate : function( key ){
        if( key == undefined ) throw new Error( 1010 );
		return this._retrieveFromCacheOrCreate( key, true );
	},

	/**
	 * Perform an injection into an object, satisfying all it's dependencies
	 * @param {Object} instance
     * @param {String} [key]
	 */
	injectInto : function( instance, key ){
        if( instance == undefined ) throw new Error( 1010 );
        var o = [];
        if( this._outlets.hasOwnProperty( 'global' ) ) o.push( this._outlets[ 'global' ] );
        if( key != undefined && this._outlets.hasOwnProperty( key ) ) o.push( this._outlets[ key ] );
        for( var i in o ){
            var l = o [ i ];
            for( var outlet in l ){
                var source = l[ outlet ];
                //must be "in" [!]
                if( ! this.strictInjections || outlet in instance ) instance[ outlet ] = this.getObject( source );
            }
        }

        return instance;
	},

	/**
	 * Remove a rule from the System
	 * @param {String} key
	 */
	unmap : function( key ){
        if( key == undefined ) throw new Error( 1010 );
		delete this._mappings[ key ];
	},

	/**
	 * removes an injection point mapping for a given class mapped to <code>key</code>
	 * @param {String} target
	 * @param {String} outlet
	 * @see dijon.System#addOutlet
	 */
	unmapOutlet : function( target, outlet ){
        if( target == undefined ) throw new Error( 1010 );
        if( outlet == undefined ) throw new Error( 1010 );
		delete this._outlets[ target ][ outlet ];
	},

    /**
     *
     * @param {String} eventName
     * @param {String} [key=undefined]
     * @param {String|Function} [handler=eventName]
     * @param {Boolean} [oneShot=false]
     * @param {Boolean} [passEvent=false]
     */
    mapHandler : function( eventName, key, handler, oneShot, passEvent ){
        if( eventName == undefined ) throw new Error( 1010 );
        if( key == undefined ) key = 'global';
        if( handler == undefined ) handler = eventName;
        if( oneShot == undefined ) oneShot = false;
        if( passEvent == undefined ) passEvent = false;
        if( ! this._handlers.hasOwnProperty( eventName ) ){
            this._handlers[ eventName ] = {};
        }
        if( ! this._handlers[eventName].hasOwnProperty( key ) ){
            this._handlers[eventName][key] = [];
        }
        this._handlers[ eventName ][ key ].push( {
            handler : handler,
            oneShot: oneShot,
            passEvent: passEvent
        } );
    },

    /**
     *
     * @param {String} eventName
     * @param {String} [key=undefined]
     * @param {String | Function} [handler=eventName]
     */
    unmapHandler : function( eventName, key, handler  ){
        if( eventName == undefined ) throw new Error( 1010 );
        if( key == undefined ) key = 'global';
        if( handler == undefined ) handler = eventName;
        if( this._handlers.hasOwnProperty( eventName ) && this._handlers[ eventName ].hasOwnProperty( key ) ){
            var handlers = this._handlers[ eventName ][ key ];
            for( var i in handlers ){
                var config = handlers[ i ];
                if( config.handler == handler ){
                    handlers.splice( i, 1 );
                    return;
                }
            }
        }
    },

    /**
     *
     * @param {String} eventName
     */
    notify : function( eventName ){
        var argsWithEvent = Array.prototype.slice.call( arguments );
        var argsClean = argsWithEvent.slice(1);
        if( this._handlers.hasOwnProperty( eventName ) ){
            var handlers = this._handlers[ eventName ];
            for( var key in handlers ){
                var configs = handlers[ key ];
                var instance;
                if( key != 'global' ) instance = this.getObject( key );
                var toBeDeleted = [];
                for( var i = 0, n = configs.length; i < n; i++ ){
                    var handler;
                    var config = configs[ i ];
                    if( instance && typeof config.handler == "string" ){
                        handler = instance[ config.handler ];
                    }else{
                        handler = config.handler;
                    }

                    //see deletion below
                    if( config.oneShot ) toBeDeleted.unshift( i );

                    if( config.passEvent ) handler.apply( instance, argsWithEvent );
                    else handler.apply( instance, argsClean );
                }

                //items should be deleted in reverse order
                //either use push above and decrement here
                //or use unshift above and increment here
                for( var i = 0, n = toBeDeleted.length; i < n; i++ ){
                    configs.splice( toBeDeleted[ i ], 1 );
                }
            }
        }
    }

};//dijon.System.prototype
