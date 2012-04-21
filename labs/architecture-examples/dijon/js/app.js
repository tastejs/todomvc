/*

[MIT licensed](http://en.wikipedia.org/wiki/MIT_License)
(c) [Sindre Sorhus](http://sindresorhus.com)

*/
( function( ns ){
    ns.App = function(){
        var system;
        return {
            startup : function(){
                system = new dijon.System();

                system.mapValue( 'system', system );
                system.mapOutlet( 'system' );

                system.injectInto( new ns.Config() );

                system.notify( 'App:startup' );
                system.notify( 'App:startupComplete' );
            }
        }
    }
}( dijondemo ) );

dijondemo.app = new dijondemo.App();
dijondemo.app.startup();