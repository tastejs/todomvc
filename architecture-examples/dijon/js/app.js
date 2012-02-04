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

                system.mapSingleton( 'config', ns.Config );
                system.getObject( 'config' );

                system.notify( 'App:startup' );
                system.notify( 'App:startupComplete' );
            }
        }
    }
}( dijondemo ) );

dijondemo.app = new dijondemo.App();
dijondemo.app.startup();