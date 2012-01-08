/**
 * @license Copyright (c) 2010-2011 Brian Cavalier
 * LICENSE: see the LICENSE.txt file. If file is missing, this file is subject
 * to the MIT License at: http://www.opensource.org/licenses/mit-license.php.
 */

/**
 * template.js
 */
define(['require', 'underscore'], function(require, _) {

    function resolveTemplate(resolver, name, refObj /*, wire */) {
        
        require([ 'text!' + name ], function( template ) {
            resolver.resolve( _.template( template ) );
        } );

    }

    return {
        wire$plugin: function(/*ready, destroyed, options*/) {
            return {
                resolvers: {
                    'template.underscore': resolveTemplate
                }
            };
        }
    };

});
