/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('classnamemanager', function (Y, NAME) {

/**
* Contains a singleton (ClassNameManager) that enables easy creation and caching of 
* prefixed class names.
* @module classnamemanager
*/

/**
 * A singleton class providing: 
 * 
 * <ul>
 *    <li>Easy creation of prefixed class names</li>
 *    <li>Caching of previously created class names for improved performance.</li>
 * </ul>
 * 
 * @class ClassNameManager
 * @static 
 */

// String constants
var CLASS_NAME_PREFIX = 'classNamePrefix',
	CLASS_NAME_DELIMITER = 'classNameDelimiter',
    CONFIG = Y.config;

// Global config

/**
 * Configuration property indicating the prefix for all CSS class names in this YUI instance.
 *
 * @property classNamePrefix
 * @type {String}
 * @default "yui"
 * @static
 */
CONFIG[CLASS_NAME_PREFIX] = CONFIG[CLASS_NAME_PREFIX] || 'yui3';

/**
 * Configuration property indicating the delimiter used to compose all CSS class names in
 * this YUI instance.
 *
 * @property classNameDelimiter
 * @type {String}
 * @default "-"
 * @static
 */
CONFIG[CLASS_NAME_DELIMITER] = CONFIG[CLASS_NAME_DELIMITER] || '-';

Y.ClassNameManager = function () {

	var sPrefix    = CONFIG[CLASS_NAME_PREFIX],
		sDelimiter = CONFIG[CLASS_NAME_DELIMITER];

	return {

		/**
		 * Returns a class name prefixed with the the value of the 
		 * <code>Y.config.classNamePrefix</code> attribute + the provided strings.
		 * Uses the <code>Y.config.classNameDelimiter</code> attribute to delimit the 
		 * provided strings. E.g. Y.ClassNameManager.getClassName('foo','bar'); // yui-foo-bar
		 *
		 * @method getClassName
		 * @param {String}+ classnameSection one or more classname sections to be joined
		 * @param {Boolean} skipPrefix If set to true, the classname will not be prefixed with the default Y.config.classNameDelimiter value.  
		 */
		getClassName: Y.cached(function () {

            var args = Y.Array(arguments);

            if (args[args.length-1] !== true) {
                args.unshift(sPrefix);
            } else {
                args.pop();
            }

			return args.join(sDelimiter);
		})

	};

}();


}, '3.7.3', {"requires": ["yui-base"]});
