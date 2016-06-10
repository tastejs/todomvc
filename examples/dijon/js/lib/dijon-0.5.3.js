/**
 * @author <a href="http://www.creynders.be">Camille Reynders</a>
 */
( function ( scope ) {

    "use strict";

    /**
     * @namespace
     */
    var dijon = {
        /**
         * framework version number
         * @constant
         * @type String
         */
        VERSION:'0.5.3'
    };//dijon


    //======================================//
    // dijon.System
    //======================================//

    /**
     * @class dijon.System
     * @constructor
     */
    dijon.System = function () {
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
         * @type Boolean
         * @default false
         */
        this.autoMapOutlets = false;

        /**
         * The name of the method that will be called for all instances, right after injection has occured.
         * @type String
         * @default 'setup'
         */
        this.postInjectionHook = 'setup';

    };//dijon.System

    dijon.System.prototype = {

        /**
         * @private
         * @param {Class} clazz
         */
        _createAndSetupInstance:function ( key, Clazz ) {
            var instance = new Clazz();
            this.injectInto( instance, key );
            return instance;
        },

        /**
         * @private
         * @param {String} key
         * @param {Boolean} overrideRules
         * @return {Object}
         */
        _retrieveFromCacheOrCreate:function ( key, overrideRules ) {
            if ( typeof overrideRules === 'undefined' ) {
                overrideRules = false;
            }
            var output;
            if ( this._mappings.hasOwnProperty( key ) ) {
                var config = this._mappings[ key ];
                if ( !overrideRules && config.isSingleton ) {
                    if ( config.object == null ) {
                        config.object = this._createAndSetupInstance( key, config.clazz );
                    }
                    output = config.object;
                } else {
                    if ( config.clazz ) {
                        output = this._createAndSetupInstance( key, config.clazz );
                    } else {
                        //TODO shouldn't this be null
                        output = config.object;
                    }
                }
            } else {
                throw new Error( 1000 );
            }
            return output;
        },


        /**
         * defines <code>outletName</code> as an injection point in <code>targetKey</code>for the object mapped to <code>sourceKey</code>
         * @example
         system.mapSingleton( 'userModel', TestClassA );
         var o = {
         user : undefined //inject
         }
         system.mapOutlet( 'userModel', 'o', 'user' );
         system.mapValue( 'o', o );

         var obj = system.getObject( 'o' );
         * //obj.user holds a reference to the singleton instance of UserModel
         *
         * @example
         system.mapSingleton( 'userModel', TestClassA );
         var o = {
         userModel : undefined //inject
         }
         system.mapOutlet( 'userModel', 'o' );
         system.mapValue( 'o', o );

         var obj = system.getObject( 'o' );
         * //obj.userModel holds a reference to the singleton instance of UserModel
         *
         * @example
         system.mapSingleton( 'userModel', TestClassA );
         system.mapOutlet( 'userModel' );
         var o = {
         userModel : undefined //inject
         }
         system.mapValue( 'o', o );

         var obj = system.getObject( 'o' );
         * //o.userModel holds a reference to the singleton instance of userModel
         *
         * @param {String} sourceKey the key mapped to the object that will be injected
         * @param {String} [targetKey='global'] the key the outlet is assigned to.
         * @param {String} [outletName=sourceKey] the name of the property used as an outlet.<br/>
         * @return {dijon.System}
         * @see dijon.System#unmapOutlet
         */
        mapOutlet:function ( sourceKey, targetKey, outletName ) {
            if ( typeof sourceKey === 'undefined' ) {
                throw new Error( 1010 );
            }
            targetKey = targetKey || "global";
            outletName = outletName || sourceKey;

            if ( !this._outlets.hasOwnProperty( targetKey ) ) {
                this._outlets[ targetKey ] = {};
            }
            this._outlets[ targetKey ][ outletName ] = sourceKey;

            return this;
        },

        /**
         * Retrieve (or create) the object mapped to <code>key</code>
         * @example
         * system.mapValue( 'foo', 'bar' );
         * var b = system.getObject( 'foo' ); //now contains 'bar'
         * @param {Object} key
         * @return {Object}
         */
        getObject:function ( key ) {
            if ( typeof key === 'undefined' ) {
                throw new Error( 1020 );
            }
            return this._retrieveFromCacheOrCreate( key );
        },

        /**
         * Maps <code>useValue</code> to <code>key</code>
         * @example
         * system.mapValue( 'foo', 'bar' );
         * var b = system.getObject( 'foo' ); //now contains 'bar'
         * @param {String} key
         * @param {Object} useValue
         * @return {dijon.System}
         */
        mapValue:function ( key, useValue ) {
            if ( typeof key === 'undefined' ) {
                throw new Error( 1030 );
            }
            this._mappings[ key ] = {
                clazz:null,
                object:useValue,
                isSingleton:true
            };
            if ( this.autoMapOutlets ) {
                this.mapOutlet( key );
            }
            if ( this.hasMapping( key )) {
                this.injectInto( useValue, key );
            }
            return this;
        },

        /**
         * Returns whether the key is mapped to an object
         * @example
         * system.mapValue( 'foo', 'bar' );
         * var isMapped = system.hasMapping( 'foo' );
         * @param {String} key
         * @return {Boolean}
         */
        hasMapping:function ( key ) {
            if ( typeof key === 'undefined' ) {
                throw new Error( 1040 );
            }
            return this._mappings.hasOwnProperty( key );
        },

        /**
         * Maps <code>clazz</code> as a factory to <code>key</code>
         * @example
         * var SomeClass = function(){
         * }
         * system.mapClass( 'o', SomeClass );
         *
         * var s1 = system.getObject( 'o' );
         * var s2 = system.getObject( 'o' );
         *
         * //s1 and s2 reference two different instances of SomeClass
         *
         * @param {String} key
         * @param {Function} clazz
         * @return {dijon.System}
         */
        mapClass:function ( key, clazz ) {
            if ( typeof key === 'undefined' ) {
                throw new Error( 1050 );
            }
            if ( typeof clazz === 'undefined' ) {
                throw new Error( 1051 );
            }
            this._mappings[ key ] = {
                clazz:clazz,
                object:null,
                isSingleton:false
            };
            if ( this.autoMapOutlets ) {
                this.mapOutlet( key );
            }
            return this;
        },

        /**
         * Maps <code>clazz</code> as a singleton factory to <code>key</code>
         * @example
         * var SomeClass = function(){
         * }
         * system.mapSingleton( 'o', SomeClass );
         *
         * var s1 = system.getObject( 'o' );
         * var s2 = system.getObject( 'o' );
         *
         * //s1 and s2 reference the same instance of SomeClass
         *
         * @param {String} key
         * @param {Function} clazz
         * @return {dijon.System}
         */
        mapSingleton:function ( key, clazz ) {
            if ( typeof key === 'undefined' ) {
                throw new Error( 1060 );
            }
            if ( typeof clazz === 'undefined' ) {
                throw new Error( 1061 );
            }
            this._mappings[ key ] = {
                clazz:clazz,
                object:null,
                isSingleton:true
            };
            if ( this.autoMapOutlets ) {
                this.mapOutlet( key );
            }
            return this;
        },

        /**
         * Force instantiation of the class mapped to <code>key</code>, whether it was mapped as a singleton or not.
         * When a value was mapped, the value will be returned.
         * TODO: should this last rule be changed?
         * @example
         var SomeClass = function(){
         }
         system.mapClass( 'o', SomeClass );

         var s1 = system.getObject( 'o' );
         var s2 = system.getObject( 'o' );
         * //s1 and s2 reference different instances of SomeClass
         *
         * @param {String} key
         * @return {Object}
         */
        instantiate:function ( key ) {
            if ( typeof key === 'undefined' ) {
                throw new Error( 1070 );
            }
            return this._retrieveFromCacheOrCreate( key, true );
        },

        /**
         * Perform an injection into an object's mapped outlets, satisfying all it's dependencies
         * @example
         * var UserModel = function(){
         * }
         * system.mapSingleton( 'userModel', UserModel );
         * var SomeClass = function(){
         *      user = undefined; //inject
         * }
         * system.mapSingleton( 'o', SomeClass );
         * system.mapOutlet( 'userModel', 'o', 'user' );
         *
         * var foo = {
         *      user : undefined //inject
         * }
         *
         * system.injectInto( foo, 'o' );
         *
         * //foo.user now holds a reference to the singleton instance of UserModel
         * @param {Object} instance
         * @param {String} [key] use the outlet mappings as defined for <code>key</code>, otherwise only the globally
         * mapped outlets will be used.
         * @return {dijon.System}
         */
        injectInto:function ( instance, key ) {
            if ( typeof instance === 'undefined' ) {
                throw new Error( 1080 );
            }
			if( ( typeof instance === 'object' ) ){
				var o = [];
				if ( this._outlets.hasOwnProperty( 'global' ) ) {
					o.push( this._outlets[ 'global' ] );
				}
				if ( typeof key !== 'undefined' && this._outlets.hasOwnProperty( key ) ) {
					o.push( this._outlets[ key ] );
				}
				for ( var i in o ) {
					var l = o [ i ];
					for ( var outlet in l ) {
						var source = l[ outlet ];
						//must be "in" [!]
						if ( !this.strictInjections || outlet in instance ) {
							instance[ outlet ] = this.getObject( source );
						}
					}
				}
				if ( "setup" in instance ) {
					instance.setup.call( instance );
				}
			}
            return this;
        },

        /**
         * Remove the mapping of <code>key</code> from the system
         * @param {String} key
         * @return {dijon.System}
         */
        unmap:function ( key ) {
            if ( typeof key === 'undefined' ) {
                throw new Error( 1090 );
            }
            delete this._mappings[ key ];

            return this;
        },

        /**
         * removes an injection point mapping for a given object mapped to <code>key</code>
         * @param {String} target
         * @param {String} outlet
         * @return {dijon.System}
         * @see dijon.System#addOutlet
         */
        unmapOutlet:function ( target, outlet ) {
            if ( typeof target === 'undefined' ) {
                throw new Error( 1100 );
            }
            if ( typeof outlet === 'undefined' ) {
                throw new Error( 1101 );
            }
            delete this._outlets[ target ][ outlet ];

            return this;
        },

        /**
         * maps a handler for an event/route.<br/>
         * @example
         var hasExecuted = false;
         var userView = {
         showUserProfile : function(){
         hasExecuted = true;
         }
         }
         system.mapValue( 'userView', userView );
         system.mapHandler( 'user/profile', 'userView', 'showUserProfile' );
         system.notify( 'user/profile' );
         //hasExecuted is true
         * @example
         * var userView = {
         *      showUserProfile : function(){
         *          //do stuff
         *      }
         * }
         * system.mapValue( 'userView', userView );
         * <strong>system.mapHandler( 'showUserProfile', 'userView' );</strong>
         * system.notify( 'showUserProfile' );
         *
         * //userView.showUserProfile is called
         * @example
         * var showUserProfile = function(){
         *          //do stuff
         * }
         * <strong>system.mapHandler( 'user/profile', undefined, showUserProfile );</strong>
         * system.notify( 'user/profile' );
         *
         * //showUserProfile is called
         * @example
         * var userView = {};
         * var showUserProfile = function(){
         *          //do stuff
         * }
         * system.mapValue( 'userView', userView );
         * <strong>system.mapHandler( 'user/profile', 'userView', showUserProfile );</strong>
         * system.notify( 'user/profile' );
         *
         * //showUserProfile is called within the scope of the userView object
         * @example
         * var userView = {
         *      showUserProfile : function(){
         *          //do stuff
         *      }
         * }
         * system.mapValue( 'userView', userView );
         * <strong>system.mapHandler( 'user/profile', 'userView', 'showUserProfile', true );</strong>
         * system.notify( 'user/profile' );
         * system.notify( 'user/profile' );
         * system.notify( 'user/profile' );
         *
         * //userView.showUserProfile is called exactly once [!]
         * @example
         * var userView = {
         *      showUserProfile : function( route ){
         *          //do stuff
         *      }
         * }
         * system.mapValue( 'userView', userView );
         * <strong>system.mapHandler( 'user/profile', 'userView', 'showUserProfile', false, true );</strong>
         * system.notify( 'user/profile' );
         *
         * //userView.showUserProfile is called and the route/eventName is passed to the handler
         * @param {String} eventName/route
         * @param {String} [key=undefined] If <code>key</code> is <code>undefined</code> the handler will be called without
         * scope.
         * @param {String|Function} [handler=eventName] If <code>handler</code> is <code>undefined</code> the value of
         * <code>eventName</code> will be used as the name of the member holding the reference to the to-be-called function.
         * <code>handler</code> accepts either a string, which will be used as the name of the member holding the reference
         * to the to-be-called function, or a direct function reference.
         * @param {Boolean} [oneShot=false] Defines whether the handler should be called exactly once and then automatically
         * unmapped
         * @param {Boolean} [passEvent=false] Defines whether the event object should be passed to the handler or not.
         * @return {dijon.System}
         * @see dijon.System#notify
         * @see dijon.System#unmapHandler
         */
        mapHandler:function ( eventName, key, handler, oneShot, passEvent ) {
            if ( typeof eventName === 'undefined' ) {
                throw new Error( 1110 );
            }
            key = key || 'global';
            handler = handler || eventName;

            if ( typeof oneShot === 'undefined' ) {
                oneShot = false;
            }
            if ( typeof passEvent === 'undefined' ) {
                passEvent = false;
            }
            if ( !this._handlers.hasOwnProperty( eventName ) ) {
                this._handlers[ eventName ] = {};
            }
            if ( !this._handlers[eventName].hasOwnProperty( key ) ) {
                this._handlers[eventName][key] = [];
            }
            this._handlers[ eventName ][ key ].push( {
                handler:handler,
                oneShot:oneShot,
                passEvent:passEvent
            } );

            return this;
        },

        /**
         * Unmaps the handler for a specific event/route.
         * @param {String} eventName Name of the event/route
         * @param {String} [key=undefined] If <code>key</code> is <code>undefined</code> the handler is removed from the
         * global mapping space. (If the same event is mapped globally and specifically for an object, then
         * only the globally mapped one will be removed)
         * @param {String | Function} [handler=eventName]
         * @return {dijon.System}
         * @see dijon.System#mapHandler
         */
        unmapHandler:function ( eventName, key, handler ) {
            if ( typeof eventName === 'undefined' ) {
                throw new Error( 1120 );
            }
            key = key || 'global';
            handler = handler || eventName;

            if ( this._handlers.hasOwnProperty( eventName ) && this._handlers[ eventName ].hasOwnProperty( key ) ) {
                var handlers = this._handlers[ eventName ][ key ];
                for ( var i in handlers ) {
                    var config = handlers[ i ];
                    if ( config.handler === handler ) {
                        handlers.splice( i, 1 );
                        break;
                    }
                }
            }
            return this;
        },

        /**
         * calls all handlers mapped to <code>eventName/route</code>
         * @param {String} eventName/route
         * @return {dijon.System}
         * @see dijon.System#mapHandler
         */
        notify:function ( eventName ) {
            if ( typeof eventName === 'undefined' ) {
                throw new Error( 1130 );
            }
            var argsWithEvent = Array.prototype.slice.call( arguments );
            var argsClean = argsWithEvent.slice( 1 );
            if ( this._handlers.hasOwnProperty( eventName ) ) {
                var handlers = this._handlers[ eventName ];
                for ( var key in handlers ) {
                    var configs = handlers[ key ];
                    var instance;
                    if ( key !== 'global' ) {
                        instance = this.getObject( key );
                    }
                    var toBeDeleted = [];
                    var i, n;
                    for ( i = 0, n = configs.length ; i < n ; i++ ) {
                        var handler;
                        var config = configs[ i ];
                        if ( instance && typeof config.handler === "string" ) {
                            handler = instance[ config.handler ];
                        } else {
                            handler = config.handler;
                        }

                        //see deletion below
                        if ( config.oneShot ) {
                            toBeDeleted.unshift( i );
                        }

                        if ( config.passEvent ) {
                            handler.apply( instance, argsWithEvent );
                        } else {
                            handler.apply( instance, argsClean );
                        }
                    }

                    //items should be deleted in reverse order
                    //either use push above and decrement here
                    //or use unshift above and increment here
                    for ( i = 0, n = toBeDeleted.length ; i < n ; i++ ) {
                        configs.splice( toBeDeleted[ i ], 1 );
                    }
                }
            }

            return this;
        }

    };//dijon.System.prototype

    scope.dijon = dijon;
}( this ));


