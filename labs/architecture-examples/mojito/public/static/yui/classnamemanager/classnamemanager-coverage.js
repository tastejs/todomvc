/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/classnamemanager/classnamemanager.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/classnamemanager/classnamemanager.js",
    code: []
};
_yuitest_coverage["build/classnamemanager/classnamemanager.js"].code=["YUI.add('classnamemanager', function (Y, NAME) {","","/**","* Contains a singleton (ClassNameManager) that enables easy creation and caching of ","* prefixed class names.","* @module classnamemanager","*/","","/**"," * A singleton class providing: "," * "," * <ul>"," *    <li>Easy creation of prefixed class names</li>"," *    <li>Caching of previously created class names for improved performance.</li>"," * </ul>"," * "," * @class ClassNameManager"," * @static "," */","","// String constants","var CLASS_NAME_PREFIX = 'classNamePrefix',","	CLASS_NAME_DELIMITER = 'classNameDelimiter',","    CONFIG = Y.config;","","// Global config","","/**"," * Configuration property indicating the prefix for all CSS class names in this YUI instance."," *"," * @property classNamePrefix"," * @type {String}"," * @default \"yui\""," * @static"," */","CONFIG[CLASS_NAME_PREFIX] = CONFIG[CLASS_NAME_PREFIX] || 'yui3';","","/**"," * Configuration property indicating the delimiter used to compose all CSS class names in"," * this YUI instance."," *"," * @property classNameDelimiter"," * @type {String}"," * @default \"-\""," * @static"," */","CONFIG[CLASS_NAME_DELIMITER] = CONFIG[CLASS_NAME_DELIMITER] || '-';","","Y.ClassNameManager = function () {","","	var sPrefix    = CONFIG[CLASS_NAME_PREFIX],","		sDelimiter = CONFIG[CLASS_NAME_DELIMITER];","","	return {","","		/**","		 * Returns a class name prefixed with the the value of the ","		 * <code>Y.config.classNamePrefix</code> attribute + the provided strings.","		 * Uses the <code>Y.config.classNameDelimiter</code> attribute to delimit the ","		 * provided strings. E.g. Y.ClassNameManager.getClassName('foo','bar'); // yui-foo-bar","		 *","		 * @method getClassName","		 * @param {String}+ classnameSection one or more classname sections to be joined","		 * @param {Boolean} skipPrefix If set to true, the classname will not be prefixed with the default Y.config.classNameDelimiter value.  ","		 */","		getClassName: Y.cached(function () {","","            var args = Y.Array(arguments);","","            if (args[args.length-1] !== true) {","                args.unshift(sPrefix);","            } else {","                args.pop();","            }","","			return args.join(sDelimiter);","		})","","	};","","}();","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/classnamemanager/classnamemanager.js"].lines = {"1":0,"22":0,"36":0,"47":0,"49":0,"51":0,"54":0,"68":0,"70":0,"71":0,"73":0,"76":0};
_yuitest_coverage["build/classnamemanager/classnamemanager.js"].functions = {"(anonymous 2):66":0,"ClassNameManager:49":0,"(anonymous 1):1":0};
_yuitest_coverage["build/classnamemanager/classnamemanager.js"].coveredLines = 12;
_yuitest_coverage["build/classnamemanager/classnamemanager.js"].coveredFunctions = 3;
_yuitest_coverline("build/classnamemanager/classnamemanager.js", 1);
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
_yuitest_coverfunc("build/classnamemanager/classnamemanager.js", "(anonymous 1)", 1);
_yuitest_coverline("build/classnamemanager/classnamemanager.js", 22);
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
_yuitest_coverline("build/classnamemanager/classnamemanager.js", 36);
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
_yuitest_coverline("build/classnamemanager/classnamemanager.js", 47);
CONFIG[CLASS_NAME_DELIMITER] = CONFIG[CLASS_NAME_DELIMITER] || '-';

_yuitest_coverline("build/classnamemanager/classnamemanager.js", 49);
Y.ClassNameManager = function () {

	_yuitest_coverfunc("build/classnamemanager/classnamemanager.js", "ClassNameManager", 49);
_yuitest_coverline("build/classnamemanager/classnamemanager.js", 51);
var sPrefix    = CONFIG[CLASS_NAME_PREFIX],
		sDelimiter = CONFIG[CLASS_NAME_DELIMITER];

	_yuitest_coverline("build/classnamemanager/classnamemanager.js", 54);
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

            _yuitest_coverfunc("build/classnamemanager/classnamemanager.js", "(anonymous 2)", 66);
_yuitest_coverline("build/classnamemanager/classnamemanager.js", 68);
var args = Y.Array(arguments);

            _yuitest_coverline("build/classnamemanager/classnamemanager.js", 70);
if (args[args.length-1] !== true) {
                _yuitest_coverline("build/classnamemanager/classnamemanager.js", 71);
args.unshift(sPrefix);
            } else {
                _yuitest_coverline("build/classnamemanager/classnamemanager.js", 73);
args.pop();
            }

			_yuitest_coverline("build/classnamemanager/classnamemanager.js", 76);
return args.join(sDelimiter);
		})

	};

}();


}, '3.7.3', {"requires": ["yui-base"]});
