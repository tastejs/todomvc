/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Sep 17 23:11
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 xtemplate
*/

/**
 * @ignore
 * simple facade for runtime and compiler
 * @author yiminghe@gmail.com
 */
KISSY.add('xtemplate', function (S, XTemplateRuntime, compiler) {
    var cache = XTemplate.cache = {};

    function compile(tpl, config) {
        var fn;

        if (config.cache && (fn = cache[tpl])) {
            return fn;
        }

        fn = compiler.compileToFn(tpl, config);

        if (config.cache) {
            cache[tpl] = fn;
        }

        return fn;
    }

    var defaultCfg = {
        /**
         * whether cache template string
         * @member KISSY.XTemplate
         * @cfg {Boolean} cache
         */
        cache: true
    };

    /**
     * xtemplate engine for KISSY.
     *
     *
     *      @example
     *      KISSY.use('xtemplate',function(S, XTemplate){
     *          document.writeln(new XTemplate('{{title}}').render({title:2}));
     *      });
     *
     *
     * @class KISSY.XTemplate
     * @extends KISSY.XTemplate.Runtime
     */
    function XTemplate(tpl, config) {
        var self = this;
        config = S.merge(defaultCfg, config);

        if (typeof tpl == 'string') {
            tpl = compile(tpl, config);
        }

        XTemplate.superclass.constructor.call(self, tpl, config);
    }

    S.extend(XTemplate, XTemplateRuntime, {}, {
        compiler: compiler,

        RunTime: XTemplateRuntime,

        /**
         * add command to all template
         * @method
         * @static
         * @param {String} commandName
         * @param {Function} fn
         */
        addCommand: XTemplateRuntime.addCommand,

        /**
         * remove command from all template by name
         * @method
         * @static
         * @param {String} commandName
         */
        removeCommand: XTemplateRuntime.removeCommand
    });

    return XTemplate;

}, {
    requires: ['xtemplate/runtime', 'xtemplate/compiler']
});

/*
 It consists three modules:

 -   xtemplate - Both compiler and runtime functionality.
 -   xtemplate/compiler - Compiler string template to module functions.
 -   xtemplate/runtime -  Runtime for string template( with xtemplate/compiler loaded)
 or template functions.

 xtemplate/compiler depends on xtemplate/runtime,
 because compiler needs to know about runtime to generate corresponding codes.
 */

